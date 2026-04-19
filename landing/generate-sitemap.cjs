// Auto-generates sitemap.xml from all HTML files in the landing/ folder.
// Also pings IndexNow so Bing/Yandex/etc. re-crawl changed URLs.
// Run: node landing/generate-sitemap.cjs
// Or add to Vercel build: "node generate-sitemap.cjs" before deploy

const fs = require('fs');
const path = require('path');
const https = require('https');

const DOMAIN = 'https://www.askgrace.org';
const HOST = 'www.askgrace.org';
const INDEXNOW_KEY = '0c2e2b812d284cb19aea3823db31e58a';
const INDEXNOW_KEY_LOCATION = `${DOMAIN}/${INDEXNOW_KEY}.txt`;
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

// --- IndexNow submission ---
// Skip on Vercel preview deploys so only production pings search engines.
const urlList = files.map(file => {
  const slug = file === 'index.html' ? '/' : '/' + file.replace('.html', '');
  return `${DOMAIN}${slug}`;
});

const isProduction = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : true;

if (!isProduction) {
  console.log('IndexNow: skipped (non-production deploy)');
} else {
  const payload = JSON.stringify({
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList,
  });

  const req = https.request({
    method: 'POST',
    hostname: 'api.indexnow.org',
    path: '/indexnow',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload),
      'Host': 'api.indexnow.org',
    },
  }, res => {
    console.log(`IndexNow: submitted ${urlList.length} URLs → HTTP ${res.statusCode}`);
    res.resume();
  });

  req.on('error', err => {
    console.warn(`IndexNow: submission failed (non-fatal): ${err.message}`);
  });

  req.write(payload);
  req.end();
}
