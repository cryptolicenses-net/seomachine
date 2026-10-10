const fs = require('fs');
const path = require('path');

const BASE = 'https://cryptolicenses.net';
const OUTPUT_DIR = path.join(__dirname, 'output');

const EXCLUDE_DIRS = ['templates', 'seomachine', 'functions', '404'];

// lastmod is the page's own dateModified, read from its JSON-LD (Article/WebPage/...).
// Pages that declare none get no <lastmod> at all: a build date is not a modification date.
// changefreq and priority are not emitted (Google ignores both).
const DATE_RE = /^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2})?)?$/;
// add_schema.js gives pages without a visible "Last updated" line this site-wide default;
// it is not the page's own date, so such pages get no lastmod.
const SITE_DEFAULT_MODIFIED = '2026-03-22';

function findDateModified(node) {
  if (!node || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (const n of node) { const d = findDateModified(n); if (d) return d; }
    return null;
  }
  if (typeof node.dateModified === 'string' && DATE_RE.test(node.dateModified)) return node.dateModified;
  for (const k of ['@graph', 'mainEntity']) {
    const d = findDateModified(node[k]);
    if (d) return d;
  }
  return null;
}

function pageLastmod(file) {
  const html = fs.readFileSync(file, 'utf8');
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const d = findDateModified(JSON.parse(m[1]));
      if (d) return d.slice(0, 10) === SITE_DEFAULT_MODIFIED ? null : d.slice(0, 10);
    } catch (e) { /* malformed JSON-LD: no lastmod */ }
  }
  return null;
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
      lastmod: pageLastmod(full),
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

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml generated: ${urls.length} URLs`);
