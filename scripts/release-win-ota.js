#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const PLATFORM = 'win';
const TAG_PREFIX = 'win-ota';

const BASE_VERSION = JSON.parse(
  readFileSync('package.json', 'utf-8')
).version;

const TAG = `${TAG_PREFIX}-${BASE_VERSION}`;

console.log(`Creating Windows OTA tag: ${TAG}`);

execSync('git fetch --tags');
execSync(`git tag ${TAG}`);
execSync(`git push origin ${TAG}`);

console.log('✅ Windows OTA tag pushed');
