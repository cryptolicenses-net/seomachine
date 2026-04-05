const fs = require('fs');
const path = require('path');

const ORG = {
  "@type": "Organization",
  "@id": "https://cryptolicenses.net/#organization",
  "name": "CryptoLicenses.net",
  "url": "https://cryptolicenses.net",
  "logo": {
    "@type": "ImageObject",
    "url": "https://cryptolicenses.net/assets/logo.png"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Grafenauweg 4",
    "addressLocality": "Zug",
    "postalCode": "6300",
    "addressRegion": "ZG",
    "addressCountry": "CH"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "info@cryptolicenses.net",
    "contactType": "customer service",
    "availableLanguage": ["English", "Russian"]
  },
  "sameAs": ["https://t.me/cryptolicensesnet"]
};

const SEGMENT_MAP = {
  "crypto-licenses": "Crypto Licenses",
  "forex-licenses": "Forex Licenses",
  "banking-licenses": "Banking & EMI Licenses",
  "corporate-services": "Corporate Services",
  "guides": "Guides",
  "about": "About Us",
  "contact": "Contact",
  "regulation": "Crypto Regulation",
  "europe": "Europe",
  "mena": "MENA",
  "uae": "UAE",
  "asia": "Asia-Pacific",
  "americas": "Americas",
  "caribbean": "Caribbean",
  "latam": "Latin America",
  "africa": "Africa",
  "vara": "VARA Dubai",
  "dmcc": "DMCC",
  "adgm": "ADGM",
  "ifza": "IFZA",
  "difc": "DIFC",
  "rak-dao": "RAK DAO",
  "emi": "EMI Licenses",
  "spi": "SPI Licenses"
};

function extract(html, regex) {
  const m = html.match(regex);
  return m ? m[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") : null;
}

function buildBreadcrumb(segments, pageTitle) {
  const items = [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptolicenses.net/" }];
  let url = "https://cryptolicenses.net";
  segments.forEach(function(seg, i) {
    url += "/" + seg;
    const isLast = i === segments.length - 1;
    const name = isLast
      ? (pageTitle || SEGMENT_MAP[seg] || seg)
      : (SEGMENT_MAP[seg] || seg);
    items.push({ "@type": "ListItem", "position": i + 2, "name": name, "item": url + "/" });
  });
  return { "@type": "BreadcrumbList", "itemListElement": items };
}

function extractFAQ(html) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const obj = JSON.parse(m[1]);
      if (obj["@type"] === "FAQPage" && obj.mainEntity) return obj.mainEntity;
      if (obj["@graph"]) {
        const faq = obj["@graph"].find(function(x) { return x["@type"] === "FAQPage"; });
        if (faq && faq.mainEntity) return faq.mainEntity;
      }
    } catch(e) {}
  }
  return null;
}

function removeExistingSchema(html) {
  return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, "");
}

function buildSchema(filePath, html) {
  const sep = path.sep;
  const outputMarker = sep + "output" + sep;
  const parts = filePath.split(outputMarker);
  const relPath = parts.length > 1 ? parts[1] : "";
  const segments = relPath.replace(/([/\\])?index\.html$/, "").replace(/^[/\\]/, "").split(/[/\\]/).filter(Boolean);
  const isHome = segments.length === 0;

  const title = extract(html, /<title>([\s\S]*?)<\/title>/);
  const desc  = extract(html, /<meta name="description" content="([^"]*)"/);
  const canonical = extract(html, /<link rel="canonical" href="([^"]*)"/);
  const pageUrl = canonical || ("https://cryptolicenses.net/" + segments.join("/") + (segments.length ? "/" : ""));

  const shortTitle = title ? title.split(/\s+[—|\-–]\s+/)[0].trim() : (segments[segments.length - 1] || "Home");

  const faqData = extractFAQ(html);
  const schemas = [];

  schemas.push(ORG);

  if (isHome) {
    schemas.push({
      "@type": "WebSite",
      "@id": "https://cryptolicenses.net/#website",
      "url": "https://cryptolicenses.net",
      "name": "CryptoLicenses.net",
      "description": desc || "International crypto licensing consultancy. 80+ jurisdictions.",
      "publisher": { "@id": "https://cryptolicenses.net/#organization" }
    });
  }

  if (!isHome && segments.length > 0) {
    schemas.push(buildBreadcrumb(segments, shortTitle));
  }

  const SERVICE_SECTIONS = ["crypto-licenses", "forex-licenses", "banking-licenses", "corporate-services", "crypto-accounting", "regulation"];
  const isJurisdiction = SERVICE_SECTIONS.includes(segments[0]) && segments.length >= 3;
  const isGuide = segments[0] === "guides" && segments.length >= 2;
  const isCaseStudy = segments[0] === "case-studies";
  const isBlog = segments[0] === "blog";
  const isAbout = segments[0] === "about";
  const isContact = segments[0] === "contact";
  const isPrivacyOrTerms = segments[0] === "privacy" || segments[0] === "terms";
  const isRegulation = segments[0] === "regulation" && segments.length >= 2;
  const isArticle = isJurisdiction || isGuide || isCaseStudy || isRegulation;

  const SERVICE_TYPE_MAP = {
    "forex-licenses": "Forex License Consulting",
    "banking-licenses": "Banking & EMI License Consulting",
    "corporate-services": "Corporate Services",
    "crypto-accounting": "Crypto Accounting Services",
    "crypto-licenses": "Crypto License Consulting",
    "regulation": "Crypto Regulation Advisory"
  };

  if (isArticle && title) {
    schemas.push({
      "@type": "Article",
      "@id": pageUrl + "#article",
      "headline": shortTitle,
      "description": desc || "",
      "url": pageUrl,
      "datePublished": "2026-01-01",
      "dateModified": "2026-03-22",
      "author": { "@id": "https://cryptolicenses.net/#organization" },
      "publisher": {
        "@type": "Organization",
        "@id": "https://cryptolicenses.net/#organization",
        "name": "CryptoLicenses.net",
        "logo": { "@type": "ImageObject", "url": "https://cryptolicenses.net/assets/logo.png" }
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
      "inLanguage": "en"
    });

    if (SERVICE_SECTIONS.includes(segments[0])) {
      schemas.push({
        "@type": "LegalService",
        "@id": pageUrl + "#service",
        "name": shortTitle,
        "description": desc || "",
        "url": pageUrl,
        "provider": { "@id": "https://cryptolicenses.net/#organization" },
        "areaServed": "Worldwide",
        "serviceType": SERVICE_TYPE_MAP[segments[0]] || "Financial License Consulting"
      });
    }
  }

  if (isAbout && !isHome) {
    schemas.push({
      "@type": "AboutPage",
      "@id": pageUrl + "#webpage",
      "name": shortTitle,
      "description": desc || "",
      "url": pageUrl,
      "publisher": { "@id": "https://cryptolicenses.net/#organization" }
    });
  } else if (isContact) {
    schemas.push({
      "@type": "ContactPage",
      "@id": pageUrl + "#webpage",
      "name": shortTitle,
      "description": desc || "",
      "url": pageUrl,
      "publisher": { "@id": "https://cryptolicenses.net/#organization" }
    });
  } else if (isPrivacyOrTerms) {
    schemas.push({
      "@type": "WebPage",
      "@id": pageUrl + "#webpage",
      "name": shortTitle,
      "description": desc || "",
      "url": pageUrl,
      "publisher": { "@id": "https://cryptolicenses.net/#organization" }
    });
  } else if (isBlog) {
    schemas.push({
      "@type": "Blog",
      "@id": pageUrl + "#webpage",
      "name": shortTitle,
      "description": desc || "",
      "url": pageUrl,
      "publisher": { "@id": "https://cryptolicenses.net/#organization" }
    });
  } else if (!isArticle && !isHome && segments.length >= 1) {
    schemas.push({
      "@type": "CollectionPage",
      "@id": pageUrl + "#webpage",
      "name": shortTitle,
      "description": desc || "",
      "url": pageUrl,
      "publisher": { "@id": "https://cryptolicenses.net/#organization" }
    });
  }

  if (faqData) {
    schemas.push({ "@type": "FAQPage", "mainEntity": faqData });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": schemas }, null, 2);
}

const root = process.argv[2];
let fixed = 0;

function walk(dir) {
  var entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch(e) { return; }
  entries.forEach(function(entry) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full); return; }
    if (!entry.name.endsWith(".html")) return;
    if (full.includes("templates")) return;

    var html = fs.readFileSync(full, "utf8");
    const schemaJson = buildSchema(full, html);
    const schemaTag = '<script type="application/ld+json">\n' + schemaJson + '\n</script>';

    html = removeExistingSchema(html);

    if (html.includes("</head>")) {
      html = html.replace("</head>", schemaTag + "\n</head>");
      fs.writeFileSync(full, html, "utf8");
      fixed++;
    }
  });
}

walk(root);
console.log("Schema updated: " + fixed + " pages");
