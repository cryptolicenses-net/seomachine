# RESEARCH BRIEF — What Is the FATF Travel Rule?

## Мета-информация
- **Тема статьи:** What Is the FATF Travel Rule? Crypto Compliance Explained (2026)
- **URL страницы:** https://cryptolicenses.net/guides/what-is-fatf-travel-rule/
- **Файл на диске:** `output/guides/what-is-fatf-travel-rule/index.html` (draft в `drafts/guides/what-is-fatf-travel-rule/`)
- **Дата исследования:** 2026-06-22
- **Статус:** [x] Исследование | [x] Написано | [ ] Задеплоено

---

## Целевой запрос и интент
- **Основной keyword:** fatf travel rule
- **Дополнительные keywords:** crypto travel rule, vasp travel rule, travel rule threshold, FATF Recommendation 16
- **Поисковый интент:** informational
- **Целевая аудитория:** Founders / compliance officers / legal counsel of crypto exchanges, custodians, brokers — researching what the Travel Rule is and how it applies to their VASP before or during licensing.

---

## Структура статьи (на основе SERP-анализа)
Конкуренты в топе (Sumsub, Notabene, Elliptic, Hacken, iDenfy, Comsure) покрывают:

1. What is the Travel Rule / Recommendation 16 (definition)
2. De-minimis threshold (USD/EUR 1,000)
3. Originator & beneficiary information requirements (above/below threshold)
4. Regional implementations (EU TFR, FinCEN, UK, Singapore, etc.)
5. The "sunrise issue"
6. June 2025 R.16 revision (fraud, proliferation financing, CoP, ISO 20022)
7. How VASPs comply (solutions, protocols)

**Чего не хватает у конкурентов (наше преимущество):**
- Side-by-side comparison table FATF vs EU TFR vs FinCEN thresholds in one view
- Practitioner "from our practice" framing tied to live VASP licensing across jurisdictions
- Direct mapping of Travel Rule obligations to the licensing decision (which jurisdiction = which threshold regime)

---

## Ключевые данные и факты

| Факт | Значение | Источник |
|------|----------|----------|
| FATF Travel Rule = application of Recommendation 16 to virtual asset transfers | R.16 (one of FATF's 40 Recommendations) | https://www.fatf-gafi.org/ |
| FATF recommended de-minimis threshold | USD/EUR 1,000 | https://www.fatf-gafi.org/ |
| Below-threshold requirement | Name of originator + beneficiary, wallet address / unique tx reference (no verification required) | https://www.fatf-gafi.org/ |
| Above-threshold originator info | Verified name, account/wallet identifier, physical address OR national ID / customer ID / DOB+place | https://www.fatf-gafi.org/ |
| Above-threshold beneficiary info | Name + account/wallet identifier | https://www.fatf-gafi.org/ |
| FATF revised R.16 | June 2025 — added fraud + proliferation financing, Confirmation of Payee, ISO 20022 alignment | https://www.fatf-gafi.org/content/dam/fatf-gafi/recommendations/2025-Targeted-Upate-VA-VASPs.pdf.coredownload.pdf |
| Jurisdictions with Travel Rule legislation passed | 85 of 117 surveyed (73%) in 2025, up from 65 in 2024 | https://www.fatf-gafi.org/en/publications/Fatfrecommendations/targeted-update-virtual-assets-vasps-2025.html |
| Jurisdictions passed or in process | 99 jurisdictions | same FATF 2025 Targeted Update |
| Jurisdictions yet to issue enforcement/supervisory findings on TR | ~59% of those with laws | same FATF 2025 Targeted Update |
| EU TFR Regulation number | (EU) 2023/1113 | https://eur-lex.europa.eu/eli/reg/2023/1113/oj/eng |
| EU TFR application date | 30 December 2024 (aligned with MiCA CASP licensing) | EUR-Lex 2023/1113 |
| EU TFR threshold | Zero / no de-minimis — applies to all CASP transfers regardless of amount | EUR-Lex 2023/1113 |
| EU TFR self-hosted wallet extra checks | Above EUR 1,000 — verify ownership/control of self-custody address | https://www.eba.europa.eu/.../guidelines-information-requirements |
| FinCEN Travel Rule threshold | USD 3,000 | https://www.ecfr.gov/current/title-31/.../section-1010.410 (31 CFR 1010.410(e),(f)) |
| FinCEN guidance applying to CVC | FIN-2019-G001 (2019) | https://www.fincen.gov/ |
| FinCEN proposed cross-border threshold | USD 250 (proposed 2020, not finalized) | https://www.federalregister.gov/documents/2020/10/27/2020-23756/... |
| Sunrise issue | Asynchronous global implementation — compliant VASPs can't always exchange data with non-compliant counterparties | https://www.fatf-gafi.org/ , Blockpass |

---

## Данные из локальных источников
Не применимо напрямую (тема — международный стандарт FATF, не швейцарское бизнес-право). Швейцария = FINMA + AMLA референс для VASP-контекста (cross-reference only).

---

## Юрисдикции для таблицы сравнения

| Режим | Порог | Применение | Регулятор/Акт | Особенность |
|-------|-------|-----------|---------------|-------------|
| FATF (global standard) | USD/EUR 1,000 | All VASP VA transfers | Recommendation 16 | Soft-law standard, jurisdictions adopt |
| EU TFR | Zero (no threshold) | All CASP transfers | Reg (EU) 2023/1113 | Strictest; self-hosted checks >EUR 1,000 |
| US FinCEN | USD 3,000 | Funds transfers incl. CVC | 31 CFR 1010.410 | Proposed cut to USD 250 cross-border |

---

## Внутренние ссылки

- /guides/aml-kyc-explained/ — Travel Rule is an AML/CFT obligation, sits inside KYC framework
- /guides/what-is-vasp/ — defines the VASP entity the rule applies to
- /crypto-licenses/vasp-license/ — licensing context where Travel Rule compliance is mandatory
- /corporate-services/aml-kyc/ — service that implements Travel Rule controls
- /regulation/ — regulation hub for jurisdiction-by-jurisdiction rules

---

## Внешние источники для раздела Sources

- https://www.fatf-gafi.org/en/publications/Fatfrecommendations/targeted-update-virtual-assets-vasps-2025.html
- https://www.fatf-gafi.org/content/dam/fatf-gafi/recommendations/2025-Targeted-Upate-VA-VASPs.pdf.coredownload.pdf
- https://www.fatf-gafi.org/content/dam/fatf-gafi/recommendations/Best-Practices-Travel-Rule-Supervision.pdf
- https://eur-lex.europa.eu/eli/reg/2023/1113/oj/eng
- https://www.eba.europa.eu/activities/single-rulebook/regulatory-activities/anti-money-laundering-and-countering-financing-terrorism/guidelines-information-requirements-relation-transfers-funds-and-certain-crypto-assets-transfers
- https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1010/subpart-D/section-1010.410
- https://www.federalregister.gov/documents/2020/10/27/2020-23756/threshold-for-the-requirement-to-collect-retain-and-transmit-information-on-funds-transfers-and

---

## Цитаты Dr. Marcus Hartmann

**Цитата 1** (для раздела: thresholds / jurisdiction choice):
> "Founders fixate on the USD 1,000 figure, but the threshold that governs your business is the one in your licensing jurisdiction, not the FATF baseline. A CASP operating under EU TFR has no de-minimis at all, while a US money transmitter still works to USD 3,000. We map the right threshold regime before a client picks where to license."

**Цитата 2** (для раздела: sunrise issue / interoperability):
> "The sunrise problem is the single most underestimated operational risk in VASP onboarding. You can be fully compliant and still be unable to complete a transfer because the counterparty VASP sits in a jurisdiction that has not adopted the rule. We build that reality into client risk assessments from day one."

---

## FAQ — вопросы для аккордеона

1. What is the FATF Travel Rule?
2. What is FATF Recommendation 16?
3. What is the Travel Rule threshold?
4. Does the Travel Rule apply below USD 1,000?
5. What information must VASPs collect and share under the Travel Rule?
6. How does the EU Transfer of Funds Regulation differ from the FATF standard?
7. What is the FinCEN Travel Rule threshold in the US?
8. What is the Travel Rule "sunrise issue"?
9. Does the Travel Rule apply to self-hosted (unhosted) wallets?
10. What changed in the June 2025 FATF Recommendation 16 revision?
11. Is the FATF Travel Rule legally binding?
12. How many jurisdictions have implemented the Travel Rule?
13. What happens if a VASP fails to comply with the Travel Rule?
14. How does the Travel Rule affect crypto licensing?

---

## Инфографика — данные для блоков

**Блок 1 — Stats (KEY METRICS, 6 метрик):**
| Метрика | Значение |
|---------|---------|
| FATF threshold | USD/EUR 1,000 |
| EU TFR threshold | 0 (no de-minimis) |
| FinCEN threshold | USD 3,000 |
| Jurisdictions with TR law (2025) | 85 / 117 |
| Recommendation number | R.16 |
| Major R.16 revision | June 2025 |

**Блок 2 — Timeline (compliance steps / process):**
1. Identify transfer & threshold regime
2. Collect originator + beneficiary data (KYC)
3. Verify counterparty VASP
4. Transmit required data securely
5. Screen, record, retain
