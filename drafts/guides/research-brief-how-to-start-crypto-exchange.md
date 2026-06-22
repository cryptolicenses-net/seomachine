# Research Brief — how-to-start-crypto-exchange

**Slug:** how-to-start-crypto-exchange
**Title/H1:** How to Start a Crypto Exchange: License, Tech & Compliance Roadmap (2026)
**Intent:** how-to (end-to-end roadmap, structured as phases)
**Primary keyword:** how to start a crypto exchange
**Secondary:** launch crypto exchange, crypto exchange setup, white label exchange, exchange compliance
**Hero image:** /assets/images/tradingview-candlestick-order-book-screen.jpg

## Internal links (>=5)
- /guides/start-crypto-business/
- /guides/how-to-get-crypto-license/
- /crypto-licenses/white-label-exchange/
- /crypto-licenses/vasp-license/
- /contact/

## Authority outbound sources (all rel="nofollow noopener noreferrer" target="_blank")
- ESMA MiCA hub — https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica
- Latham MiCA CASP requirements tracker — https://www.lw.com/en/markets-in-crypto-assets-regulation-tracker/mica-requirements-casps
- MAS DTSP licensing guidelines — https://www.mas.gov.sg/regulation/guidelines/guidelines-on-licensing-for-dtsps
- MAS DPT services guidelines PS-G02 — https://www.mas.gov.sg/regulation/guidelines/ps-g02-guidelines-on-provision-of-digital-payment-token-services-to-the-public
- FATF VASP/Travel Rule 2025 Targeted Update — https://www.fatf-gafi.org/en/publications/Fatfrecommendations/targeted-update-virtual-assets-vasps-2025.html
- NYDFS Virtual Currency Business Licensing (BitLicense) — https://www.dfs.ny.gov/virtual_currency_businesses
- EUR-Lex MiCA Regulation (EU) 2023/1114 — https://eur-lex.europa.eu/eli/reg/2023/1114/oj/eng

## Verified facts (every figure traces to source)

### Jurisdiction / license
- **MiCA** (Regulation (EU) 2023/1114) is fully applicable; transitional/grandfathering window for existing operators ends **1 July 2026** in most member states. Source: ESMA MiCA hub; bitcoinmarket.net summary.
- MiCA CASP minimum own-funds tiers (Annex IV): **EUR 50,000** (Class 1 — reception/transmission, advice, transfer/execution), **EUR 125,000** (Class 2 — custody, exchange of crypto for funds/other crypto), **EUR 150,000** (Class 3 — operating a trading platform). Own-funds floor is the higher of the fixed minimum or one quarter of prior-year fixed overheads. Source: MiCA Annex IV; Latham tracker; adamsmith.lt; amlbot. NOTE: figures are the established MiCA Annex IV minimums (well-corroborated, not single-source).
- Running a centralized exchange (trading platform) = Class 3 → EUR 150,000 minimum own funds.
- **Singapore (MAS):** DPT service providers licensed under Payment Services Act 2019 (amended Apr 2024). Need SPI or MPI license; MPI is the standard route for established exchanges. Must appoint AML/CFT compliance officer, independent external auditor assessment, segregate + hold customer assets on trust. From 30 June 2025 DTSPs serving only overseas clients must be licensed and MAS will "generally not issue a licence." Source: MAS guidelines on DTSPs; PS-G02; MAS media release 2025.
- **US:** FinCEN MSB registration + state money transmitter licenses; New York requires a **BitLicense** (23 NYCRR Part 200), application fee **USD 5,000**, fewer than 50 BitLicenses granted as of 2026. Source: NYDFS; tetraconsultants; bitnewsbot.
- **FATF:** exchanges are VASPs; subject to AML/CFT + Travel Rule (Recommendation 16). 85 of 117 surveyed jurisdictions had Travel Rule legislation by 2025. Source: FATF 2025 Targeted Update.

### Tech stack
- Matching engine: Go or Rust, price-time priority (FIFO); core execution infra. Source: chainup; merehead; troniex.
- Services layer: Node.js/Python (trading, wallet); PostgreSQL for transactions, Redis for live order book, MongoDB for logs; Docker/Kubernetes on AWS/GCP. Source: plainenglish.io.
- Custody: 90-95% assets in cold storage, small operating balance in hot wallets. Source: search summary (industry standard).
- Liquidity: integrate liquidity aggregators / market makers via API (e.g., Binance/Kraken) from day 1, target near-zero spread. Source: search summary.

### Build vs white-label / cost
- Custom MVP: ~USD 50,000-250,000, 4-9 months build. Source: search summary.
- White-label: starter/MVP USD 8,000-30,000, 2-4 week launch; full white label up to USD 250,000+. Source: dappfort; b2broker.
- Licensing legal cost: USD 50,000-500,000 depending on scope; allocate 6-18 months. Source: innreg.
- Realistic total minimum: USD 300,000-500,000 (dev + licensing + first-year ops). Source: search summary.

### Ongoing compliance
- AML/KYC program, sanctions screening, transaction monitoring, MLRO/AML compliance officer appointment.
- Travel Rule (FATF R.16) data-sharing solution required.
- Customer asset segregation, safeguarding, daily reconciliation (MAS-style); MiCA safeguarding of client assets.

## Unverified / soft figures (flagged)
- USD cost ranges (white-label, MVP, total minimum) are industry/vendor estimates, not a single official source — presented as ranges with "industry estimates" framing.
- MiCA Annex IV exact EUR tiers corroborated across multiple secondary sources but not quoted from a primary EUR-Lex extract in this session.
