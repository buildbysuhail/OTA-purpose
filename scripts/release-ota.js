#!/usr/bin/env node

/**
 * OTA Release Script
 * Automatically increments OTA version and pushes tag
 *
 * Usage:
 *   npm run release:ota
 *   node scripts/release-ota.js
 */

import { execSync } from 'child_process';
import { createInterface } from 'readline';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
);
const BASE_VERSION = packageJson.version;

function exec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

function askQuestion(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase());
    });
  });
}

async function main() {
  console.log('\n🔄 Fetching tags from remote...\n');

  // Fetch all tags
  exec('git fetch --tags');

  // Get all OTA tags for this version
  const tagsOutput = exec(`git tag -l "ota-${BASE_VERSION}-ota.*"`);
  const tags = tagsOutput ? tagsOutput.split('\n').filter(Boolean) : [];

  // Sort and find latest
  const sortedTags = tags.sort((a, b) => {
    const numA = parseInt(a.split('.').pop(), 10);
    const numB = parseInt(b.split('.').pop(), 10);
    return numA - numB;
  });

  const latestTag = sortedTags[sortedTags.length - 1];
  let newOtaNum = 1;

  if (latestTag) {
    const currentOtaNum = parseInt(latestTag.split('.').pop(), 10);
    newOtaNum = currentOtaNum + 1;
  }

  const newTag = `ota-${BASE_VERSION}-ota.${newOtaNum}`;

  console.log('==========================================');
  console.log('  OTA Release');
  console.log('==========================================');
  console.log(`  Base Version: ${BASE_VERSION}`);
  console.log(`  Latest Tag:   ${latestTag || 'none'}`);
  console.log(`  New Tag:      ${newTag}`);
  console.log('==========================================\n');

  const answer = await askQuestion(`Create and push tag '${newTag}'? (y/n) `);

  if (answer === 'y' || answer === 'yes') {
    console.log('\n📦 Creating tag...');
    exec(`git tag ${newTag}`);

    console.log('🚀 Pushing tag to remote...');
    exec(`git push origin ${newTag}`);

    console.log(`\n✅ Tag '${newTag}' created and pushed!`);
    console.log('📦 GitHub Actions will now build and deploy the OTA update.\n');
  } else {
    console.log('\n❌ Cancelled\n');
  }
}

main().catch(console.error);
