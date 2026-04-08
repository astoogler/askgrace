// Auto-generates sitemap.xml from all HTML files in the landing/ folder.
// Run: node landing/generate-sitemap.js
// Or add to Vercel build: "node generate-sitemap.js" before deploy

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://www.askgrace.org';
const LANDING_DIR = __dirname;
const TODAY = new Date().toISOString().split('T')[0];

// Pages that should have higher priority
const HIGH_PRIORITY = ['index.html', 'ai-for-seniors.html', 'ai-for-beginners.html', 'ai-for-elderly-parents.html', 'is-ai-safe.html'];
const LOW_PRIORITY = ['privacy.html', 'terms.html'];

// Files to exclude from sitemap
const EXCLUDE = ['generate-sitemap.js', 'vercel.json', 'robots.txt', 'sitemap.xml', 'og-image.png', 'favicon.ico', 'favicon-32x32.png', 'apple-touch-icon.png'];

const files = fs.readdirSync(LANDING_DIR).filter(f => {
  if (EXCLUDE.includes(f)) return false;
  if (f.startsWith('.')) return false;
  if (!f.endsWith('.html')) return false;
  return true;
});

const urls = files.map(file => {
  const slug = file === 'index.html' ? '/' : '/' + file.replace('.html', '');
  let priority = '0.7';
  let changefreq = 'monthly';

  if (file === 'index.html') {
    priority = '1.0';
    changefreq = 'weekly';
  } else if (HIGH_PRIORITY.includes(file)) {
    priority = '0.9';
  } else if (LOW_PRIORITY.includes(file)) {
    priority = '0.3';
  } else {
    priority = '0.8';
  }

  return `  <url>
    <loc>${DOMAIN}${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(LANDING_DIR, 'sitemap.xml'), sitemap);
console.log(`Sitemap generated with ${urls.length} URLs`);
