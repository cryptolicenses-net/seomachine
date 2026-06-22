#!/usr/bin/env node
/**
 * add_new_guides_to_schedule.js — append 30 new guides to publish-schedule.json
 * Adds schedule[] entries (weekly Sundays from 2026-06-28, status pending) and
 * interlinking.guide_links{} (related_guides, related_pages, keywords_to_anchor).
 * Idempotent: skips slugs already present in schedule.
 */
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'publish-schedule.json');

// Weekly Sundays starting 2026-06-28 (the cadence continues from 2026-06-14)
const dates = [
  '2026-06-28','2026-07-05','2026-07-12','2026-07-19','2026-07-26','2026-08-02',
  '2026-08-09','2026-08-16','2026-08-23','2026-08-30','2026-09-06','2026-09-13',
  '2026-09-20','2026-09-27','2026-10-04','2026-10-11','2026-10-18','2026-10-25',
  '2026-11-01','2026-11-08','2026-11-15','2026-11-22','2026-11-29','2026-12-06',
  '2026-12-13','2026-12-20','2026-12-27','2027-01-03','2027-01-10','2027-01-17'
];

const G = (slug, title, related_guides, related_pages, keywords) =>
  ({ slug, title, related_guides, related_pages, keywords });

const guides = [
  G('what-is-fatf-travel-rule','What Is the FATF Travel Rule? Crypto Compliance Explained (2026)',
    ['aml-kyc-explained','what-is-vasp'],['/crypto-licenses/vasp-license/','/corporate-services/aml-kyc/','/regulation/'],
    {'FATF Travel Rule':1,'crypto travel rule':1,'travel rule threshold':1}),
  G('what-is-mica-casp-license','What Is a MiCA CASP License? Requirements, Capital & EU Passporting (2026)',
    ['mica-explained','what-is-vasp'],['/crypto-licenses/europe/mica-compliance/','/regulation/eu/','/contact/'],
    {'MiCA CASP license':1,'CASP authorization':1,'crypto asset service provider':1}),
  G('vasp-vs-casp','VASP vs CASP: EU Crypto Registration vs MiCA Licensing (2026)',
    ['what-is-vasp','mica-explained'],['/crypto-licenses/vasp-license/','/crypto-licenses/europe/','/regulation/eu/'],
    {'VASP vs CASP':1,'VASP to CASP transition':1}),
  G('estonia-vs-lithuania-crypto-license','Estonia vs Lithuania Crypto License: Which Is Better in 2026?',
    ['cheapest-crypto-licenses','fastest-crypto-licenses'],['/crypto-licenses/europe/lithuania/','/crypto-licenses/europe/estonia/','/crypto-licenses/europe/'],
    {'Estonia vs Lithuania crypto license':1,'Baltic crypto licensing':1}),
  G('vara-vs-adgm-crypto-license','VARA vs ADGM: Which Dubai/UAE Crypto License Is Right for You? (2026)',
    ['what-is-crypto-regulation'],['/crypto-licenses/mena/vara/','/crypto-licenses/mena/adgm/','/crypto-licenses/mena/'],
    {'VARA vs ADGM':1,'Dubai crypto license':1}),
  G('best-crypto-license-jurisdiction','How to Choose the Best Crypto License Jurisdiction in 2026 (Decision Guide)',
    ['cheapest-crypto-licenses','fastest-crypto-licenses','how-to-get-crypto-license'],['/crypto-licenses/','/crypto-licenses/europe/','/crypto-licenses/mena/'],
    {'best crypto license jurisdiction':1,'crypto friendly jurisdictions':1}),
  G('crypto-bank-account-for-vasp','How to Open a Bank Account for a Crypto/VASP Company (2026)',
    ['crypto-friendly-banks-guide','how-to-get-crypto-license'],['/crypto-licenses/vasp-license/','/banking-licenses/crypto-banking/','/contact/'],
    {'crypto bank account':1,'VASP bank account':1,'banking for crypto exchange':1}),
  G('what-is-crypto-custody-license','What Is a Crypto Custody License? Qualified Custodian Rules Explained (2026)',
    ['what-is-crypto-license','what-is-vasp'],['/crypto-licenses/custody-license/','/crypto-licenses/wallet-license/','/contact/'],
    {'crypto custody license':1,'qualified custodian':1,'digital asset custody':1}),
  G('security-token-vs-utility-token','Security Token vs Utility Token: Regulation, Howey Test & Classification (2026)',
    ['what-is-crypto-regulation','stablecoin-regulation'],['/regulation/usa/','/regulation/eu/','/crypto-licenses/general/'],
    {'security token vs utility token':1,'Howey test':1,'token classification':1}),
  G('what-is-msb-license','What Is an MSB License? FinCEN Money Services Business Registration Explained (2026)',
    ['what-is-crypto-license','what-is-crypto-regulation'],['/banking-licenses/','/regulation/usa/','/crypto-licenses/americas/usa/'],
    {'MSB license':1,'money services business':1,'FinCEN registration':1}),
  G('emi-vs-banking-license','EMI License vs Banking License: Key Differences for Fintechs (2026)',
    ['what-is-crypto-license'],['/banking-licenses/emi/','/banking-licenses/','/banking-licenses/emi/switzerland/'],
    {'EMI license vs banking license':1,'electronic money institution':1}),
  G('singapore-vs-hong-kong-crypto-license','Singapore vs Hong Kong Crypto License: MAS vs SFC Compared (2026)',
    ['fastest-crypto-licenses'],['/crypto-licenses/asia/singapore/','/crypto-licenses/asia/hong-kong/','/crypto-licenses/asia/'],
    {'Singapore vs Hong Kong crypto license':1,'MAS crypto license':1,'SFC VASP license':1}),
  G('offshore-vs-onshore-crypto-license','Offshore vs Onshore Crypto License: Pros, Cons & Banking Reality (2026)',
    ['best-crypto-license-jurisdiction','cheapest-crypto-licenses'],['/crypto-licenses/offshore/','/crypto-licenses/americas/cayman-islands/','/crypto-licenses/europe/'],
    {'offshore vs onshore crypto license':1,'offshore crypto license':1}),
  G('crypto-regulation-usa-vs-eu-vs-uk','Crypto Regulation: USA vs EU vs UK Compared (2026)',
    ['what-is-crypto-regulation','mica-explained','stablecoin-regulation'],['/regulation/usa/','/regulation/eu/','/regulation/uk/'],
    {'crypto regulation USA vs EU vs UK':1,'UK crypto regulation':1}),
  G('crypto-compliance-officer-mlro','What Does a Crypto MLRO Do? Compliance Officer Role & Requirements (2026)',
    ['aml-kyc-explained','no-kyc-exchanges-risks'],['/corporate-services/aml-kyc/','/corporate-services/compliance/','/contact/'],
    {'crypto MLRO':1,'money laundering reporting officer':1}),
  G('defi-regulation-mica','Is DeFi Regulated? MiCA Fully Decentralized Exemption Explained (2026)',
    ['mica-explained','what-is-crypto-regulation'],['/regulation/eu/','/crypto-licenses/europe/mica-compliance/','/crypto-licenses/general/'],
    {'DeFi regulation':1,'MiCA DeFi exemption':1,'decentralized finance regulation':1}),
  G('how-long-crypto-license-takes','How Long Does It Take to Get a Crypto License? Timelines by Jurisdiction (2026)',
    ['fastest-crypto-licenses','how-to-get-crypto-license'],['/crypto-licenses/','/crypto-licenses/europe/lithuania/','/contact/'],
    {'how long crypto license takes':1,'crypto license timeline':1}),
  G('crypto-friendly-banks-guide','Crypto-Friendly Banks & Business Accounts: A 2026 Guide',
    ['crypto-bank-account-for-vasp'],['/banking-licenses/crypto-banking/','/banking-licenses/crypto-payment-processing/','/contact/'],
    {'crypto friendly banks':1,'crypto business bank account':1}),
  G('buy-ready-made-crypto-license','Buying a Ready-Made Crypto License: Pros, Cons & Risks (2026)',
    ['how-to-get-crypto-license'],['/corporate-services/ready-made-companies/crypto-license/','/corporate-services/ready-made-companies/','/contact/'],
    {'ready made crypto license':1,'shelf company crypto':1}),
  G('how-to-start-crypto-exchange','How to Start a Crypto Exchange: License, Tech & Compliance Roadmap (2026)',
    ['start-crypto-business','how-to-get-crypto-license'],['/crypto-licenses/white-label-exchange/','/crypto-licenses/vasp-license/','/contact/'],
    {'how to start a crypto exchange':1,'launch crypto exchange':1}),
  G('finma-crypto-license-switzerland','FINMA Crypto Licensing in Switzerland: SRO, FinTech & DLT Routes Explained (2026)',
    ['what-is-crypto-license','best-crypto-license-jurisdiction'],['/crypto-licenses/europe/switzerland/','/regulation/switzerland/','/contact/'],
    {'FINMA crypto license':1,'Swiss crypto license':1,'DLT trading facility':1}),
  G('crypto-regulation-asia-overview','Crypto Regulation in Asia: Singapore, Hong Kong, Japan & More (2026)',
    ['singapore-vs-hong-kong-crypto-license','best-crypto-license-jurisdiction'],['/crypto-licenses/asia/','/regulation/singapore/','/regulation/japan/'],
    {'crypto regulation Asia':1,'Asia crypto license':1}),
  G('crypto-regulation-mena-gcc','Crypto Regulation in the UAE & GCC: VARA, ADGM, DFSA & SCA Explained (2026)',
    ['vara-vs-adgm-crypto-license','best-crypto-license-jurisdiction'],['/crypto-licenses/mena/','/crypto-licenses/mena/vara/','/crypto-licenses/mena/difc/'],
    {'crypto regulation UAE':1,'GCC crypto regulation':1}),
  G('offshore-vs-onshore-forex-license','Offshore vs Onshore Forex Broker License: Which Should You Choose? (2026)',
    ['best-crypto-license-jurisdiction','how-to-get-forex-broker-license'],['/forex-licenses/','/forex-licenses/broker-setup/','/forex-licenses/crypto-brokerage/'],
    {'offshore vs onshore forex license':1,'forex broker license':1}),
  G('how-to-get-forex-broker-license','How to Get a Forex Broker License: Step-by-Step Process (2026)',
    ['offshore-vs-onshore-forex-license','how-to-get-crypto-license'],['/forex-licenses/','/forex-licenses/broker-setup/','/contact/'],
    {'how to get forex broker license':1,'forex license requirements':1}),
  G('how-to-get-emi-license','How to Get an EMI License in Europe: Requirements & Process (2026)',
    ['emi-vs-banking-license','crypto-bank-account-for-vasp'],['/banking-licenses/emi/','/banking-licenses/emi/lithuania/','/contact/'],
    {'how to get EMI license':1,'EMI license requirements':1}),
  G('crypto-payment-processing-psp','Crypto Payment Processing: PSP Licensing & High-Risk Merchants Explained (2026)',
    ['how-to-get-emi-license','crypto-friendly-banks-guide'],['/banking-licenses/crypto-payment-processing/','/banking-licenses/crypto-payment-processing/high-risk/','/banking-licenses/'],
    {'crypto payment processing':1,'crypto PSP':1}),
  G('crypto-tax-by-country','Crypto Tax by Country: Zero-Tax & Low-Tax Jurisdictions (2026)',
    ['best-crypto-license-jurisdiction','crypto-accounting-ifrs-vs-gaap'],['/crypto-accounting/tax/','/crypto-licenses/europe/germany/','/crypto-licenses/mena/'],
    {'crypto tax free countries':1,'crypto tax by country':1}),
  G('crypto-accounting-ifrs-vs-gaap','Crypto Accounting: IFRS vs US GAAP for Digital Assets Explained (2026)',
    ['crypto-tax-by-country'],['/crypto-accounting/standards/ifrs/','/crypto-accounting/standards/us-gaap/','/crypto-accounting/'],
    {'crypto accounting IFRS':1,'digital asset accounting':1}),
  G('how-to-launch-a-stablecoin','How to Launch a Stablecoin: EMT vs ART Licensing Under MiCA (2026)',
    ['stablecoin-regulation','mica-explained'],['/crypto-licenses/europe/mica-compliance/','/banking-licenses/emi/','/regulation/eu/'],
    {'how to launch a stablecoin':1,'EMT vs ART':1,'stablecoin license':1}),
];

const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
const existing = new Set(data.schedule.map(s => s.slug));
data.interlinking = data.interlinking || {};
data.interlinking.guide_links = data.interlinking.guide_links || {};

let added = 0;
guides.forEach((g, i) => {
  if (existing.has(g.slug)) { console.log(`skip (exists): ${g.slug}`); return; }
  data.schedule.push({ date: dates[i], slug: g.slug, title: g.title, status: 'pending' });
  const kw = {};
  Object.keys(g.keywords).forEach(k => { kw[k] = `/guides/${g.slug}/`; });
  data.interlinking.guide_links[g.slug] = {
    related_guides: g.related_guides,
    related_pages: g.related_pages,
    keywords_to_anchor: kw,
  };
  added++;
});

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log(`\nAdded ${added} guides. schedule now has ${data.schedule.length} entries.`);
