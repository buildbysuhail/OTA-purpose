#!/bin/bash
# ==========================================
# OTA Release Script (Multi-Platform)
# Platforms:
#   android → JS OTA (incremental)
#   ios     → JS OTA (incremental)
#   win     → Electron binary OTA
#   mac     → Electron binary OTA
#
# Usage:
#   ./release-ota.sh android
#   ./release-ota.sh ios
#   ./release-ota.sh win
#   ./release-ota.sh mac
# ==========================================

set -e

PLATFORM=$1

if [ -z "$PLATFORM" ]; then
  echo "❌ Usage: ./release-ota.sh <android|ios|win|mac>"
  exit 1
fi

# Read base version
BASE_VERSION=$(node -p "require('./package.json').version")

# Fetch tags
git fetch --tags

# ---------------- ANDROID / iOS ----------------
if [[ "$PLATFORM" == "android" || "$PLATFORM" == "ios" ]]; then
  TAG_PREFIX="${PLATFORM}-ota"

  LATEST_TAG=$(git tag -l "${TAG_PREFIX}-${BASE_VERSION}-ota.*" | sort -V | tail -n 1)

  if [ -z "$LATEST_TAG" ]; then
    NEW_OTA_NUM=1
  else
    CURRENT_OTA_NUM=$(echo "$LATEST_TAG" | sed "s/${TAG_PREFIX}-${BASE_VERSION}-ota\.//")
    NEW_OTA_NUM=$((CURRENT_OTA_NUM + 1))
  fi

  NEW_TAG="${TAG_PREFIX}-${BASE_VERSION}-ota.${NEW_OTA_NUM}"
fi

# ---------------- WINDOWS / MAC ----------------
if [[ "$PLATFORM" == "win" || "$PLATFORM" == "mac" ]]; then
  TAG_PREFIX="${PLATFORM}-ota"
  NEW_TAG="${TAG_PREFIX}-${BASE_VERSION}"
fi

echo ""
echo "=========================================="
echo "  OTA Release"
echo "=========================================="
echo "  Platform:     ${PLATFORM}"
echo "  Base Version: ${BASE_VERSION}"
echo "  New Tag:      ${NEW_TAG}"
echo "=========================================="
echo ""

read -p "Create and push tag '${NEW_TAG}'? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  git tag "$NEW_TAG"
  git push origin "$NEW_TAG"

  echo ""
  echo "✅ Tag '${NEW_TAG}' created and pushed!"
  echo "📦 GitHub Actions will now build & deploy OTA."
  echo ""
else
  echo "❌ Cancelled"
fi
