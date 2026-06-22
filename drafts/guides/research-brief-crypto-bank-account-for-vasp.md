# Research Brief — How to Open a Bank Account for a Crypto/VASP Company (2026)

**Slug:** `crypto-bank-account-for-vasp`
**Intent:** how-to
**Primary keyword:** crypto bank account vasp
**Secondary:** banking for crypto exchange, vasp bank account, segregated client account, crypto banking access
**Author:** Dr. Marcus Hartmann · Published/Updated June 2026

---

## Core thesis

A crypto licence does not buy a bank account. The hardest operational problem for a regulated VASP/CASP is opening and *keeping* operating, safeguarding, and inbound-deposit accounts at institutions that will not de-risk the firm a year later. Banking is a continuous multi-year programme, not a one-time setup.

## Why banks de-risk crypto / VASPs (grounded)

Three structural pressures (finconduit, corroborated by EBA AML pressure context):
1. **Correspondent banking withdrawal** — one US correspondent line closure forces European banks to drop entire crypto portfolios (Estonia/Latvia 2018–2019; US mid-tier 2023).
2. **Capital charges** — Basel III conservative risk weights on operational accounts holding client crypto proceeds raise capital requirements.
3. **AML bandwidth** — a single CASP can generate 5–10x the alert volume of an equivalent-sized non-crypto business.

Key framing: "De-banking is rarely about the CASP doing something wrong. It is about the bank's risk appetite changing." Banks face their own supervisory pressure (EBA Guidelines, AMLD framework); crypto is on every supervisor's enhanced-scrutiny list. Tier-1 banks and major processors will not bank *unlicensed* crypto businesses at all. A licence is a prerequisite, not a differentiator.

## Role of the licence in onboarding

- Licence *brand* (issuing regulator) outweighs licence *type*. A MiCA CASP from BaFin or Central Bank of Ireland opens doors a Czech/Polish legacy registration does not.
- Pre-MiCA VASP registrations now treated as "expiring credentials" (EU VASP regimes sunsetting 2025–2026; BitGo Europe / readycorp corroboration).
- An unlicensed entity is a fast-decline.

## Bank vs EMI vs Payment Institution (the jx-table)

- **Credit institution (bank):** can hold client safeguarding deposits as bank money; can issue correspondent sponsor letters; FX/treasury/overdraft lines. Slowest (4–7 months). Strongest.
- **EMI (e-money institution):** issues virtual IBANs for inbound client deposits, clears SEPA under PSD2; fast (4–8 weeks); CANNOT hold MiCA-grade safeguarding deposits the same way, no correspondent sponsor letters, no treasury lines. Use as inbound rail, never the only layer.
- **Payment institution / specialist crypto bank:** institutional/B2B focus; FX & settlement; varies.

EMI bank accounts do NOT qualify for safeguarding under MiCA. Safeguarding must be in segregated, named, ring-fenced accounts separate from the operating bank (MiCA Art. 75 + PSD2 context).

## Segregated / safeguarding client accounts (grounded)

- MiCA mandates client funds in segregated, named, ring-fenced accounts, separate from operating account.
- Pakistan SBP (2026) concrete model: separate PKR-denominated Client Money Accounts (CMAs), non-remunerative, no cash deposits/withdrawals, cannot be used as collateral/security, no commingling. (Useful as a real-world example of segregation rules.)

## Documentation banks require (grounded)

6–10 weeks of prep before filing. Banks expect:
- 8–15 page cover memo mapping services to MiCA definitions
- corporate structure diagram + full UBO chain (nominees disclosed)
- audited financials (Big-4 or Tier-2 auditor)
- 30–80 page AML programme with crypto-specific typologies + transaction monitoring
- named blockchain analytics vendor contract (not "in-house")
- named Travel Rule provider contract
- DORA-aligned cyber/ICT controls + third-party register
- 12-month customer geography + volume forecast
- bank statements proving capital source (source of funds; no undisclosed offshore entities)
- governance: two EEA-resident directors, regulator-approved MLRO, independent compliance officer

## Numbers / metrics (for ig-stats + body)

- Bank (Tier-1 EEA): **4–7 months** pitch to funded account
- EMI inbound rail: **4–8 weeks**
- Crypto-friendly bank diligence: **8–16 weeks**
- Most CASPs apply to **8–15 banks** before securing one relationship
- Monthly volume "sweet spot" for mid-tier EU banks: **EUR 5–50 million**
- Operating capital banks want held: **18–24 months** runway; for mid-sized CASP ≈ **EUR 1.5–3 million** at the bank
- MiCA Class 3 capital floor: **EUR 150,000**
- Recommended architecture: **4–6 institutions** (operating, backup, safeguarding, EMI rail, FX, custody)
- finconduit claims **87%** pre-approval success (service-provider claim — attribute, do not state as our figure)

## Account-opening timeline (ig-timeline, 5 steps)

1. Licence + readiness (warm intro beats cold) — weeks 1–2
2. File submission; bank identifies gaps — weeks 3–6
3. Financial-crime committee review + video/site diligence — weeks 6–12
4. Credit committee; account-opening package — weeks 12–18
5. Operational onboarding (IBAN, mandate testing, safeguarding set-up) — weeks 18–24

## EMI alternative

EMIs (e.g. Lithuania-based, crypto-native API-first providers) give fast virtual IBANs and SEPA clearing as the inbound rail. They reduce concentration risk but cannot be the safeguarding layer. Speak in categories, not named brands, in prose.

## Fast-decline triggers

- "global retail, no jurisdiction restrictions" customer base
- privacy coins / mixers in supported assets (auto-reject)
- UBO in FATF grey-list / EU high-risk jurisdiction
- no named blockchain analytics or Travel Rule provider
- offshore intermediary trusts with undisclosed nominees
- single-bank architecture (one supervisor letter from shutdown)

## Internal links (>=5)
- /guides/crypto-friendly-banks-guide/
- /guides/how-to-get-crypto-license/
- /crypto-licenses/vasp-license/
- /banking-licenses/crypto-banking/
- /contact/
(plus /guides/aml-kyc-explained/, /guides/what-is-vasp/ where natural)

## Authority sources (6–10, nofollow)
- eba.europa.eu — EBA AML/transfer-of-funds + crypto guidelines
- finma.ch — Swiss FINMA AML / banking
- fatf-gafi.org — FATF VASP standards
- eur-lex MiCA Reg (EU) 2023/1114 (safeguarding Art. 75)
- eur-lex PSD2 safeguarding
- Basel / BIS prudential treatment of crypto (context)
- Pakistan SBP / PVARA 2026 example (news, attribute)

## Unverified / attributed
- 87% pre-approval rate = single service-provider claim; attribute, do not present as fact.
- EUR 1.5–3m "held at bank" = market practice figure from one source; framed as typical, not rule.
- Named institutions kept out of prose; spoken in categories per instruction.
