# Research Brief — what-is-crypto-custody-license

**Slug:** `what-is-crypto-custody-license`
**Title/H1:** What Is a Crypto Custody License? Qualified Custodian Rules Explained (2026)
**Primary keyword:** crypto custody license
**Secondary:** qualified custodian, digital asset custody, custody requirements, safekeeping crypto
**Intent:** informational
**Hero image:** /assets/images/gold-bars-pile.jpg
**Canonical / og:url / og:image:** https://cryptolicenses.net/guides/what-is-crypto-custody-license/

## Internal links (≥5)
- /guides/what-is-crypto-license/
- /guides/what-is-vasp/
- /crypto-licenses/custody-license/
- /crypto-licenses/wallet-license/
- /contact/
(plus /corporate-services/aml-kyc/, /regulation/, /guides/ in nav/footer)

## Verified facts (every figure traced to a real source)

### MiCA — custody and administration of crypto-assets on behalf of clients
- Service defined in Regulation (EU) 2023/1114 (MiCA) as "the safekeeping or the control, on behalf of clients, of crypto-assets or of the means of access to such crypto-assets, where applicable in the form of private cryptographic keys." (esma.europa.eu / eur-lex)
- Minimum capital: **Class 2 — EUR 125,000** (Annex IV). Class 1 = EUR 50,000 (e.g. order execution, advice); Class 3 = EUR 150,000 (operating a trading platform). Source: MiCA Annex IV; sumsub, White & Case summaries. Custody falls in Class 2 = EUR 125,000.
- CASPs must also hold own funds = at least one quarter of fixed overheads of the preceding year, if higher than the permanent minimum. (Article 67)
- **Article 75** governs custody and administration. Key requirements (verified via mica.wtf / EUR-Lex Art 75):
  - Custody agreement with each client specifying duties/responsibilities.
  - Register of positions opened in the name of each client.
  - Operational segregation: crypto-assets held in custody segregated from the CASP's own holdings and from the CASP's estate.
  - **Liability for loss**: CASP liable to clients for loss of crypto-assets/means of access from an incident attributable to it; liability **capped at the market value of the crypto-asset lost at the time the loss occurred**.
  - Custody policy minimising risk of loss from fraud, cyber threats, negligence.
  - Statement of position to client **at least once every three months** and on request.
- MiCA fully applicable to CASPs from 30 December 2024.

### US — qualified custodian
- Rule 206(4)-2 of the Investment Advisers Act of 1940 ("the Custody Rule"). RIAs with custody of client assets must keep them with a "qualified custodian."
- Qualified custodian = a bank or savings association, registered broker-dealer, registered futures commission merchant (FCM), or certain foreign financial institutions; holds assets segregated from proprietary assets. (17 CFR 275.206(4)-2; Cornell LII)
- Sept 3, 2024: SEC charged a former RIA for failing to keep crypto assets sold as securities with a qualified custodian (Sidley).
- Sept 30, 2025: SEC Division of Investment Management no-action letter letting RIAs/registered funds treat certain state-chartered trust companies as "banks" (qualified custodians) for crypto custody, subject to conditions (annual due diligence, SOC 1/SOC 2 review, no pledging/rehypothecation without written consent). (Sidley, Morgan Lewis, Hunton)
- The 2023 proposed Safeguarding Rule (would have expanded custody to crypto) was withdrawn in 2025.

### FINMA (Switzerland)
- FINMA Guidance 01/2026 (12 Jan 2026): Swiss banks may hold crypto-based assets as segregable custody assets with bankruptcy protection if held in readiness for customers at all times, in individual custody or collective custody with clear customer shares; such assets do not generally give rise to capital requirements. Delegation to foreign custodians allowed if foreign custodian is prudentially supervised and foreign law guarantees bankruptcy protection. (finma.ch news 2026/01)

### Hot vs cold storage / proof of reserves
- Hot wallet = internet-connected; cold storage = offline (USB/hardware/air-gapped). Cold storage generally holds 80–90% of assets as long-term reserves; ~10–20% in hot wallets for day-to-day activity. (AMINA Bank, Gemini Cryptopedia)
- Proof of Reserves (PoR): cryptographic attestation (often Merkle tree) that a custodian/exchange holds enough assets to cover client balances; certified by independent auditor. (BeInCrypto, Binance, Crypto.com)

## Outbound authority sources (all nofollow noopener noreferrer target=_blank)
1. ESMA MiCA page — esma.europa.eu
2. EUR-Lex Regulation (EU) 2023/1114 (MiCA) — eur-lex.europa.eu
3. EUR-Lex / mica Article 75 text
4. SEC.gov — Custody of Funds or Securities of Clients (Rule 206(4)-2)
5. Cornell LII 17 CFR 275.206(4)-2 (qualified custodian definition)
6. SEC.gov / Sidley — Sept 2025 no-action letter (use sec.gov)
7. FINMA news 2026/01 crypto custody guidance
8. Investor.gov — crypto asset custody basics (SEC)

## Structure
- Author block (Dr. Marcus Hartmann)
- Definition + TLDR + Section 1 basics + Infographic 1 (KEY METRICS, ig-stats)
- Section 2: Do you need a license / when custody triggers authorisation
- Section 3: MiCA custody requirements (jx-table: data fields / Article 75 obligations)
- Expert quote
- Section 4: MiCA vs US qualified custodian vs FINMA (jx-table regime comparison)
- Inline CTA
- Section 5: Hot vs cold storage + proof of reserves
- From-our-practice block
- Section 6: How to get a custody license (Infographic 2, ig-timeline 5 steps)
- FAQ (13 items) — byte-identical in FAQPage JSON-LD
- Sources
- Author box

## Notes
- 2026 in title/H1/meta.
- Zero em-dashes in prose.
- FAQ HTML count == FAQPage JSON-LD count (13).
