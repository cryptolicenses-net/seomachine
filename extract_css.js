#!/usr/bin/env node
/**
 * extract_css.js — Extract common CSS into external stylesheet
 *
 * Strategy: Parse all pages, find CSS rule blocks that appear on 50%+ pages,
 * extract them to /assets/style.css, leave page-specific styles inline (smaller).
 * Also merges burger-css into the external file.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUTPUT = path.join(__dirname, 'output');
const CSS_FILE = path.join(OUTPUT, 'assets', 'style.css');

// Step 1: Collect all CSS blocks from all pages
console.log('Step 1: Scanning all pages...');

const pages = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['.github', '.wrangler', 'templates', 'functions', 'assets'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.name === 'index.html') {
      pages.push(full);
    }
  }
}
walk(OUTPUT);
console.log(`Found ${pages.length} pages`);

// Step 2: Parse CSS into rule blocks
function parseCssRules(css) {
  const rules = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < css.length; i++) {
    current += css[i];
    if (css[i] === '{') depth++;
    if (css[i] === '}') {
      depth--;
      if (depth <= 0) {
        const rule = current.trim();
        if (rule) rules.push(rule);
        current = '';
        depth = 0;
      }
    }
  }
  return rules;
}

// Step 3: Count frequency of each rule across all pages
console.log('Step 2: Counting CSS rule frequency...');

const ruleCount = new Map(); // hash -> { rule, count }
const pageRules = new Map(); // filePath -> rules[]

for (const filePath of pages) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const mainMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!mainMatch) continue;

  const rules = parseCssRules(mainMatch[1]);
  const ruleHashes = [];

  for (const rule of rules) {
    const hash = crypto.createHash('md5').update(rule).digest('hex');
    ruleHashes.push(hash);

    if (!ruleCount.has(hash)) {
      ruleCount.set(hash, { rule, count: 0 });
    }
    ruleCount.get(hash).count++;
  }

  pageRules.set(filePath, ruleHashes);
}

// Step 4: Determine threshold — rules appearing on 30%+ of pages go external
const threshold = Math.floor(pages.length * 0.3);
console.log(`Threshold: rules appearing on ${threshold}+ pages (30% of ${pages.length})`);

const commonRules = [];
const commonHashes = new Set();

// Sort by frequency (most common first)
const sorted = [...ruleCount.entries()].sort((a, b) => b[1].count - a[1].count);

for (const [hash, { rule, count }] of sorted) {
  if (count >= threshold) {
    commonRules.push(rule);
    commonHashes.add(hash);
  }
}

console.log(`Common rules (30%+ pages): ${commonRules.length} out of ${ruleCount.size} unique rules`);

// Step 5: Extract burger CSS (it's almost identical everywhere)
let burgerCss = '';
for (const filePath of pages) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const burgerMatch = html.match(/<style id="burger-css">([\s\S]*?)<\/style>/);
  if (burgerMatch && burgerMatch[1].trim().length > burgerCss.length) {
    burgerCss = burgerMatch[1].trim();
  }
}

// Step 6: Build external CSS file
console.log('Step 3: Building external stylesheet...');

const externalCss = `/* CryptoLicenses.net — Common Styles */
/* Auto-extracted ${new Date().toISOString().slice(0,10)} */

${commonRules.join('\n\n')}

/* Burger / Mobile Navigation */
${burgerCss}

/* Author Box */
.author-box { display: flex; gap: 1.25rem; align-items: flex-start; padding: 1.5rem; border: var(--heavy); margin: 1.5rem 0; background: rgba(201,168,76,0.04); }
.author-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--ink); color: var(--paper); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 600; flex-shrink: 0; }
.author-box-name { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }
.author-box-name a { color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--accent); }
.author-box-name a:hover { color: var(--accent); }
.author-box-meta { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent); margin-bottom: 0.5rem; }
.author-box-bio { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }

/* Last Updated Badge */
.last-updated { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); padding: 0.35rem 0.75rem; border: var(--border); display: inline-block; margin-bottom: 1rem; }
`;

fs.writeFileSync(CSS_FILE, externalCss, 'utf-8');
const cssSize = Math.round(externalCss.length / 1024);
console.log(`Written: /assets/style.css (${cssSize} KB)`);

// Step 7: Update all pages — remove common rules from inline, add link tag
console.log('Step 4: Updating pages...');

let updated = 0;
for (const filePath of pages) {
  let html = fs.readFileSync(filePath, 'utf-8');
  const hashes = pageRules.get(filePath);
  if (!hashes) continue;

  // Get page-specific rules only (not in common set)
  const mainMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!mainMatch) continue;

  const allRules = parseCssRules(mainMatch[1]);
  const specificRules = [];

  for (let i = 0; i < allRules.length; i++) {
    const hash = hashes[i];
    if (!commonHashes.has(hash)) {
      specificRules.push(allRules[i]);
    }
  }

  // Build new inline style (page-specific only)
  const newInlineStyle = specificRules.length > 0
    ? `<style>\n${specificRules.join('\n')}\n    </style>`
    : '';

  // Add link to external CSS before inline styles or before </head>
  const linkTag = '<link rel="stylesheet" href="/assets/style.css">';

  // Replace main <style> block
  if (html.includes(linkTag)) {
    // Already has link tag — just update inline
    html = html.replace(/<style>([\s\S]*?)<\/style>/, newInlineStyle);
  } else {
    // Replace <style>...</style> with link + remaining inline
    const replacement = newInlineStyle
      ? `${linkTag}\n    ${newInlineStyle}`
      : linkTag;
    html = html.replace(/<style>([\s\S]*?)<\/style>/, replacement);
  }

  // Remove burger-css block (now in external file)
  html = html.replace(/<style id="burger-css">[\s\S]*?<\/style>\s*/, '');

  fs.writeFileSync(filePath, html, 'utf-8');
  updated++;
}

console.log(`Updated ${updated} pages`);

// Stats
const avgInlineBefore = Math.round(22000); // ~22KB average
const commonExtracted = Math.round(externalCss.length);
console.log(`\nSummary:`);
console.log(`  External CSS: ${cssSize} KB (cached across all pages)`);
console.log(`  Common rules extracted: ${commonRules.length}`);
console.log(`  Pages updated: ${updated}`);
console.log(`  Burger CSS merged into external`);
console.log(`  Author-box + last-updated CSS added to external`);
