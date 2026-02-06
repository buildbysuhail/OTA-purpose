#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const PLATFORM = 'android';
const TAG_PREFIX = 'android-ota';


const BASE_VERSION = JSON.parse(
  readFileSync('package.json', 'utf-8')
).version;

execSync('git fetch --tags');

const tags = execSync(
  `git tag -l "${TAG_PREFIX}-${BASE_VERSION}-ota.*"`,
  { encoding: 'utf-8' }
)
  .split('\n')
  .filter(Boolean);

let otaNum = 1;
if (tags.length) {
  otaNum =
    Math.max(...tags.map(t => Number(t.split('.').pop()))) + 1;
}

const NEW_TAG = `${TAG_PREFIX}-${BASE_VERSION}-ota.${otaNum}`;

console.log(`Creating iOS OTA tag: ${NEW_TAG}`);
execSync(`git tag ${NEW_TAG}`);
execSync(`git push origin ${NEW_TAG}`);

console.log('✅ iOS OTA tag pushed');
