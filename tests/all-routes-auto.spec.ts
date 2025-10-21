import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173/';

// 🔍 Add all route files you want to scan
const ROUTE_FILES = [
  './src/components/common/sidebar/sidemenu/reports-routes.tsx',
  './src/pages/inventory/masters/sales-route/sales-route.tsx',
  './src/components/common/content/content.tsx',
];

// 🧠 Extract all paths from the listed files
const allRoutes: string[] = [];

for (const file of ROUTE_FILES) {
  const fullPath = path.resolve(file);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, 'utf8');
  const regex = /(path|routePath)\s*:\s*[`'"]([^`'"]+)[`'"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const route = match[2];
    if (route && !route.includes('*') && !allRoutes.includes(route)) {
      allRoutes.push(route);
    }
  }
}

// Always include home page
if (!allRoutes.includes('/')) allRoutes.unshift('/');

console.log('🧭 Auto-detected routes:', allRoutes);

test.describe('🌍 Full App Route Test', () => {
  for (const route of allRoutes) {
    test(`Route ${route}`, async ({ page, browserName }) => {
      const url = `${BASE_URL}${route}`;
      const errors: string[] = [];

      page.on('pageerror', (err) => errors.push(err.message));

      console.log(`🔹 Testing ${browserName}: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle' });

      // ✅ Ensure page is not empty
      await expect(page.locator('body')).not.toBeEmpty();

      // ✅ Ensure no JavaScript runtime errors
      expect(errors.length, `JavaScript errors on ${route}`).toBe(0);

      // ✅ Take a screenshot per page
      const safeName = route.replace(/[\/:]/g, '_') || 'home';
      await page.screenshot({
        path: `screenshots/${safeName}_${browserName}.png`,
        fullPage: true,
      });
    });
  }
});
