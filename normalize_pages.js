#!/usr/bin/env node
/**
 * normalize_pages.js - idempotent accessibility / markup normaliser.
 *
 * Usage: node normalize_pages.js <dir> [<dir> ...]     (default: output)
 *
 * Why it exists: every page on the site (and every draft guide that auto-publish.js
 * copies into output/) is a standalone, pre-rendered HTML file; there is no template
 * engine. These fixes therefore live in one script that runs
 *   - over output/ and drafts/guides/ whenever the fixes are (re)applied, and
 *   - from auto-publish.js after a draft is copied, before add_schema.js and
 *     generate_sitemap.js run,
 * so a newly published guide always carries them. Running it twice changes nothing.
 *
 * What it does per HTML file:
 *   1. drops `sizes` from <img> that have no `srcset` (Nu validator error)
 *   2. adds width/height to the header/footer logo <img> that has an inline height
 *   3. adds a "Skip to main content" link, a <main id> landmark (wraps content when the
 *      page has none) and a <header> landmark around the first site <nav>
 *   4. associates contact-form <label>s with their controls (for/id) and names the <select>
 *   5. og:type website on the home page only
 *   6. /favicon.ico link next to the SVG icon
 *   7. colour contrast: gold/grey text tokens get AA-safe "ink" variants on light
 *      backgrounds and keep the original brand colours inside dark containers; non-text
 *      uses of the gold token are re-pointed to a constant token so fills do not change
 *   8. mobile nav overflow, reduced-motion rule and skip-link styles (one <style id="a11y-fixes">)
 * and over assets/style.css: step 7 re-pointing, plus a ?v=<hash> cache-buster on the
 * <link> to it (/assets/* is served `immutable`, so the URL has to change).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const OUTPUT = path.join(ROOT, 'output');
const STYLE_CSS = path.join(OUTPUT, 'assets', 'style.css');

// ---- colour tokens (computed against every light background used on the site) ----
const GOLD = '#C9A84C';
const GOLD_INK = '#7B6425';     // >= 4.5:1 on #F5F0EB .. #E8E4E1
const GOLD_INK_LG = '#9A7D2E';  // >= 3:1 (large text only) on the same backgrounds
const MUTED = '#6B7587';
const MUTED_INK = '#5E6777';    // >= 4.5:1 on #F5F0EB .. #E8E4E1

// Containers with a dark (navy) background: gold/grey text inside them keeps the original colours.
const DARK = [
  'header.hero-guide', 'a.nav-logo',
  'section.cta-section', 'div.cta-section', 'div.cta-band', 'div.cta-box',
  'div.cta-block', 'div.cta-inline', 'div.aside-cta-box', 'div.aside-box-title', 'div.aside-card-head',
  'div.hero-cta-box', 'div.swiss-right', 'div.final-cta', 'div.tldr-box', 'div.form-header', 'div.error-top',
  'div.vanuatu-header', 'div.ticker', 'div.tl-date', 'div.type-card-label', 'div.trend-badge',
  'div.author-avatar', 'div.ig-cost-row.total', 'a.nav-cta', 'a.btn-primary-lg',
  'a.mobile-nav-cta', 'button.newsletter-btn', 'button.submit-btn', 'a.filter-btn.active'
];

// footer is navy on pages that link style.css or set it themselves, paper-coloured elsewhere
function footerIsDark(html) {
  if (/href="\/assets\/style\.css/.test(html)) return true;
  return /(^|[}\s,])footer\s*\{[^}]*background(-color)?\s*:\s*(var\(--ink\)|#1c2b4a)/i.test(html);
}

// classes that are navy on some pages and light on others: navy only where the page's own CSS says so
const CONDITIONAL = { 'section.hero': 'hero', 'div.step-num': 'step-num' };
function conditionalDark(html) {
  const out = [];
  for (const [sel, cls] of Object.entries(CONDITIONAL)) {
    const re = new RegExp('\\.' + cls + '\\s*\\{[^}]*background(-color)?\\s*:\\s*(var\\(--ink\\)|#1c2b4a)', 'i');
    if (re.test(html)) out.push(sel);
  }
  return out;
}

function a11yCss(hasBurger, footerDark, extraDark) {
  const dark = (footerDark ? ['footer'] : []).concat(extraDark || []).concat(DARK).flatMap(s => [s, s + ' *']).join(',');
  let css = `
/* a11y-fixes: managed by normalize_pages.js - do not edit by hand */
:root{--accent-ink:${GOLD_INK};--accent-ink-lg:${GOLD_INK_LG};--muted-ink:${MUTED_INK};--brand-gold:${GOLD}}
body{--accent:var(--accent-ink);--accent-lg:var(--accent-ink-lg);--muted:var(--muted-ink)}
${dark}{--accent:${GOLD};--accent-lg:${GOLD};--muted:${MUTED}}
.hero-h1 em,.value-big{color:var(--accent-lg)}
.breadcrumb span{opacity:1}
.hero-meta-item{opacity:1;color:rgba(245,240,235,.6)}
.hero-meta-item span{color:#AF954C}
.skip-link{position:absolute;left:0;top:0;z-index:1000;padding:.75rem 1rem;background:#1C2B4A;color:#F5F0EB;font:500 .875rem/1.2 Inter,sans-serif;text-decoration:none;transform:translateY(-120%)}
.skip-link:focus{transform:none;outline:2px solid ${GOLD};outline-offset:2px}
.site-header{position:sticky;top:0;z-index:100}
.site-header>nav{position:static}
.nav-links{min-width:0}
@media (max-width:640px){.site-header{position:static}`;
  if (!hasBurger) {
    css += `nav{flex-wrap:wrap;overflow:visible}.nav-brand{flex:1 1 auto;width:auto;padding:1rem 1.25rem;border-right:0}.nav-cta{flex:0 0 auto;padding:0 1rem}.nav-links{order:3;flex:1 1 100%;border-top:var(--border)}`;
  }
  css += `}
@media (prefers-reduced-motion:reduce){.ticker-content{animation:none;transform:none}}
`;
  return css;
}

// ---- CSS text helpers ----
// Non-text uses of var(--accent) (backgrounds, borders, ...) must keep the gold fill.
function repointAccent(css) {
  return css.replace(/([a-zA-Z-]+)(\s*:\s*)([^;{}]*?var\(--accent\)[^;{}]*)/g, (m, prop, sep, val) => {
    if (prop === 'color' || prop.startsWith('--')) return m;
    return prop + sep + val.replace(/var\(--accent\)/g, `var(--brand-gold,${GOLD})`);
  });
}
function fixLiteralGold(css) {
  return css.replace(/(^|[^-\w])color(\s*:\s*)#C9A84C\b/gi, '$1color$2var(--accent)');
}
function transformCssText(css) { return fixLiteralGold(repointAccent(css)); }

function transformStyleRegions(html) {
  html = html.replace(/(<style\b(?![^>]*id="a11y-fixes")[^>]*>)([\s\S]*?)(<\/style>)/gi, (m, o, css, c) => o + transformCssText(css) + c);
  html = html.replace(/(\sstyle\s*=\s*)("[^"]*"|'[^']*')/gi, (m, a, v) => a + transformCssText(v));
  return html;
}

// ---- per-page transforms ----
function dropOrphanSizes(html) {
  return html.replace(/<img\b[^>]*>/gi, tag =>
    /\ssrcset\s*=/i.test(tag) ? tag : tag.replace(/\s+sizes\s*=\s*("[^"]*"|'[^']*')/i, ''));
}

function sizeLogos(html) {
  return html.replace(/<img\b[^>]*src="\/assets\/logo\.svg"[^>]*>/gi, tag => {
    if (/\swidth\s*=/i.test(tag) && /\sheight\s*=/i.test(tag)) return tag;
    const h = /height\s*:\s*(\d+(?:\.\d+)?)px/i.exec(tag);
    if (!h) return tag;
    const height = Math.round(parseFloat(h[1]));
    const width = Math.round(height * 9); // logo.svg is 288x32
    return tag.replace(/<img\b/i, `<img width="${width}" height="${height}"`);
  });
}

function landmarks(html) {
  const bodyOpen = /<body\b[^>]*>/i.exec(html);
  if (!bodyOpen) return html;

  // <header> landmark around the first site nav when the page has no body-level header yet
  if (!/<header\b/i.test(html)) {
    const navStart = html.indexOf('<nav', bodyOpen.index);
    if (navStart !== -1) {
      const navEnd = html.indexOf('</nav>', navStart);
      if (navEnd !== -1) {
        const end = navEnd + '</nav>'.length;
        html = html.slice(0, navStart) + '<header class="site-header">' + html.slice(navStart, end) + '</header>' + html.slice(end);
      }
    }
  }

  // <main> landmark
  let targetId = 'main-content';
  const mainTag = /<main\b[^>]*>/i.exec(html);
  if (mainTag) {
    const idm = /\sid\s*=\s*"([^"]+)"/i.exec(mainTag[0]);
    if (idm) targetId = idm[1];
    else html = html.replace(mainTag[0], mainTag[0].replace(/<main\b/i, `<main id="${targetId}"`));
  } else {
    const footerAt = html.lastIndexOf('<footer');
    const bodyStart = bodyOpen.index + bodyOpen[0].length;
    let after = html.indexOf('</header>', bodyStart);
    after = after !== -1 ? after + '</header>'.length : -1;
    if (after === -1) {
      const n = html.indexOf('</nav>', bodyStart);
      after = n !== -1 ? n + '</nav>'.length : -1;
    }
    if (footerAt !== -1 && after !== -1 && after < footerAt) {
      html = html.slice(0, after) + `\n<main id="${targetId}">` + html.slice(after, footerAt) + '</main>\n' + html.slice(footerAt);
    } else {
      return html; // no safe place: leave the page as it is (reported by the caller)
    }
  }

  // skip link as the first element of <body>
  if (!/class="skip-link"/.test(html)) {
    const b = /<body\b[^>]*>/i.exec(html);
    html = html.slice(0, b.index + b[0].length) + `\n<a class="skip-link" href="#${targetId}">Skip to main content</a>` + html.slice(b.index + b[0].length);
  }
  return html;
}

function labelForms(html) {
  return html.replace(/<form\b[^>]*data-contact-form[\s\S]*?<\/form>/gi, form => {
    // 1. labels followed by their control
    form = form.replace(/<label(?![^>]*\sfor=)([^>]*)>([\s\S]*?)<\/label>(\s*(?:<div[^>]*>\s*)?)(<(?:input|select|textarea)\b[^>]*>)/gi,
      (m, lattr, text, between, control) => {
        const nm = /\sname="([^"]+)"/i.exec(control);
        if (!nm) return m;
        let id = (/\sid="([^"]+)"/i.exec(control) || [])[1];
        if (!id) {
          id = 'cf-' + nm[1].replace(/_/g, '-');
          control = control.replace(/<(input|select|textarea)\b/i, `<$1 id="${id}"`);
        }
        return `<label${lattr} for="${id}">${text}</label>${between}${control}`;
      });
    // 2. controls that still have no accessible name (select with no label): use the placeholder option
    form = form.replace(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi, (m, attrs, inner) => {
      if (/\saria-label(ledby)?=/i.test(attrs) || /\sid="/i.test(attrs) && new RegExp(`for="${(/\sid="([^"]+)"/i.exec(attrs) || [])[1]}"`).test(form)) return m;
      const first = /<option[^>]*>([\s\S]*?)<\/option>/i.exec(inner);
      let name = first ? first[1].replace(/<[^>]+>/g, '').replace(/&hellip;|…|\.\.\.$/g, '').trim() : '';
      if (!name) name = 'Select an option';
      return `<select${attrs} aria-label="${name.replace(/"/g, '&quot;')}">${inner}</select>`;
    });
    return form;
  });
}

function homeOgType(html, rel) {
  if (rel !== 'index.html') return html;
  return html.replace(/(<meta\s+property="og:type"\s+content=")article(")/i, '$1website$2');
}

function faviconIco(html) {
  if (/href="\/favicon\.ico"/i.test(html)) return html;
  return html.replace(/(\s*)(<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="\/assets\/favicon\.svg">)/i,
    (m, ws, svg) => `${ws}<link rel="icon" href="/favicon.ico" sizes="any">${ws}${svg}`);
}

function injectBlock(html) {
  const hasBurger = /burger-btn/.test(html);
  const block = `<style id="a11y-fixes">${a11yCss(hasBurger, footerIsDark(html), conditionalDark(html))}</style>`;
  if (/<style id="a11y-fixes">[\s\S]*?<\/style>/.test(html)) return html.replace(/<style id="a11y-fixes">[\s\S]*?<\/style>/, () => block);
  if (!/<\/head>/i.test(html)) return html;
  return html.replace(/<\/head>/i, () => block + '\n</head>');
}

function cacheBust(html, version) {
  return html.replace(/(href="\/assets\/style\.css)(\?v=[0-9a-f]+)?(")/g, `$1?v=${version}$3`);
}

function normalizeHtml(html, rel, version) {
  const before = html;
  html = dropOrphanSizes(html);
  html = sizeLogos(html);
  html = labelForms(html);
  html = homeOgType(html, rel);
  html = faviconIco(html);
  html = transformStyleRegions(html);
  html = landmarks(html);
  html = injectBlock(html);
  if (version) html = cacheBust(html, version);
  return html !== before ? html : before;
}

// ---- driver ----
function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['functions', 'node_modules', '.git', '.github', '.wrangler'].includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function normalizeStyleCss() {
  if (!fs.existsSync(STYLE_CSS)) return null;
  const src = fs.readFileSync(STYLE_CSS, 'utf8');
  const out = transformCssText(src);
  if (out !== src) fs.writeFileSync(STYLE_CSS, out, 'utf8');
  return crypto.createHash('sha1').update(out).digest('hex').slice(0, 8);
}

function main() {
  const dirs = process.argv.slice(2).length ? process.argv.slice(2) : [OUTPUT];
  const version = normalizeStyleCss();
  let changed = 0, total = 0;
  const noMain = [];
  for (const d of dirs) {
    const base = path.resolve(d);
    for (const f of walk(base, [])) {
      total++;
      const rel = path.relative(base, f).split(path.sep).join('/');
      const src = fs.readFileSync(f, 'utf8');
      if (!/<\/head>/i.test(src)) continue;
      const out = normalizeHtml(src, rel, version);
      if (!/<main\b/i.test(out)) noMain.push(rel);
      if (out !== src) { fs.writeFileSync(f, out, 'utf8'); changed++; }
    }
  }
  console.log(`normalize_pages: ${changed}/${total} files changed, style.css version ${version}`);
  if (noMain.length) console.log(`normalize_pages: no <main> could be added to: ${noMain.join(', ')}`);
}

if (require.main === module) main();
module.exports = { normalizeHtml, transformCssText };
