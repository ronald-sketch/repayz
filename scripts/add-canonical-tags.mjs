import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist/public');

console.log('🔧 Adding canonical tags and robots meta to ALL HTML files...');

// Get all HTML files in dist/public
const htmlFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.html'));

console.log(`Found ${htmlFiles.length} HTML files to process`);

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let html = fs.readFileSync(filePath, 'utf-8');
  
  // Determine the canonical URL based on filename
  let canonicalUrl;
  if (file === 'index.html') {
    canonicalUrl = 'https://repayz.nl/';
  } else {
    // Remove .html extension for canonical URL
    const slug = file.replace('.html', '');
    canonicalUrl = `https://repayz.nl/${slug}`;
  }
  
  // Check if canonical tag already exists
  if (html.includes('<link rel="canonical"')) {
    // Update existing canonical tag
    html = html.replace(
      /<link rel="canonical" href=".*?" \/>/,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );
    console.log(`✅ Updated canonical in: ${file} → ${canonicalUrl}`);
  } else {
    // Add canonical tag after theme-color meta tag
    html = html.replace(
      /<meta name="theme-color" content=".*?" \/>/,
      `<meta name="theme-color" content="#1a3a52" />\n    \n    <!-- SEO Meta Tags -->\n    <link rel="canonical" href="${canonicalUrl}" />\n    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`
    );
    console.log(`✅ Added canonical to: ${file} → ${canonicalUrl}`);
  }
  
  // Ensure robots meta tag exists
  if (!html.includes('<meta name="robots"')) {
    // Add robots meta tag after canonical
    html = html.replace(
      /<link rel="canonical" href=".*?" \/>/,
      `<link rel="canonical" href="${canonicalUrl}" />\n    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`
    );
  }
  
  // Write back to file
  fs.writeFileSync(filePath, html);
});

console.log('✨ All HTML files processed successfully!');
console.log(`📊 Total files updated: ${htmlFiles.length}`);
