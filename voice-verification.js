#!/usr/bin/env node
/**
 * Voice Configuration Verification Script
 * 
 * This script helps verify that your voice configuration is set up correctly
 * according to the documentation in README.md
 */

const fs = require('fs');
const path = require('path');

console.log('🎤 AI Foundry Teams Bot - Voice Configuration Verification\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const hasEnv = fs.existsSync(envPath);

console.log('📋 Configuration Check:');
console.log(`   .env file: ${hasEnv ? '✅ Found' : '❌ Missing'}`);

if (hasEnv) {
    require('dotenv').config();
    
    // Check required environment variables for voice
    const requiredVoiceVars = [
        'BOT_ID',
        'BOT_PASSWORD', 
        'SPEECH_KEY',
        'SPEECH_REGION',
        'AI_FOUNDRY_ENDPOINT',
        'AI_FOUNDRY_API_KEY'
    ];
    
    console.log('\n🔑 Environment Variables:');
    requiredVoiceVars.forEach(varName => {
        const value = process.env[varName];
        const status = value ? '✅ Set' : '❌ Missing';
        const masked = value ? value.substring(0, 4) + '...' : 'Not set';
        console.log(`   ${varName}: ${status} (${masked})`);
    });
    
    // Check optional voice-specific variables
    const optionalVoiceVars = [
        'SPEECH_RECOGNITION_LANGUAGE',
        'SPEECH_SYNTHESIS_VOICE_NAME',
        'ENABLE_AUDIO_ENHANCEMENT'
    ];
    
    console.log('\n🎯 Optional Voice Settings:');
    optionalVoiceVars.forEach(varName => {
        const value = process.env[varName];
        const status = value ? '✅ Set' : '⚠️  Using default';
        const displayValue = value || 'Default';
        console.log(`   ${varName}: ${status} (${displayValue})`);
    });
}

// Check if app package files exist
console.log('\n📦 Teams App Package:');
const appPackagePath = path.join(__dirname, 'appPackage');
const manifestPath = path.join(appPackagePath, 'manifest.json');
const colorIconPath = path.join(appPackagePath, 'color.png');
const outlineIconPath = path.join(appPackagePath, 'outline.png');

console.log(`   manifest.json: ${fs.existsSync(manifestPath) ? '✅ Found' : '❌ Missing'}`);
console.log(`   color.png: ${fs.existsSync(colorIconPath) ? '✅ Found' : '❌ Missing'}`);
console.log(`   outline.png: ${fs.existsSync(outlineIconPath) ? '✅ Found' : '❌ Missing'}`);

// Check if manifest has voice-specific permissions
if (fs.existsSync(manifestPath)) {
    try {
        const manifestContent = fs.readFileSync(manifestPath, 'utf8');
        const manifest = JSON.parse(manifestContent);
        
        console.log('\n🔐 Teams Permissions Check:');
        
        // Check if bot supports calling
        const bot = manifest.bots && manifest.bots[0];
        const supportsCalling = bot && bot.supportsCalling;
        console.log(`   Calling support: ${supportsCalling ? '✅ Enabled' : '❌ Missing'}`);
        
        // Check permissions
        const permissions = manifest.permissions || [];
        const hasAudioVideo = permissions.includes('audioVideo');
        console.log(`   Audio/Video permission: ${hasAudioVideo ? '✅ Enabled' : '❌ Missing'}`);
        
        // Check device permissions
        const devicePermissions = manifest.devicePermissions || [];
        const hasMedia = devicePermissions.includes('media');
        console.log(`   Media device permission: ${hasMedia ? '✅ Enabled' : '❌ Missing'}`);
        
    } catch (error) {
        console.log('   ❌ Error reading manifest.json:', error.message);
    }
}

// Check if built files exist
console.log('\n🏗️  Build Status:');
const distPath = path.join(__dirname, 'dist');
const mainJsPath = path.join(distPath, 'index.js');
const botJsPath = path.join(distPath, 'aiFoundryVoiceBot.js');

console.log(`   dist/index.js: ${fs.existsSync(mainJsPath) ? '✅ Built' : '❌ Not built'}`);
console.log(`   dist/aiFoundryVoiceBot.js: ${fs.existsSync(botJsPath) ? '✅ Built' : '❌ Not built'}`);

// Provide guidance based on findings
console.log('\n📖 Next Steps:');

if (!hasEnv) {
    console.log('   1. Copy .env.example to .env and configure your credentials');
}

if (!fs.existsSync(mainJsPath)) {
    console.log('   2. Run "npm run build" to compile TypeScript');
}

if (!fs.existsSync(manifestPath)) {
    console.log('   3. Configure appPackage/manifest.json with your bot details');
}

console.log('   4. Follow the "Voice Over Teams Configuration" section in README.md');
console.log('   5. Test with "npm run dev" and verify voice functionality');

console.log('\n📚 For detailed setup instructions, see the README.md file');
console.log('🎯 Focus on the "Voice Over Teams Configuration" section for voice-specific setup\n');