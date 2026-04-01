# CRYPTOLICENSES.NET — ПРОГРЕСС ГЕНЕРАЦИИ СТРАНИЦ
# Файл для отслеживания состояния проекта между сессиями
# Обновляй после каждого сплита!
# ВАЖНО: После прочтения этого файла — обязательно изучить CLAUDE.md

---

## ИСПРАВЛЕНИЯ ВЁРСТКИ (2026-03-29) ✅

### CSS-компоненты которые нужно добавлять во все новые страницы:

1. **burger/mobile-nav** — `<style id="burger-css">` перед `</head>`. Без него mobile-nav виден как список ссылок.
2. **ig-stat / ig-compare** — стили для блока KEY METRICS (`.ig-stats`, `.ig-stat-value`, `.ig-stat-label`, `.ig-compare*`).
3. **ig-step / ig-timeline** — стили для PROCESS TIMELINE (`.ig-timeline`, `.ig-step`, `.ig-step-num`, `.ig-step-body`, `.ig-step-tag`, `.ig-step-title`, `.ig-step-desc`).
4. **photo-section** — `.photo-section-inner`, `.photo-section-col-img`, `.photo-section-col-content`.

### Исправлено скриптами `/tmp/fix_css.js` и `/tmp/fix_all_css.js`:
- 207 страниц — burger/mobile-nav CSS
- 214 страниц — ig-stat CSS
- 149 страниц — ig-step CSS
- 217 страниц — photo-section CSS

### ⚠️ ЗАПРЕЩЕНО запускать `unify_nav_footer.js` без проверки — ломает стили на всех страницах.
### ✅ Telegram бот обновлён: токен AAH1LdPXGIXMkNI... (бот @dobby_goldblum_bot, chat 165281748)

---

## ПРОЕКТ
- **Сайт:** CryptoLicenses.net
- **Домен:** https://cryptolicenses.net
- **Суть:** Международный консалтинг по крипто-лицензиям в 80+ юрисдикциях
- **Штаб:** Grafenauweg 4, 6300 Zug ZG, Switzerland | info@cryptolicenses.net
- **Стек:** Статический HTML + Tailwind CDN + Google Fonts (Fraunces, Inter, JetBrains Mono)
- **Дизайн:** Бежевый navbar (#F5F0EB) с тёмной полосой, бежевый фон (#F5F0EB), акцент золотой (#C9A84C)
- **Папка вывода:** `output/`

---

## ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА ПОСЛЕ КАЖДОГО СПЛИТА ⚠️

После генерации новых страниц — ВСЕГДА выполнять в таком порядке:

1. `node add_schema.js "$(pwd)/output"` — обновить Schema.org разметку на всех страницах
2. `node generate_sitemap.js` — перегенерировать `output/sitemap.xml` с новыми URL
3. `node generate_redirects.js output` — перегенерировать `output/_redirects` (trailing slash + www + 404)
4. Задеплоить: `CLOUDFLARE_API_TOKEN=cfut_XhKdixhNNCX88Uof8YEbaC8rBaQTCbpj5it7abuse2a52713 CLOUDFLARE_ACCOUNT_ID=0166508d5cf2032b7d2eff4f9b50f66a npx wrangler pages deploy output --project-name=cryptolicenses-net --branch=master --commit-dirty=true`
5. Обновить PROGRESS.md — отметить созданные страницы ✅ и обновить таблицу ИТОГ

**Правила Schema.org:**
- Скрипт `add_schema.js` автоматически определяет тип страницы и ставит нужную разметку
- Юрисдикции (crypto/forex/banking/corporate/regulation, глубина 3+): `Article` + `LegalService`
- Гайды и кейсы: `Article`
- Хабы и коллекции: `CollectionPage`
- About: `AboutPage`, Contact: `ContactPage`, Blog: `Blog`, Privacy/Terms: `WebPage`
- На каждой странице: `Organization` + `BreadcrumbList`
- `dateModified` обновлять при каждом запуске скрипта

**Правила sitemap.xml:**
- Скрипт `generate_sitemap.js` автоматически обходит `output/` и включает все `index.html`
- Исключает: `templates/`, `seomachine/`, `functions/`
- Приоритеты: homepage `1.0`, хабы `0.8`, региональные хабы `0.7`, юрисдикции `0.6`, privacy/terms `0.3`

---

## ПРАВИЛО ОТЛОЖЕННОЙ ПУБЛИКАЦИИ ⏳ (GUIDES + KNOWLEDGE BASE)

**Статьи в разделах `/guides/` и `/knowledge-base/` публикуются по расписанию — 1 статья в неделю.**

### Рабочий процесс:
1. **Написать статью** → сохранить в `drafts/guides/[slug]/index.html` (НЕ в `output/`)
2. **НЕ деплоить** черновики — они живут в `drafts/` до даты публикации
3. **В день публикации** — переместить папку из `drafts/guides/` в `output/guides/`
4. Запустить `node add_schema.js "$(pwd)/output"` + `node generate_sitemap.js`
5. Задеплоить

### Структура папок:
- `drafts/guides/` — черновики гайдов (не деплоятся)
- `output/guides/` — опубликованные гайды (деплоятся)

### График публикации гайдов (начало — неделя после 2026-03-22):
| Неделя | Дата публикации | Slug | Статус |
|--------|----------------|------|--------|
| 1 | 2026-03-29 | `crypto-license-cost` | published ✅ |
| 2 | 2026-04-05 | `what-is-crypto-license` | drafts ⏳ |
| 3 | 2026-04-12 | `what-is-vasp` | drafts ⏳ |
| 4 | 2026-04-19 | `mica-explained` | drafts ⏳ |
| 5 | 2026-04-26 | `aml-kyc-explained` | drafts ⏳ |
| 6 | 2026-05-03 | `no-kyc-exchanges-risks` | drafts ⏳ |
| 7 | 2026-05-10 | `stablecoin-regulation` | drafts ⏳ |
| 8 | 2026-05-17 | `crypto-broker-license` | drafts ⏳ |
| 9 | 2026-05-24 | `fastest-crypto-licenses` | drafts ⏳ |
| 10 | 2026-05-31 | `cheapest-crypto-licenses` | drafts ⏳ |
| 11 | 2026-06-07 | `start-crypto-business` | drafts ⏳ |
| 12 | 2026-06-14 | `what-is-crypto-regulation` | drafts ⏳ |

**Команда для публикации одной статьи:**
```bash
mv drafts/guides/[slug] output/guides/[slug]
node add_schema.js "$(pwd)/output"
node generate_sitemap.js
# затем wrangler deploy
```

---

## ИСТОЧНИКИ ДЛЯ /blog/ И /guides/ ⚠️ ОБЯЗАТЕЛЬНО

При написании статей для разделов `/blog/` и `/guides/` — ВСЕГДА:

### Локальные файлы-источники (читать перед написанием):
- `Руководство_по_ведению_бизнеса_в_Швейцарии_для_иностранцев_—_русский` — бизнес в Швейцарии для иностранцев
- `ihb_2020_5_ru` — IHB 2020 №5 (швейцарское деловое право/практика)
- `Financial Services Regulation 2025 - Switzerland _ Global Practice Guides _ Chambers and Partners` — регулирование финансовых услуг Швейцарии 2025

### Официальные сайты (заходить и брать актуальную информацию, давать ссылки на конкретные страницы):
- https://www.admin.ch — федеральный портал Швейцарии
- https://www.eda.admin.ch — МИД Швейцарии (визы, иностранцы)
- https://www.henleyglobal.com — паспорта, резидентство, визы
- https://www.estv.admin.ch — Федеральная налоговая администрация (НДС, налоги)
- https://www.zefix.ch — торговый реестр компаний Швейцарии
- https://www.bfs.admin.ch — Федеральное статистическое бюро
- https://www.seco.admin.ch — государственный секретариат по экономике
- https://www.ahv-iv.ch — социальное страхование AHV/IV
- https://www.finma.ch — финансовый регулятор FINMA
- https://www.zh.ch/de.html — кантон Цюрих
- https://www.zg.ch/de — кантон Цуг

### Правило:
- В статьях давать прямые ссылки на источники с этих сайтов (не просто домен, а конкретный URL страницы)
- Информация из локальных файлов использовать как базу, актуальные цифры/даты проверять на официальных сайтах

---

## ДИЗАЙН-СТАНДАРТ (использовать для всех новых страниц)

- `<nav>` — бежевый фон (var(--paper)) с heavy border снизу
- `.hero` — editorial split-grid с `.hero-content` + `.hero-aside` (At a Glance)
- `.layout` — grid 1fr 320px (контент + боковая панель)
- Секции: section-label → section-h2 → контент
- FAQ аккордеон, cards-grid карточки
- Schema markup в `<head>`: Article + FAQPage
- FAQ JS аккордеон в конце страницы
- Эталонный шаблон: `output/crypto-licenses/europe/france/index.html`

---

## ИСТОЧНИК ТАКСОНОМИИ
Файл: `fileproject/Базовая таксономия сайта по криптолецензии.md`
Всего страниц по таксономии: ~250 (без учёта 150+ regulation-стран)

---

## СДЕЛАНО ✅ (89 страниц)

### Служебные страницы
- [x] `/` — Homepage (`output/index.html`)
- [x] `/about/` — About Us
- [x] `/contact/` — Contact

### Crypto Licenses — Хабы
- [x] `/crypto-licenses/` — Main hub
- [x] `/crypto-licenses/europe/` — Europe hub
- [x] `/crypto-licenses/mena/` — MENA hub
- [x] `/crypto-licenses/asia/` — Asia hub
- [x] `/crypto-licenses/caribbean/` — Caribbean hub (URL отличается от таксономии /americas/ — оставить как есть)
- [x] `/crypto-licenses/latam/` — LatAm hub (аналогично)

### Europe — Юрисдикции (30 сделано)
- [x] `/crypto-licenses/europe/poland/` — Poland (KNF)
- [x] `/crypto-licenses/europe/lithuania/` — Lithuania (FCIS)
- [x] `/crypto-licenses/europe/estonia/` — Estonia
- [x] `/crypto-licenses/europe/slovakia/` — Slovakia
- [x] `/crypto-licenses/europe/bulgaria/` — Bulgaria
- [x] `/crypto-licenses/europe/united-kingdom/` — UK (FCA)
- [x] `/crypto-licenses/europe/switzerland/` — Switzerland (FINMA)
- [x] `/crypto-licenses/europe/gibraltar/` — Gibraltar (GFSC)
- [x] `/crypto-licenses/europe/mica-compliance/` — MiCA
- [x] `/crypto-licenses/europe/malta/` — Malta (VFA / MFSA)
- [x] `/crypto-licenses/europe/cyprus/` — Cyprus (CySEC CASP)
- [x] `/crypto-licenses/europe/germany/` — Germany (BaFin)
- [x] `/crypto-licenses/europe/georgia/` — Georgia (NBG + Virtual Zone)
- [x] `/crypto-licenses/europe/spain/` — Spain (CNMV)
- [x] `/crypto-licenses/europe/france/` — France (AMF DASP)
- [x] `/crypto-licenses/europe/portugal/` — Portugal
- [x] `/crypto-licenses/europe/netherlands/` — Netherlands (DNB)
- [x] `/crypto-licenses/europe/ireland/` — Ireland (CBI)
- [x] `/crypto-licenses/europe/liechtenstein/` — Liechtenstein (FMA TVTG)
- [x] `/crypto-licenses/europe/isle-of-man/` — Isle of Man (IOM FSA)
- [x] `/crypto-licenses/europe/czech-republic/` — Czech Republic (CNB)
- [x] `/crypto-licenses/europe/finland/` — Finland (FIN-FSA)
- [x] `/crypto-licenses/europe/italy/` — Italy (OAM)
- [x] `/crypto-licenses/europe/romania/` — Romania (ASF)
- [x] `/crypto-licenses/europe/sweden/` — Sweden (Finansinspektionen)
- [x] `/crypto-licenses/europe/montenegro/` — Montenegro (CBCG)
- [x] `/crypto-licenses/europe/ukraine/` — Ukraine (NSSMC)
- [x] `/crypto-licenses/europe/armenia/` — Armenia (CBA)
- [x] `/crypto-licenses/europe/bosnia-herzegovina/` — Bosnia & Herzegovina
- [ ] `/crypto-licenses/europe/serbia/` — Serbia (NBS) ← следующий сплит
- [ ] `/crypto-licenses/europe/slovenia/` — Slovenia (ATVP) ← следующий сплит
- [ ] `/crypto-licenses/europe/monaco/` — Monaco (SICCFIN) ← следующий сплит
- [ ] `/crypto-licenses/europe/jersey/` — Jersey (JFSC) ← следующий сплит
- [ ] `/crypto-licenses/europe/guernsey/` — Guernsey (GFSC) ← следующий сплит

### MENA — UAE под-зоны (7 сделано)
- [x] `/crypto-licenses/mena/uae/` — UAE hub
- [x] `/crypto-licenses/mena/uae/vara/` — VARA
- [x] `/crypto-licenses/mena/uae/dmcc/` — DMCC
- [x] `/crypto-licenses/mena/uae/adgm/` — ADGM
- [x] `/crypto-licenses/mena/uae/ifza/` — IFZA
- [x] `/crypto-licenses/mena/uae/difc/` — DIFC
- [x] `/crypto-licenses/mena/uae/rak-dao/` — RAK DAO

### MENA — остальные юрисдикции (3 сделано)
- [x] `/crypto-licenses/mena/bahrain/` — Bahrain (CBB)
- [x] `/crypto-licenses/mena/turkey/` — Turkey (CMB/SPK)
- [x] `/crypto-licenses/mena/israel/` — Israel (ISA + BoI)

### Asia (12 сделано — Split 7+8)
- [x] `/crypto-licenses/asia/singapore/` — Singapore (MAS)
- [x] `/crypto-licenses/asia/hong-kong/` — Hong Kong (SFC)
- [x] `/crypto-licenses/asia/labuan/` — Labuan (Malaysia)
- [x] `/crypto-licenses/asia/australia/` — Australia (AUSTRAC)
- [x] `/crypto-licenses/asia/japan/` — Japan (JFSA)
- [x] `/crypto-licenses/asia/south-korea/` — South Korea (FSC)
- [x] `/crypto-licenses/asia/new-zealand/` — New Zealand (FMA FSP)
- [x] `/crypto-licenses/asia/malaysia/` — Malaysia (SC DAX)
- [x] `/crypto-licenses/asia/kazakhstan/` — Kazakhstan (AIFC AFSA)
- [x] `/crypto-licenses/asia/philippines/` — Philippines (BSP VASP)
- [x] `/crypto-licenses/asia/thailand/` — Thailand (SEC)
- [x] `/crypto-licenses/asia/indonesia/` — Indonesia (OJK/Bappebti)

### Americas / Caribbean / LatAm (9 сделано)
- [x] `/crypto-licenses/caribbean/svg/` — SVG (существующий URL)
- [x] `/crypto-licenses/caribbean/seychelles/` — Seychelles (существующий URL)
- [x] `/crypto-licenses/latam/el-salvador/` — El Salvador
- [x] `/crypto-licenses/latam/panama/` — Panama
- [x] `/crypto-licenses/americas/` — Americas hub
- [x] `/crypto-licenses/americas/canada/` — Canada (FINTRAC MSB)
- [x] `/crypto-licenses/americas/usa/` — USA (FinCEN + State MTL)
- [x] `/crypto-licenses/americas/bvi/` — BVI (FSC VASP)
- [x] `/crypto-licenses/americas/cayman-islands/` — Cayman Islands (CIMA VASP)

### Guides (14 сделано — ВСЕ ✅)
- [x] `/guides/` — Guides hub
- [x] `/guides/how-to-get-crypto-license/`
- [x] `/guides/crypto-license-cost/` ✅ (2026-03-22)
- [x] `/guides/what-is-crypto-license/` ✅ (2026-03-22)
- [x] `/guides/what-is-vasp/` ✅ (2026-03-22)
- [x] `/guides/mica-explained/` ✅ (2026-03-22)
- [x] `/guides/aml-kyc-explained/` ✅ (2026-03-22)
- [x] `/guides/no-kyc-exchanges-risks/` ✅ (2026-03-22)
- [x] `/guides/stablecoin-regulation/` ✅ (2026-03-22)
- [x] `/guides/crypto-broker-license/` ✅ (2026-03-22)
- [x] `/guides/fastest-crypto-licenses/` ✅ (2026-03-22)
- [x] `/guides/cheapest-crypto-licenses/` ✅ (2026-03-22)
- [x] `/guides/start-crypto-business/` ✅ (2026-03-22)
- [x] `/guides/what-is-crypto-regulation/` ✅ (2026-03-22)

---

## ОСТАЛОСЬ СДЕЛАТЬ ❌ (~199 страниц по таксономии)

### ✅ СПЛИТ 8 — ВЫПОЛНЕН (11 страниц)
**Asia (6):** new-zealand, malaysia, kazakhstan, philippines, thailand, indonesia
**Americas (5):** americas hub, canada, usa, bvi, cayman-islands

### ✅ СПЛИТ 9 — Europe остаток (10 из 14 готово)
- [x] `/crypto-licenses/europe/czech-republic/` — Czech Republic (CNB) ✅
- [x] `/crypto-licenses/europe/finland/` — Finland (FIN-FSA) ✅
- [x] `/crypto-licenses/europe/italy/` — Italy (OAM) ✅
- [x] `/crypto-licenses/europe/romania/` — Romania (ASF) ✅
- [x] `/crypto-licenses/europe/sweden/` — Sweden (Finansinspektionen) ✅
- [x] `/crypto-licenses/europe/serbia/` — Serbia (NBS) ✅
- [x] `/crypto-licenses/europe/slovenia/` — Slovenia (ATVP) ✅
- [x] `/crypto-licenses/europe/montenegro/` — Montenegro (CBCG) ✅
- [x] `/crypto-licenses/europe/ukraine/` — Ukraine (NSSMC) ✅
- [x] `/crypto-licenses/europe/armenia/` — Armenia (CBA) ✅
- [x] `/crypto-licenses/europe/bosnia-herzegovina/` — Bosnia & Herzegovina ✅
- [x] `/crypto-licenses/europe/monaco/` — Monaco (SICCFIN) ✅
- [x] `/crypto-licenses/europe/jersey/` — Jersey (JFSC) ✅
- [x] `/crypto-licenses/europe/guernsey/` — Guernsey (GFSC) ✅

### ✅ СПЛИТ 10 — ВЫПОЛНЕН (2026-03-21)
**MENA:**
- [x] `/crypto-licenses/mena/uae/dafza/` — DAFZA ✅
- [x] `/crypto-licenses/mena/uae/dwtc/` — DWTC ✅

**Asia:**
- [x] `/crypto-licenses/asia/india/` — India (FIU-IND/RBI) ✅
- [x] `/crypto-licenses/asia/uzbekistan/` — Uzbekistan (NAPP) ✅
- [x] `/crypto-licenses/asia/vietnam/` — Vietnam (SBV sandbox) ✅

**Africa:**
- [x] `/crypto-licenses/africa/` — Africa hub ✅
- [x] `/crypto-licenses/africa/seychelles/` — Seychelles (FSA) ✅
- [x] `/crypto-licenses/africa/mauritius/` — Mauritius (FSC) ✅
- [x] `/crypto-licenses/africa/south-africa/` — South Africa (FSCA) ✅
- [x] `/crypto-licenses/africa/nigeria/` — Nigeria (SEC) ✅
- [x] `/crypto-licenses/africa/anjouan/` — Anjouan (AOFA) ✅
- [x] `/crypto-licenses/africa/cape-verde/` — Cape Verde (BCV) ✅
- [x] `/crypto-licenses/africa/kenya/` — Kenya (CMA) ✅

### ✅ СПЛИТ 11 — ВЫПОЛНЕН (2026-03-21)
- [x] `/crypto-licenses/americas/wyoming/` — Wyoming (SPDI) ✅
- [x] `/crypto-licenses/americas/usa/new-york/` — New York BitLicense ✅
- [x] `/crypto-licenses/americas/costa-rica/` — Costa Rica ✅
- [x] `/crypto-licenses/americas/bahamas/` — Bahamas (SCB) ✅
- [x] `/crypto-licenses/americas/bermuda/` — Bermuda (BMA) ✅
- [x] `/crypto-licenses/americas/saint-lucia/` — Saint Lucia ✅
- [x] `/crypto-licenses/americas/barbados/` — Barbados ✅
- [x] `/crypto-licenses/americas/belize/` — Belize ✅
- [x] `/crypto-licenses/americas/marshall-islands/` — Marshall Islands ✅
- [x] `/crypto-licenses/americas/samoa/` — Samoa ✅
- [x] `/crypto-licenses/americas/argentina/` — Argentina (CNV) ✅
- [x] `/crypto-licenses/americas/brazil/` — Brazil (BCB) ✅
- [x] `/crypto-licenses/americas/ecuador/` — Ecuador ✅
- [x] `/crypto-licenses/offshore/` — Offshore hub ✅ (2026-03-22)
- [x] `/crypto-licenses/offshore/vanuatu/` — Vanuatu (VFSC) ✅

### ✅ СПЛИТ 12 — ВЫПОЛНЕН (2026-03-21)
- [x] `/crypto-licenses/vasp-license/` — VASP License Explained ✅
- [x] `/crypto-licenses/wallet-license/` — Crypto Wallet License ✅
- [x] `/crypto-licenses/custody-license/` — Crypto Custody License ✅
- [x] `/crypto-licenses/otc-license/` — OTC Trading License ✅
- [x] `/crypto-licenses/white-label-exchange/` — White Label Exchange ✅
- [x] `/crypto-licenses/general/` — General Licensing ✅

### ✅ СПЛИТ 13 — ВЫПОЛНЕН (2026-03-21)
- [x] `/forex-licenses/` — Forex hub ✅
- [x] `/forex-licenses/broker-setup/` — Broker Setup ✅
- [x] `/forex-licenses/crypto-brokerage/` — Crypto Brokerage ✅
- [x] `/forex-licenses/offshore/` — Offshore hub ✅
- [x] `/forex-licenses/offshore/svg/` — SVG ✅
- [x] `/forex-licenses/offshore/comoros/` — Comoros ✅
- [x] `/forex-licenses/offshore/seychelles/` — Seychelles ✅
- [x] `/forex-licenses/offshore/mauritius/` — Mauritius ✅
- [x] `/forex-licenses/offshore/labuan/` — Labuan ✅
- [x] `/forex-licenses/offshore/cape-verde/` — Cape Verde ✅
- [x] `/forex-licenses/offshore/saint-lucia/` — Saint Lucia ✅
- [x] `/forex-licenses/offshore/belize/` — Belize ✅
- [x] `/forex-licenses/offshore/bvi/` — BVI ✅
- [x] `/forex-licenses/offshore/cayman-islands/` — Cayman Islands ✅
- [x] `/forex-licenses/offshore/bahamas/` — Bahamas ✅
- [x] `/forex-licenses/offshore/panama/` — Panama ✅
- [x] `/forex-licenses/offshore/antigua-barbuda/` — Antigua ✅
- [x] `/forex-licenses/offshore/dominica/` — Dominica ✅
- [x] `/forex-licenses/offshore/saint-kitts-nevis/` — Saint Kitts ✅
- [x] `/forex-licenses/offshore/marshall-islands/` — Marshall Islands ✅
- [x] `/forex-licenses/offshore/bermuda/` — Bermuda ✅
- [x] `/forex-licenses/offshore/vanuatu/` — Vanuatu ✅

### ✅ СПЛИТ 14 — ВЫПОЛНЕН (2026-03-21)
- [x] `/forex-licenses/onshore/` — Onshore hub ✅
- [x] `/forex-licenses/onshore/cyprus/` — Cyprus (CySEC) ✅
- [x] `/forex-licenses/onshore/uk/` — UK (FCA) ✅
- [x] `/forex-licenses/onshore/australia/` — Australia (ASIC) ✅
- [x] `/forex-licenses/onshore/south-africa/` — South Africa (FSCA) ✅
- [x] `/forex-licenses/onshore/singapore/` — Singapore (MAS) ✅
- [x] `/forex-licenses/onshore/hong-kong/` — Hong Kong (SFC) ✅
- [x] `/forex-licenses/onshore/japan/` — Japan (FSA) ✅
- [x] `/forex-licenses/onshore/georgia/` — Georgia ✅
- [x] `/forex-licenses/onshore/bulgaria/` — Bulgaria ✅
- [x] `/forex-licenses/onshore/estonia/` — Estonia ✅
- [x] `/forex-licenses/onshore/malta/` — Malta (MFSA) ✅
- [x] `/forex-licenses/onshore/serbia/` — Serbia ✅
- [x] `/forex-licenses/onshore/czech-republic/` — Czech Republic ✅
- [x] `/forex-licenses/onshore/dubai/` — Dubai (DFSA) ✅
- [x] `/forex-licenses/onshore/usa/` — USA (NFA/CFTC) ✅
- [x] `/forex-licenses/onshore/new-zealand/` — New Zealand ✅
- [x] `/forex-licenses/onshore/india/` — India ✅
- [x] `/forex-licenses/onshore/cambodia/` — Cambodia ✅
- [x] `/forex-licenses/onshore/lithuania/` — Lithuania ✅
- [x] `/forex-licenses/onshore/switzerland/` — Switzerland ✅

### ✅ СПЛИТ 15 — ВЫПОЛНЕН (2026-03-21)
- [x] `/banking-licenses/` — Banking hub ✅
- [x] `/banking-licenses/emi/` — EMI hub ✅
- [x] `/banking-licenses/emi/lithuania/` — Lithuania EMI ✅
- [x] `/banking-licenses/emi/uk/` — UK EMI (FCA) ✅
- [x] `/banking-licenses/emi/netherlands/` — Netherlands EMI ✅
- [x] `/banking-licenses/emi/cyprus/` — Cyprus EMI ✅
- [x] `/banking-licenses/emi/ireland/` — Ireland EMI ✅
- [x] `/banking-licenses/emi/malta/` — Malta EMI ✅
- [x] `/banking-licenses/emi/estonia/` — Estonia EMI ✅
- [x] `/banking-licenses/emi/czech-republic/` — Czech Republic EMI ✅
- [x] `/banking-licenses/emi/uae/` — UAE EMI ✅
- [x] `/banking-licenses/emi/egypt/` — Egypt EMI ✅
- [x] `/banking-licenses/emi/philippines/` — Philippines EMI ✅
- [x] `/banking-licenses/emi/pakistan/` — Pakistan EMI ✅
- [x] `/banking-licenses/emi/switzerland/` — Switzerland EMI ✅
- [x] `/banking-licenses/emi/singapore/` — Singapore EMI ✅
- [x] `/banking-licenses/emi/malaysia/` — Malaysia EMI ✅
- [x] `/banking-licenses/spi/` — SPI hub ✅
- [x] `/banking-licenses/spi/uk/` — UK SPI ✅
- [x] `/banking-licenses/spi/poland/` — Poland SPI ✅
- [x] `/banking-licenses/spi/czech-republic/` — Czech Republic SPI ✅
- [x] `/banking-licenses/msb/` — MSB hub ✅
- [x] `/banking-licenses/crypto-payment-processing/` — Crypto Payment Processing ✅
- [x] `/banking-licenses/crypto-payment-processing/high-risk/` — High-Risk Processing ✅
- [x] `/banking-licenses/crypto-banking/` — Crypto Banking & Neobank ✅

### ✅ СПЛИТ 16 — ВЫПОЛНЕН (2026-03-21)
- [x] `/crypto-accounting/` — Hub ✅
- [x] `/crypto-accounting/services/` — Services ✅
- [x] `/crypto-accounting/audit/` — Audit ✅
- [x] `/crypto-accounting/bookkeeping/` — Bookkeeping ✅
- [x] `/crypto-accounting/fund-accounting/` — Fund Accounting ✅
- [x] `/crypto-accounting/mining/` — Mining Accounting ✅
- [x] `/crypto-accounting/standards/` — Standards ✅
- [x] `/crypto-accounting/standards/fasb-asu-2023-08/` — FASB ASU 2023-08 ✅
- [x] `/crypto-accounting/standards/ifrs/` — IFRS ✅
- [x] `/crypto-accounting/standards/us-gaap/` — US GAAP ✅
- [x] `/crypto-accounting/tax/` — Tax Accounting ✅
- [x] `/crypto-accounting/software/` — Software ✅

### ✅ СПЛИТ 17 — ВЫПОЛНЕН (2026-03-21)
- [x] `/corporate-services/` — Hub ✅
- [x] `/corporate-services/company-formation/` — Company Formation ✅
- [x] `/corporate-services/company-formation/switzerland/` — Swiss Crypto Company ✅
- [x] `/corporate-services/company-formation/dubai/` — Dubai Crypto Company ✅
- [x] `/corporate-services/company-formation/bulgaria/` — Bulgaria Crypto Company ✅
- [x] `/corporate-services/ready-made-companies/` — Ready-Made Companies ✅
- [x] `/corporate-services/ready-made-companies/crypto-license/` — Crypto License for Sale ✅
- [x] `/corporate-services/ready-made-companies/forex-broker/` — Forex Broker for Sale ✅
- [x] `/corporate-services/ready-made-companies/emi-license/` — EMI License for Sale ✅
- [x] `/corporate-services/ready-made-companies/shelf-companies/` — Shelf Companies ✅
- [x] `/corporate-services/aml-kyc/` — AML/KYC Services ✅
- [x] `/corporate-services/license-renewal/` — License Renewal ✅
- [x] `/corporate-services/surety-bonds/` — Surety Bonds ✅
- [x] `/corporate-services/compliance/` — General Compliance ✅
- [x] `/corporate-services/fintech-licensing/` — FinTech Licensing ✅
- [x] `/corporate-services/fintech-licensing/crypto-gambling/` — Crypto Gambling License ✅
- [x] `/corporate-services/fintech-licensing/crypto-casino/` — Crypto Casino License ✅
- [x] `/corporate-services/fintech-licensing/p2p-lending/` — P2P Lending ✅
- [x] `/corporate-services/fintech-licensing/switzerland/` ✅
- [x] `/corporate-services/fintech-licensing/india/` ✅
- [x] `/corporate-services/fintech-licensing/egypt/` ✅
- [x] `/corporate-services/fintech-licensing/ghana/` ✅
- [x] `/corporate-services/fintech-licensing/nigeria/` ✅
- [x] `/corporate-services/fintech-licensing/seychelles/` ✅
- [x] `/corporate-services/fintech-licensing/singapore/` ✅
- [x] `/corporate-services/fintech-licensing/malaysia/` ✅
- [x] `/corporate-services/fintech-licensing/isle-of-man/` ✅
- [x] `/corporate-services/fintech-licensing/jersey/` ✅

### ✅ СПЛИТ 18 — ВЫПОЛНЕН (2026-03-22)
**Regulation (16 стр.) — все задеплоены:**
- [x] `/regulation/` — Hub ✅
- [x] `/regulation/map/` — Global Map ✅
- [x] `/regulation/usa/` — USA (SEC/CFTC/FIT21) ✅
- [x] `/regulation/eu/` — EU / MiCA ✅
- [x] `/regulation/india/` — India (FIU-IND, 30% tax) ✅
- [x] `/regulation/china/` — China (ban + HK alternative) ✅
- [x] `/regulation/uk/` — UK (FCA) ✅
- [x] `/regulation/estonia/` — Estonia (FIU VASP) ✅
- [x] `/regulation/pakistan/` — Pakistan (SECP) ✅
- [x] `/regulation/turkey/` — Turkey (CMB/SPK) ✅
- [x] `/regulation/japan/` — Japan (JFSA CAESP) ✅
- [x] `/regulation/singapore/` — Singapore (MAS DPT) ✅
- [x] `/regulation/canada/` — Canada (FINTRAC MSB) ✅
- [x] `/regulation/news/` — News hub ✅
- [x] `/regulation/news/licensing/` — Licensing News ✅
- [x] `/regulation/news/trends/` — Global Trends ✅
- [x] `/regulation/switzerland/` — Switzerland (FINMA, FinTech Licence, DLT Act) ✅ (2026-03-26)

**Guides (отложенная публикация — 1 в неделю):**
- [ ] `/guides/crypto-license-cost/` ← неделя 1
- [ ] `/guides/what-is-crypto-license/` ← неделя 2
- [ ] `/guides/what-is-vasp/` ← неделя 3
- [ ] `/guides/mica-explained/` ← неделя 4
- [ ] `/guides/aml-kyc-explained/` ← неделя 5
- [ ] `/guides/no-kyc-exchanges-risks/` ← неделя 6
- [ ] `/guides/stablecoin-regulation/` ← неделя 7
- [ ] `/guides/crypto-broker-license/` ← неделя 8
- [ ] `/guides/fastest-crypto-licenses/` ← неделя 9
- [ ] `/guides/cheapest-crypto-licenses/` ← неделя 10
- [ ] `/guides/start-crypto-business/` ← неделя 11
- [ ] `/guides/what-is-crypto-regulation/` ← неделя 12

### ✅ СПЛИТ 19 — ВЫПОЛНЕН (2026-03-22)
- [x] `/case-studies/` — 6 кейсов (EU MiCA, UAE VARA, Estonia, Singapore, FCA, Cayman) ✅
- [x] `/about/experts/` — 4 эксперта + advisory network ✅
- [x] `/blog/` — блог-хаб, 6 статей, topic cloud ✅
- [x] `/sitemap/` — HTML-сайтмап 240+ страниц, 11 секций ✅
- [x] `/privacy/` — Privacy Policy GDPR, швейцарское право ✅
- [x] `/terms/` — Terms of Service, швейцарское право ✅

---

## ИТОГ

| Категория | Сделано | Осталось |
|-----------|---------|----------|
| Служебные | 9 | 0 ✅ |
| Хабы crypto | 9 | 0 ✅ |
| Europe | 35 | 0 ✅ |
| MENA/UAE | 12 | 0 ✅ |
| Asia | 15 | 0 ✅ |
| Americas/Caribbean/LatAm | 23 | 0 ✅ |
| Africa | 8 | 0 ✅ |
| Crypto General | 6 | 0 ✅ |
| Forex | 43 | 0 ✅ |
| Banking/EMI/SPI | 25 | 0 ✅ |
| Crypto Accounting | 12 | 0 ✅ |
| Corporate Services | 28 | 0 ✅ |
| Regulation Hub | 17 | 0 ✅ |
| Guides | 2 (опубл.) + 12 (drafts) | 0 ⏳ |
| Offshore | 1 | 0 ✅ |
| **ИТОГО (задеплоено)** | **241** | — |

*Обновлено: 2026-03-26 (сессия 12). Создана `/regulation/switzerland/` (FINMA, FinTech Licence, DLT Act, SRO, AMLA, Crypto Valley Zug). 243 страницы задеплоены.

*Обновлено: 2026-03-25 (сессия 11). На сайте 241 страница задеплоена. 12 гайдов в `drafts/guides/`, публикуются по 1 в неделю с 2026-03-29. Гайд `how-to-get-crypto-license` переписан по правилам prompt-guides-rewrite.md и задеплоен 2026-03-25.*

---

## LOG СЕССИЙ

### Сессия 1 (до восстановления)
Создано: Homepage, /crypto-licenses/, все Europe страницы (poland, lithuania, estonia, slovakia, bulgaria, uk, switzerland, gibraltar, mica), UAE + VARA, singapore, hong-kong, labuan, caribbean (svg, seychelles), latam (el-salvador, panama), все региональные хабы, about, contact, guides hub, how-to-get-crypto-license guide.

### Сессия 11 (2026-03-25)
Переписан гайд `/guides/how-to-get-crypto-license/` (задеплоен) + все 12 черновых гайдов в `drafts/guides/`:

**Переписаны и задеплоены:**
- `how-to-get-crypto-license` ✅

**Переписаны (не задеплоены, ждут расписания публикации):**
- `aml-kyc-explained` ✅
- `cheapest-crypto-licenses` ✅
- `crypto-broker-license` ✅
- `crypto-license-cost` ✅
- `fastest-crypto-licenses` ✅
- `mica-explained` ✅
- `no-kyc-exchanges-risks` ✅
- `stablecoin-regulation` ✅
- `start-crypto-business` ✅
- `what-is-crypto-license` ✅
- `what-is-crypto-regulation` ✅
- `what-is-vasp` ✅

**Что сделано в каждом гайде:**
- Добавлен блок Dr. Marcus Hartmann (первая секция после hero)
- 2 тематических цитаты эксперта
- Inline CTA блок в середине
- Раздел Sources с реальными ссылками на finma.ch
- Schema.org: автор → Dr. Marcus Hartmann (Person), удалены Russian/Telegram
- dateModified → 2026-03-25
- Написан research brief в `drafts/guides/research-brief-[slug].md`
- Все правила из `prompt-guides-rewrite.md` соблюдены

### Сессия 2 (2026-03-19)
Восстановлен контекст. Создан сплит 5:
- `/crypto-licenses/mena/uae/dmcc/` ✅
- `/crypto-licenses/mena/uae/adgm/` ✅
- `/crypto-licenses/mena/uae/ifza/` ✅
- `/crypto-licenses/mena/uae/difc/` ✅
- `/crypto-licenses/mena/uae/rak-dao/` ✅

### Сессия 3 (2026-03-19)
Унификация дизайна — приведены к editorial-стандарту 18 страниц.

### Сессия 4 (2026-03-19) — СПЛИТ 6
- `/crypto-licenses/mena/bahrain/` ✅
- `/crypto-licenses/mena/turkey/` ✅
- `/crypto-licenses/mena/israel/` ✅
- `/crypto-licenses/europe/malta/` ✅
- `/crypto-licenses/europe/cyprus/` ✅
- `/crypto-licenses/europe/germany/` ✅
- `/crypto-licenses/europe/georgia/` ✅
- `/crypto-licenses/europe/spain/` ✅

### Сессия 5 (2026-03-19) — СПЛИТ 7
- `/crypto-licenses/europe/netherlands/` ✅ (DNB Wwft + MiCA, 4–8 мес.)
- `/crypto-licenses/europe/ireland/` ✅ (CBI, 12.5% tax, EU passport)
- `/crypto-licenses/europe/liechtenstein/` ✅ (FMA TVTG, EEA passport, 12.5% tax)
- `/crypto-licenses/europe/isle-of-man/` ✅ (IOM FSA DBRA, 0% tax)
- `/crypto-licenses/asia/australia/` ✅ (AUSTRAC DCE + ASIC AFSL)
- `/crypto-licenses/asia/japan/` ✅ (JFSA CAESP PSA, 6–18 мес.)
- `/crypto-licenses/asia/south-korea/` ✅ (FSC VASP + ISMS + real-name bank)

Также: проведён анализ таксономии из fileproject/, PROGRESS.md обновлён с полной картой ~199 оставшихся страниц по 19 сплитам.

### Сессия 6 (2026-03-19) — СПЛИТЫ 8 + 9 + ПУБЛИКАЦИЯ

**Сплит 8 (11 стр.) — ВЫПОЛНЕН:**
- Asia: new-zealand, malaysia, kazakhstan, philippines, thailand, indonesia ✅
- Americas: americas hub, canada, usa, bvi, cayman-islands ✅

**Сплит 9 (14 стр.) — ЧАСТИЧНО ВЫПОЛНЕН (10 из 14):**
- ✅ czech-republic, finland, italy, romania, sweden (Batch 1 — 5 стр.)
- ✅ montenegro, ukraine, armenia, bosnia-herzegovina (Batch 2 — 4 стр.)
- ❌ serbia, slovenia, monaco, jersey, guernsey — не созданы (агенты упёрлись в rate limit)

**Публикация сайта (Cloudflare Pages):**
- Cloudflare аккаунт: info@goldblum.ch
- Account ID: `0166508d5cf2032b7d2eff4f9b50f66a`
- Pages проект: `cryptolicenses-net` (существует с 11.02.2026, тип Direct Uploads)
- Pages URL: https://cryptolicenses-net.pages.dev
- Домен: cryptolicenses.net (CNAME → cryptolicenses-net.pages.dev, статус deactivated — ожидает деплоя с контентом)
- DNS записи в Cloudflare: cryptolicenses.net + www.cryptolicenses.net → proxied CNAME ✅
- Создан API Token для GitHub Actions: `cfut_XhKdixhNNCX88Uof8YEbaC8rBaQTCbpj5it7abuse2a52713`
- Workflow файл сохранён: `seomachine/github-actions-deploy.yml`

**Что нужно сделать для автодеплоя:**
1. Добавить секрет `CLOUDFLARE_API_TOKEN` в GitHub repo secrets (значение: токен выше)
2. Добавить файл `.github/workflows/deploy.yml` в репозиторий cryptolicenses-net/cryptolicenses-net
3. Каждый push в ветку master → автодеплой на cryptolicenses.net

**Примечание:** GitHub нельзя подключить к существующему Direct Upload Pages проекту через API — требуется браузерный OAuth. Решение через GitHub Actions обходит это ограничение.

### Сессия 7 (2026-03-20) — ДЕПЛОЙ И ВОССТАНОВЛЕНИЕ DNS

**Проблема:** Сайт показывал старый контент без стилей. Pages проект существовал с 11.02.2026 со старыми файлами.

**Деплой файлов через Wrangler CLI:**
- Установлен wrangler 4.75.0 глобально (`npm install -g wrangler`)
- Задеплоены все 78 файлов из `output/` командой:
  `CLOUDFLARE_API_TOKEN=cfut_... CLOUDFLARE_ACCOUNT_ID=0166508d5cf2032b7d2eff4f9b50f66a npx wrangler pages deploy . --project-name=cryptolicenses-net --branch=master`
- Деплой URL: https://bf08f76a.cryptolicenses-net.pages.dev

**Проблема с доменами:** Пользователь сбросил все настройки в Cloudflare — проект и DNS были удалены.

**Восстановление:**
1. Pages проект `cryptolicenses-net` пересоздан через API (новый ID: `bcdecd37-73e4-4dd8-9d09-b1ccab0eef02`)
2. 78 файлов задеплоены заново (все загружены с нуля)
3. DNS записи созданы через Global API Key (`X-Auth-Email: info@goldblum.ch`):
   - `cryptolicenses.net` → CNAME proxied → `cryptolicenses-net.pages.dev` ✅
   - `www.cryptolicenses.net` → CNAME proxied → `cryptolicenses-net.pages.dev` ✅
4. Домены привязаны к Pages проекту через API
5. SSL сертификат выпущен (Google CA, HTTP-валидация)

**Результат:** Сайт https://cryptolicenses.net работает ✅

**Используемые токены:**
- Pages API: `cfut_XhKdixhNNCX88Uof8YEbaC8rBaQTCbpj5it7abuse2a52713` (scope: Cloudflare Pages)
- DNS API: Global API Key `bea1e01ac913e7280cf9c4097e639af8e31a8` + email `info@goldblum.ch`
- Zone ID: `868ab2384ceda8cc9bca22fca197f38d`

### Сессия 8 (2026-03-21) — ТЕХНИЧЕСКИЕ ПРАВКИ САЙТА ✅

#### Пункт 1 — Формы обратной связи ✅
- `functions/api/contact.js` — Cloudflare Pages Function, обработчик POST `/api/contact`
- Telegram: `@dobby_goldblum_bot`, token `8668223825:AAEDqT96yCnKn-wwVTVRDgL_YRmasYgqknM`, chat_id `165281748`
- Email: MailChannels API → `info@cryptolicenses.net`
- `output/assets/contact-form.js` — общий JS для всех форм (`form[data-contact-form]`)
- Форма `/contact/` переключена на fetch, убран `action="/contact/thank-you/"`
- Cloudflare redirect rule обновлено: исключения `/api/*` и `/assets/*`
- Деплой: `functions/` в корне seomachine (рядом с `output/`), не внутри output

#### Пункт 2 — Мобильная версия ✅
- Причина: `nav-brand { width: 260px }` фиксированная + нет `overflow-x:hidden`
- Добавлен `@media(max-width:768px)` на все 74 страницы
- На мобильном: `.nav-links { display:none }`, `nav-brand` авто-ширина, `body overflow-x:hidden`

#### Пункт 3 — Dropdown на странице контактов ✅
- `.select-wrap` wrapper + CSS стрелка через `::after`
- `appearance: none` убирает браузерный нативный стиль

#### Пункт 4 — CTA блоки на всех коммерческих страницах ✅
- CTA блок добавлен на все 71 коммерческую страницу перед `<footer>`
- Форма с `data-contact-form` → `/api/contact` → Telegram + email
- `contact-form.js` подключён на всех страницах

#### Пункт 5 — Schema.org микроразметка ✅
- Скрипт: `seomachine/add_schema.js`
- **После каждого сплита запускать:** `node add_schema.js "$(pwd)/output"` перед деплоем
- Homepage → Organization + WebSite
- Hub страницы → Organization + BreadcrumbList + CollectionPage
- Юрисдикции → Organization + BreadcrumbList + Article + LegalService + FAQPage
- Гайды → Organization + BreadcrumbList + Article + FAQPage

#### Деплой сессии 8
- Команда: `cd seomachine && CLOUDFLARE_API_TOKEN=cfut_XhKdixhNNCX88Uof8YEbaC8rBaQTCbpj5it7abuse2a52713 CLOUDFLARE_ACCOUNT_ID=0166508d5cf2032b7d2eff4f9b50f66a npx wrangler pages deploy output --project-name=cryptolicenses-net --branch=master --commit-dirty=true`
- Последний деплой: 2026-03-21, 79 файлов ✅

---

### СЛЕДУЮЩИЕ ЗАДАЧИ
- [x] Сплит 9 batch 2: Serbia, Slovenia, Monaco, Jersey, Guernsey ✅ (2026-03-21)
- [x] Сплит 10: DAFZA, DWTC, India, Uzbekistan, Vietnam, Africa hub + 7 African countries ✅ (2026-03-21)
- [ ] Сплит 11: Americas остаток (14 страниц)
- [ ] После генерации — `node add_schema.js "$(pwd)/output"` + деплой
- [ ] Пункт 6: использовать PDF (Руководство_по_ведению_бизнеса_в_Швейцарии) для наполнения контентом
- [ ] Пункт 7: глоссарий и база знаний — после всех коммерческих страниц

### ТЕХНИЧЕСКИЕ ПРАВКИ (2026-03-22) ✅
- [x] SVG логотип создан: `output/assets/logo.svg` (иконка C-крипто-символ + wordmark)
- [x] SVG фавикон создан: `output/assets/favicon.svg`
- [x] Все 218 страниц обновлены: фавикон в `<head>`, nav-brand показывает `logo.svg`
- [x] Левый TOC-сайдбар в /guides/ расширен: 220px → 280px

## ПРАВИЛО САМОПРОВЕРКИ ПОСЛЕ ГЕНЕРАЦИИ СТРАНИЦЫ ⚠️

После генерации **каждой** страницы — обязательно перечитать и проверить:

1. **Факты и цифры:** Все числа (сроки, стоимости, суммы капитала, ставки налогов) должны быть реалистичными и согласованными между собой. Не выдумывать конкретные суммы без источника.
2. **Законы и регуляторы:** Проверить, что упомянутые законы, директивы, регуляторы действительно существуют (например, MiCA — реальный регламент ЕС, VARA — регулятор Дубая). Не придумывать несуществующие законы.
3. **Внешние ссылки — nofollow noopener:** Все `<a href="https://...">` на внешние сайты ОБЯЗАНЫ иметь `rel="nofollow noopener noreferrer"`. Без исключений.
4. **Приоритетные источники для внешних ссылок** (использовать именно эти домены):
   - `admin.ch` — федеральный портал Швейцарии
   - `estv.admin.ch` — федеральная налоговая администрация
   - `zefix.ch` — реестр компаний Швейцарии
   - `bfs.admin.ch` — федеральная статистика
   - `seco.admin.ch` — государственный секретариат по экономике
   - `ahv-iv.ch` — страховое ведомство Швейцарии
   - `finma.ch` — регулятор финансовых рынков Швейцарии
   - `zh.ch/de.html` — кантон Цюрих
   - `zg.ch/de` — кантон Цуг
5. **Внешние ссылки открывать в новой вкладке:** `target="_blank" rel="nofollow noopener noreferrer"`
6. **Блок FAQ — минимум 10, максимум 15 вопросов и ответов.** Меньше 10 — недопустимо. Вопросы должны быть практическими: стоимость, сроки, требования, комплаенс, налоги, банкинг, риски, сравнение юрисдикций. Обновлять `FAQPage` JSON-LD микроразметку синхронно с HTML.
7. **HTML-инфографика — обязательна на каждой новой странице.** При создании любой страницы добавлять минимум 2 блока инфографики (чистый HTML/CSS, без внешних библиотек). Тип выбирать по смыслу страницы:
   - crypto/forex/banking страны: Stats (6 метрик: капитал, сроки, сборы, налоги, регулятор, ключевой плюс) + Timeline (5 шагов лицензирования)
   - guides: Timeline (шаги процесса) + Stats (ключевые факты)
   - regulation: Stats + Bar chart (сравнение метрик)
   - accounting/corporate: Stats + Cost breakdown table
   - hub страницы: Stats + Comparison (2 колонки)
   - Использовать CSS-классы из INFOGRAPHIC_CSS в infographics.js (ig-stats, ig-stat, ig-timeline, ig-step, ig-compare, ig-bars, ig-cost и дочерние)
   - Вставлять перед блоком FAQ, обернуть в section-block с section-h2 заголовком
   - Данные должны быть реальными и специфичными для страницы (не плейсхолдеры)

---

## ПРАВИЛА ДЛЯ ГЕНЕРАЦИИ СТАТЕЙ ⚠️
- В метатегах (title, description, og:title, og:description) — указывать **2026** год
- В заголовках h1 — указывать **2026** год
- Контент должен быть актуальным на 2026 год
- Гайды: лейаут `grid-template-columns: 280px 1fr 300px` (TOC-col 280px, не 220px!)
- Статьи в /guides/ и базе знаний — **отложенная публикация: 1 статья в неделю** (не деплоить сразу все)
- Статистику и фактические данные брать из файлов:
  - `ihb_2020_5_ru.pdf` — статистика IHB
  - `Financial Services Regulation 2025 - Switzerland _ Global Practice Guides _ Chambers and Partners.mhtml` — регулирование финансовых услуг Швейцарии
  - `Руководство_по_ведению_бизнеса_в_Швейцарии_для_иностранцев_—_русский.pdf` — бизнес в Швейцарии для иностранцев
- [x] Боковая панель расширена: `grid-template-columns: 1fr 320px` → `1fr 400px` (hero + content-wrap)
- [x] Schema.org: logo.png → logo.svg

### ТЕХНИЧЕСКИЕ ПРАВКИ (2026-03-21) ✅
- [x] Футер в /contact/ — унифицирован под editorial-стандарт (светлый, как France и остальные)
- [x] Telegram в контактах обновлён → @GnomesLord
- [x] Email форм: MailChannels → Cloudflare Email Workers (send_email binding)
  - Email Routing включён на cryptolicenses.net (статус: ready)
  - Правило: info@cryptolicenses.net → info@goldblum.ch
  - Binding SEND_EMAIL добавлен в Pages проект (production + preview)
  - functions/api/contact.js обновлён
- [x] Страница автора: /about/dr-marcus-hartmann/ — Dr. Marcus Hartmann, 47 лет, LL.M. Цюрих, Dr. iur. Берн
  - Фото: /assets/authors/dr-marcus-hartmann.svg (SVG-портрет)
  - Блок автора добавлен в /guides/how-to-get-crypto-license/
  - Schema.org Person-ссылка в Article Schema
- [x] Стратегия 50/50 публикации (Вариант Б): половину страниц генерировать локально, не деплоить сразу

### Сессия 9 (2026-03-21) — СПЛИТЫ 11 + 12

**Сплит 11 (14 стр.) — Americas + Offshore:**
- wyoming (SPDI), usa/new-york (BitLicense), costa-rica, bahamas (SCB), bermuda (BMA)
- saint-lucia, barbados, belize, marshall-islands, samoa
- argentina (CNV), brazil (BCB), ecuador, offshore/vanuatu (VFSC) ✅

**Сплит 12 (6 стр.) — Crypto General Services:**
- vasp-license, wallet-license, custody-license, otc-license, white-label-exchange, general ✅

**Итого после сессии 9: 110 страниц задеплоено на cryptolicenses.net**


---

## СОСТОЯНИЕ ПРОЕКТА — 2026-03-22 ✅

### Итого страниц: 241

| Раздел | Кол-во страниц |
|--------|---------------|
| crypto-licenses (юрисдикции + хабы) | ~130 |
| banking-licenses (EMI, SPI, MSB) | ~25 |
| forex-licenses (onshore + offshore) | ~35 |
| corporate-services | ~18 |
| crypto-accounting | ~12 |
| regulation | ~10 |
| guides | 2 опубликовано (12 черновиков в drafts/) |
| about, contact, case-studies, другие | ~9 |

### Статус контента

| Параметр | Значение |
|----------|---------|
| Страниц задеплоено | **241** |
| FAQ 10+ вопросов | **222** из 222 (у кого есть FAQ) |
| HTML-инфографика | **231** страниц |
| FAQPage JSON-LD схема | **212** страниц |
| Sitemap | 241 URL |

### Что сделано в сессии (2026-03-22)

**FAQ:**
- Запущен expand_faq.js — расширен FAQ на 16 страницах (было < 12 вопросов)
- Исправлены 10 страниц без FAQPage схемы — скрипт expand_faq их пропускал
- India/Uzbekistan: нестандартная разметка (onclick="toggleFaq"), добавлены через fix_missing_faq.js
- FAQPage JSON-LD синхронизирован на 212 страницах

**HTML-инфографика (скрипт infographics.js):**
- Добавлена на 231 страницу (2 блока: stats + timeline/comparison/barchart/cost)
- Исправлена ошибка: SKIP содержал 'index.html' — из-за этого все страницы пропускались
- Исправлено размещение: 96 страниц имели инфографику внутри aside — перемещена в контентную зону

**Правила (обновлены в progress.md):**
- Правило №7: HTML-инфографика обязательна на каждой новой странице

### Черновики гайдов (не задеплоены)
12 гайдов в drafts/guides/ — публикация по расписанию 1 статья/неделю начиная с 2026-03-29.

### Скрипты автоматизации

| Скрипт | Назначение |
|--------|-----------|
| add_schema.js | Schema.org разметка на всех страницах |
| generate_sitemap.js | Генерация sitemap.xml |
| expand_faq.js | Расширение FAQ до 12 вопросов (страницы с FAQPage схемой) |
| fix_missing_faq.js | FAQ для страниц без FAQPage схемы (нестандартная разметка) |
| infographics.js | HTML-инфографика на все страницы через Haiku API |
| insert_level1_images.js | Фото на 7 страниц Level 1 ✅ |
| insert_level2_images.js | Фото на 55 страниц Level 2 ✅ |
| insert_level3_images.js | Фото на 160 страниц Level 3 ✅ |
| insert_level4_images.js | Фото на 9 страниц Level 4 ✅ (2026-03-26) |

### Статус изображений (2026-03-26)
- **Level 1** (7 стр): ✅ все есть
- **Level 2** (55 стр): ✅ все есть
- **Level 3** (160 стр): ✅ все есть
- **Level 4** (9 стр): ✅ добавлены (usa/new-york, uae/adgm, dafza, difc, dmcc, dwtc, ifza, rak-dao, vara)
- **Итого: 243 страницы, у всех есть изображения**

### Следующие задачи
- [x] Публикация гайдов по расписанию (первый: 2026-03-29, slug: crypto-license-cost) ✅ АВТОМАТИЗИРОВАНО
- [ ] Глоссарий и база знаний — после всех коммерческих страниц
- [ ] Проверить email доставку через MailChannels (подтвердить info@cryptolicenses.net)

---

### Сессия 13 (2026-04-01) — АВТОПУБЛИКАЦИЯ ГАЙДОВ

**Задача:** Настроить автоматическую публикацию черновиков гайдов из GitHub по расписанию с перелинковкой и деплоем.

**Проблема:** `drafts/*` был в `.gitignore` — черновики не попадали на GitHub. Публикация была полностью ручной (mv + node scripts + wrangler deploy).

**Решение — система автопубликации:**

1. **`auto-publish.js`** — Node.js скрипт:
   - Проверяет `publish-schedule.json` на сегодняшнюю дату
   - Копирует черновик `drafts/guides/[slug]` → `output/guides/[slug]`
   - **Перелинковка:** добавляет блок "Related Guides/Services" в новую страницу + ищет ключевые слова в существующих страницах и вставляет ссылки на новый гайд
   - Обновляет `output/guides/index.html` (карточка → Published, удаление из Coming Soon)
   - Запускает `generate_sitemap.js`, `add_schema.js`, `generate_redirects.js`
   - Обновляет статус в `publish-schedule.json`
   - Поддерживает override даты: `node auto-publish.js 2026-04-05`

2. **`publish-schedule.json`** — расписание + карта перелинковки:
   - 12 гайдов (1 в неделю, 5 апр — 14 июн 2026)
   - Для каждого гайда: `related_guides`, `related_pages`, `keywords_to_anchor`

3. **`.github/workflows/auto-publish.yml`** — GitHub Actions cron:
   - Запуск: каждый день 08:00 UTC (10:00 Цюрих)
   - Ручной запуск: workflow_dispatch
   - Цепочка: `auto-publish.js` → git commit → git push → Cloudflare Pages deploy

4. **`.github/workflows/deploy.yml`** — деплой при push в `output/`

**Репозиторий:**
- Основной `TheCraigHewitt/seomachine` — у аккаунта `cryptolicenses-net` только read-доступ
- **Создан форк:** `cryptolicenses-net/seomachine`
- **Origin переключен** на форк
- **GitHub Secrets** настроены: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- **Тестовый запуск** workflow прошёл успешно ✅

**Изменения в git (2 коммита, запушены в `cryptolicenses-net/seomachine`):**
- `.gitignore` — добавлено `!drafts/guides/` (черновики теперь в git)
- `auto-publish.js` — скрипт автопубликации (399 строк)
- `publish-schedule.json` — расписание + интерлинкинг (278 строк)
- `drafts/guides/` — 11 черновиков + 14 research briefs
- `.github/workflows/auto-publish.yml` — cron workflow
- `.github/workflows/deploy.yml` — deploy on push workflow

**Как добавить новый гайд в расписание:**
1. Положить черновик в `drafts/guides/[slug]/index.html`
2. Добавить запись в `publish-schedule.json`: slug, date, title, status: "pending" + interlinking config
3. Закоммитить и запушить — cron сделает остальное

*Обновлено: 2026-04-01 (сессия 13). Автопубликация настроена. 243 страницы задеплоены + 11 черновиков ждут по расписанию.*

---

## SEO ИНСТРУМЕНТЫ АУДИТА (папка `seocheck/`) ⚠️ ОБЯЗАТЕЛЬНО

### Файлы в `seocheck/`:

1. **`seo_book.txt`** — Книга "DrMax: Доказательное SEO 2026" (2MB). Основана на утечках Google Content Warehouse API + данных суда USA v Google. Содержит:
   - Часть 1: Архитектура ранжирования Google (Q*, P*, NavBoost, Twiddlers)
   - Часть 2: Техническое SEO (robots.txt, sitemap, каноникализация, CWV)
   - Часть 3: On-Page SEO (Title/Goldmine, H1-H6, contentEffort, QBST-семантика)
   - Часть 4: Off-Page SEO (линкбилдинг, бренд-сигналы, SERM)
   - Часть 5: E-E-A-T, локальное SEO, мобильное SEO
   - Часть 6: Полный чек-лист аудита 2026 (Глава 17)
   - Книга 2: Промптоведение для SEO

2. **`seo_baseline_analysis.py`** — Скрипт базового SEO-анализа:
   - Проверяет BOFU/MOFU ключевые слова через DataForSEO Live SERP
   - Вытягивает данные GSC (позиции, impressions, clicks, CTR)
   - Классифицирует по коммерческому намерению (Transactional / Commercial Investigation / Informational)
   - Определяет Quick Win opportunities (страница 2, позиции 11-20)
   - Запуск: `python seocheck/seo_baseline_analysis.py` (требует DataForSEO + GSC credentials)

3. **`seo_bofu_rankings.py`** — Детальный анализ BOFU-запросов:
   - Live SERP проверка каждого ключевого слова (объём, CPC, конкуренция)
   - Позиция сайта vs Top 5 в выдаче
   - Альтернативные/competitor-запросы
   - GSC данные по high-intent ключевикам
   - Запуск: `python seocheck/seo_bofu_rankings.py`

4. **`seo_competitor_analysis.py`** — Конкурентный SEO-анализ:
   - Head-to-head сравнение по BOFU/MOFU запросам
   - Keyword Gap Analysis (где конкуренты ранжируются, а мы нет)
   - Win/Loss Analysis по каждому конкуренту
   - Top 300 ключевых слов конкурентов
   - Запуск: `python seocheck/seo_competitor_analysis.py`

### Когда использовать:
- **Перед созданием новых страниц** → `seo_baseline_analysis.py` (найти gaps)
- **При планировании контент-стратегии** → `seo_competitor_analysis.py` (keyword gap)
- **При оптимизации существующих страниц** → `seo_bofu_rankings.py` (quick wins)
- **При проверке качества страниц** → чек-лист из seo_book.txt Глава 17

### Конфигурация:
- Ключевые слова: `config/competitors.json` (bofu_keywords, mofu_keywords, direct_competitors, relevant_terms)
- API: `data_sources/config/.env` (DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD, GSC_SITE_URL)

---

## ПОЛНЫЙ ON-PAGE SEO ЧЕК-ЛИСТ (из seo_book.txt) ⚠️ РУКОВОДСТВОВАТЬСЯ ВСЕГДА

### При СОЗДАНИИ каждой новой страницы проверять:

**Title (система Goldmine):**
- [ ] Уникальный `<title>` (не дублируется с другими страницами)
- [ ] 50-60 символов (не обрезается в SERP)
- [ ] Основной keyword в начале
- [ ] Без boilerplate ("Home", "Page") — штраф goldmineHasBoilerplateInTitle
- [ ] Не повторять слова — штраф dupTokens
- [ ] Title и H1 когерентны (описывают одно и то же, но не идентичны)
- [ ] Год 2026 в title для актуальности

**Заголовки H1-H6:**
- [ ] Ровно ОДИН `<h1>` на странице (золотой стандарт)
- [ ] H1 визуально самый крупный элемент
- [ ] H1 содержит основной keyword
- [ ] H2 следуют логической иерархии (нет пропуска уровней H1→H3)
- [ ] Каждый H2 отвечает на подвопрос основной темы
- [ ] H2 уникальны по сайту (не повторяются между страницами)
- [ ] Структура заголовков = outline для Passage Indexing и AI Overviews

**Контент (contentEffort):**
- [ ] 2000-4000+ слов для коммерческих/конкурентных тем
- [ ] Оригинальные данные/исследования (не копипаст)
- [ ] Конкретные цифры: стоимость, сроки, капитал, налоги
- [ ] Реальные кейсы и примеры из практики
- [ ] Источники с прямыми ссылками (admin.ch, finma.ch и др.)
- [ ] Нет "воды" — каждый абзац добавляет ценность
- [ ] Ответы на все People Also Ask по теме
- [ ] Покрытие всех подтем конкурентов (QBST-полнота)

**Семантика (QBST — Query-Based Salient Terms):**
- [ ] Все ожидаемые термины по теме присутствуют
- [ ] Аббревиатуры расшифрованы при первом упоминании
- [ ] Сущности (регуляторы, законы) названы полностью
- [ ] Schema.org для ключевых сущностей
- [ ] Ссылки на авторитетные источники (Wikipedia, .gov, регуляторы)

**E-E-A-T (YMYL-тематика — повышенные требования):**
- [ ] Автор с реальным именем и квалификацией (Dr. Marcus Hartmann)
- [ ] Ссылка на страницу автора /about/dr-marcus-hartmann/
- [ ] Person Schema на странице автора
- [ ] Источники из официальных правительственных сайтов
- [ ] Дисклеймер о необходимости профессиональной консультации
- [ ] Дата публикации и дата обновления
- [ ] Контактная информация легко доступна

**Технические мета-теги:**
- [ ] `<meta name="robots" content="index, follow">`
- [ ] `<link rel="canonical" href="...">`
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] Open Graph: og:title, og:description, og:image, og:type
- [ ] Schema.org JSON-LD: Organization + BreadcrumbList + тип страницы

**Внутренняя перелинковка:**
- [ ] 3-5+ внутренних ссылок на релевантные страницы
- [ ] Ссылки на hub-страницу раздела
- [ ] Ссылки на связанные юрисдикции/гайды
- [ ] Якорный текст описывает целевую страницу (не "click here")
- [ ] Breadcrumb навигация (визуальная + Schema)

**FAQ:**
- [ ] 10-15 вопросов-ответов
- [ ] FAQPage JSON-LD схема синхронизирована с HTML
- [ ] Практические вопросы: стоимость, сроки, требования, налоги, банкинг

**CTA и конверсия:**
- [ ] CTA блок "Free Consultation" перед footer
- [ ] Форма с `data-contact-form` → `/api/contact`
- [ ] contact-form.js подключён

**Изображения:**
- [ ] Минимум 1 фото в photo-section
- [ ] Alt-текст описательный и содержит keyword
- [ ] Формат: JPG для фото, SVG для иконок

### При ПРОВЕРКЕ существующих страниц дополнительно:

**Performance (Core Web Vitals):**
- [ ] LCP < 2.5s (inline CSS помогает, но объём критичен)
- [ ] CLS < 0.1 (нет сдвигов макета)
- [ ] Шрифты preconnect (fonts.googleapis.com)
- [ ] Изображения оптимизированы

**Канонификация:**
- [ ] Нет дублей контента
- [ ] Все версии URL (http/https, www/non-www, trailing slash) редиректят на каноническую
- [ ] `_redirects` файл покрывает все случаи

**Robots.txt и Sitemap:**
- [ ] robots.txt не блокирует важные страницы
- [ ] sitemap.xml содержит все опубликованные URL
- [ ] Приоритеты корректны (homepage 1.0, hubs 0.8, страницы 0.6)

---

## ON-PAGE SEO АУДИТ CRYPTOLICENSES.NET (2026-04-01)

### Общая оценка: **7.5 / 10**

### Сильные стороны (что хорошо):

| Параметр | Оценка | Комментарий |
|----------|--------|-------------|
| Title Tags | 9/10 | Уникальные, keyword-focused, правильная длина |
| Meta Descriptions | 9/10 | Убедительные, 150-160 символов, с CTA |
| Schema.org | 9.5/10 | Organization, BreadcrumbList, Article, FAQPage, LegalService — комплексно |
| FAQ секции | 9/10 | 10-15 вопросов на 222 страницах, FAQPage JSON-LD |
| Breadcrumbs | 9/10 | Визуальные + Schema на всех страницах кроме homepage |
| Internal Linking | 8.5/10 | Навигация, связанные страницы, hub→spoke структура |
| CTA конверсии | 9/10 | Prominent "Free Consultation" на всех коммерческих страницах |
| Sitemap | 9/10 | 245 URL, правильные приоритеты, changefreq |
| Мобильная версия | 8/10 | Viewport meta, responsive CSS, burger-menu |
| Изображения | 8.5/10 | Alt-тексты, photo-section на всех страницах |

### Слабые стороны (что нужно исправить):

| Проблема | Серьёзность | Влияние | Что делать |
|----------|-------------|---------|------------|
| **Inline CSS 4000-5000 строк** | ВЫСОКАЯ | LCP, кеширование | Вынести в external stylesheet `/assets/style.css` |
| **OG-теги неполные** | СРЕДНЯЯ | Social sharing | Homepage и crypto-licenses hub — нет og:title, og:description |
| **robots.txt `Disallow: /?`** | СРЕДНЯЯ | Может блокировать параметрические URL | Уточнить правило или убрать |
| **contentEffort — нет оригинальных данных** | ВЫСОКАЯ | Q* сигнал Google | Добавить реальные кейсы, таймлайны из практики, оригинальные таблицы |
| **Одно фото-image на всех страницах** | СРЕДНЯЯ | original_media_score | Уникальные изображения для каждого региона/юрисдикции |
| **Нет HowTo Schema** | НИЗКАЯ | Rich snippets | Добавить на guide-страницы с пошаговым процессом |
| **External links без rel** | НИЗКАЯ | Безопасность | Аудит: все внешние ссылки → `rel="nofollow noopener noreferrer"` |
| **Контент может быть "шаблонным"** | ВЫСОКАЯ | contentEffort, pandaDemotion | Разнообразить структуру, добавить уникальные инсайты на каждой странице |
| **Нет видимого автора на коммерческих страницах** | СРЕДНЯЯ | E-E-A-T | Добавить byline Dr. Marcus Hartmann на все страницы |
| **Нет даты обновления в видимом контенте** | СРЕДНЯЯ | Freshness сигнал | Показать "Last updated: March 2026" на каждой странице |

### Детальная разбивка по категориям:

**T — TRUST (Техническое доверие): 8/10**
- ✅ SSL (Cloudflare)
- ✅ Нет crawl-ошибок
- ✅ Каноникализация через `_redirects`
- ⚠️ robots.txt требует уточнения
- ⚠️ Inline CSS негативно влияет на CWV

**E — EXPERIENCE (Опыт): 6/10**
- ✅ Кейсы на /case-studies/
- ✅ Dr. Marcus Hartmann как автор гайдов
- ⚠️ Нет оригинальных фото из офиса/с клиентами
- ⚠️ Нет конкретных примеров из практики ("мы помогли X получить лицензию за Y дней")
- ❌ Стоковые изображения снижают original_media_score
- ❌ Нет видео-контента

**E — EXPERTISE (Экспертиза): 8/10**
- ✅ Высокий siteFocusScore — 100% контента по крипто-лицензированию
- ✅ Hub-and-spoke архитектура (hubs → regions → jurisdictions)
- ✅ 243 страницы глубокого покрытия темы
- ✅ Страница автора с Person Schema
- ⚠️ QBST-покрытие не проверено vs конкурентов
- ⚠️ Нет внешних публикаций автора (нет backlinks от авторитетных источников)

**A — AUTHORITATIVENESS (Авторитетность): 6/10**
- ✅ Полная страница About Us
- ✅ Organization Schema
- ✅ Физический адрес (Zug, Switzerland)
- ⚠️ Сайт новый — нет backlink-профиля
- ⚠️ Нет упоминаний бренда на внешних ресурсах
- ⚠️ Нет наград/сертификатов/медиа-упоминаний
- ❌ Брендовый поисковой объём = 0 (новый домен)

### Приоритеты исправлений:

**Фаза 1 (неделя 1-2) — Критические:**
1. Вынести CSS в external stylesheet
2. Добавить недостающие OG-теги (homepage, hubs)
3. Добавить byline автора + дату обновления на все страницы
4. Исправить robots.txt

**Фаза 2 (неделя 3-4) — Важные:**
5. Уникальные изображения для регионов (не одно zurich-lakeside на всех)
6. Оригинальные данные: реальные кейсы, таймлайны, стоимости из практики
7. HowTo Schema на гайдах
8. Разнообразить структуру контента (не все страницы по одному шаблону)

**Фаза 3 (месяц 2+) — Стратегические:**
9. Линкбилдинг: публикации Dr. Hartmann на внешних площадках
10. Запуск seo_baseline_analysis.py + seo_competitor_analysis.py для keyword gaps
11. Брендовые сигналы: социальные сети, каталоги, упоминания

*Обновлено: 2026-04-01 (сессия 13, часть 2). SEO аудит проведён. Оценка 7.5/10.*
