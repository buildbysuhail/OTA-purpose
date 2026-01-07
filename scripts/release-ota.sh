#!/bin/bash

# OTA Release Script
# Automatically increments OTA version and pushes tag

set -e

# Get the base version from package.json
BASE_VERSION=$(node -p "require('./package.json').version")

# Fetch all tags from remote
git fetch --tags

# Find the latest OTA tag for this version
LATEST_TAG=$(git tag -l "ota-${BASE_VERSION}-ota.*" | sort -V | tail -n 1)

if [ -z "$LATEST_TAG" ]; then
    # No existing OTA tags for this version, start at 1
    NEW_OTA_NUM=1
else
    # Extract the OTA number and increment
    CURRENT_OTA_NUM=$(echo "$LATEST_TAG" | sed "s/ota-${BASE_VERSION}-ota\.//")
    NEW_OTA_NUM=$((CURRENT_OTA_NUM + 1))
fi

# Create new tag name
NEW_TAG="ota-${BASE_VERSION}-ota.${NEW_OTA_NUM}"

echo ""
echo "=========================================="
echo "  OTA Release"
echo "=========================================="
echo "  Base Version: ${BASE_VERSION}"
echo "  Latest Tag:   ${LATEST_TAG:-none}"
echo "  New Tag:      ${NEW_TAG}"
echo "=========================================="
echo ""

# Ask for confirmation
read -p "Create and push tag '${NEW_TAG}'? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Create and push tag
    git tag "$NEW_TAG"
    git push origin "$NEW_TAG"

    echo ""
    echo "✅ Tag '${NEW_TAG}' created and pushed!"
    echo "📦 GitHub Actions will now build and deploy the OTA update."
    echo ""
else
    echo "❌ Cancelled"
fi
