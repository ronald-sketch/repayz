import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist/public');
const indexPath = path.join(distDir, 'index.html');

const pageMetas = {
  'hoe-het-werkt': {
    title: 'Hoe Werkt REPAYZ? - Bulk Recycling in 3 Stappen | Envipco Quantum Oisterwijk',
    description: 'Ontdek hoe de Envipco Quantum machine werkt bij REPAYZ Oisterwijk. Stort je zak leeg, machine telt automatisch tot 120 items/min, ontvang direct statiegeld via Tikkie. Bulk recycling gemaakt gemakkelijk!',
    keywords: 'Envipco Quantum, bulk recycling, statiegeld machine, hoe werkt REPAYZ, flessen inleveren Oisterwijk, blikjes recyclen, Tikkie statiegeld',
    ogTitle: 'Hoe Werkt REPAYZ? - Bulk Recycling in 3 Stappen',
    ogDescription: 'Stort je zak leeg, machine telt automatisch, ontvang direct je statiegeld. Zo werkt de Envipco Quantum bij REPAYZ Oisterwijk!'
  },
  'vinted-go': {
    title: 'Vinted Go Locker Oisterwijk - Tweedehands Kleding Verkopen & Versturen',
    description: 'Vinted Go locker bij REPAYZ Oisterwijk. Verkoop je tweedehands kleding via Vinted en gebruik de locker 24/7 voor versturen en ophalen van pakketten. Duurzaam en lokaal!',
    keywords: 'Vinted Go locker Oisterwijk, Vinted pakketpunt, tweedehands kleding verkopen, Vinted versturen Brabant, circulaire economie Oisterwijk',
    ogTitle: 'Vinted Go Locker bij REPAYZ Oisterwijk',
    ogDescription: 'Verkoop je tweedehands kleding via Vinted en gebruik onze 24/7 locker voor versturen en ophalen. Duurzaam en makkelijk!'
  },
  'locatie': {
    title: 'REPAYZ Locatie Oisterwijk - Adres, Openingstijden & Routebeschrijving',
    description: 'Vind de REPAYZ recycling machine in Oisterwijk. Bekijk ons adres, openingstijden (di-za 10:00-18:00) en routebeschrijving. Lever je flessen en blikjes in bij onze Envipco Quantum machine.',
    keywords: 'REPAYZ locatie, REPAYZ Oisterwijk adres, recycling machine Oisterwijk, openingstijden REPAYZ, statiegeld inleveren Oisterwijk centrum',
    ogTitle: 'REPAYZ Locatie - Oisterwijk Centrum',
    ogDescription: 'Bezoek REPAYZ in Oisterwijk centrum. Di-za 10:00-18:00. Lever je flessen en blikjes in en ontvang direct statiegeld!'
  },
  'contact': {
    title: 'Contact REPAYZ Oisterwijk - Vragen over Recycling & Statiegeld',
    description: 'Neem contact op met REPAYZ Oisterwijk. Vragen over de recycling machine, statiegeld inleveren of technische problemen? Stuur een WhatsApp bericht of bezoek onze winkel.',
    keywords: 'REPAYZ contact, recycling machine hulp Oisterwijk, statiegeld vragen, REPAYZ WhatsApp, technische ondersteuning REPAYZ',
    ogTitle: 'Contact REPAYZ - We Helpen Je Graag!',
    ogDescription: 'Vragen over REPAYZ? Stuur ons een WhatsApp bericht of bezoek onze winkel in Oisterwijk. We helpen je graag verder!'
  },
  'game-on': {
    title: 'REPAYZ Leaderboard - Game On! Top Recyclers Oisterwijk',
    description: 'Bekijk de top recyclers van deze week bij REPAYZ Oisterwijk. Wie heeft de meeste flessen en blikjes ingeleverd? Doe mee en kom op het leaderboard!',
    keywords: 'REPAYZ leaderboard, top recyclers Oisterwijk, recycling game, statiegeld competitie, milieu challenge Oisterwijk',
    ogTitle: 'REPAYZ Leaderboard - Game On!',
    ogDescription: 'Zie wie deze week het meest heeft gerecycled bij REPAYZ Oisterwijk. Doe mee en kom op het leaderboard!'
  }
};

console.log('🔧 Generating SEO-optimized HTML files for each route...');

// Read the base index.html
const baseHtml = fs.readFileSync(indexPath, 'utf-8');

// Generate HTML file for each route
Object.entries(pageMetas).forEach(([route, meta]) => {
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
  
  // Update canonical URL for this page
  const pageUrl = `https://repayz.nl/${route}`;
  html = html.replace(
    /<link rel="canonical" href=".*?" \/>/,
    `<link rel="canonical" href="${pageUrl}" />`
  );
  
  // Write to file
  const filePath = path.join(distDir, `${route}.html`);
  fs.writeFileSync(filePath, html);
  console.log(`✅ Generated: ${route}.html`);
});

console.log('✨ SEO pages generated successfully!');
