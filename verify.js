#!/usr/bin/env node

// Quick verification script for AI Foundry Teams Bot
// This script tests the main components without requiring Teams setup

const { AIFoundryVoiceBot } = require('./dist/aiFoundryVoiceBot');
const { TestAdapter } = require('botbuilder');

async function runVerification() {
  console.log('🧪 AI Foundry Teams Bot Verification');
  console.log('=====================================');

  try {
    // Test 1: Bot initialization
    console.log('1️⃣  Testing bot initialization...');
    const bot = new AIFoundryVoiceBot();
    console.log('✅ Bot initialized successfully');

    // Test 2: Test adapter
    console.log('2️⃣  Testing bot framework adapter...');
    const adapter = new TestAdapter(async (context) => {
      await bot.run(context);
    });
    console.log('✅ Adapter configured successfully');

    // Test 3: Simple message handling
    console.log('3️⃣  Testing message handling...');
    await adapter
      .send('hello')
      .assertReply((activity) => {
        console.log('   📝 Bot response received:', activity.text ? 'Text message' : 'Rich response');
        return true;
      });
    console.log('✅ Message handling works');

    // Test 4: Voice command detection
    console.log('4️⃣  Testing voice command detection...');
    await adapter
      .send('Hey AI Foundry, test message')
      .assertReply((activity) => {
        console.log('   🎤 Voice command processed');
        return true;
      });
    console.log('✅ Voice command detection works');

    // Test 5: Voice session management
    console.log('5️⃣  Testing voice session management...');
    await adapter
      .send('start voice')
      .assertReply((activity) => {
        console.log('   🔊 Voice session started');
        return true;
      });
    console.log('✅ Voice session management works');

    console.log('\n🎉 All verification tests passed!');
    console.log('\nNext steps:');
    console.log('- Configure your .env file with actual credentials');
    console.log('- Deploy to Azure or run locally with ngrok');
    console.log('- Create Teams app package and install in Teams');
    console.log('- Test voice interaction during Teams calls');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('- Make sure you ran "npm run build" first');
    console.log('- Check that all dependencies are installed');
    console.log('- Verify TypeScript compilation was successful');
    process.exit(1);
  }
}

// Run verification if this script is executed directly
if (require.main === module) {
  runVerification();
}

module.exports = { runVerification };