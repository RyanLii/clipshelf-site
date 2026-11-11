// Writes the static pages to the repository root. Run: node src/build.mjs
// Plain output on purpose: the site needs no build step on the host.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://clipshelfapp.vercel.app";
const IOS = "https://apps.apple.com/app/id6823508990";
const ISSUES = "https://github.com/RyanLii/clipshelf-site/issues";
const UPDATED = "2026-11-07";

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
  screenshot: [`${SITE}/assets/img/mac-mountain.webp`, `${SITE}/assets/img/mac-shibuya.webp`],
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
  <a class="top-mark" href="./"><img src="assets/img/icon-192.png" width="32" height="32" alt=""><span>ClipShelf</span></a>
  <nav class="top-links" aria-label="Main">
    ${link("mac", "Mac")}
    ${link("iphone", "iPhone")}
    ${link("support", "Support")}
  </nav>
</header>`;
}

const foot = `<footer class="foot">
  <span>© 2026 Rui Li</span>
  <a href="privacy">Privacy Policy</a>
</footer>`;

function page({ file, path, title, description, current, body, schema = [], ogType = "website", banner = true, head = "" }) {
  const url = `${SITE}/${path}`;
  const graph = { "@context": "https://schema.org", "@graph": [publisher, ...schema] };
  const html = `<!doctype html>
<html lang="en">
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
<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${nav(current)}
<main id="main">
${body}
</main>
${foot}
</body>
</html>
`;
  writeFileSync(join(root, file), html);
}

const pic = (src, w, h, alt, extra = "") =>
  `<img src="assets/img/${src}" width="${w}" height="${h}" alt="${alt}" ${extra}>`;
const lazy = 'loading="lazy" decoding="async"';
const split = (text, picture, flip = false) =>
  `<section class="split${flip ? " flip" : ""}"><div>${text}</div>${picture}</section>`;
const phone = (src, w, h, alt, extra = lazy) => pic(src, w, h, alt, `class="phone" ${extra}`);
const ol = (items) => `<ol>${items.map((i) => `<li>${i}</li>`).join("")}</ol>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

/* ---------- Home ---------- */
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
  body: `<section class="hero">
  <h1>ClipShelf</h1>
  <p>Clipboard history for Mac, iPhone and iPad.</p>
  <video controls playsinline preload="none" width="1920" height="1080" poster="assets/img/film-poster.jpg" aria-label="A 21-second film of ClipShelf on a Mac and an iPhone."><source src="assets/video/clipshelf.mp4" type="video/mp4"></video>
</section>
${split(`<h2>Mac</h2><p>Press Shift-Command-V in any app. Coming to the Mac App Store.</p><p><a href="mac">ClipShelf for Mac</a></p>`,
  pic("mac-shibuya.webp", 1800, 1125, "ClipShelf for Mac open over a photo of Shibuya at night.", lazy))}
${split(`<h2>iPhone and iPad</h2><p>Free, with a keyboard for any app.</p><p><a class="button" href="${IOS}">Get it on the App Store</a></p><p><a href="iphone">ClipShelf for iPhone</a></p>`,
  phone("iphone-list.webp", 800, 1067, "ClipShelf on iPhone: a searchable list of copied items with pinboard tabs above it."), true)}`,
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
  body: `<section class="hero">
  <h1>Clipboard manager for Mac</h1>
  <p>Coming to the Mac App Store.</p>
  ${pic("mac-shibuya.webp", 1800, 1125, "ClipShelf for Mac open at the bottom of the screen, showing copied items as cards.", 'fetchpriority="high" decoding="async"')}
</section>
<section class="columns">
  <div><h2>How to see clipboard history on a Mac</h2>${ol([
    "Copy something in any app.",
    "Press Shift-Command-V. Your history opens, newest first.",
    "Type to search, or use the arrow keys.",
    "Press Return to copy the item, then Command-V to paste it.",
  ])}</div>
  <div><h2>Keyboard shortcuts</h2><table>
    <tr><th scope="row">Shift-Command-V</th><td>Open the shelf</td></tr>
    <tr><th scope="row">Return</th><td>Copy the selected item</td></tr>
    <tr><th scope="row">Command-1 to 9</th><td>Copy item 1 to 9</td></tr>
    <tr><th scope="row">Space</th><td>Preview the item</td></tr>
    <tr><th scope="row">Command-E</th><td>Edit the item</td></tr>
    <tr><th scope="row">Command-N</th><td>Type a new item</td></tr>
    <tr><th scope="row">Control-Command-C</th><td>Turn Paste Stack on or off</td></tr>
  </table></div>
</section>
${split(`<h2>Paste in order</h2><p>Press Control-Command-C, copy each item, then press Command-V to paste them one by one.</p>`,
  pic("mac-stack.webp", 1000, 862, "The Paste Stack panel with four items waiting to be pasted in order.", lazy))}
<section class="plain"><h2>Details</h2>${ul([
    "Text, rich text, links, colors, images and files.",
    "Search text inside copied images. Recognition runs on your Mac.",
    "Filter by type, app and date.",
    "Skips confidential content, and any app you choose to ignore.",
    "Hidden from screen sharing unless you turn that on.",
    "macOS 14 or later. One-time price, no subscription.",
  ])}</section>`,
});

/* ---------- iPhone ---------- */
page({
  file: "iphone.html",
  path: "iphone",
  title: "ClipShelf for iPhone and iPad: Free Clipboard History App",
  description: "Keep a clipboard history on iPhone and iPad. Save text, links and images, pin them to boards and type them from the ClipShelf keyboard. Free, with no ads.",
  current: "iphone",
  schema: [iosApp, crumbs("ClipShelf for iPhone and iPad", "iphone")],
  body: `${split(`<h1>Clipboard history for iPhone</h1><p>Free, with no ads.</p><p><a class="button" href="${IOS}">Get it on the App Store</a></p>`,
    phone("iphone-list.webp", 800, 1067, "ClipShelf on iPhone with a list of copied items and pinboard tabs.", 'fetchpriority="high" decoding="async"'))}
${split(`<h2>Save it, pin it</h2>${ul([
    "Open ClipShelf or its keyboard after you copy.",
    "Tap the paste button inside ClipShelf.",
    "Share text, a link or an image to ClipShelf from any app.",
  ])}<p>Pinned items never expire.</p>`,
    phone("iphone-travel.webp", 800, 1030, "A Travel pinboard with a photo, a message, a link and a hotel address."), true)}
${split(`<h2>How to turn on the ClipShelf keyboard</h2>${ol([
    "Open Settings, then General, Keyboard and Keyboards.",
    "Tap Add New Keyboard and choose ClipShelf.",
    "Tap ClipShelf and turn on Allow Full Access, so it can read your history.",
    "In any app, switch keyboards with the globe key, then tap an item.",
  ])}`,
    phone("iphone-code.webp", 800, 1067, "A Code pinboard on iPhone with code, a git command, a link and JSON."))}
${split(`<h2 id="ipad">iPad and iPhone Duo</h2><p>The list and the item sit side by side. On iPhone Duo they split at the fold. iOS 17 or iPadOS 17 or later.</p>`,
    phone("ipad.webp", 1400, 1867, "ClipShelf on iPad, with the list and the selected item side by side."), true)}`,
});

/* ---------- Support ---------- */
const answers = [
  ["What is ClipShelf?", "ClipShelf is a clipboard manager for Mac, iPhone and iPad. It keeps the text, links and images you copy in a history you can search, so you can use them again. You can keep important items on named, colored pinboards, where they never expire."],
  ["How do I see my clipboard history on a Mac?", "macOS holds only one copied item. With ClipShelf on your Mac, press Shift-Command-V in any app to open your history at the bottom of the screen. Type to search, press Return to copy an item, then press Command-V to paste it."],
  ["Does iPhone have a clipboard history?", "No. iOS remembers only the last thing you copied, and it lets apps read the clipboard only while they are open. So ClipShelf saves what you copied when you open the app or its keyboard, when you tap its paste button, or when you share something to it."],
  ["The keyboard shows no items", "In iPhone Settings &gt; General &gt; Keyboard &gt; Keyboards &gt; ClipShelf, turn on Allow Full Access. The keyboard needs it to read your ClipShelf history. It does not record what you type, and it does not use the network."],
  ["How do I sync Mac and iPhone?", "Sync is off until you turn it on. Sign in to the same iCloud account on each device, then turn on Settings &gt; Sync on each one. Choose everything, or pinboards only. Use Sync Now to sync at once."],
  ["My items do not sync", "Check that sync is on and that each device uses the same iCloud account. With “Pinboards only”, only pinned items sync."],
  ["How much does it cost?", "ClipShelf for iPhone and iPad is free on the App Store, with no in-app purchases and no ads. ClipShelf for Mac is a separate paid app with a one-time price, no subscription and no in-app purchases. It is in App Review now, and the price for your country will show on the Mac App Store."],
  ["Is it safe to keep my clipboard in an app?", 'ClipShelf has no accounts and no servers of its own, and it does not use analytics or advertising. Your history stays on your devices and, if you turn on sync, in the private database of your own iCloud account, so the developer cannot read it. On Mac it skips content that apps mark as confidential, such as passwords from password managers, and content from apps you choose to ignore. See the <a href="privacy">Privacy Policy</a>.'],
  ["How long is my history kept?", "You choose: a day, a week, a month, a year or forever. Pinned items never expire."],
  ["Which devices does it run on?", "ClipShelf for Mac needs macOS 14 Sonoma or later. ClipShelf for iPhone and iPad needs iOS 17 or iPadOS 17 or later."],
];
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
  ${answers.map(([q, a]) => `<h2>${q}</h2>\n  <p>${a}</p>`).join("\n  ")}
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
  <p>This website uses no cookies or analytics. It is hosted on Vercel, which handles requests to the site.</p>
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
  body: `<article class="doc"><h1>Page not found</h1><p><a href="./">Go to the home page</a></p></article>`,
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
