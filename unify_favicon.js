// unify_favicon.js — ensures every output/*.html has a single, canonical favicon link.
//
// Canonical block (inserted right after <meta name="viewport"...>):
//   <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
//   <link rel="apple-touch-icon" href="/assets/favicon.svg">
//
// - Removes any existing <link rel="icon"|"shortcut icon"|"apple-touch-icon"> tags.
// - Inserts the canonical block once per file, after the viewport meta (or after <title> if no viewport).
// - Idempotent: re-running produces no diff.
//
// Run from project root: node unify_favicon.js

const fs   = require('fs');
const path = require('path');

const ROOT  = path.join(__dirname, 'output');
const BLOCK =
  '    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">\n' +
  '    <link rel="apple-touch-icon" href="/assets/favicon.svg">';

// Match any kind of favicon / apple-touch link tag.
// Tail \r?\n? — consume own line ending only, NOT next line's leading whitespace.
const ICON_LINK_RE = /^[ \t]*<link\b[^>]*\brel=["'](?:icon|shortcut icon|apple-touch-icon|mask-icon)["'][^>]*>\r?\n?/gim;
const VIEWPORT_RE  = /(<meta\s+name=["']viewport["'][^>]*>)/i;
const TITLE_RE     = /(<title>[\s\S]*?<\/title>)/i;

let files   = 0;
let touched = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) processFile(full);
  }
}

function processFile(file) {
  files++;
  const original = fs.readFileSync(file, 'utf8');

  // 1) Strip every existing icon-related <link>.
  let stripped = original.replace(ICON_LINK_RE, '');

  // 2) Insert canonical block.
  let updated;
  if (VIEWPORT_RE.test(stripped)) {
    updated = stripped.replace(VIEWPORT_RE, (m) => `${m}\n${BLOCK}`);
  } else if (TITLE_RE.test(stripped)) {
    updated = stripped.replace(TITLE_RE, (m) => `${m}\n${BLOCK}`);
  } else {
    // Last resort: insert right after <head>.
    updated = stripped.replace(/(<head\b[^>]*>)/i, (m) => `${m}\n${BLOCK}`);
  }

  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8');
    touched++;
  }
}

walk(ROOT);

console.log(`scanned: ${files}`);
console.log(`touched: ${touched}`);
