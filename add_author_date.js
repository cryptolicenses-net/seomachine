#!/usr/bin/env node
/**
 * add_author_date.js — Add author byline box + last updated date to all pages
 *
 * Author box: inserted before CTA section or footer
 * Last updated: inserted after breadcrumb
 *
 * Skips: homepage, 404, privacy, terms, sitemap, contact (non-article pages)
 */

const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(__dirname, 'output');

const AUTHOR_BOX = `
    <!-- Author -->
    <div class="author-box">
        <div class="author-avatar">MH</div>
        <div>
            <div class="author-box-name"><a href="/about/dr-marcus-hartmann/">Dr. Marcus Hartmann</a></div>
            <div class="author-box-meta">Senior Licensing Consultant · LL.M. International Financial Law</div>
            <div class="author-box-bio">22 years in financial services regulation. Advised 400+ crypto licensing mandates across 60+ jurisdictions. Based in Zug, Switzerland.</div>
        </div>
    </div>`;

const LAST_UPDATED = `<div class="last-updated">Last updated: April 2026</div>`;

// Pages to SKIP (not articles/commercial pages)
const SKIP_PATHS = [
  'output/index.html',          // homepage
  'output/404/index.html',      // 404
  'output/privacy/index.html',  // privacy
  'output/terms/index.html',    // terms
  'output/sitemap/index.html',  // sitemap
  'output/contact/index.html',  // contact
  'output/about/index.html',    // about
];

function shouldSkip(filePath) {
  const rel = filePath.replace(/\\/g, '/');
  for (const skip of SKIP_PATHS) {
    if (rel.endsWith(skip.replace(/\//g, path.sep)) || rel.endsWith(skip)) return true;
  }
  // Normalize for comparison
  const normalized = rel.replace(/\\/g, '/');
  for (const skip of SKIP_PATHS) {
    if (normalized.endsWith(skip)) return true;
  }
  return false;
}

let authorAdded = 0;
let dateAdded = 0;
let skipped = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['.github', '.wrangler', 'templates', 'functions', 'assets'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.name === 'index.html') {
      processPage(full);
    }
  }
}

function processPage(filePath) {
  // Check skip list
  const relPath = path.relative(__dirname, filePath).split(path.sep).join('/');
  if (SKIP_PATHS.some(s => relPath === s)) {
    skipped++;
    return;
  }

  let html = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // 1. Add author box (if not already present)
  if (!html.includes('author-box')) {
    // Insert before CTA section
    if (html.includes('<section class="cta-section">')) {
      html = html.replace(
        '<section class="cta-section">',
        `${AUTHOR_BOX}\n\n    <section class="cta-section">`
      );
      modified = true;
      authorAdded++;
    }
    // Fallback: insert before <footer>
    else if (html.includes('<footer')) {
      html = html.replace(
        '<footer',
        `${AUTHOR_BOX}\n\n    <footer`
      );
      modified = true;
      authorAdded++;
    }
  }

  // 2. Add last updated date (if not already present)
  if (!html.includes('last-updated')) {
    // Insert after breadcrumb closing div, before hero
    if (html.includes('class="breadcrumb"')) {
      // Find end of breadcrumb div and insert after
      html = html.replace(
        /(<div class="breadcrumb">[\s\S]*?<\/div>)\s*\n/,
        `$1\n    ${LAST_UPDATED}\n`
      );
      modified = true;
      dateAdded++;
    }
    // Fallback: insert after hero section
    else if (html.includes('class="hero"') || html.includes('class="hero ')) {
      html = html.replace(
        /(<\/section>)/,
        `$1\n    ${LAST_UPDATED}`
      );
      modified = true;
      dateAdded++;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf-8');
  }
}

walk(OUTPUT);
console.log(`Author box added: ${authorAdded} pages`);
console.log(`Last updated added: ${dateAdded} pages`);
console.log(`Skipped: ${skipped} pages`);
