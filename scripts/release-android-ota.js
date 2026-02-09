#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const PLATFORM = 'android';
const TAG_PREFIX = 'android-ota';

// Read base version
const BASE_VERSION = JSON.parse(
  readFileSync('package.json', 'utf-8')
).version;

// Fetch tags
execSync('git fetch --tags');

// Get all OTA tags for this base version
const tags = execSync(
  `git tag -l "${TAG_PREFIX}-${BASE_VERSION}-ota.*"`,
  { encoding: 'utf-8' }
)
  .split('\n')
  .filter(Boolean)
  .sort((a, b) => {
    const na = Number(a.split('.').pop());
    const nb = Number(b.split('.').pop());
    return na - nb;
  });

// Detect OLD tag
const OLD_TAG = tags.length ? tags[tags.length - 1] : 'none';

// Calculate next OTA number
let otaNum = 1;
if (tags.length) {
  otaNum = Number(tags[tags.length - 1].split('.').pop()) + 1;
}

const NEW_TAG = `${TAG_PREFIX}-${BASE_VERSION}-ota.${otaNum}`;

// Pretty output
console.log('');
console.log('===================================');
console.log(' ANDROID OTA RELEASE');
console.log('-----------------------------------');
console.log(` Base Version: ${BASE_VERSION}`);
console.log(` Old Tag: ${OLD_TAG}`);
console.log(` New Tag: ${NEW_TAG}`);
console.log('===================================');
console.log('');

// Ask confirmation
const readline = await import('readline/promises');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const answer = await rl.question(
  `Create and push tag '${NEW_TAG}'? (y/N): `
);
rl.close();

if (!/^y(es)?$/i.test(answer)) {
  console.log('❌ Cancelled');
  process.exit(0);
}

// Create & push tag
execSync(`git tag ${NEW_TAG}`);
execSync(`git push origin ${NEW_TAG}`);

console.log('');
console.log(`✅ Android OTA tag pushed: ${NEW_TAG}`);
console.log('🚀 GitHub Actions triggered automatically');
