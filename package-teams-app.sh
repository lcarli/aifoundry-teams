#!/bin/bash

# Teams App Package Creator
# This script creates a Teams app package (.zip) for distribution

echo "📦 Creating Teams App Package"
echo "=============================="

# Check if required files exist
if [ ! -f "appPackage/manifest.json" ]; then
    echo "❌ manifest.json not found in appPackage/"
    exit 1
fi

if [ ! -f "appPackage/color.png" ]; then
    echo "⚠️  Warning: color.png not found, using placeholder"
fi

if [ ! -f "appPackage/outline.png" ]; then
    echo "⚠️  Warning: outline.png not found, using placeholder"
fi

# Create package directory
PACKAGE_DIR="teams-app-package"
mkdir -p "$PACKAGE_DIR"

# Copy manifest
cp appPackage/manifest.json "$PACKAGE_DIR/"

# Copy or create icons
if [ -f "appPackage/color.png" ]; then
    cp appPackage/color.png "$PACKAGE_DIR/"
else
    echo "Creating placeholder color icon..."
    # Create a simple colored rectangle as placeholder
    convert -size 192x192 xc:blue "$PACKAGE_DIR/color.png" 2>/dev/null || {
        echo "ImageMagick not available, copying text file as placeholder"
        cp appPackage/color.png "$PACKAGE_DIR/"
    }
fi

if [ -f "appPackage/outline.png" ]; then
    cp appPackage/outline.png "$PACKAGE_DIR/"
else
    echo "Creating placeholder outline icon..."
    # Create a simple outline as placeholder
    convert -size 32x32 xc:white -stroke black -fill none -draw "rectangle 4,4 28,28" "$PACKAGE_DIR/outline.png" 2>/dev/null || {
        echo "ImageMagick not available, copying text file as placeholder"
        cp appPackage/outline.png "$PACKAGE_DIR/"
    }
fi

# Create the zip package
PACKAGE_NAME="aifoundry-teams-app.zip"
cd "$PACKAGE_DIR"
zip -r "../$PACKAGE_NAME" . >/dev/null

cd ..
rm -rf "$PACKAGE_DIR"

echo "✅ Teams app package created: $PACKAGE_NAME"
echo ""
echo "📋 Package contents:"
unzip -l "$PACKAGE_NAME"
echo ""
echo "🚀 Next steps:"
echo "1. Upload $PACKAGE_NAME to Teams Admin Center"
echo "2. Or install directly in Teams: Apps → Manage your apps → Upload an app"
echo "3. Make sure your bot is deployed and accessible"
echo ""
echo "📝 Note: Update manifest.json with your actual bot and app IDs before packaging for production"