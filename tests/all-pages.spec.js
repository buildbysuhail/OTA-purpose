import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Auto-detect routes by scanning your React pages folder.
 * Adjust the path if needed (like src/pages or src/routes).
 */
const pagesDir = path.resolve('./src/pages');
const pageFiles = fs.readdirSync(pagesDir)
  .filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'))
  .map(f => f.replace(/\.(t|j)sx$/, ''));

for (const page of pageFiles) {
  test(`Page: /${page}`, async ({ page: browserPage }) => {
    const url = `http://localhost:5173/${page === 'index' ? '' : page}`;
    await browserPage.goto(url);
    await expect(browserPage).toHaveTitle(/./); // page should have a title
    await expect(browserPage).not.toHaveTitle('404'); // skip broken links
  });
}
