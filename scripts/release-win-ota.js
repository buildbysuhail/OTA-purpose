#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const TAG_PREFIX = 'win-ota';
const VERSION = JSON.parse(
  readFileSync('package.json', 'utf-8')
).version;

const TAG = `${TAG_PREFIX}-${VERSION}`;

execSync('git fetch --tags');

const existing = execSync(
  `git tag -l "${TAG}"`,
  { encoding: 'utf-8' }
).trim();

if (existing) {
  console.log(`⚠️ Windows OTA tag already exists: ${TAG}`);
  console.log('ℹ️ Electron OTA supports ONE build per version.');
  console.log('✅ If you need a new OTA, bump package.json version.');
  process.exit(0);
}

console.log(`Creating Windows OTA tag: ${TAG}`);
execSync(`git tag ${TAG}`);
execSync(`git push origin ${TAG}`);

console.log('✅ Windows OTA tag pushed');
