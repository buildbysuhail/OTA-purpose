import { test, expect } from '@playwright/test';
import fs from 'fs';

const BASE_URL = 'http://localhost:5173/';

// === Auto-detect routes from App.tsx ===
const appFile = './src/App.tsx';
const content = fs.readFileSync(appFile, 'utf8');

// Match patterns like: <Route path="/something" element={<Component />} />
const routeRegex = /path\s*=\s*["'`](\/[^"'`]*)["'`]/g;
const routes = [];
let match;
while ((match = routeRegex.exec(content)) !== null) {
  routes.push(match[1]);
}

// Always include home page
if (!routes.includes('/')) routes.unshift('/');

console.log('🧭 Detected routes:', routes);

test.describe('React App Route Tests', () => {
  for (const route of routes) {
    test(`Check route ${route}`, async ({ page, browserName }) => {
      const url = `${BASE_URL}${route}`;
      console.log(`🔹 Testing ${browserName}: ${url}`);

      const errors = [];
      page.on('pageerror', (err) => errors.push(err.message));

      await page.goto(url, { waitUntil: 'networkidle' });

      // Expect the page to render something
      await expect(page.locator('body')).not.toBeEmpty();

      // No JS errors
      expect(errors.length, `JavaScript errors on ${route}`).toBe(0);

      // Screenshot for each page
      const filename = route === '/' ? 'home' : route.replace(/\//g, '_');
      await page.screenshot({ path: `screenshots/${filename}_${browserName}.png`, fullPage: true });
    });
  }
});
