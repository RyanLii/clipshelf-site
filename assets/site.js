// Sections rise in once as they reach the screen. Without this script, everything is simply there.
(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");
  const risers = [...document.querySelectorAll(".rise")];
  const parents = new Map();
  risers.forEach((el) => {
    const n = parents.get(el.parentElement) ?? 0;
    parents.set(el.parentElement, n + 1);
    el.style.setProperty("--i", Math.min(n, 6));
  });
  if (!("IntersectionObserver" in window)) {
    risers.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -6% 0px" });
  risers.forEach((el) => io.observe(el));
})();
