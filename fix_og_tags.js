#!/usr/bin/env node
/**
 * fix_og_tags.js — Ensure all 4 mandatory OG tags on every page (idempotent).
 *
 *   og:title       <- existing <title>            (fallback if missing)
 *   og:description <- existing meta description    (fallback if missing)
 *   og:url         <- <link rel="canonical"> href
 *   og:image       <- faithful session-19 value when available, else first
 *                     /assets/images/ content image, else /assets/og-default.jpg
 *
 * og:image source of truth: the pre-livesync stash (STASH_REF) holds session-19's
 * contextual og:image per page (e.g. homepage -> bern-old-town, which has no inline
 * <img>). We prefer that exact value; pages absent from the stash (the 9 cron guides
 * published later) fall back to their first content image. Preserves LF line endings.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT = path.join(__dirname, 'output');
const SITE = 'https://cryptolicenses.net';
const STASH_REF = process.env.OG_STASH_REF || 'stash@{0}';
const GENERIC = ['og-default.jpg', 'zurich-lakeside-historic-buildings.jpg'];
let fixed = 0, skipped = 0;

function stashOgImage(relFromRoot) {
  try {
    const buf = execSync(`git show ${STASH_REF}:${relFromRoot}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    const m = buf.match(/property="og:image"\s+content="([^"]+)"/);
    return m ? m[1] : null;
  } catch { return null; }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['templates', 'functions', '.github', '.wrangler', 'assets'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.name === 'index.html') {
      fixOne(full);
    }
  }
}

function fixOne(filePath) {
  let html = fs.readFileSync(filePath, 'utf-8');
  const before = html;

  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1]?.trim();
  const desc = (html.match(/<meta\s+name="description"\s+content="([^"]+)"/) || [])[1]?.trim();
  const canonical = (html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/) || [])[1]?.trim();

  // --- og:title / og:description (fallbacks) ---
  if (!html.includes('property="og:title"') && title) {
    html = insertHead(html, `<meta property="og:title" content="${title}">`);
  }
  if (!html.includes('property="og:description"') && desc) {
    html = insertHead(html, `<meta property="og:description" content="${desc}">`);
  }

  // --- og:image (contextual) ---
  const relFromRoot = path.relative(__dirname, filePath);
  let img = stashOgImage(relFromRoot);
  if (!img) {
    const firstImg = (html.match(/<img[^>]+src="(\/assets\/images\/[^"]+)"/) || [])[1];
    img = firstImg ? `${SITE}${firstImg}` : `${SITE}/assets/og-default.jpg`;
  }
  const curImg = (html.match(/property="og:image"\s+content="([^"]+)"/) || [])[1];
  if (curImg) {
    // replace only if current is generic and we have a better contextual one
    const curGeneric = GENERIC.some(g => curImg.includes(g));
    if (curGeneric && !GENERIC.some(g => img.includes(g)) && curImg !== img) {
      html = html.replace(/(property="og:image"\s+content=")[^"]+(")/, `$1${img}$2`);
    }
  } else {
    html = insertHead(html, `<meta property="og:image" content="${img}">`);
  }

  // --- og:url (from canonical) ---
  if (!html.includes('property="og:url"') && canonical) {
    const tag = `<meta property="og:url" content="${canonical}">`;
    if (html.includes('property="og:image"')) {
      html = html.replace(/(\s*)(<meta\s+property="og:image")/, `$1${tag}$1$2`);
    } else {
      html = insertHead(html, tag);
    }
  }

  if (html !== before) {
    fs.writeFileSync(filePath, html, 'utf-8');
    fixed++;
  } else {
    skipped++;
  }
}

function insertHead(html, tag) {
  if (html.includes('property="og:image"')) {
    return html.replace(/(<meta\s+property="og:image"[^>]*>)/, `${tag}\n    $1`);
  }
  if (html.includes('</head>')) {
    return html.replace('</head>', `    ${tag}\n</head>`);
  }
  return html;
}

walk(OUTPUT);
console.log(`\nDone: ${fixed} fixed, ${skipped} already OK`);
