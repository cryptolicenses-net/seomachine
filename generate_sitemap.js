const fs = require('fs');
const path = require('path');

const BASE = 'https://cryptolicenses.net';
const OUTPUT_DIR = path.join(__dirname, 'output');

const EXCLUDE_DIRS = ['templates', 'seomachine', 'functions', '404'];

// Priority rules by depth and section
function getPriority(segments) {
  const section = segments[0] || '';
  const depth = segments.length;

  if (depth === 0) return '1.0'; // homepage
  if (section === 'privacy' || section === 'terms' || section === 'sitemap') return '0.3';
  if (section === 'blog' || section === 'case-studies' || section === 'podcast-ads-guide-2025') return '0.6';
  if (depth === 1) return '0.8'; // top hubs
  if (depth === 2) return '0.7'; // regional hubs
  return '0.6'; // jurisdiction pages
}

function getChangefreq(segments) {
  const section = segments[0] || '';
  const depth = segments.length;

  if (depth === 0) return 'daily';
  if (section === 'regulation' || section === 'blog') return 'weekly';
  if (section === 'guides') return 'weekly';
  if (section === 'privacy' || section === 'terms') return 'yearly';
  if (depth <= 2) return 'weekly';
  return 'monthly';
}

const urls = [];

function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch(e) { return; }

  entries.forEach(entry => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.includes(entry.name)) return;
      walk(full);
      return;
    }

    if (entry.name !== 'index.html') return;

    const rel = path.relative(OUTPUT_DIR, full);
    const segments = rel
      .replace(/[/\\]?index\.html$/, '')
      .replace(/^[/\\]/, '')
      .split(/[/\\]/)
      .filter(Boolean);

    const urlPath = segments.length === 0 ? '/' : '/' + segments.join('/') + '/';
    const fullUrl = BASE + urlPath;

    urls.push({
      loc: fullUrl,
      priority: getPriority(segments),
      changefreq: getChangefreq(segments),
      depth: segments.length
    });
  });
}

walk(OUTPUT_DIR);

// Sort: homepage first, then by depth, then alphabetically
urls.sort((a, b) => {
  if (a.depth !== b.depth) return a.depth - b.depth;
  return a.loc.localeCompare(b.loc);
});

const today = new Date().toISOString().split('T')[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml generated: ${urls.length} URLs`);
