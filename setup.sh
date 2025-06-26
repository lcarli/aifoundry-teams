#!/bin/bash

# AI Foundry Teams Bot Installation Script

echo "🚀 AI Foundry Teams Bot Setup"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version must be 16 or higher. Current: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Project built successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo ""
    echo "⚠️  IMPORTANT: Please update the .env file with your actual configuration:"
    echo "   - Bot Framework credentials (BOT_ID, BOT_PASSWORD)"
    echo "   - Azure Speech Services (SPEECH_KEY, SPEECH_REGION)"
    echo "   - AI Foundry endpoint and API key"
    echo "   - Teams app configuration"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Create bot registration in Azure"
echo "3. Set up Azure Speech Services"
echo "4. Configure AI Foundry endpoint"
echo "5. Update Teams app manifest with your IDs"
echo "6. Run 'npm start' to start the bot"
echo ""
echo "📚 See README.md for detailed instructions"