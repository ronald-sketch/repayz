import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist/public');
const indexPath = path.join(distDir, 'index.html');
const sitemapPath = path.join(distDir, 'sitemap.xml');

console.log('🔧 Generating static HTML files for ALL sitemap URLs...');

// Read sitemap and extract all URLs
const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
const urlMatches = sitemapContent.matchAll(/<loc>https:\/\/repayz\.nl\/(.*?)<\/loc>/g);
const routes = Array.from(urlMatches).map(match => match[1]).filter(route => route.length > 0);

console.log(`📊 Found ${routes.length} routes in sitemap`);

// Read the base index.html
const baseHtml = fs.readFileSync(indexPath, 'utf-8');

// City names for better titles
const cityNames = {
  'oisterwijk': 'Oisterwijk',
  'udenhout': 'Udenhout',
  'moergestel': 'Moergestel',
  'biezenmortel': 'Biezenmortel',
  'berkel-enschot': 'Berkel-Enschot',
  'haaren': 'Haaren',
  'helvoirt': 'Helvoirt',
  'boxtel': 'Boxtel',
  'tilburg': 'Tilburg',
  'loon-op-zand': 'Loon op Zand',
  'hilvarenbeek': 'Hilvarenbeek',
  'den-bosch': 'Den Bosch'
};

// Language names
const langNames = {
  'en': 'English',
  'ro': 'Română',
  'pl': 'Polski',
  'bg': 'Български',
  'ua': 'Українська'
};

// Generate title and description based on route
function generateMeta(route) {
  // Statiegeld city pages
  if (route.startsWith('statiegeld-')) {
    const city = route.replace('statiegeld-', '');
    const cityName = cityNames[city] || city;
    return {
      title: `Snel Bulk Statiegeld Inleveren ${cityName} | REPAYZ Bulkautomaat`,
      description: `Lever bulk statiegeld in bij REPAYZ ${cityName}. Tot 120 items/min! Stort je zak leeg, machine telt automatisch. Ontvang direct CASH via Tikkie of steun Sociaal Huis Oisterwijk.`,
      keywords: `statiegeld ${city}, statiegeld inleveren ${city}, bulk statiegeld ${cityName}, REPAYZ ${cityName}, flessen inleveren ${city}`,
      ogTitle: `Bulk Statiegeld Inleveren ${cityName} | REPAYZ`,
      ogDescription: `Lever bulk statiegeld in bij REPAYZ ${cityName}. Tot 120 items/min! Ontvang direct CASH via Tikkie.`
    };
  }
  
  // Vinted locker city pages
  if (route.startsWith('vinted-locker-')) {
    const city = route.replace('vinted-locker-', '');
    const cityName = cityNames[city] || city;
    return {
      title: `Vinted Go Locker ${cityName} - Tweedehands Kleding Versturen & Ophalen`,
      description: `Vinted Go locker bij REPAYZ ${cityName}. Verkoop tweedehands kleding via Vinted en gebruik de locker 24/7 voor versturen en ophalen. Duurzaam en lokaal!`,
      keywords: `Vinted locker ${city}, Vinted Go ${cityName}, tweedehands kleding ${city}, Vinted pakketpunt ${cityName}`,
      ogTitle: `Vinted Go Locker ${cityName} | REPAYZ`,
      ogDescription: `Gebruik de Vinted Go locker bij REPAYZ ${cityName}. 24/7 beschikbaar voor versturen en ophalen van tweedehands kleding.`
    };
  }
  
  // Language pages
  if (route.match(/^(en|ro|pl|bg|ua)$/)) {
    const lang = route;
    const langName = langNames[lang] || lang;
    return {
      title: `REPAYZ - Recycle, Get Paid, Zero Waste | ${langName}`,
      description: `REPAYZ Oisterwijk - Bulk recycling machine. Return bottles and cans, get cash instantly via Tikkie. Up to 120 items per minute!`,
      keywords: `REPAYZ ${lang}, recycling Oisterwijk, deposit return, bulk recycling`,
      ogTitle: `REPAYZ - Recycle, Get Paid, Zero Waste`,
      ogDescription: `Bulk recycling machine in Oisterwijk. Return bottles and cans, get cash instantly!`
    };
  }
  
  // Language + city pages
  if (route.match(/^(en|ro|pl|bg|ua)-.+$/)) {
    const [lang, city] = route.split('-');
    const langName = langNames[lang] || lang;
    const cityName = cityNames[city] || city;
    return {
      title: `REPAYZ ${cityName} - Bulk Recycling Machine | ${langName}`,
      description: `REPAYZ bulk recycling machine in ${cityName}. Return bottles and cans, get cash instantly. Up to 120 items per minute!`,
      keywords: `REPAYZ ${city}, recycling ${cityName}, deposit return ${city}`,
      ogTitle: `REPAYZ ${cityName} - Bulk Recycling`,
      ogDescription: `Bulk recycling machine in ${cityName}. Return bottles and cans, get cash instantly!`
    };
  }
  
  // Generic fallback for other routes
  return {
    title: `REPAYZ - Recycle, Get Paid, Zero Waste`,
    description: `Recycle makkelijk statiegeld flessen en blikjes bij REPAYZ Oisterwijk. Tot 120 items per minuut! Ontvang CASH via Tikkie of steun Sociaal Huis Oisterwijk.`,
    keywords: `REPAYZ, statiegeld, recycling, Oisterwijk`,
    ogTitle: `REPAYZ - Recycle, Get Paid, Zero Waste`,
    ogDescription: `Recycle makkelijk statiegeld flessen en blikjes bij REPAYZ Oisterwijk.`
  };
}

// Generate HTML file for each route
let generatedCount = 0;
routes.forEach(route => {
  const meta = generateMeta(route);
  let html = baseHtml;
  
  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${meta.title}</title>`
  );
  
  // Replace description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${meta.description}" />`
  );
  
  // Add keywords if not present
  if (!html.includes('<meta name="keywords"')) {
    html = html.replace(
      '<meta name="description"',
      `<meta name="keywords" content="${meta.keywords}" />\n    <meta name="description"`
    );
  }
  
  // Replace OG title
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${meta.ogTitle}" />`
  );
  
  // Replace OG description
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="${meta.ogDescription}" />`
  );
  
  // Replace Twitter title
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${meta.ogTitle}" />`
  );
  
  // Replace Twitter description
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="${meta.ogDescription}" />`
  );
  
  // Update canonical URL for this page
  const pageUrl = `https://repayz.nl/${route}`;
  html = html.replace(
    /<link rel="canonical" href=".*?" \/>/,
    `<link rel="canonical" href="${pageUrl}" />`
  );
  
  // Update OG URL
  html = html.replace(
    /<meta property="og:url" content=".*?" \/>/,
    `<meta property="og:url" content="${pageUrl}" />`
  );
  
  // Update Twitter URL
  html = html.replace(
    /<meta name="twitter:url" content=".*?" \/>/,
    `<meta name="twitter:url" content="${pageUrl}" />`
  );
  
  // Write to file
  const filePath = path.join(distDir, `${route}.html`);
  fs.writeFileSync(filePath, html);
  console.log(`✅ Generated: ${route}.html`);
  generatedCount++;
});

console.log(`✨ All ${generatedCount} SEO pages generated successfully!`);
console.log(`📊 Total HTML files: ${generatedCount + 1} (including index.html)`);
