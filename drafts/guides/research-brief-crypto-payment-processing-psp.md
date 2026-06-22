# Research Brief — Crypto Payment Processing: PSP Licensing & High-Risk Merchants (2026)

**Slug:** `crypto-payment-processing-psp`
**Intent:** Informational
**Primary keyword:** crypto payment processing
**Secondary:** crypto psp, payment institution license, high risk merchant crypto, stablecoin payments
**Target length:** 1,500–2,500 words
**Author byline:** Dr. Marcus Hartmann (Published/Updated June 2026)

---

## Core thesis

Crypto payment processing splits across two legs that demand different licences:
1. **Fiat leg** (card acquiring, fiat on/off ramp, settlement, e-money) → Payment Institution (PI) or Electronic Money Institution (EMI) under PSD2/EMD2 in the EU; money transmitter/MSB under FinCEN in the US.
2. **Crypto leg** (custody, exchange, transfer of crypto-assets) → MiCA CASP authorisation in the EU.

Stablecoins sit at the seam: EMT (e-money token) transfers by CASPs are now treated as payment services under PSD2, triggering a PI/EMI requirement from 2 March 2026.

---

## Verified facts (each traces to a real source)

### EU — PSD2 / EMD2 / MiCA interplay (EBA No-Action Letter)
- EBA published a No-Action Letter on the interplay between PSD2/PSD3 and MiCA. NCAs should regard "the transfer of crypto assets as a payment service under PSD2 where they entail EMTs and are carried out by entities on behalf of their clients."
- **Transition / no-action date: 2 March 2026.** Before this date, no PSD2 authorisation required for EMT transactions by CASPs; after it, CASPs transacting EMTs must obtain PI or EMI authorisation under PSD2.
- EBA prioritised avoiding the burden of dual authorisation; regulators should reuse information already submitted for CASP licensing during PSD2 authorisation.
- Source: eba.europa.eu press release + Opinion PDF; Ashurst insight.
- Stablecoins are legally classified under MiCA as electronic money tokens (EMTs) when pegged to a single fiat currency.

### PI vs EMI capital requirements (PSD2 / EMD2)
- **PI initial capital by service:** EUR 20,000 (money remittance only); EUR 50,000 (payment initiation / PISP); EUR 125,000 (execution of transfers, acquiring, card issuing).
- **EMI initial capital:** EUR 350,000 (flat).
- **Role distinction:** PI moves money between parties without storing value; EMI can issue and redeem e-money / store customer value in wallets/IBANs. EMI can do everything a PI does plus e-money issuance/redemption.
- Source: Crassula PI license guide (reflecting PSD2 / EMD2 Directive 2009/110/EC). Capital thresholds are set in PSD2 Art. 7 / Directive 2015/2366; EMI EUR 350k in EMD2 Art. 4.
- PSD2 transition period for the EMT/PSD2 obligation ends 2 March 2026; PSD3 will merge PI and EMI regimes into one framework (future, not yet in force).

### US — FinCEN / MSB
- An administrator or exchanger that accepts and transmits, or buys/sells, convertible virtual currency (CVC) is a money transmitter, hence an MSB (per 2013 + 2019 FinCEN CVC guidance).
- MSBs register with FinCEN via Form 107 (BSA E-Filing), renewing every two calendar years.
- A *user* who buys CVC to purchase goods/services is NOT an MSB.
- CTR (Form 112) for cash transactions over USD 10,000/day; SAR (Form 111) for suspicious activity USD 2,000+.
- Operating an unregistered MSB is a federal crime under 18 U.S.C. § 1960 (up to 5 years).
- FinCEN Travel Rule recordkeeping threshold: USD 3,000 (31 CFR 1010.410) — relevant to AML leg.

### High-risk merchant acquiring (industry data, 2026)
- High-risk merchants face transaction fees ~4–8% (vs ~2.9% mainstream), rolling reserves 5–15% held 6–12 months, monthly minimums USD 25–100, chargeback fees USD 25–100 per dispute.
- Rolling reserve = insurance the processor holds against chargeback liability; processor holds the float.
- Acquiring banks can exit a whole merchant category (de-risking), cutting off merchants regardless of own performance.
- 2026 trend: fiat-to-crypto / crypto-settlement gateways let merchants accept Visa/Mastercard and settle in USDC/USDT/BTC, bypassing the traditional acquiring-bank rolling-reserve model.
- Source: Medium/Coinmonks + TechBullion 2026 high-risk merchant guides (industry, not regulator — flagged as industry estimates).

### How crypto payment processing works
- Fiat-to-crypto on-ramp: customer pays fiat (card/bank), processor converts to crypto.
- Crypto-to-fiat off-ramp + merchant settlement: customer pays crypto, processor settles fiat or stablecoin to merchant.
- Stablecoin rails: settlement directly in USDC/USDT to merchant wallet.
- Two legs = two licence families (fiat=PI/EMI/MSB; crypto=CASP/VASP). AML/Travel Rule overlays both.

### MiCA CASP (crypto leg)
- MiCA grants a passportable CASP authorisation across the EU/EEA; covers custody, exchange of crypto for funds, exchange of crypto for crypto, transfer services, etc.
- Crypto leg of a payment processor (holding/transferring crypto on behalf of clients) needs CASP authorisation.

---

## Internal links (≥5, all required)
- /guides/how-to-get-emi-license/
- /guides/crypto-friendly-banks-guide/
- /banking-licenses/crypto-payment-processing/
- /banking-licenses/crypto-payment-processing/high-risk/
- /banking-licenses/

## Outbound authority sources (6–10, all nofollow noopener noreferrer target=_blank)
- eba.europa.eu No-Action Letter press release
- eba.europa.eu Opinion on interplay PSD2/MiCA (PDF)
- eur-lex.europa.eu PSD2 Directive (EU) 2015/2366
- eur-lex.europa.eu EMD2 Directive 2009/110/EC
- esma.europa.eu MiCA
- eur-lex.europa.eu MiCA Regulation (EU) 2023/1114
- fincen.gov CVC guidance (2019)
- ecfr.gov 31 CFR 1010.410 (Travel Rule recordkeeping)

## Hero image
/assets/images/crypto-portfolio-app-bitcoin-coins.jpg

## Unverified / flagged
- High-risk fee ranges (4–8%, 5–15% reserves) are industry-reported estimates, not regulator figures. Stated as "typically" / "industry estimates."
