#!/usr/bin/env node
/**
 * auto-publish.js — Automated guide publishing with interlinking
 *
 * Runs daily via GitHub Actions. Checks publish-schedule.json,
 * and if today matches a scheduled date:
 *   1. Copies draft from drafts/guides/[slug] → output/guides/[slug]
 *   2. Adds interlinks: new page ↔ existing pages
 *   3. Updates guides hub (output/guides/index.html)
 *   4. Runs sitemap + schema + redirects generation
 *   5. Updates publish-schedule.json status
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const OUTPUT = path.join(ROOT, 'output');
const DRAFTS = path.join(ROOT, 'drafts', 'guides');
const SCHEDULE_FILE = path.join(ROOT, 'publish-schedule.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function today() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function log(msg) {
  console.log(`[auto-publish] ${msg}`);
}

function readFile(p) {
  return fs.readFileSync(p, 'utf-8');
}

function writeFile(p, content) {
  fs.writeFileSync(p, content, 'utf-8');
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ---------------------------------------------------------------------------
// 1. Check schedule
// ---------------------------------------------------------------------------

function getScheduledForToday(schedule, dateOverride) {
  const targetDate = dateOverride || today();
  return schedule.filter(
    item => item.date === targetDate && item.status === 'pending'
  );
}

// ---------------------------------------------------------------------------
// 2. Copy draft → output
// ---------------------------------------------------------------------------

function publishDraft(slug) {
  const src = path.join(DRAFTS, slug);
  const dest = path.join(OUTPUT, 'guides', slug);

  if (!fs.existsSync(src)) {
    throw new Error(`Draft not found: ${src}`);
  }

  if (fs.existsSync(dest)) {
    log(`WARNING: ${dest} already exists, overwriting`);
  }

  copyDirSync(src, dest);
  log(`Copied: drafts/guides/${slug} → output/guides/${slug}`);
  return dest;
}

// ---------------------------------------------------------------------------
// 3. Interlinking
// ---------------------------------------------------------------------------

/**
 * Add "Related Guides" links to the newly published page.
 * Inserts links before the FAQ section or before the CTA block.
 */
function addLinksToNewPage(slug, guideConfig, schedule) {
  const filePath = path.join(OUTPUT, 'guides', slug, 'index.html');
  let html = readFile(filePath);

  // Build related guides links
  const relatedGuides = (guideConfig.related_guides || [])
    .filter(g => {
      // Only link to guides that are already published
      const entry = schedule.find(s => s.slug === g);
      return entry && entry.status === 'published' ||
             fs.existsSync(path.join(OUTPUT, 'guides', g, 'index.html'));
    });

  const relatedPages = guideConfig.related_pages || [];

  if (relatedGuides.length === 0 && relatedPages.length === 0) return;

  // Build the related guides HTML block
  const guideLinks = relatedGuides.map(g => {
    const entry = schedule.find(s => s.slug === g);
    const title = entry ? entry.title : g.replace(/-/g, ' ');
    return `                        <li><a href="/guides/${g}/">${title}</a></li>`;
  }).join('\n');

  const pageLinks = relatedPages.map(p => {
    const name = p.replace(/\//g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());
    return `                        <li><a href="${p}">${name}</a></li>`;
  }).join('\n');

  const relatedBlock = `
        <!-- Related Content — auto-published -->
        <div class="section-block" style="border-top: var(--heavy);">
            <div class="section-label">Related Resources</div>
            <h2 class="section-h2">Continue <em>Reading</em></h2>
            ${guideLinks ? `<h3 style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--accent);margin-bottom:0.75rem;">Related Guides</h3>
            <ul style="list-style:none;padding:0;margin-bottom:1.5rem;">
${guideLinks}
            </ul>` : ''}
            ${pageLinks ? `<h3 style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--accent);margin-bottom:0.75rem;">Related Services</h3>
            <ul style="list-style:none;padding:0;">
${pageLinks}
            </ul>` : ''}
        </div>`;

  // Insert before FAQ section or before footer
  if (html.includes('<!-- FAQ')) {
    html = html.replace('<!-- FAQ', relatedBlock + '\n        <!-- FAQ');
  } else if (html.includes('class="faq')) {
    html = html.replace(/(<div[^>]*class="[^"]*faq)/, relatedBlock + '\n        $1');
  } else if (html.includes('<footer')) {
    html = html.replace('<footer', relatedBlock + '\n    <footer');
  }

  writeFile(filePath, html);
  log(`Added related links to /guides/${slug}/`);
}

/**
 * Add links TO the new guide FROM existing pages.
 * Scans pages matching related_pages + other published guides and inserts
 * contextual links where relevant keywords appear.
 */
function addLinksFromExistingPages(slug, guideConfig, scheduleData) {
  const keywords = guideConfig.keywords_to_anchor || {};
  const targetUrl = `/guides/${slug}/`;

  if (Object.keys(keywords).length === 0) return;

  // Collect all HTML files in output
  const pagesToScan = [];

  // Scan related pages
  for (const relPage of (guideConfig.related_pages || [])) {
    const filePath = path.join(OUTPUT, relPage.replace(/^\//, ''), 'index.html');
    if (fs.existsSync(filePath)) pagesToScan.push(filePath);
  }

  // Scan other published guides
  for (const entry of scheduleData) {
    if (entry.slug === slug) continue;
    if (entry.status !== 'published') continue;
    const filePath = path.join(OUTPUT, 'guides', entry.slug, 'index.html');
    if (fs.existsSync(filePath)) pagesToScan.push(filePath);
  }

  // Also scan the how-to-get-crypto-license guide (always published)
  const howToGuide = path.join(OUTPUT, 'guides', 'how-to-get-crypto-license', 'index.html');
  if (fs.existsSync(howToGuide) && !pagesToScan.includes(howToGuide)) {
    pagesToScan.push(howToGuide);
  }

  let linkedCount = 0;

  for (const filePath of pagesToScan) {
    let html = readFile(filePath);

    // Skip if already has a link to this guide
    if (html.includes(targetUrl)) continue;

    let modified = false;

    for (const [keyword, url] of Object.entries(keywords)) {
      if (url !== targetUrl) continue;

      // Case-insensitive search in text content (not inside tags or existing links)
      // Only replace first occurrence in prose paragraphs
      const regex = new RegExp(
        `(<p[^>]*>[^<]*?)\\b(${escapeRegex(keyword)})\\b([^<]*?</p>)`,
        'i'
      );

      if (regex.test(html) && !html.includes(`href="${targetUrl}"`)) {
        html = html.replace(regex, (match, before, kw, after) => {
          // Don't link if already inside an <a> tag
          if (before.includes('<a ') && !before.includes('</a>')) return match;
          return `${before}<a href="${targetUrl}">${kw}</a>${after}`;
        });
        modified = true;
        break; // One link per page is enough
      }
    }

    if (modified) {
      writeFile(filePath, html);
      linkedCount++;
      log(`Added link to /guides/${slug}/ from ${path.relative(OUTPUT, filePath)}`);
    }
  }

  log(`Interlinked ${linkedCount} existing pages → /guides/${slug}/`);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// 4. Update guides hub page
// ---------------------------------------------------------------------------

function updateGuidesHub(slug, scheduleEntry) {
  const hubPath = path.join(OUTPUT, 'guides', 'index.html');
  let html = readFile(hubPath);

  const title = scheduleEntry.title;

  // Build guide card HTML
  const guideCard = `                <a href="/guides/${slug}/" class="guide-card">
                    <span class="guide-tag">Expert Guide · 20 min read</span>
                    <div class="guide-title">${title}</div>
                    <div class="guide-desc">Published ${formatDate(scheduleEntry.date)}. Expert analysis and practical guidance for crypto licensing professionals.</div>
                    <span class="guide-arrow">Read Guide &rarr;</span>
                </a>`;

  // Insert before closing </div> of guide-grid
  const guideGridEnd = '</div>\n        \n      </div>';
  if (html.includes(guideGridEnd)) {
    html = html.replace(guideGridEnd, guideCard + '\n            </div>\n        \n      </div>');
  } else {
    // Fallback: find the guide-grid closing tag near other guide-cards
    const altPattern = /(<a href="\/guides\/[^"]*" class="guide-card">[\s\S]*?<\/a>)\s*(<\/div>\s*<\/div>\s*<\/div>)/;
    if (altPattern.test(html)) {
      html = html.replace(altPattern, `$1\n${guideCard}\n            $2`);
    }
  }

  // Remove this guide from "Coming Soon" section
  // Match the coming-card that contains this guide's date
  const dateStr = formatDateForHub(scheduleEntry.date);
  const comingCardRegex = new RegExp(
    `<div class="coming-card">\\s*<div class="coming-date">${escapeRegex(dateStr)}</div>[\\s\\S]*?</div>\\s*</div>`,
    'i'
  );
  html = html.replace(comingCardRegex, '');

  writeFile(hubPath, html);
  log(`Updated guides hub: added card for ${slug}, removed from Coming Soon`);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  });
}

function formatDateForHub(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  });
}

// ---------------------------------------------------------------------------
// 5. Run post-publish scripts
// ---------------------------------------------------------------------------

function runPostPublishScripts() {
  log('Running generate_sitemap.js...');
  execSync('node generate_sitemap.js', { cwd: ROOT, stdio: 'inherit' });

  log('Running add_schema.js...');
  execSync(`node add_schema.js "${OUTPUT}"`, { cwd: ROOT, stdio: 'inherit' });

  log('Running generate_redirects.js...');
  execSync('node generate_redirects.js output', { cwd: ROOT, stdio: 'inherit' });
}

// ---------------------------------------------------------------------------
// 6. Update schedule file
// ---------------------------------------------------------------------------

function markAsPublished(scheduleData, slug) {
  const entry = scheduleData.schedule.find(s => s.slug === slug);
  if (entry) {
    entry.status = 'published';
  }
  writeFile(SCHEDULE_FILE, JSON.stringify(scheduleData, null, 2));
  log(`Marked ${slug} as published in schedule`);
}

// ---------------------------------------------------------------------------
// 7. Update HTML sitemap page
// ---------------------------------------------------------------------------

function updateHtmlSitemap(slug, title) {
  const sitemapPath = path.join(OUTPUT, 'sitemap', 'index.html');
  if (!fs.existsSync(sitemapPath)) return;

  let html = readFile(sitemapPath);

  // Find the Guides section and add the new link
  const guidesMarker = /(<a href="\/guides\/[^"]*">[^<]*<\/a>\s*)+/;
  if (guidesMarker.test(html)) {
    html = html.replace(guidesMarker, (match) => {
      return match + `\n                <a href="/guides/${slug}/">${title}</a>`;
    });
    writeFile(sitemapPath, html);
    log(`Updated HTML sitemap with /guides/${slug}/`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // Allow date override via CLI arg: node auto-publish.js 2026-04-05
  const dateOverride = process.argv[2] || null;
  const targetDate = dateOverride || today();

  log(`Checking schedule for ${targetDate}...`);

  if (!fs.existsSync(SCHEDULE_FILE)) {
    log('No publish-schedule.json found, exiting');
    process.exit(0);
  }

  const scheduleData = JSON.parse(readFile(SCHEDULE_FILE));
  const toPublish = getScheduledForToday(scheduleData.schedule, targetDate);

  if (toPublish.length === 0) {
    log('Nothing scheduled for today. Exiting.');
    process.exit(0);
  }

  log(`Found ${toPublish.length} guide(s) to publish: ${toPublish.map(g => g.slug).join(', ')}`);

  const interlinking = scheduleData.interlinking?.guide_links || {};

  for (const entry of toPublish) {
    const { slug, title } = entry;
    log(`\n========== Publishing: ${slug} ==========`);

    // Step 1: Copy draft to output
    publishDraft(slug);

    // Step 2: Add interlinks TO new page
    const guideConfig = interlinking[slug] || {};
    addLinksToNewPage(slug, guideConfig, scheduleData.schedule);

    // Step 3: Add interlinks FROM existing pages
    addLinksFromExistingPages(slug, guideConfig, scheduleData.schedule);

    // Step 4: Update guides hub
    updateGuidesHub(slug, entry);

    // Step 5: Update HTML sitemap
    updateHtmlSitemap(slug, title);

    // Step 6: Mark as published
    markAsPublished(scheduleData, slug);
  }

  // Step 7: Run sitemap, schema, redirects
  runPostPublishScripts();

  log('\n========== All done! ==========');
  log(`Published: ${toPublish.map(g => g.slug).join(', ')}`);
  log('Ready for deploy.');
}

main();
