#!/usr/bin/env node
/**
 * Static site builder for Taos River Adventures. Zero dependencies — just Node 18+.
 *   node build.mjs          -> builds the site into dist/
 * Content lives in content/site.json. Any text value starting with "TODO" is hidden.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'dist');
const site = JSON.parse(fs.readFileSync(path.join(root, 'content/site.json'), 'utf8'));
const imgManifest = JSON.parse(fs.readFileSync(path.join(root, 'src/assets/img/images.json'), 'utf8'));
const B = site.business, C = site.contact;
const BASE = B.url.replace(/\/$/, '');
const YEAR = new Date().getFullYear();
const ASSET_V = Date.now().toString(36);

/* ---------- helpers ---------- */
const isSet = (v) => {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '' && !/^\s*TODO/i.test(v);
  if (Array.isArray(v)) return v.some(isSet);
  return true;
};
const setOnly = (arr) => (arr || []).filter(isSet);
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = esc;
const todos = [];
(function scan(v, p) {
  if (typeof v === 'string') { if (/^\s*TODO/i.test(v)) todos.push(p + ': ' + v.replace(/^\s*TODO:?\s*/i, '')); }
  else if (Array.isArray(v)) v.forEach((x, i) => scan(x, p + '[' + i + ']'));
  else if (v && typeof v === 'object') for (const k of Object.keys(v)) if (!k.startsWith('_')) scan(v[k], p ? p + '.' + k : k);
})(site, '');

const ICONS = {
  rapids: '<path d="M2 8c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M2 13c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M2 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  family: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2"/><circle cx="17.5" cy="9.5" r="2.5"/><path d="M17 14.5a4 4 0 0 1 4 4V21"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  mountain: '<path d="M3 20l6-11 4 7 3-5 5 9z"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  left: '<path d="M15 6l-6 6 6 6"/>',
  right: '<path d="M9 6l6 6-6 6"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  bag: '<path d="M6 8h12l-1 13H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  food: '<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1-3 4-3 7h3v11"/>',
  link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>'
};
const icon = (n, extra = '') => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' + extra + '>' + (ICONS[n] || ICONS.info) + '</svg>';

const LOGO = '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#007f7f"/><stop offset=".6" stop-color="#349e8f"/><stop offset="1" stop-color="#f2c849"/></linearGradient></defs><circle cx="24" cy="24" r="23" fill="url(#lg)"/><circle cx="31" cy="17" r="6" fill="#f2c849"/><path d="M1.5 30 12 18l6 7 5-5 9 10H1.5z" fill="#1a3c3c" opacity=".85"/><path d="M3 33c4 0 4-2.5 8-2.5s4 2.5 8 2.5 4-2.5 8-2.5 4 2.5 8 2.5 4-2.5 8-2.5" fill="none" stroke="#fefefc" stroke-width="2.4" stroke-linecap="round"/><path d="M6 39c3.5 0 3.5-2 7-2s3.5 2 7 2 3.5-2 7-2 3.5 2 7 2 3.5-2 7-2" fill="none" stroke="#fefefc" stroke-width="2" stroke-linecap="round" opacity=".7"/></svg>';

function img(name, { sizes = '100vw', eager = false, cls = '', alt } = {}) {
  const m = imgManifest[name];
  const meta = site.images[name] || {};
  if (!m) throw new Error('Unknown image "' + name + '" — add photos/' + name + '.jpg and run scripts/optimize-images.mjs');
  const srcset = m.widths.map((w) => '/assets/img/' + name + '-' + w + '.webp ' + w + 'w').join(', ');
  const fallbackW = m.widths.includes(1200) ? 1200 : m.widths[m.widths.length - 1];
  return '<img src="/assets/img/' + name + '-' + fallbackW + '.webp" srcset="' + srcset + '" sizes="' + sizes + '" width="' + m.width + '" height="' + m.height + '" alt="' + attr(alt ?? meta.alt ?? '') + '"' +
    (eager ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"') + (cls ? ' class="' + cls + '"' : '') + '>';
}
const imgUrl = (name, ext = 'webp', w = 1200) => BASE + '/assets/img/' + name + '-' + (ext === 'jpg' ? imgManifest[name].jpg : w) + '.' + ext;

const tripUrl = (t) => '/trips/' + t.slug;
const hasPolicies = setOnly(site.policies.map((p) => (isSet(p.text) ? p : null))).length > 0;
const reviews = (site.reviews || []).filter((r) => isSet(r.quote) && isSet(r.name));
const email = isSet(C.email) ? C.email : null;
const phone = isSet(C.phone) ? C.phone : null;
const phoneHref = isSet(C.phoneHref) ? C.phoneHref : null;
const address = isSet(C.streetAddress) ? C.streetAddress : null;
const socials = (C.social || []).filter((s) => isSet(s.url) && isSet(s.handle));
const bookingUrl = isSet(C.bookingUrl) ? C.bookingUrl : null;

const NAV = [
  ['/trips', 'Trips'],
  ['/about', 'Our Story'],
  ['/safety', 'Safety'],
  ['/faq', 'FAQ'],
  ['/gallery', 'Gallery'],
  ['/location', 'Location']
];

function jsonLd(obj) { return '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, '\\u003c') + '</script>'; }

const businessLd = () => {
  const o = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'SportsActivityLocation'],
    '@id': BASE + '/#business',
    name: B.name,
    alternateName: B.logoText,
    description: B.shortDescription,
    url: BASE + '/',
    image: imgUrl(site.home.heroImage, 'jpg'),
    logo: BASE + '/icons/icon-512.png',
    address: { '@type': 'PostalAddress', addressLocality: B.town, addressRegion: B.region, addressCountry: B.country },
    areaServed: { '@type': 'Place', name: 'Rio Grande, ' + B.town + ', ' + B.regionName }
  };
  if (isSet(B.foundedYear)) o.foundingDate = B.foundedYear;
  if (email) o.email = email;
  if (phone) o.telephone = phoneHref || phone;
  if (address) o.address.streetAddress = address;
  if (isSet(C.postalCode)) o.address.postalCode = C.postalCode;
  if (isSet(C.hoursSchema)) o.openingHours = C.hoursSchema;
  if (socials.length) o.sameAs = socials.map((s) => s.url);
  return o;
};

/* ---------- layout ---------- */
function layout({ path: p, title, description, body, image, solidHeader = false, ld = [], noindex = false }) {
  const full = title ? title + ' | ' + B.name : B.name + ' — Rio Grande Rafting in Taos, NM';
  const canonical = BASE + (p === '/' ? '/' : p);
  const ogImage = image ? imgUrl(image, 'jpg') : imgUrl(site.home.heroImage, 'jpg');
  const navHtml = NAV.map(([href, label]) => '<a href="' + href + '"' + (p === href || (href !== '/' && p.startsWith(href + '/')) ? ' aria-current="page"' : '') + '>' + label + '</a>').join('');
  return '<!DOCTYPE html>\n<html lang="en" class="no-js">\n<head>\n' +
    '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + esc(full) + '</title>\n<meta name="description" content="' + attr(description) + '">\n' +
    (noindex ? '<meta name="robots" content="noindex">\n' : '<link rel="canonical" href="' + canonical + '">\n') +
    '<meta name="theme-color" content="#007f7f">\n' +
    '<meta property="og:type" content="website">\n<meta property="og:site_name" content="' + attr(B.name) + '">\n' +
    '<meta property="og:title" content="' + attr(full) + '">\n<meta property="og:description" content="' + attr(description) + '">\n' +
    '<meta property="og:url" content="' + canonical + '">\n<meta property="og:image" content="' + ogImage + '">\n<meta property="og:locale" content="en_US">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n<link rel="icon" href="/favicon.ico" sizes="32x32">\n<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">\n' +
    '<link rel="preload" href="/assets/fonts/poppins-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>\n' +
    '<link rel="preload" href="/assets/fonts/poppins-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>\n' +
    '<link rel="stylesheet" href="/assets/css/main.css?v=' + ASSET_V + '">\n' +
    '<script src="/assets/js/main.js?v=' + ASSET_V + '" defer></script>\n' +
    [businessLd(), ...ld].map(jsonLd).join('\n') + '\n</head>\n<body>\n' +
    '<a class="skip-link" href="#main">Skip to content</a>\n' +
    '<header class="site-header' + (solidHeader ? ' site-header--solid' : '') + '">\n<div class="container">\n' +
    '<a class="brand" href="/" aria-label="' + attr(B.name) + ' — home">' + LOGO + '<span>' + esc(B.logoText) + '<small>' + esc(B.town) + ', ' + esc(B.regionName) + '</small></span></a>\n' +
    '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">' + icon('menu') + '</button>\n' +
    '<nav id="site-nav" class="nav" aria-label="Main">' + navHtml + '<a class="btn btn--gold" href="/contact">Book a trip</a></nav>\n' +
    '</div>\n</header>\n<main id="main">\n' + body + '\n</main>\n' + footer() + '\n</body>\n</html>\n';
}

function footer() {
  const contactItems = [];
  if (email) contactItems.push('<li><a href="mailto:' + attr(email) + '">' + esc(email) + '</a></li>');
  if (phone) contactItems.push('<li>' + (phoneHref ? '<a href="tel:' + attr(phoneHref) + '">' + esc(phone) + '</a>' : esc(phone)) + '</li>');
  if (isSet(C.hours)) contactItems.push('<li>' + esc(C.hours) + '</li>');
  if (address) contactItems.push('<li>' + esc(address) + '</li>');
  socials.forEach((s) => contactItems.push('<li><a href="' + attr(s.url) + '" rel="noopener">' + esc(s.label) + ': ' + esc(s.handle) + '</a></li>'));
  const tripLinks = site.trips.map((t) => '<li><a href="' + tripUrl(t) + '">' + esc(t.name) + '</a></li>').join('');
  const more = [['/about', 'Our Story'], ['/safety', 'Safety & What to Bring'], ['/faq', 'FAQ'], ['/gallery', 'Gallery'], ['/location', 'Location'], ['/contact', 'Book & Contact']];
  if (hasPolicies) more.push(['/policies', 'Policies']);
  more.push(['/credits', 'Photo credits']);
  return '<footer class="site-footer">\n<div class="container">\n<div class="footer-grid">\n' +
    '<div class="footer-brand"><a class="brand" href="/">' + LOGO + '<span>' + esc(B.name) + '<small>' + esc(B.town) + ', ' + esc(B.regionName) + '</small></span></a><p>' + esc(B.shortDescription) + '</p></div>\n' +
    '<div><h2>Trips</h2><ul>' + tripLinks + '</ul></div>\n' +
    '<div><h2>Explore</h2><ul>' + more.map(([h, l]) => '<li><a href="' + h + '">' + l + '</a></li>').join('') + '</ul></div>\n' +
    '<div><h2>Contact</h2><ul>' + contactItems.join('') + '<li><a href="/contact">Request a booking →</a></li></ul></div>\n' +
    '</div>\n<div class="footer-bottom"><p>&copy; ' + YEAR + ' ' + esc(B.name) + '. All rights reserved.</p><p>' + esc(B.town) + ', ' + esc(B.regionName) + ' · Rio Grande</p><p><a href="https://demo.ultimatebusinessmachines.com/portfolio">Part of the Ultimate Business Machines portfolio</a></p></div>\n</div>\n</footer>';
}

const waves = '<div class="waves" aria-hidden="true">' +
  ['w1', 'w2', 'w3'].map((c, i) => '<svg class="' + c + '" viewBox="0 0 2400 120" preserveAspectRatio="none"><path fill="' + (i === 2 ? '#fefefc' : i === 1 ? '#f6f1e4' : '#f2c849') + '" d="M0 ' + (60 + i * 12) + ' C200 ' + (20 + i * 15) + ' 400 ' + (100 - i * 5) + ' 600 ' + (60 + i * 12) + ' S1000 ' + (20 + i * 15) + ' 1200 ' + (60 + i * 12) + ' S1600 ' + (100 - i * 5) + ' 1800 ' + (60 + i * 12) + ' S2200 ' + (20 + i * 15) + ' 2400 ' + (60 + i * 12) + ' V120 H0Z"/></svg>').join('') + '</div>';

function pageHero({ eyebrow, title, text, image, crumbs }) {
  const bc = crumbs ? '<nav class="breadcrumb" aria-label="Breadcrumb"><ol>' + crumbs.map(([h, l], i) => '<li>' + (i < crumbs.length - 1 ? '<a href="' + h + '">' + esc(l) + '</a>' : '<span aria-current="page">' + esc(l) + '</span>') + '</li>').join('') + '</ol></nav>' : '';
  return '<section class="page-hero">' + (image ? '<div class="page-hero__media" data-parallax>' + img(image, { eager: true, alt: '' }) + '</div>' : '') +
    '<div class="container">' + bc + (eyebrow ? '<span class="eyebrow">' + esc(eyebrow) + '</span>' : '') + '<h1>' + esc(title) + '</h1>' + (text ? '<p>' + esc(text) + '</p>' : '') + '</div>' + waves + '</section>';
}

const ctaBand = (title = 'Ready to hit the water?', text = 'Tell us your dates and group size and we’ll help you pick the perfect trip on the Rio Grande.') =>
  '<section class="section" style="padding-top:0"><div class="container"><div class="cta-band" data-reveal="zoom">' +
  '<svg class="ripple" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="98"/><circle cx="100" cy="100" r="98"/><circle cx="100" cy="100" r="98"/></svg>' +
  '<h2>' + esc(title) + '</h2><p>' + esc(text) + '</p><div class="btn-row"><a class="btn btn--gold" href="/contact">Book a trip ' + icon('arrow') + '</a><a class="btn btn--ghost" href="/trips">Compare trips</a></div></div></div></section>';

/* ---------- trip helpers ---------- */
const CAT_LABEL = { whitewater: 'Whitewater', family: 'Family-friendly', relaxed: 'Relaxed', private: 'Private' };
function tripFacts(t) {
  return [
    ['clock', 'Duration', t.duration], ['rapids', 'Difficulty', t.difficulty], ['mountain', 'River', t.river],
    ['calendar', 'Schedule', t.schedule], ['sun', 'Season', t.season], ['users', 'Good for', t.goodFor],
    ['family', 'Minimum age', t.minAge], ['compass', 'Fitness', t.fitness], ['clock', 'Check-in', t.meetingTime],
    ['star', 'Price', t.price]
  ].filter(([, , v]) => isSet(v));
}
function tripCard(t, i) {
  const badges = [];
  if (isSet(t.difficulty)) badges.push('<span class="badge badge--gold">' + icon('rapids') + esc(t.difficulty) + '</span>');
  if (isSet(t.duration)) badges.push('<span class="badge">' + icon('clock') + esc(t.duration) + '</span>');
  const meta = [['mountain', t.river], ['users', t.goodFor], ['calendar', t.schedule], ['star', t.price]].filter(([, v]) => isSet(v));
  return '<article class="trip-card" data-reveal style="--d:' + (i * 0.08).toFixed(2) + 's" data-categories="' + attr((t.category || []).join(' ')) + '">' +
    '<div class="trip-card__media">' + img(t.image, { sizes: '(min-width: 1100px) 360px, (min-width: 700px) 50vw, 100vw', alt: '' }) + '<div class="trip-card__badges">' + badges.join('') + '</div></div>' +
    '<div class="trip-card__body"><p class="trip-card__river">' + (t.category || []).map((c) => CAT_LABEL[c] || c).join(' · ') + '</p>' +
    '<h3><a href="' + tripUrl(t) + '">' + esc(t.name) + '</a></h3><p>' + esc(t.summary) + '</p>' +
    '<ul class="meta-list">' + meta.map(([ic, v]) => '<li>' + icon(ic) + '<span>' + esc(v) + '</span></li>').join('') + '</ul>' +
    '<div class="btn-row"><a class="btn btn--teal btn--sm" href="' + tripUrl(t) + '" aria-label="Trip details: ' + attr(t.name) + '">Details ' + icon('arrow') + '</a><a class="btn btn--outline btn--sm" href="/contact?trip=' + t.slug + '" aria-label="Request ' + attr(t.name) + '">Request</a></div></div></article>';
}

/* ---------- pages ---------- */
const pages = [];
const add = (file, html) => pages.push([file, html]);

// Home
{
  const h = site.home;
  const facts = [];
  if (isSet(B.foundedYear)) facts.push(['shield', 'Since ' + B.foundedYear, 'Locals & lifelong river runners']);
  facts.push(['rapids', 'The Rio Grande', B.town + ', ' + B.regionName]);
  facts.push(['clock', 'Half & full day', 'Trips for every pace']);
  facts.push(['family', 'Kids welcome', 'Family & group adventures']);
  const about = site.about.sections;
  const faqTeaser = site.faq.filter((f) => isSet(f.a)).slice(0, 4);
  const body =
    '<section class="hero"><div class="hero__media" data-parallax>' + img(h.heroImage, { eager: true }) + '</div>' +
    '<div class="container"><div class="hero__content"><span class="eyebrow">' + esc(h.heroEyebrow) + '</span>' +
    '<h1>' + esc(h.heroTitle).replace(/(Adventures)$/, '<span class="accent">$1</span>') + '</h1><p>' + esc(h.heroText) + '</p>' +
    '<div class="btn-row"><a class="btn btn--gold" href="/contact">Book a trip ' + icon('arrow') + '</a><a class="btn btn--ghost" href="/trips">View trips</a></div></div></div>' +
    '<span class="hero__scroll" aria-hidden="true"></span>' + waves + '</section>' +
    '<section class="facts" aria-label="At a glance"><div class="container"><div class="facts__inner" data-reveal>' + facts.map(([ic, s, t]) => '<div class="fact">' + icon(ic) + '<div><strong>' + esc(s) + '</strong><span>' + esc(t) + '</span></div></div>').join('') + '</div></div></section>' +
    '<section class="section"><div class="container"><div class="section-head section-head--center" data-reveal><span class="eyebrow">Ways to ride the river</span><h2>Adventure, your way</h2><p>From splashy whitewater to quiet canyon floats, there’s a Rio Grande trip for every crew.</p></div>' +
    '<div class="grid grid--3">' + h.features.map((f, i) => '<article class="feature" data-reveal style="--d:' + (i * 0.1) + 's"><div class="feature__icon">' + icon(f.icon) + '</div><h3><a class="stretched" href="' + attr(f.link) + '">' + esc(f.title) + '</a></h3><p>' + esc(f.text) + '</p><span class="more" aria-hidden="true">Explore ' + icon('arrow') + '</span></article>').join('') + '</div></div></section>' +
    '<section class="section section--sand"><div class="container"><div class="section-head" data-reveal><span class="eyebrow">Trips & packages</span><h2>Hand-crafted rafting experiences</h2><p>Explore the Rio Grande with trips for all skill levels and adventure styles.</p></div>' +
    '<div class="grid grid--2" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr))">' + site.trips.map(tripCard).join('') + '</div>' +
    '<p class="center mt-2"><a class="btn btn--outline" href="/trips">Compare all trips ' + icon('arrow') + '</a></p></div></section>' +
    '<section class="section"><div class="container split"><div class="media-stack" data-reveal="left">' +
    (isSet(B.foundedYear) ? '<div class="stamp"><span><small>Since</small><b>' + esc(B.foundedYear) + '</b></span></div>' : '') +
    '<div class="media-frame">' + img('gorge-river-bend', { sizes: '(min-width: 880px) 40vw, 90vw' }) + '</div><div class="media-frame media-frame--small">' + img('bighorn-sheep', { sizes: '(min-width: 880px) 20vw, 45vw' }) + '</div></div>' +
    '<div data-reveal="right"><span class="eyebrow">Our story</span><h2 class="mt-1">Locals and lifelong river runners</h2><p class="lead mt-1">' + esc(site.about.intro) + '</p><p>' + esc(about[0].text) + '</p>' +
    '<div class="btn-row mt-2"><a class="btn btn--teal" href="/about">Read our story ' + icon('arrow') + '</a><a class="btn btn--outline" href="/safety">Safety & what to bring</a></div></div></div></section>' +
    (reviews.length ? '<section class="section section--sand"><div class="container"><div class="section-head section-head--center" data-reveal><span class="eyebrow">Reviews</span><h2>What our guests say</h2></div><div class="grid grid--3">' + reviews.map(reviewHtml).join('') + '</div></div></section>' : '') +
    '<section class="section section--dark"><div class="container"><div class="section-head" data-reveal><span class="eyebrow">What we stand for</span><h2>River people, through and through</h2></div><div class="pillars">' +
    about.slice(1).map((s, i) => '<article class="pillar" data-reveal style="--d:' + (i * 0.1) + 's"><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></article>').join('') + '</div></div></section>' +
    '<section class="section"><div class="container split split--rev"><div data-reveal="right" class="media-frame media-frame--wide">' + img('gorge-plateau', { sizes: '(min-width: 880px) 45vw, 90vw' }) + '</div>' +
    '<div data-reveal="left"><span class="eyebrow">Good to know</span><h2 class="mt-1">Questions, answered</h2><div class="faq mt-2">' + faqTeaser.map(faqItem).join('') + '</div><p class="mt-2"><a class="btn btn--outline" href="/faq">All FAQs ' + icon('arrow') + '</a></p></div></div></section>' +
    ctaBand();
  add('index.html', layout({ path: '/', description: B.tagline, body }));
}

function reviewHtml(r) {
  return '<figure class="review" data-reveal>' + (r.rating ? '<p class="stars" aria-label="' + r.rating + ' out of 5 stars">' + '★'.repeat(r.rating) + '</p>' : '') + '<blockquote><p>“' + esc(r.quote) + '”</p></blockquote><figcaption>' + esc(r.name) + (isSet(r.source) ? ' <span class="muted">· ' + esc(r.source) + '</span>' : '') + '</figcaption></figure>';
}
function faqItem(f) { return '<details><summary>' + esc(f.q) + '</summary><div class="answer"><p>' + esc(f.a) + '</p></div></details>'; }

// Trips list
{
  const cats = ['all', ...new Set(site.trips.flatMap((t) => t.category || []))];
  const rows = [['Duration', 'duration'], ['Difficulty', 'difficulty'], ['River', 'river'], ['Good for', 'goodFor'], ['Schedule', 'schedule'], ['Season', 'season'], ['Minimum age', 'minAge'], ['Price', 'price']];
  const usedRows = rows.filter(([, k]) => site.trips.some((t) => isSet(t[k])));
  const body = pageHero({ eyebrow: 'Trips & packages', title: 'Find your Rio Grande adventure', text: 'Explore the Rio Grande with hand-crafted rafting experiences for all skill levels and adventure styles.', image: 'gorge-plateau', crumbs: [['/', 'Home'], ['/trips', 'Trips']] }) +
    '<section class="section"><div class="container">' +
    '<div class="filters" role="group" aria-label="Filter trips" data-filters>' + cats.map((c) => '<button class="chip" type="button" data-filter="' + c + '" aria-pressed="' + (c === 'all') + '">' + (c === 'all' ? 'All trips' : CAT_LABEL[c] || c) + '</button>').join('') + '</div>' +
    '<p class="filter-status" data-filter-status aria-live="polite"></p>' +
    '<div class="grid grid--3">' + site.trips.map(tripCard).join('') + '</div></div></section>' +
    '<section class="section section--sand"><div class="container"><div class="section-head" data-reveal><span class="eyebrow">Side by side</span><h2>Compare trips</h2><p>Not sure which trip fits your group? Here’s how they stack up. Anything marked “Ask us” — just get in touch.</p></div>' +
    '<div class="table-wrap" data-reveal><table><caption class="sr-only">Trip comparison</caption><thead><tr><th scope="col">Trip</th>' + usedRows.map(([l]) => '<th scope="col">' + l + '</th>').join('') + '</tr></thead><tbody>' +
    site.trips.map((t) => '<tr><th scope="row"><a href="' + tripUrl(t) + '">' + esc(t.name) + '</a></th>' + usedRows.map(([, k]) => '<td>' + (isSet(t[k]) ? esc(t[k]) : '<span class="ask">Ask us</span>') + '</td>').join('') + '</tr>').join('') +
    '</tbody></table></div></div></section>' + ctaBand('Not sure which trip to pick?', 'Tell us who’s coming and what you’re after — we’ll point you to the right stretch of river.');
  add('trips.html', layout({ path: '/trips', title: 'Trips & Packages', description: 'Rafting trips on the Rio Grande near Taos: half-day whitewater in the Lower Gorge, full-day Racecourse (Class III), scenic floats and custom private trips.', body, image: 'gorge-plateau' }));
}

// Trip detail pages
site.trips.forEach((t) => {
  const facts = tripFacts(t);
  const includes = setOnly(t.includes);
  const others = site.trips.filter((o) => o.slug !== t.slug);
  const body = pageHero({ eyebrow: (t.category || []).map((c) => CAT_LABEL[c] || c).join(' · '), title: t.name, text: t.summary, image: t.image, crumbs: [['/', 'Home'], ['/trips', 'Trips'], [tripUrl(t), t.name]] }) +
    '<section class="section"><div class="container detail"><div>' +
    (facts.length ? '<dl class="facts-grid" data-reveal>' + facts.map(([ic, l, v]) => '<div><dt>' + icon(ic) + l + '</dt><dd>' + esc(v) + '</dd></div>').join('') + '</dl>' : '') +
    '<div class="prose" data-reveal><h2>About this trip</h2>' + t.description.filter(isSet).map((p) => '<p>' + esc(p) + '</p>').join('') +
    (includes.length ? '<h3>What’s included</h3><ul class="check-list">' + includes.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') +
    '<h3>Before you go</h3><p>Check our <a href="/safety">safety &amp; what-to-bring guide</a> and the <a href="/faq">FAQ</a>. Questions about whether this trip suits your group? <a href="/contact?trip=' + t.slug + '">Ask us</a> — we’re happy to help.</p></div>' +
    '<div class="media-frame media-frame--wide mt-3" data-reveal="zoom">' + img(t.image, { sizes: '(min-width: 960px) 60vw, 100vw' }) + '</div></div>' +
    '<aside class="book-card" aria-label="Book this trip" data-reveal="right"><h2>Request this trip</h2><p>Send us your preferred date and group size and we’ll get back to you to confirm availability' + (isSet(t.price) ? ' and pricing.' : ' and pricing details.') + '</p>' +
    (bookingUrl ? '<a class="btn btn--gold" href="' + attr(bookingUrl) + '" rel="noopener">Book online ' + icon('arrow') + '</a>' : '') +
    '<a class="btn ' + (bookingUrl ? 'btn--ghost' : 'btn--gold') + '" href="/contact?trip=' + t.slug + '">Send a booking request ' + icon('arrow') + '</a>' +
    '<p class="small">' + (email ? 'Or email <a href="mailto:' + attr(email) + '?subject=' + encodeURIComponent(t.name) + '">' + esc(email) + '</a>' : '') + (phone ? '<br>Call or text ' + (phoneHref ? '<a href="tel:' + attr(phoneHref) + '">' + esc(phone) + '</a>' : esc(phone)) : '') + (isSet(C.hours) ? '<br>' + esc(C.hours) : '') + '</p></aside>' +
    '</div></section>' +
    '<section class="section section--sand"><div class="container"><div class="section-head" data-reveal><span class="eyebrow">Keep exploring</span><h2>Other trips</h2></div><div class="grid grid--3">' + others.map(tripCard).join('') + '</div></div></section>';
  const ld = [{
    '@context': 'https://schema.org', '@type': 'TouristTrip', name: t.name, description: t.description.filter(isSet).join(' '),
    url: BASE + tripUrl(t), image: imgUrl(t.image, 'jpg'), touristType: (t.category || []).map((c) => CAT_LABEL[c] || c),
    provider: { '@id': BASE + '/#business' }, ...(isSet(t.duration) ? { additionalProperty: [{ '@type': 'PropertyValue', name: 'Duration', value: t.duration }] } : {})
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ['Trips', '/trips'], [t.name, tripUrl(t)]].map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: BASE + u }))
  }];
  add('trips/' + t.slug + '.html', layout({ path: tripUrl(t), title: t.name, description: t.summary, body, image: t.image, ld }));
});

// About
{
  const a = site.about;
  const story = setOnly(a.familyStory || []);
  const guides = (a.guides || []).filter((g) => isSet(g.name));
  const body = pageHero({ eyebrow: 'Our story', title: 'Born from the river. Raised by the canyon.', text: 'A Taos outfitter run by locals and lifelong river runners. We live for water, wilderness, and bringing people together outside.', image: 'gorge-overlook', crumbs: [['/', 'Home'], ['/about', 'Our Story']] }) +
    '<section class="section"><div class="container split"><div data-reveal="left"><span class="eyebrow">' + esc(a.sections[0].title) + '</span><h2 class="mt-1">' + (isSet(B.foundedYear) ? 'On the Rio Grande since ' + esc(B.foundedYear) : 'Our roots') + '</h2><p class="lead mt-1">' + esc(a.sections[0].text) + '</p>' +
    story.map((p) => '<p>' + esc(p) + '</p>').join('') + '</div>' +
    '<div class="media-stack" data-reveal="right">' + (isSet(B.foundedYear) ? '<div class="stamp"><span><small>Est.</small><b>' + esc(B.foundedYear) + '</b></span></div>' : '') + '<div class="media-frame">' + img('gorge-river-bend', { sizes: '(min-width: 880px) 40vw, 90vw' }) + '</div><div class="media-frame media-frame--small">' + img('sunset-mesa', { sizes: '(min-width: 880px) 20vw, 45vw' }) + '</div></div></div></section>' +
    '<section class="section section--dark"><div class="container"><div class="section-head" data-reveal><span class="eyebrow">What drives us</span><h2>Respect for the river, joy in sharing it</h2></div><div class="pillars">' +
    a.sections.map((s, i) => '<article class="pillar" data-reveal style="--d:' + (i * 0.1) + 's"><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></article>').join('') + '</div></div></section>' +
    (guides.length ? '<section class="section"><div class="container"><div class="section-head" data-reveal><span class="eyebrow">The crew</span><h2>Meet our guides</h2></div><div class="grid grid--3">' +
      guides.map((g) => '<article class="feature" data-reveal>' + (isSet(g.photo) && imgManifest[g.photo] ? '<div class="media-frame" style="aspect-ratio:1;margin-bottom:1.25rem">' + img(g.photo, { sizes: '360px', alt: g.name }) + '</div>' : '<div class="feature__icon">' + icon('users') + '</div>') + '<h3>' + esc(g.name) + '</h3>' + (isSet(g.role) ? '<p class="trip-card__river">' + esc(g.role) + '</p>' : '') + (isSet(g.bio) ? '<p>' + esc(g.bio) + '</p>' : '') + '</article>').join('') + '</div></div></section>' : '') +
    ctaBand('Come raft with us', 'We’d love to share our favourite stretches of the Rio Grande with you.');
  add('about.html', layout({ path: '/about', title: 'Our Story', description: a.intro + ' ' + a.sections[0].text, body, image: 'gorge-overlook' }));
}

// Safety & what to bring
{
  const s = site.safety;
  const details = s.details.filter((d) => isSet(d.text));
  const body = pageHero({ eyebrow: 'Safety & preparation', title: 'Safety & what to bring', text: 'A great day on the river starts with good preparation.', image: 'wildflowers-ute-mountain', crumbs: [['/', 'Home'], ['/safety', 'Safety']] }) +
    '<section class="section"><div class="container split"><div data-reveal="left"><span class="eyebrow">Our guides</span><h2 class="mt-1">They’ve got your back</h2><p class="lead mt-1">' + esc(s.intro) + '</p>' +
    (details.length ? '<div class="grid mt-2">' + details.map((d) => '<div class="contact-card">' + icon('shield') + '<div><h3>' + esc(d.title) + '</h3><p>' + esc(d.text) + '</p></div></div>').join('') + '</div>' : '') +
    '<p class="mt-2">Have a question about safety, fitness or a medical condition? <a href="/contact">Ask us before you book</a> — we’ll help you choose the right trip.</p></div>' +
    '<div class="media-frame" data-reveal="right">' + img('gorge-bridge-bighorn', { sizes: '(min-width: 880px) 45vw, 90vw' }) + '</div></div></section>' +
    '<section class="section section--sand"><div class="container grid grid--2"><div data-reveal><span class="eyebrow">Packing list</span><h2 class="mt-1">What to bring</h2><p class="muted mt-1">' + esc(s.whatToBringNote) + '</p><ul class="check-list mt-2">' + setOnly(s.whatToBring).map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div>' +
    '<div data-reveal style="--d:.1s"><span class="eyebrow">On the river</span><h2 class="mt-1">Tips for guests</h2><ul class="check-list mt-2">' + setOnly(s.guestTips).map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div></section>' +
    ctaBand();
  add('safety.html', layout({ path: '/safety', title: 'Safety & What to Bring', description: 'How to prepare for a rafting trip on the Rio Grande near Taos: what to bring, what to wear and tips from our guides.', body, image: 'wildflowers-ute-mountain' }));
}

// FAQ
{
  const faqs = site.faq.filter((f) => isSet(f.q) && isSet(f.a));
  const body = pageHero({ eyebrow: 'FAQ', title: 'Frequently asked questions', text: 'Everything you need to know before your Rio Grande trip. Can’t find your answer? Just ask.', image: 'bighorn-sheep', crumbs: [['/', 'Home'], ['/faq', 'FAQ']] }) +
    '<section class="section"><div class="container"><div class="faq" data-reveal>' + faqs.map(faqItem).join('') + '</div>' +
    '<div class="notice mt-3" style="max-width:52rem">Still have questions? <a href="/contact">Get in touch</a>' + (isSet(C.hours) ? ' — we’re available ' + esc(C.hours) + '.' : '.') + '</div></div></section>' + ctaBand();
  const ld = [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }];
  add('faq.html', layout({ path: '/faq', title: 'FAQ', description: 'Answers to common questions about rafting the Rio Grande with ' + B.name + ': experience needed, kids, lunch, private trips and booking.', body, image: 'bighorn-sheep', ld }));
}

// Gallery
{
  const items = site.gallery.filter((n) => imgManifest[n]);
  const capFor = (n) => { const m = site.images[n] || {}; return esc(m.alt) + (isSet(m.credit) ? ' · Photo: ' + esc(m.credit) + (isSet(m.license) ? ' (' + esc(m.license) + ')' : '') : ''); };
  const body = pageHero({ eyebrow: 'Gallery', title: 'Life on the Rio Grande', text: site.galleryNote, image: 'gorge-river-bend', crumbs: [['/', 'Home'], ['/gallery', 'Gallery']] }) +
    '<section class="section"><div class="container"><div class="gallery">' + items.map((n, i) => {
      const m = imgManifest[n];
      const big = m.widths[m.widths.length - 1];
      return '<figure data-reveal="zoom" style="--d:' + ((i % 3) * 0.08).toFixed(2) + 's"><button type="button" data-lightbox-item data-full="/assets/img/' + n + '-' + big + '.webp" data-w="' + m.width + '" data-h="' + m.height + '" data-alt="' + attr(site.images[n]?.alt || '') + '" data-caption="' + attr(capFor(n)) + '" aria-label="View larger: ' + attr(site.images[n]?.alt || n) + '">' +
        img(n, { sizes: '(min-width: 1100px) 360px, (min-width: 640px) 50vw, 100vw' }) + '<figcaption>' + esc(site.images[n]?.alt || '') + '</figcaption></button></figure>';
    }).join('') + '</div><p class="muted mt-2 center">Photo credits are listed on our <a href="/credits">credits page</a>.</p></div></section>' +
    '<dialog class="lightbox" data-lightbox aria-label="Photo viewer"><figure><img src="data:," alt=""><figcaption></figcaption></figure>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Previous photo">' + icon('left') + '</button><button class="lb-btn lb-next" type="button" aria-label="Next photo">' + icon('right') + '</button><button class="lb-btn lb-close" type="button" aria-label="Close photo viewer">' + icon('close') + '</button></dialog>' +
    ctaBand('See it for yourself', 'Pictures only tell half the story. Come feel the spray of the Rio Grande.');
  add('gallery.html', layout({ path: '/gallery', title: 'Gallery', description: 'Photos of the Rio Grande Gorge and the Río Grande del Norte National Monument near Taos, New Mexico.', body, image: 'gorge-river-bend' }));
}

// Location
{
  const parts = [];
  if (address) parts.push(['pin', 'Address', esc(address) + (isSet(C.postalCode) ? ' ' + esc(C.postalCode) : '') + (isSet(C.locationNote) ? '<br>' + esc(C.locationNote) : '')]);
  if (isSet(C.meetingPoint)) parts.push(['compass', 'Meeting point', esc(C.meetingPoint)]);
  if (isSet(C.directions)) parts.push(['arrow', 'Directions', esc(C.directions)]);
  if (isSet(C.hours)) parts.push(['clock', 'Hours', esc(C.hours)]);
  const mapLink = isSet(C.mapUrl) ? C.mapUrl : 'https://www.openstreetmap.org/search?query=' + encodeURIComponent(B.town + ', ' + B.regionName);
  const body = pageHero({ eyebrow: 'Location', title: 'Find us in ' + B.town, text: 'We run trips on the Rio Grande in Northern New Mexico, near ' + B.town + '.', image: 'gorge-bridge-bighorn', crumbs: [['/', 'Home'], ['/location', 'Location']] }) +
    '<section class="section"><div class="container split"><div data-reveal="left"><span class="eyebrow">Getting here</span><h2 class="mt-1">' + esc(B.town) + ', ' + esc(B.regionName) + '</h2>' +
    '<p class="lead mt-1">Our trips explore the Rio Grande as it carves through the canyons of Northern New Mexico.</p>' +
    (parts.length ? '<div class="contact-cards mt-2">' + parts.map(([ic, t, v]) => '<div class="contact-card">' + icon(ic) + '<div><h3>' + t + '</h3><p>' + v + '</p></div></div>').join('') + '</div>' : '') +
    (!isSet(C.meetingPoint) ? '<div class="notice mt-2">Meeting-point details for your trip: <a href="/contact">contact us</a> and we’ll let you know exactly where to go.</div>' : '') +
    '<div class="btn-row mt-2"><a class="btn btn--teal" href="' + attr(mapLink) + '" rel="noopener">' + icon('pin') + (isSet(C.mapUrl) ? 'Open in maps' : 'View ' + esc(B.town) + ' on OpenStreetMap') + '</a><a class="btn btn--outline" href="/contact">Contact us</a></div></div>' +
    '<div class="media-frame" data-reveal="right">' + img('gorge-plateau', { sizes: '(min-width: 880px) 45vw, 90vw' }) + '</div></div></section>' + ctaBand();
  add('location.html', layout({ path: '/location', title: 'Location & Directions', description: 'Where to find ' + B.name + ' — rafting on the Rio Grande near ' + B.town + ', ' + B.regionName + '.', body, image: 'gorge-bridge-bighorn' }));
}

// Contact / booking
{
  const cards = [];
  if (email) cards.push(['mail', 'Email', '<a href="mailto:' + attr(email) + '">' + esc(email) + '</a>']);
  if (phone) cards.push(['phone', 'Call or text', (phoneHref ? '<a href="tel:' + attr(phoneHref) + '">' + esc(phone) + '</a>' : esc(phone)) + (isSet(C.hours) ? '<br>' + esc(C.hours) : '')]);
  else if (isSet(C.hours)) cards.push(['clock', 'Hours', esc(C.hours)]);
  if (address) cards.push(['pin', 'Visit us', esc(address) + (isSet(C.locationNote) ? '<br>' + esc(C.locationNote) : '')]);
  socials.forEach((s) => cards.push(['camera', s.label, '<a href="' + attr(s.url) + '" rel="noopener">' + esc(s.handle) + '</a>']));
  const opts = site.trips.map((t) => '<option value="' + t.slug + '">' + esc(t.name) + '</option>').join('') + '<option value="not-sure">Not sure yet — help me choose</option>';
  const form = email ? '<form class="form" data-booking-form data-email="' + attr(email) + '" action="mailto:' + attr(email) + '" method="post" enctype="text/plain" data-reveal="right">' +
    '<h2 style="font-size:1.6rem">Booking request</h2><p class="form-note">Fill this in and we’ll open an email to us with your details — nothing is stored on this website. We’ll reply to confirm availability.</p>' +
    '<div class="field"><label for="f-trip">Trip</label><select id="f-trip" name="trip" required>' + opts + '</select></div>' +
    '<div class="form-row"><div class="field"><label for="f-date">Preferred date</label><input id="f-date" name="date" type="date"><span class="hint">Leave blank if flexible</span></div>' +
    '<div class="field"><label for="f-adults">Adults</label><input id="f-adults" name="adults" type="number" min="1" max="99" value="2" required></div>' +
    '<div class="field"><label for="f-kids">Children</label><input id="f-kids" name="children" type="number" min="0" max="99" value="0"></div></div>' +
    '<div class="form-row"><div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" type="text" autocomplete="name" required></div>' +
    '<div class="field"><label for="f-phone">Phone <span class="hint">(optional)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div></div>' +
    '<div class="field"><label for="f-notes">Questions or notes</label><textarea id="f-notes" name="notes" placeholder="Ages of children, experience level, special requests…"></textarea></div>' +
    '<button class="btn btn--gold" type="submit">Create booking email ' + icon('arrow') + '</button><p class="form-status" data-form-status role="status" aria-live="polite"></p></form>' : '';
  const body = pageHero({ eyebrow: 'Book & contact', title: 'Plan your river trip', text: 'Have a question or ready to book? Reach out — we’re always happy to help you plan your next river adventure.', image: 'sunset-mesa', crumbs: [['/', 'Home'], ['/contact', 'Book & Contact']] }) +
    '<section class="section"><div class="container split" style="align-items:start"><div data-reveal="left"><span class="eyebrow">Get in touch</span><h2 class="mt-1">We’d love to hear from you</h2>' +
    '<p class="lead mt-1">Tell us your dates, group size and the kind of adventure you’re after.</p>' +
    (bookingUrl ? '<p class="mt-2"><a class="btn btn--teal" href="' + attr(bookingUrl) + '" rel="noopener">Book online ' + icon('arrow') + '</a></p>' : '') +
    '<div class="contact-cards mt-2">' + cards.map(([ic, t, v]) => '<div class="contact-card">' + icon(ic) + '<div><h3>' + esc(t) + '</h3><p>' + v + '</p></div></div>').join('') + '</div>' +
    '<p class="mt-2 muted">Planning tips: see <a href="/trips">all trips</a>, <a href="/safety">what to bring</a> and our <a href="/faq">FAQ</a>.</p></div>' + form + '</div></section>';
  add('contact.html', layout({ path: '/contact', title: 'Book a Trip & Contact', description: 'Request a rafting trip on the Rio Grande or get in touch with ' + B.name + ' in ' + B.town + ', ' + B.regionName + '.', body, image: 'sunset-mesa' }));
}

// Policies (only when content exists)
if (hasPolicies) {
  const ps = site.policies.filter((p) => isSet(p.text));
  const body = pageHero({ eyebrow: 'Policies', title: 'Booking policies', text: 'The fine print, in plain language.', crumbs: [['/', 'Home'], ['/policies', 'Policies']] }) +
    '<section class="section"><div class="container prose">' + ps.map((p) => '<h2>' + esc(p.title) + '</h2><p>' + esc(p.text) + '</p>').join('') + '</div></section>';
  add('policies.html', layout({ path: '/policies', title: 'Policies', description: 'Booking, cancellation and waiver policies for ' + B.name + '.', body }));
}

// Credits
{
  const used = Object.keys(site.images).filter((n) => imgManifest[n]);
  const body = pageHero({ eyebrow: 'Credits', title: 'Photo & font credits', crumbs: [['/', 'Home'], ['/credits', 'Credits']] }) +
    '<section class="section"><div class="container prose"><p>Photos on this site are used under the licences below. Thank you to the photographers and to the U.S. Bureau of Land Management for sharing images of the Río Grande del Norte National Monument.</p>' +
    '<ul class="mt-2">' + used.map((n) => { const m = site.images[n]; return '<li>' + esc(m.alt) + ' — ' + esc(m.credit) + ', ' + esc(m.license) + (isSet(m.source) ? ' (<a href="' + attr(m.source) + '" rel="noopener">source</a>)' : '') + '</li>'; }).join('') + '</ul>' +
    '<h2 class="mt-3">Fonts</h2><p>Poppins by Indian Type Foundry, licensed under the SIL Open Font License 1.1 and self-hosted on this site.</p></div></section>';
  add('credits.html', layout({ path: '/credits', title: 'Credits', description: 'Photo and font credits for the ' + B.name + ' website.', body }));
}

// 404
add('404.html', layout({ path: '/404', title: 'Page not found', description: 'This page could not be found.', noindex: true, solidHeader: true,
  body: '<section class="section not-found"><div class="container"><span class="eyebrow">Error 404</span><h1 class="mt-1">Looks like you’ve drifted off course</h1><p class="lead mt-1 muted">The page you’re looking for isn’t here. Let’s get you back on the river.</p><div class="btn-row mt-2" style="justify-content:center"><a class="btn btn--teal" href="/">Back to home</a><a class="btn btn--outline" href="/trips">See trips</a></div></div></section>' }));

/* ---------- write ---------- */
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const copyDir = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b2 = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b2); else if (e.name !== 'images.json') fs.copyFileSync(a, b2);
  }
};
copyDir(path.join(root, 'src/assets'), path.join(out, 'assets'));
copyDir(path.join(root, 'src/static'), out);
for (const [file, html] of pages) {
  const dest = path.join(out, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}
const urls = pages.map(([f]) => f).filter((f) => f !== '404.html').map((f) => f === 'index.html' ? '/' : '/' + f.replace(/\.html$/, ''));
fs.writeFileSync(path.join(out, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map((u) => '  <url><loc>' + BASE + u + '</loc></url>').join('\n') + '\n</urlset>\n');
fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + BASE + '/sitemap.xml\n');
fs.writeFileSync(path.join(out, 'site.webmanifest'), JSON.stringify({ name: B.name, short_name: B.logoText, description: B.shortDescription, start_url: '/', display: 'standalone', background_color: '#fefefc', theme_color: '#007f7f', icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }] }, null, 2));

console.log('Built ' + pages.length + ' pages into dist/');
if (todos.length) {
  console.log('\n' + todos.length + ' content item(s) still marked TODO (hidden on the site until filled in):');
  todos.forEach((t) => console.log('  - ' + t));
}
