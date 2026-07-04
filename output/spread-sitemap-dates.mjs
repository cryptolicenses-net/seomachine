#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'

const SITEMAP = new URL('./sitemap.xml', import.meta.url)
const BASE = '2026-05-13'
const SPAN_DAYS = 28

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i)
  return Math.abs(h)
}
function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

const xml = readFileSync(SITEMAP, 'utf8')
const updated = xml.replace(
  /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>[^<]+<\/lastmod>/g,
  (match, loc) => {
    if (loc === 'https://cryptolicenses.net/') {
      return match.replace(/<lastmod>[^<]+<\/lastmod>/, `<lastmod>${BASE}</lastmod>`)
    }
    const offset = -(hashStr(loc) % SPAN_DAYS)
    return match.replace(/<lastmod>[^<]+<\/lastmod>/, `<lastmod>${addDays(BASE, offset)}</lastmod>`)
  }
)
writeFileSync(SITEMAP, updated)
const uniq = new Set([...updated.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]))
console.log(`✔ ${uniq.size} unique dates across ${[...updated.matchAll(/<loc>/g)].length} URLs`)
