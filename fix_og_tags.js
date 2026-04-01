#!/usr/bin/env node
/**
 * fix_og_tags.js — Add missing og:title and og:description tags
 * Extracts from existing <title> and <meta name="description"> tags
 */

const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(__dirname, 'output');
let fixed = 0;
let skipped = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['templates', 'functions', '.github', '.wrangler', 'assets'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.name === 'index.html') {
      fixOgTags(full);
    }
  }
}

function fixOgTags(filePath) {
  let html = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Extract title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1].trim() : null;

  // Extract meta description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  const desc = descMatch ? descMatch[1].trim() : null;

  // Check and add og:title
  if (!html.includes('og:title') && title) {
    const ogTitle = `    <meta property="og:title" content="${title}">`;
    // Insert after existing og tags, or after description meta, or before </head>
    if (html.includes('og:image')) {
      html = html.replace(
        /(<meta\s+property="og:image"[^>]*>)/,
        `<meta property="og:title" content="${title}">\n    $1`
      );
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', `    ${ogTitle}\n    </head>`);
    }
    modified = true;
  }

  // Check and add og:description
  if (!html.includes('og:description') && desc) {
    const ogDesc = `<meta property="og:description" content="${desc}">`;
    if (html.includes('og:title')) {
      html = html.replace(
        /(<meta\s+property="og:title"[^>]*>)/,
        `$1\n    ${ogDesc}`
      );
    } else if (html.includes('og:image')) {
      html = html.replace(
        /(<meta\s+property="og:image"[^>]*>)/,
        `${ogDesc}\n    $1`
      );
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', `    ${ogDesc}\n    </head>`);
    }
    modified = true;
  }

  // Check and add og:type if missing
  if (!html.includes('og:type') && modified) {
    const ogType = html.includes('/guides/') ? 'article' : 'website';
    if (html.includes('og:description')) {
      html = html.replace(
        /(<meta\s+property="og:description"[^>]*>)/,
        `$1\n    <meta property="og:type" content="${ogType}">`
      );
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf-8');
    fixed++;
    console.log(`Fixed: ${path.relative(OUTPUT, filePath)}`);
  } else {
    skipped++;
  }
}

walk(OUTPUT);
console.log(`\nDone: ${fixed} fixed, ${skipped} already OK`);
