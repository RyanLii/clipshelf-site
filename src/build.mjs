// Writes the static pages to the repository root. Run: node src/build.mjs
// Plain output on purpose: the site needs no build step on the host.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://clipshelfapp.vercel.app";
const IOS = "https://apps.apple.com/app/id6823508990";
const ISSUES = "https://github.com/RyanLii/clipshelf-site/issues";
const UPDATED = "2026-11-06";

const iosApp = {
  "@type": "MobileApplication",
  "@id": `${SITE}/iphone#app`,
  name: "ClipShelf for iPhone and iPad",
  url: `${SITE}/iphone`,
  downloadUrl: IOS,
  operatingSystem: "iOS 17 or later, iPadOS 17 or later",
  applicationCategory: "ProductivityApplication",
  description: "Clipboard history for iPhone and iPad with pinboards, search, a keyboard and optional iCloud sync.",
  image: `${SITE}/assets/img/icon-192.png`,
  screenshot: [`${SITE}/assets/img/iphone-list.webp`, `${SITE}/assets/img/ipad.webp`],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@id": `${SITE}/#publisher` },
};
const macApp = {
  "@type": "SoftwareApplication",
  "@id": `${SITE}/mac#app`,
  name: "ClipShelf for Mac",
  url: `${SITE}/mac`,
  operatingSystem: "macOS 14 or later",
  applicationCategory: "ProductivityApplication",
  description: "A clipboard manager for Mac: open your clipboard history with Shift-Command-V, search it, pin items and paste a stack in order.",
  image: `${SITE}/assets/img/icon-192.png`,
  screenshot: [`${SITE}/assets/img/mac-mountain.webp`, `${SITE}/assets/img/mac-stack.webp`],
  publisher: { "@id": `${SITE}/#publisher` },
};
const publisher = { "@type": "Person", "@id": `${SITE}/#publisher`, name: "Rui Li", url: `${SITE}/` };

function crumbs(name, path) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClipShelf", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name, item: `${SITE}/${path}` },
    ],
  };
}

function nav(current) {
  const link = (href, label) =>
    `<a href="${href}"${current === href ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<header class="top">
  <a class="top-mark" href="./" aria-label="ClipShelf home"><img src="assets/img/icon-192.png" width="40" height="40" alt=""></a>
  <nav class="top-links" aria-label="Main">
    ${link("mac", "Mac")}
    ${link("iphone", "iPhone")}
    ${link("support", "Support")}
  </nav>
  <a class="top-action" href="${IOS}">App Store</a>
</header>`;
}

const foot = `<footer class="foot">
  <a class="blocks" href="./" aria-label="ClipShelf home">
    ${[..."ClipShelf"].map((c) => `<span aria-hidden="true">${c}</span>`).join("")}
  </a>
  <div class="foot-cols">
    <div><p class="foot-label">Apps</p><ul>
      <li><a href="mac">ClipShelf for Mac</a></li>
      <li><a href="iphone">ClipShelf for iPhone</a></li>
      <li><a href="iphone#ipad">iPad and iPhone Duo</a></li>
    </ul></div>
    <div><p class="foot-label">Learn</p><ul>
      <li><a href="./#how">How it works</a></li>
      <li><a href="./#questions">Common questions</a></li>
      <li><a href="mac#keys">Mac keyboard shortcuts</a></li>
    </ul></div>
    <div><p class="foot-label">Help</p><ul>
      <li><a href="support">Support</a></li>
      <li><a href="privacy">Privacy Policy</a></li>
    </ul></div>
    <div><p class="foot-label">Contact</p><ul>
      <li><a href="${ISSUES}">Open an issue on GitHub</a></li>
      <li><a href="${IOS}">ClipShelf on the App Store</a></li>
    </ul></div>
  </div>
  <div class="foot-end"><span>© 2026 Rui Li</span><span>No accounts. No ads. No tracking.</span></div>
</footer>`;

const shelf = `<aside id="shelf" class="shelf" aria-label="Your shelf on this page" hidden>
  <div class="shelf-bar"><span class="shelf-status" role="status"></span><button type="button" class="shelf-close">Close</button></div>
  <div class="shelf-list"></div>
</aside>`;

function page({ file, path, title, description, current, body, schema = [], ogType = "website", banner = true, head = "" }) {
  const url = `${SITE}/${path}`;
  const graph = { "@context": "https://schema.org", "@graph": [publisher, ...schema] };
  const html = `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
${banner ? '<meta name="apple-itunes-app" content="app-id=6823508990">\n' : ""}${head}<meta name="theme-color" content="#1c1c1c">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="ClipShelf">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/assets/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="The ClipShelf shelf on a Mac, showing copied images, text, a link and a color as cards.">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.png" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preload" href="assets/fonts/general-sans-500.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/site.css">
<script src="assets/site.js" defer></script>
<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${nav(current)}
<main id="main">
${body}
</main>
${foot}
${shelf}
</body>
</html>
`;
  writeFileSync(join(root, file), html);
}

const pic = (src, w, h, alt, extra = "") =>
  `<img src="assets/img/${src}" width="${w}" height="${h}" alt="${alt}" ${extra || 'loading="lazy" decoding="async"'}>`;

/* ---------- Home ---------- */
const rows = [
  { name: "Landing at 6:40 pm. Dinner at the little ramen place near the station?", kind: "Text", cls: "k-text", from: "Messages", time: "15 mins", open: true },
  { name: "git switch -c feature/shelf-preview && swift test", kind: "Code", cls: "k-code", from: "Terminal", time: "3 hrs", pre: true },
  { name: "https://en.wikipedia.org/wiki/Latte_art", kind: "Link", cls: "k-link", from: "Safari", time: "1 hr" },
  { name: "#FF6B4A", kind: "Color", cls: "k-color", from: "Notes", time: "2 hrs" },
  { name: "Hotel Gracery Shinjuku, 1-19-1 Kabukicho, Tokyo 160-8466", kind: "Address", cls: "k-address", from: "Maps", time: "Yesterday" },
  { name: '{ "theme": "sunset", "accent": "#FF6B4A" }', kind: "JSON", cls: "k-json", from: "Xcode", time: "10 hrs", pre: true },
];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const rowHtml = rows.map((r) => `<details class="row rise" name="clips"${r.open ? " open" : ""} data-ui>
    <summary><span class="row-name">${esc(r.name)}</span><span class="row-from">${r.from}</span><span class="row-time">${r.time}</span><span class="row-kind ${r.cls}">${r.kind}</span></summary>
    <div class="row-body">${r.pre ? `<pre>${esc(r.name)}</pre>` : `<p>${esc(r.name)}</p>`}<button type="button" class="button copy-btn" data-copy="${esc(r.name)}">Copy</button></div>
  </details>`).join("\n  ");

const faqs = [
  ["What is ClipShelf?", "ClipShelf is a clipboard manager for Mac, iPhone and iPad. It keeps the text, links and images you copy in a history you can search, so you can use them again. You can keep important items on named, colored pinboards, where they never expire."],
  ["Does iPhone have a clipboard history?", "No. iOS remembers only the last thing you copied. ClipShelf adds a history, but iOS lets apps read the clipboard only while they are open. So ClipShelf saves what you copied when you open the app or its keyboard, when you tap its paste button, or when you share something to it."],
  ["How do I see my clipboard history on a Mac?", "macOS also holds only one copied item. With ClipShelf on your Mac, press Shift-Command-V in any app to open your history at the bottom of the screen. Type to search, press Return to copy an item, then press Command-V to paste it."],
  ["Is ClipShelf free?", "ClipShelf for iPhone and iPad is free on the App Store, with no in-app purchases and no ads. ClipShelf for Mac is a separate paid app with a one-time price and no subscription. It is in App Review now."],
  ["Is it safe to keep my clipboard in an app?", "ClipShelf has no accounts and no servers of its own, and it does not use analytics or advertising. Your history stays on your devices. On Mac it skips content that apps mark as confidential, such as passwords from password managers, and content from apps you choose to ignore."],
  ["How does sync between Mac and iPhone work?", "Sync is off until you turn it on. When it is on, ClipShelf uses the private database of your own iCloud account, so the developer cannot read it. Turn on sync on each device and sign in to the same iCloud account. You can sync everything or only your pinboards."],
  ["Why does the keyboard ask for Full Access?", "The ClipShelf keyboard needs Full Access to read your history, which is stored in a container it shares with the app. It only inserts the items you tap. It does not record or store what you type, and it does not use the network."],
];

const clip = (top, sub, body, foot) => `<div class="clip" data-ui>
      <div class="clip-top">Text${sub ? `<span>${sub}</span>` : ""}</div>
      <div class="clip-body">${body}</div>
      <div class="clip-foot">${foot}</div>
    </div>`;

page({
  file: "index.html",
  path: "",
  title: "ClipShelf: Clipboard Manager for Mac, iPhone and iPad",
  description: "ClipShelf keeps everything you copy in a clipboard history you can search. Pin what matters and sync with your own iCloud. No accounts, no ads, no tracking.",
  current: "",
  head: '<meta name="google-site-verification" content="hbIigC22Wnp4jU4ec2b8nRgtxZ_-Vx-WNhSgpIfC3_M">\n',
  schema: [
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "ClipShelf", publisher: { "@id": `${SITE}/#publisher` } },
    iosApp,
    macApp,
  ],
  body: `<section class="board hero" aria-label="ClipShelf">
  <div class="tile hero-name"><h1><span class="hero-word">ClipShelf</span><span class="hero-what">Clipboard manager for iPhone and Mac</span></h1></div>
  <div class="tile tile-pic hero-mac shutter">${pic("mac-mountain.webp", 1800, 1125, "The ClipShelf shelf on a Mac, with copied images, text, code, a link and a color laid out as cards.", 'fetchpriority="high" decoding="async"')}</div>
  <div class="tile tile-pic hero-phone">${pic("iphone-list.webp", 800, 1067, "ClipShelf on iPhone: a searchable list of copied images, text, code and links, with pinboard tabs above it.", 'decoding="async"')}</div>
  <div class="tile tile-pic hero-phone2 drift">${pic("iphone-link.webp", 800, 1273, "A saved link in ClipShelf on iPhone, with a photo of latte art and the page title.", 'decoding="async"')}</div>
  <div class="tile hero-say"><p>Everything you copy, kept on a shelf you can search.</p><p class="note">Text, links and images, on your devices and in your own iCloud.</p></div>
  <div class="tile tile-accent hero-get"><p class="big">Free on iPhone and iPad.</p><p><a class="button" href="${IOS}">Get it on the App Store</a></p></div>
</section>

<section class="board devices section-gap" aria-labelledby="devices">
  <div class="tile head rise"><h2 id="devices">One shelf on every Apple device</h2><p>Copy on your Mac and find it on your iPhone. ClipShelf is built for each screen, and optional iCloud sync keeps them together.</p></div>
  <a class="tile device d-mac rise" href="mac"><div class="device-pic">${pic("mac-alley.webp", 1800, 1125, "ClipShelf for Mac open at the bottom of the screen over a photo of a lantern-lit alley.")}</div><div class="device-text"><h3>ClipShelf for Mac</h3><p>Press Shift-Command-V in any app. Coming to the Mac App Store.</p></div></a>
  <a class="tile device d-iphone rise" href="iphone"><div class="device-pic">${pic("iphone-travel.webp", 800, 1030, "A Travel pinboard on iPhone, holding a photo, a message, a link and a hotel address.")}</div><div class="device-text"><h3>ClipShelf for iPhone</h3><p>History, pinboards and a keyboard for any app.</p></div></a>
  <a class="tile device d-ipad rise" href="iphone#ipad"><div class="device-pic">${pic("ipad.webp", 1400, 1867, "ClipShelf on iPad, with the list and the selected item side by side.")}</div><div class="device-text"><h3>ClipShelf for iPad</h3><p>The list and the item, side by side.</p></div></a>
  <a class="tile device d-duo rise" href="iphone#ipad"><div class="device-pic">${pic("duo-open.webp", 1600, 1162, "ClipShelf on an open iPhone Duo, with the list on one side of the fold and a photo on the other.")}</div><div class="device-text"><h3>ClipShelf on iPhone Duo</h3><p>Open it to see the list and the item split at the fold. Close it to go back to the list.</p></div></a>
</section>

<section class="section-gap" aria-labelledby="try">
  <div class="rows-head"><div class="tile"><h2 id="try" class="rise">Copy something and watch it land</h2><p class="rise">Open a row and press Copy, or select any words on this page and copy them. They land on a small shelf, the way they do in the app.</p></div></div>
  <div class="rows">
  ${rowHtml}
  </div>
</section>

<section class="board mosaic section-gap" aria-labelledby="features">
  <div class="tile m m-6x2 m-head rise"><h2 id="features">What your clipboard can do</h2></div>
  <div class="tile m m-6x4 m-pic rise"><div class="pic">${pic("iphone-code.webp", 800, 1067, "A Code pinboard on iPhone with Swift code, a git command, a link and JSON.")}</div><div class="cap"><h3>Pinboards</h3><p>Keep items on named, colored boards, such as Travel or Code. Pinned items never expire.</p></div></div>
  <div class="tile m m-3x2 rise"><div class="m-ui" data-ui><div class="search-ui">latte art</div></div><h3>Search</h3><p>Find items by words, then filter by type and date.</p></div>
  <div class="tile m m-3x2 rise"><div class="swatch" data-ui></div><h3>Colors, links, images</h3><p>Each one looks like what it is.</p></div>
  <div class="tile m m-6x4 m-pic rise"><div class="pic">${pic("mac-stack.webp", 1000, 862, "The Paste Stack panel on Mac listing four copied items in order.")}</div><div class="cap"><h3>Paste Stack on Mac</h3><p>Press Control-Command-C, copy several items, then press Command-V to paste them one by one.</p></div></div>
  <div class="tile m m-3x4 rise"><div class="m-ui" data-ui><span class="key">⇧</span><span class="key">⌘</span><span class="key">V</span></div><h3>One shortcut on Mac</h3><p>Open your history from any app. Command-1 to Command-9 copy the first nine items.</p></div>
  <div class="tile m m-3x4 tile-field rise"><div class="m-ui" data-ui><span class="chip"><i class="dot-o"></i>Travel</span><span class="chip"><i class="dot-p"></i>Code</span><span class="chip"><i class="dot-g"></i>Design</span></div><h3>Keyboard on iPhone</h3><p>The ClipShelf keyboard shows recent items and pinboards in any app. Tap an item to type it.</p></div>
  <div class="tile m m-6x2 tile-accent rise"><h3>Private by design</h3><p>No account, no ads, no tracking. Sync is off until you turn it on, and then it uses your own private iCloud.</p></div>
  <div class="tile m m-3x2 rise"><h3>Text in images</h3><p>On Mac, text in copied images is recognized on the device, so you can search for it.</p></div>
  <div class="tile m m-3x2 rise"><h3>Link previews</h3><p>Links show the page's title and image. You can turn this off in Settings.</p></div>
</section>

<section class="fields section-gap" id="how" aria-labelledby="how-h">
  <div class="field"><h2 id="how-h">How it works</h2>${clip("", "", "Landing at 6:40 pm.", "")}<p class="rise">First you copy it, as you always do.</p></div>
  <div class="field"><div class="field-spacer"></div>${clip("", "15 mins ago", "Landing at 6:40 pm.", "<span>Messages</span><span>⌘2</span>")}<p class="rise">Then it lands on your shelf, with where it came from.</p></div>
  <div class="field"><div class="field-spacer"></div>${clip("", "15 mins ago", "Landing at 6:40 pm.", "<b>Pinned to Travel</b><span>⌘2</span>")}<p class="rise">Pin it, and it stays until you remove it.</p></div>
  <div class="field"><div class="field-spacer"></div>${clip("", "On iPhone and Mac", "Landing at 6:40 pm.", "<b>Pinned to Travel</b><span>Synced</span>")}<p class="rise">Turn on sync, and it follows you to your other devices.</p></div>
</section>

<section class="section-gap" id="questions" aria-labelledby="q">
  <div class="band band-head"><h2 id="q">Common questions</h2></div>
  ${faqs.map(([q, a]) => `<div class="band"><h3>${q}</h3><div><p>${a}</p></div></div>`).join("\n  ")}
</section>

<section class="cta section-gap" aria-labelledby="get">
  <div class="cta-l">${pic("iphone-travel.webp", 800, 1030, "A Travel pinboard in ClipShelf on iPhone.")}</div>
  <div class="cta-c"><h2 id="get">Stop copying things twice</h2><p>ClipShelf is free on iPhone and iPad, and works with ClipShelf for Mac through your own iCloud.</p><p><a class="button" href="${IOS}">Get it on the App Store</a></p></div>
  <div class="cta-r"></div>
</section>`,
});

/* ---------- Mac ---------- */
page({
  file: "mac.html",
  path: "mac",
  title: "ClipShelf for Mac: Clipboard Manager and History for macOS",
  description: "A clipboard manager for Mac. Press Shift-Command-V to open your clipboard history, search it, pin items and paste a stack in order. No accounts or tracking.",
  current: "mac",
  banner: false,
  schema: [macApp, crumbs("ClipShelf for Mac", "mac")],
  body: `<section class="board page-hero">
  <div class="tile page-title"><h1>Clipboard manager for Mac</h1><p>Everything you copy is one shortcut away. ClipShelf for Mac is in App Review and coming to the Mac App Store.</p></div>
  <div class="tile tile-pic page-pic shutter">${pic("mac-mountain.webp", 1800, 1125, "ClipShelf for Mac open at the bottom of the screen, showing copied items as cards.", 'fetchpriority="high" decoding="async"')}</div>
</section>

<section class="board split section-gap" aria-labelledby="one">
  <div class="tile s-text rise"><h2 id="one">Your history, one shortcut away</h2><p>macOS remembers only the last thing you copied. ClipShelf keeps all of it. Press Shift-Command-V in any app, and your clipboard history opens at the bottom of the screen.</p><p>Type to search. Pick an item and press Return to copy it, then press Command-V to paste it. Command-1 to Command-9 copy the first nine items.</p></div>
  <div class="tile tile-pic s-pic bottom rise">${pic("mac-alley.webp", 1800, 1125, "The shelf over a lantern-lit alley photo, with the first card selected.")}</div>
</section>

<section class="board split section" aria-labelledby="all">
  <div class="tile tile-pic s-pic rise">${pic("mac-shelf.webp", 1800, 369, "Seven clip cards: an image, a message, Swift code, a link preview, a photo, a color and a terminal command.")}</div>
  <div class="tile s-text tile-field rise"><h2 id="all">Everything you copy</h2><ul>
    <li>Text, rich text, links, colors, images and files, with their original formatting.</li>
    <li>Link previews show the page's title and image.</li>
    <li>Text in copied images is recognized on your Mac, so you can search for it.</li>
    <li>Filter by type, app and date. Press Space for a full preview.</li>
    <li>Edit the text of an item, or type a new one.</li>
  </ul></div>
</section>

<section class="board split section" aria-labelledby="stack">
  <div class="tile s-text tile-accent rise"><h2 id="stack">Paste in order with Paste Stack</h2><p>Filling in a form or moving several values? Press Control-Command-C, copy each item, then press Command-V to paste them one by one. You choose copy order or newest first.</p></div>
  <div class="tile tile-pic s-pic rise">${pic("mac-stack.webp", 1000, 862, "The Paste Stack panel with four items waiting to be pasted in order.")}</div>
</section>

<section class="board split section-gap" id="keys" aria-labelledby="keys-h">
  <div class="tile s-text rise"><h2 id="keys-h">Keyboard shortcuts</h2><p>You can change the shortcut that opens the shelf in Settings.</p></div>
  <div class="tile s-text rise" data-ui><table class="keys-table">
    <tr><th scope="row">Shift-Command-V</th><td>Open the shelf</td></tr>
    <tr><th scope="row">Return</th><td>Copy the selected item</td></tr>
    <tr><th scope="row">Command-1 to 9</th><td>Copy item 1 to 9</td></tr>
    <tr><th scope="row">Space</th><td>Preview the item</td></tr>
    <tr><th scope="row">Command-E</th><td>Edit the item</td></tr>
    <tr><th scope="row">Command-N</th><td>Type a new item</td></tr>
    <tr><th scope="row">Control-Command-C</th><td>Turn Paste Stack on or off</td></tr>
  </table></div>
</section>

<section class="board split section-gap" aria-labelledby="how-mac">
  <div class="tile s-text rise"><h2 id="how-mac">How to see clipboard history on a Mac</h2><p>macOS has no built-in clipboard history. Once ClipShelf is running, it stays in the menu bar and saves what you copy from then on.</p><ol class="steps">
    <li>Copy something in any app, as you normally do.</li>
    <li>Press Shift-Command-V. Your history opens at the bottom of the screen, newest first.</li>
    <li>Type a few words to search, or use the arrow keys to pick an item.</li>
    <li>Press Return to copy the item, then press Command-V where you want it.</li>
  </ol></div>
  <div class="tile s-text tile-field rise"><h2 id="control">You stay in control</h2><ul>
    <li>ClipShelf skips content that apps mark as confidential or temporary, such as passwords from password managers.</li>
    <li>Add any app to the ignore list, and nothing you copy from it is saved.</li>
    <li>The shelf is hidden from screen sharing unless you turn that on.</li>
    <li>Choose how long history is kept, and delete a single item or everything at any time.</li>
    <li>Duplicates do not pile up: copying the same content again moves it to the top.</li>
    <li>Sync is off until you turn it on, and it only ever uses your own private iCloud.</li>
  </ul></div>
</section>

<section class="section-gap" aria-labelledby="q">
  <div class="band band-head"><h2 id="q">Mac questions</h2></div>
  <div class="band"><h3>Does ClipShelf save my passwords?</h3><div><p>ClipShelf skips content that apps mark as confidential or temporary, such as passwords from password managers. You can also add apps to an ignore list. The shelf is hidden from screen sharing unless you turn that on.</p></div></div>
  <div class="band"><h3>Which Macs does it run on?</h3><div><p>ClipShelf for Mac needs macOS 14 Sonoma or later.</p></div></div>
  <div class="band"><h3>How long is my history kept?</h3><div><p>You choose: a day, a week, a month, a year or forever. Pinned items never expire.</p></div></div>
  <div class="band"><h3>How much does it cost?</h3><div><p>ClipShelf for Mac is a paid app with a one-time price, no subscription and no in-app purchases. The price for your country will show on the Mac App Store.</p></div></div>
  <div class="band"><h3>Can I use it with my iPhone?</h3><div><p>Yes. <a href="iphone">ClipShelf for iPhone</a> is free. Turn on iCloud sync on both devices to share your history or only your pinboards.</p></div></div>
</section>`,
});

/* ---------- iPhone ---------- */
page({
  file: "iphone.html",
  path: "iphone",
  title: "ClipShelf for iPhone and iPad: Free Clipboard History App",
  description: "Keep a clipboard history on iPhone and iPad. Save text, links and images, pin them to boards and type them from the ClipShelf keyboard. Free, with no ads.",
  current: "iphone",
  schema: [iosApp, crumbs("ClipShelf for iPhone and iPad", "iphone")],
  body: `<section class="board page-hero">
  <div class="tile page-title"><h1>Clipboard history for iPhone</h1><p>Save what you copy, find it again and type it in any app. Free on the App Store.</p><p><a class="button" href="${IOS}">Get it on the App Store</a></p></div>
  <div class="tile tile-pic page-pic portrait shutter">${pic("iphone-list.webp", 800, 1067, "ClipShelf on iPhone with a list of copied items and pinboard tabs.", 'fetchpriority="high" decoding="async"')}</div>
</section>

<section class="board split section-gap" aria-labelledby="save">
  <div class="tile s-text rise"><h2 id="save">Three ways to save what you copy</h2><p>iOS remembers only the last thing you copied, and it lets apps read the clipboard only while they are open. So ClipShelf gives you three clear ways in:</p><ul>
    <li>Open ClipShelf or its keyboard after you copy. You can turn this off.</li>
    <li>Tap the paste button inside ClipShelf.</li>
    <li>Share text, a link or an image to ClipShelf from any app.</li>
  </ul></div>
  <div class="tile tile-pic s-pic rise">${pic("iphone-link.webp", 800, 1273, "A saved link in ClipShelf, showing a photo of latte art, the page title and the address.")}</div>
</section>

<section class="board split section" aria-labelledby="pin">
  <div class="tile tile-pic s-pic rise">${pic("iphone-travel.webp", 800, 1030, "A Travel pinboard with a photo, a message, a link and a hotel address.")}</div>
  <div class="tile s-text tile-field rise"><h2 id="pin">Pinboards for what you keep</h2><p>Addresses, booking codes, replies and code all have a place. Keep them on named, colored pinboards. Pinned items never expire, however long you keep your history: a day, a week, a month, a year or forever.</p></div>
</section>

<section class="board split section" aria-labelledby="kb">
  <div class="tile s-text tile-accent rise"><h2 id="kb">A keyboard that knows your clipboard</h2><p>The ClipShelf keyboard shows your recent items and pinboards in any app. Tap an item to type it. It needs Full Access to read your history, it does not record what you type, and it does not use the network.</p></div>
  <div class="tile tile-pic s-pic rise">${pic("iphone-code.webp", 800, 1067, "A Code pinboard on iPhone with code, a git command, a link and JSON.")}</div>
</section>

<section class="board split section-gap" id="ipad" aria-labelledby="wide">
  <div class="tile s-text rise"><h2 id="wide">Made for iPad and iPhone Duo</h2><p>On iPad, the list and the item sit side by side. On iPhone Duo, opening the device splits them at the fold, and closing it goes back to the list.</p><p>ClipShelf needs iOS 17 or iPadOS 17 or later. Pinboard tabs use Liquid Glass on iOS 26 and later.</p></div>
  <div class="tile tile-pic s-pic contain rise">${pic("duo-open.webp", 1600, 1162, "ClipShelf on an open iPhone Duo, split at the fold.")}</div>
</section>
<section class="board split section">
  <div class="tile tile-pic s-pic rise">${pic("ipad.webp", 1400, 1867, "ClipShelf on iPad showing the list and an item.")}</div>
  <div class="tile tile-pic s-pic contain rise">${pic("duo-closed.webp", 800, 1115, "ClipShelf on a closed iPhone Duo, showing the list.")}</div>
</section>

<section class="board split section-gap" aria-labelledby="setup-kb">
  <div class="tile s-text rise"><h2 id="setup-kb">How to turn on the ClipShelf keyboard</h2><ol class="steps">
    <li>Open iPhone Settings, then General, Keyboard and Keyboards.</li>
    <li>Tap Add New Keyboard and choose ClipShelf.</li>
    <li>Tap ClipShelf in the list and turn on Allow Full Access, so it can read your history.</li>
    <li>In any app, switch to the ClipShelf keyboard with the globe key, then tap an item to type it.</li>
  </ol></div>
  <div class="tile s-text tile-field rise"><h2 id="setup-sync">How to sync iPhone and Mac</h2><ol class="steps">
    <li>Sign in to the same iCloud account on each device.</li>
    <li>In ClipShelf on each device, open Settings and turn on Sync.</li>
    <li>Choose everything, or pinboards only if you want your history to stay on one device.</li>
    <li>Use Sync Now when you want it to happen at once.</li>
  </ol></div>
</section>

<section class="section-gap" aria-labelledby="q">
  <div class="band band-head"><h2 id="q">iPhone questions</h2></div>
  <div class="band"><h3>Why does ClipShelf not save everything by itself?</h3><div><p>iOS does not let any app watch the clipboard in the background. ClipShelf saves what you copied when you open it or its keyboard, when you tap its paste button, or when you share something to it.</p></div></div>
  <div class="band"><h3>Is ClipShelf free on iPhone?</h3><div><p>Yes. ClipShelf for iPhone and iPad is free, with no in-app purchases and no ads.</p></div></div>
  <div class="band"><h3>Where is my data stored?</h3><div><p>On your device. If you turn on sync, it is also stored in the private database of your own iCloud account. There are no accounts and no servers of our own. See the <a href="privacy">Privacy Policy</a>.</p></div></div>
  <div class="band"><h3>What can ClipShelf save on iPhone?</h3><div><p>Text, links and images. Links can show the page's title and image, which you can turn off in Settings. You can also type a new item yourself, edit the text of an item, and search your history or filter it by type and date.</p></div></div>
  <div class="band"><h3>Does it work with my Mac?</h3><div><p>Yes, with <a href="mac">ClipShelf for Mac</a>. Turn on iCloud sync on each device with the same iCloud account. You can sync everything or only your pinboards.</p></div></div>
</section>

<section class="cta section-gap" aria-labelledby="get">
  <div class="cta-l">${pic("iphone-list.webp", 800, 1067, "ClipShelf's list on iPhone.")}</div>
  <div class="cta-c"><h2 id="get">Keep what you copy</h2><p>Free on iPhone and iPad. No account needed.</p><p><a class="button" href="${IOS}">Get it on the App Store</a></p></div>
  <div class="cta-r"></div>
</section>`,
});

/* ---------- Support ---------- */
page({
  file: "support.html",
  path: "support",
  title: "ClipShelf Support: Sync, Keyboard and Paste Help",
  description: "Get help with ClipShelf for Mac, iPhone and iPad: fix sync between devices, turn on the keyboard, save what you copied, and contact support.",
  current: "support",
  banner: false,
  schema: [crumbs("Support", "support")],
  body: `<article class="doc">
  <h1>Support</h1>
  <p>Help with ClipShelf for Mac, iPhone and iPad.</p>
  <h2>My items do not sync between Mac and iPhone</h2>
  <p>Turn on Settings &gt; Sync on each device, and sign in to the same iCloud account. Use Sync Now to sync at once. With "Pinboards only", only pinned items sync.</p>
  <h2>The keyboard shows no items</h2>
  <p>In iPhone Settings &gt; General &gt; Keyboard &gt; Keyboards &gt; ClipShelf, turn on Allow Full Access. The keyboard needs it to read your ClipShelf history.</p>
  <h2>iPhone does not save what I copied</h2>
  <p>iOS lets apps read the clipboard only while they are open. Open ClipShelf or its keyboard after you copy, tap the paste button, or share the content to ClipShelf.</p>
  <h2>How do I paste on Mac?</h2>
  <p>Press Shift-Command-V, pick an item and press Return to copy it, then press Command-V in your app.</p>
  <h2>Contact</h2>
  <p>Report a problem or ask a question by <a href="${ISSUES}">opening an issue on GitHub</a>. Please include your device, system version and ClipShelf version.</p>
</article>`,
});

/* ---------- Privacy ---------- */
page({
  file: "privacy.html",
  path: "privacy",
  title: "ClipShelf Privacy Policy",
  description: "ClipShelf stores your clipboard history on your devices and, if you turn on sync, in your own iCloud. No accounts, analytics, advertising or tracking.",
  current: "privacy",
  banner: false,
  schema: [crumbs("Privacy Policy", "privacy")],
  body: `<article class="doc">
  <h1>Privacy Policy</h1>
  <p>Effective November 6, 2026</p>
  <p>This policy covers the ClipShelf apps for Mac, iPhone and iPad, including the ClipShelf keyboard and share extension. In short: your clipboard history stays on your devices and, if you turn on sync, in your own iCloud account. We do not collect, receive, or sell any of your data.</p>
  <h2>What ClipShelf stores</h2>
  <ul>
    <li>Clipboard items. On Mac, ClipShelf saves what you copy. It skips content that apps mark as confidential or temporary (for example, from password managers) and content from apps you choose to ignore. On iPhone and iPad, ClipShelf saves the clipboard when you open the app or the keyboard (you can turn this off), when you tap the paste button, or when you share something to ClipShelf.</li>
    <li>Pinboards and settings that you create.</li>
  </ul>
  <p>This data is stored on your device. You can delete single items, clear your history, or choose how long history is kept in the app's settings. Deleting the app removes its data from that device.</p>
  <h2>iCloud sync</h2>
  <p>Sync is off until you turn it on. When it is on, ClipShelf stores your items and pinboards in the private database of your own iCloud account, using Apple's CloudKit. Clipboard text is stored in encrypted fields. We cannot access your iCloud data. Apple's handling of iCloud data is described in <a href="https://www.apple.com/legal/privacy/">Apple's Privacy Policy</a>. To remove synced data, turn off sync and delete ClipShelf data in your iCloud storage settings.</p>
  <h2>Processing on your device</h2>
  <ul>
    <li>Text in images. On Mac, ClipShelf recognizes text in copied images so you can search for it. This uses Apple's on-device Vision framework. Images are not sent anywhere.</li>
    <li>Link previews. On Mac, iPhone and iPad, ClipShelf can download the title and image of a web page you copied a link to. The request goes directly from your device to that website, as a browser would. You can turn link previews off in Settings.</li>
  </ul>
  <h2>The ClipShelf keyboard</h2>
  <p>The keyboard needs Full Access to read your ClipShelf history, which is stored in a container shared with the app. The keyboard only inserts the items you tap. It does not record or store what you type, and it does not use the network.</p>
  <h2>What we do not do</h2>
  <ul>
    <li>No accounts, sign-in, or servers of our own.</li>
    <li>No analytics, advertising, or tracking, and no third-party code that collects data.</li>
    <li>No sale or sharing of your data with anyone.</li>
  </ul>
  <h2>This website</h2>
  <p>This website uses no cookies or analytics. It is hosted on Vercel, which handles requests to the site. If you try the copy demo on the home page, what you copy stays in that browser tab and is not sent anywhere.</p>
  <h2>Children</h2>
  <p>ClipShelf is not directed at children and does not knowingly collect information from anyone.</p>
  <h2>Changes</h2>
  <p>If this policy changes, we will update this page and its effective date.</p>
  <h2>Contact</h2>
  <p>Questions about privacy: <a href="${ISSUES}">open an issue on GitHub</a>.</p>
</article>`,
});

/* ---------- 404 ---------- */
page({
  file: "404.html",
  path: "404",
  title: "Page not found | ClipShelf",
  description: "This page does not exist.",
  current: "",
  banner: false,
  body: `<article class="doc"><h1>Nothing on this shelf</h1><p>This page does not exist. Go to the <a href="./">ClipShelf home page</a>.</p></article>`,
});

/* ---------- Crawl files ---------- */
const urls = ["", "mac", "iphone", "support", "privacy"];
writeFileSync(join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}/${u}</loc><lastmod>${UPDATED}</lastmod></url>`).join("\n")}
</urlset>
`);
writeFileSync(join(root, "robots.txt"), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
