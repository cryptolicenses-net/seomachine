const fs   = require('fs');
const path = require('path');

// --- Обход папки output/ ---
function walk(dir) {
  const results = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      results.push(...walk(full));
    } else if (f === 'index.html') {
      results.push(full);
    }
  });
  return results;
}

const SKIP        = ['templates', 'seomachine', 'functions', 'drafts'];
const outputDir   = process.argv[2] || 'output';
const BASE_DOMAIN = 'https://cryptolicenses.net';

// --- Собрать все страницы ---
const files = walk(outputDir).filter(f => !SKIP.some(s => f.includes(s)));

const rules = [];

// ─────────────────────────────────────────────────────────
// БЛОК 1: Глобальные правила (всегда вверху файла)
// ─────────────────────────────────────────────────────────

// 1.1 www → non-www (301)
rules.push('# www → non-www');
rules.push(`https://www.cryptolicenses.net/* https://cryptolicenses.net/:splat 301`);
rules.push('');

// 1.2 HTTP → HTTPS (Cloudflare делает это автоматически через SSL,
//     но явное правило гарантирует 301, а не 302)
rules.push('# http → https');
rules.push(`http://cryptolicenses.net/* https://cryptolicenses.net/:splat 301`);
rules.push(`http://www.cryptolicenses.net/* https://cryptolicenses.net/:splat 301`);
rules.push('');

// ─────────────────────────────────────────────────────────
// БЛОК 2: Trailing slash — для каждой страницы
// ─────────────────────────────────────────────────────────
rules.push('# Trailing slash: URL без слеша → URL со слешем (301)');
rules.push('# Сгенерировано автоматически — не редактировать вручную');
rules.push('');

files.forEach(file => {
  // Получить URL-путь из пути к файлу
  // output/crypto-licenses/europe/france/index.html → /crypto-licenses/europe/france/
  let urlPath = '/' + path
    .relative(outputDir, file)   // crypto-licenses/europe/france/index.html
    .replace(/\\/g, '/')          // нормализация для Windows
    .replace(/\/index\.html$/, '') // убрать /index.html
    .replace(/^index$/, '');       // корень → пустая строка

  // Корневая страница: / — редирект не нужен (слеш уже есть)
  if (urlPath === '') return;

  // Правило: /path → /path/ 301
  rules.push(`${urlPath} ${urlPath}/ 301`);
});

rules.push('');

// ─────────────────────────────────────────────────────────
// БЛОК 3: Ручные редиректы (старые/альтернативные URL)
// ─────────────────────────────────────────────────────────
rules.push('# Ручные редиректы — добавлять сюда при необходимости');
rules.push('');

// ─────────────────────────────────────────────────────────
// БЛОК 4: Fallback 404
// ─────────────────────────────────────────────────────────
rules.push('# 404 fallback — обязательно последним');
rules.push('/* /404/index.html 404');

// --- Записать файл ---
const content  = rules.join('\n');
const outFile  = path.join(outputDir, '_redirects');
fs.writeFileSync(outFile, content, 'utf8');

const ruleCount = rules.filter(r => r && !r.startsWith('#')).length;
console.log(`✅ _redirects создан: ${outFile}`);
console.log(`   Правил: ${ruleCount} (из них trailing-slash: ${files.length - 1})`);
console.log(`   Лимит Cloudflare Pages: 2 000 правил`);
