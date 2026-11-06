// Motion, and the page's own small shelf: what a visitor copies here lands on it.
// Items stay in this tab's memory. Nothing is stored or sent.
(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  // Entrances: the parts of each section, staggered, once.
  const risers = [...document.querySelectorAll(".rise")];
  const parents = new Map();
  risers.forEach((el) => {
    const n = parents.get(el.parentElement) ?? 0;
    parents.set(el.parentElement, n + 1);
    el.style.setProperty("--i", Math.min(n, 6));
  });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    risers.forEach((el) => io.observe(el));
  } else {
    risers.forEach((el) => el.classList.add("in"));
  }

  const shelf = document.getElementById("shelf");
  if (!shelf) return;
  const list = shelf.querySelector(".shelf-list");
  const status = shelf.querySelector(".shelf-status");
  const items = [];

  const kindOf = (text) => {
    if (/^#[0-9a-f]{3,8}$/i.test(text)) return ["Color", "k-color"];
    if (/^https?:\/\/\S+$/i.test(text)) return ["Link", "k-link"];
    if (/^\s*[{[]/.test(text) || /^(git|func|npm|swift|let|const) /.test(text)) return ["Code", "k-code"];
    return ["Text", "k-text"];
  };

  const open = () => {
    shelf.hidden = false;
    shelf.classList.remove("closing");
  };
  const close = () => {
    shelf.classList.add("closing");
    setTimeout(() => {
      if (shelf.classList.contains("closing")) shelf.hidden = true;
    }, 320);
  };

  const write = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const add = (raw) => {
    const text = raw.trim().slice(0, 400);
    if (!text) return;
    const seen = items.indexOf(text);
    if (seen >= 0) {
      // The same content moves to the front, as it does in the app.
      items.splice(seen, 1);
      list.children[seen].remove();
    }
    items.unshift(text);
    const [label, cls] = kindOf(text);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "shelf-card";
    const top = document.createElement("b");
    top.className = cls;
    top.textContent = label;
    const body = document.createElement("span");
    body.textContent = text;
    card.append(top, body);
    card.setAttribute("aria-label", `Copy again: ${text.slice(0, 80)}`);
    card.addEventListener("click", async () => {
      const ok = await write(text);
      status.textContent = ok ? "Copied again. Press paste anywhere." : "Your browser blocked the copy.";
    });
    list.prepend(card);
    open();
    status.textContent = `${items.length} on your shelf. It stays in this tab. Nothing is sent.`;
  };

  // Anything selected and copied on the page.
  document.addEventListener("copy", () => {
    const selected = String(window.getSelection() ?? "");
    if (selected) add(selected);
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => {
      const text = button.dataset.copy;
      // The card lands first: a clipboard write can wait on a permission prompt.
      add(text);
      write(text).then((ok) => {
        if (!ok) status.textContent = "Your browser blocked the copy, but the card landed.";
      });
      const label = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => { button.textContent = label; }, 1400);
    });
  });

  shelf.querySelector(".shelf-close").addEventListener("click", close);

  // The app's own shortcut opens the page's shelf, once it has something on it.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !shelf.hidden) close();
    if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "v" && items.length) {
      e.preventDefault();
      if (shelf.hidden) open(); else close();
    }
  });
})();
