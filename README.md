# AI Foundry Teams Bot

A Microsoft Teams app that integrates with AI Foundry agent and provides voice interaction capabilities during Teams calls.

## Features

- 🎤 **Voice Interaction**: Talk to the AI Foundry agent using natural speech
- 💬 **Text Chat**: Standard text-based interaction with the AI agent
- 📞 **Teams Call Integration**: Works seamlessly during Teams calls
- 🧠 **AI Foundry Integration**: Connects to your AI Foundry endpoint
- 🔊 **Text-to-Speech**: Converts AI responses to speech for better accessibility

## Prerequisites

1. **Microsoft Teams**: Admin access to install custom apps
2. **Azure Bot Service**: Bot registration in Azure
3. **Azure Speech Services**: For voice recognition and synthesis
4. **AI Foundry**: API endpoint and access key
5. **Node.js**: Version 16 or higher

## Quick Start

1. **Run the setup script**: `./setup.sh`
2. **Configure environment**: Update `.env` with your credentials
3. **Build and start**: `npm run dev`
4. **Verify functionality**: `node verify.js`
5. **Package for Teams**: `./package-teams-app.sh`
6. **Deploy and test**: Upload the package to Teams

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd aifoundry-teams
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
# Bot Framework Configuration
BOT_ID=your-bot-app-id
BOT_PASSWORD=your-bot-app-password

# Azure Speech Services Configuration
SPEECH_KEY=your-azure-speech-key
SPEECH_REGION=eastus

# AI Foundry Configuration
AI_FOUNDRY_ENDPOINT=https://your-ai-foundry-endpoint
AI_FOUNDRY_API_KEY=your-ai-foundry-api-key

# Teams App Configuration
TEAMS_APP_ID=your-teams-app-id
AAD_APP_CLIENT_ID=your-aad-app-client-id
BOT_DOMAIN=your-bot-domain.com
```

### 3. Azure Bot Service Setup

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new "Azure Bot" resource
3. Configure the messaging endpoint: `https://your-domain.com/api/messages`
4. Note down the `Application ID` and `Application Secret`

### 4. Azure Speech Services Setup

1. Create an "Speech Services" resource in Azure
2. Get the `Subscription Key` and `Region`
3. Add them to your `.env` file

### 5. AI Foundry Configuration

1. Ensure you have access to an AI Foundry endpoint
2. Get your API endpoint URL and access key
3. Update the `.env` file with these values

### 6. Build and Run

```bash
# Build the TypeScript code
npm run build

# Start the server
npm start
```

The bot will be available at `http://localhost:3978`

### 7. Teams App Installation

1. Update `appPackage/manifest.json` with your actual IDs
2. Create a zip file containing:
   - `manifest.json`
   - `color.png` (192x192 icon)
   - `outline.png` (32x32 icon)
3. In Teams, go to Apps → Manage your apps → Upload an app
4. Upload the zip file

## Voice Over Teams Configuration

This section provides comprehensive, step-by-step instructions for configuring the AI Foundry Teams Bot for voice interactions during Teams calls.

### Overview

The AI Foundry Teams Bot enables you to:
- 🗣️ **Talk directly to the bot** during Teams calls using voice commands
- 👂 **Listen to voice responses** from the bot with natural-sounding speech
- 🎯 **Use wake word activation** ("Hey AI Foundry") to trigger interactions
- 📞 **Participate in group calls** while seamlessly interacting with the AI assistant
- 🔄 **Switch between voice and text** interactions as needed

### Prerequisites for Voice Functionality

Before configuring voice features, ensure you have:

1. **Azure Speech Services** subscription with:
   - Speech-to-Text (STT) capabilities enabled
   - Text-to-Speech (TTS) capabilities enabled
   - Sufficient quota for your expected usage
   - Regional endpoint matching your configuration

2. **Teams Administrator Access** to:
   - Install custom apps in your organization
   - Configure bot permissions for calls
   - Enable microphone access for the bot

3. **User Permissions** including:
   - Microphone access in Teams
   - Permission to add bots to calls
   - Audio device properly configured

### Step-by-Step Voice Configuration

#### Step 1: Azure Speech Services Advanced Setup

1. **Create Speech Resource with Optimal Settings**
   ```bash
   # Using Azure CLI (alternative to portal)
   az cognitiveservices account create \
     --name "aifoundry-speech-service" \
     --resource-group "your-resource-group" \
     --kind SpeechServices \
     --sku S0 \
     --location "eastus" \
     --yes
   ```

2. **Configure Speech Recognition Settings**
   - Navigate to Azure Portal → Your Speech Service
   - Go to **Speech Studio** (speech.microsoft.com)
   - Select your subscription and resource
   - Configure **Custom Speech** models if needed for better accuracy
   - Test speech recognition with your expected vocabulary

3. **Optimize Text-to-Speech Settings**
   - In Speech Studio, go to **Voice Gallery**
   - Test different neural voices (recommended: `en-US-JennyNeural` for natural conversation)
   - Consider custom neural voice if you need branded voice
   - Configure SSML settings for better pronunciation

4. **Get Your Speech Credentials**
   ```bash
   # Get your speech key
   az cognitiveservices account keys list \
     --name "aifoundry-speech-service" \
     --resource-group "your-resource-group"
   ```

#### Step 2: Teams Bot Calling Permissions

1. **Configure Bot for Voice Calls**
   - Go to [Azure Portal](https://portal.azure.com) → Your Bot Registration
   - Navigate to **Channels** → **Microsoft Teams**
   - Enable **"Calling"** in Teams channel settings
   - Set **Webhook** for calling: `https://your-domain.com/api/calls`
   - Enable **"Media in call"** if you need advanced audio processing

2. **Update Bot Manifest for Voice**
   - Edit `appPackage/manifest.json`:
   ```json
   {
     "bots": [{
       "botId": "your-bot-id",
       "scopes": ["personal", "team", "groupchat"],
       "supportsFiles": false,
       "isNotificationOnly": false,
       "supportsCalling": true,
       "supportsVideo": false
     }],
     "permissions": [
       "identity",
       "messageTeamMembers",
       "audioVideo"
     ],
     "devicePermissions": [
       "media"
     ]
   }
   ```

3. **Grant Required Permissions**
   - In Azure AD, go to your bot's app registration
   - Navigate to **API Permissions**
   - Add these Microsoft Graph permissions:
     - `Calls.AccessMedia.All` (Application)
     - `Calls.Initiate.All` (Application)
     - `OnlineMeetings.ReadWrite.All` (Application)
   - Grant admin consent for your organization

#### Step 3: Audio Quality Optimization

1. **Configure Audio Codec Settings**
   ```env
   # Add to your .env file
   SPEECH_RECOGNITION_LANGUAGE=en-US
   SPEECH_SYNTHESIS_VOICE_NAME=en-US-JennyNeural
   AUDIO_SAMPLE_RATE=16000
   AUDIO_CHANNELS=1
   ENABLE_AUDIO_ENHANCEMENT=true
   ```

2. **Optimize for Teams Audio**
   - Teams uses Opus codec for audio streaming
   - Configure speech services for optimal latency:
   ```typescript
   // In your aiFoundryVoiceBot.ts configuration
   const speechConfig = AzureSpeechConfig.fromSubscription(key, region);
   speechConfig.speechRecognitionLanguage = "en-US";
   speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
   speechConfig.setProperty("SpeechServiceConnection_InitialSilenceTimeoutMs", "3000");
   speechConfig.setProperty("SpeechServiceConnection_EndSilenceTimeoutMs", "1000");
   ```

3. **Test Audio Quality**
   ```bash
   # Use the verification script to test audio
   node verify.js --test-audio
   ```

#### Step 4: Wake Word Configuration

1. **Understanding Wake Word Detection**
   - The bot listens for "Hey AI Foundry" in all audio streams
   - Wake word detection happens locally in Teams client
   - Phrases after wake word are sent to AI Foundry for processing

2. **Customize Wake Word Sensitivity**
   ```typescript
   // Configure wake word detection sensitivity
   const recognitionConfig = {
     wakeWordThreshold: 0.7, // Adjust from 0.1 to 1.0
     continuousRecognition: true,
     enableWakeWordDetection: true
   };
   ```

3. **Alternative Activation Methods**
   - Type `start voice` to begin voice session
   - @mention the bot: `@AI Foundry Voice Bot hello`
   - Use bot commands in Teams chat

#### Step 5: Deploy and Test Voice Features

1. **Deploy with Voice Configuration**
   ```bash
   # Build with voice optimizations
   npm run build
   
   # Start with enhanced logging
   DEBUG=voice,audio npm start
   ```

2. **Test Voice in Teams**
   - Start a Teams call (can be with yourself initially)
   - Add the AI Foundry Voice Bot to the call
   - Test wake word: "Hey AI Foundry, can you hear me?"
   - Verify you receive audio response
   - Test during active conversation with others

3. **Verify All Voice Functions**
   - [ ] Wake word detection during calls
   - [ ] Clear audio responses from bot
   - [ ] Ability to interrupt/restart conversations
   - [ ] Voice commands work alongside text
   - [ ] Bot responds appropriately to background noise

## Usage

### Voice Commands During Teams Calls

#### Primary Voice Interaction
- **"Hey AI Foundry [your question]"**: Activates the bot and asks your question
  - Example: "Hey AI Foundry, what's the weather like today?"
  - Example: "Hey AI Foundry, summarize the main points from this meeting"
  - Example: "Hey AI Foundry, help me with a technical question"

#### Voice Session Management
- **"start voice"**: Begin a dedicated voice session
- **"stop voice"**: End the voice session
- **"Hey AI Foundry, go silent"**: Temporarily disable voice responses
- **"Hey AI Foundry, speak up"**: Re-enable voice responses

#### Advanced Voice Commands
- **"Hey AI Foundry, repeat that"**: Ask bot to repeat its last response
- **"Hey AI Foundry, speak slower"**: Request slower speech
- **"Hey AI Foundry, be brief"**: Request shorter responses

### Text Commands

- Type any message to interact with the AI Foundry agent
- The bot responds with both text and optional audio
- Use @mentions for direct bot interaction: `@AI Foundry Voice Bot your question`

### During Teams Calls - Detailed Scenarios

#### Scenario 1: One-on-One Call with Voice Bot
1. Start a Teams call with any participant
2. Click **"Add people"** in the call controls
3. Search for and add **"AI Foundry Voice Bot"**
4. Wait for the bot to join (you'll see a confirmation message)
5. Say **"Hey AI Foundry, hello"** to test the connection
6. Listen for the bot's voice response
7. Continue your conversation naturally

#### Scenario 2: Group Call with Voice Assistant
1. Join an existing group call or start a new one
2. Add the AI Foundry Voice Bot using **"Add people"**
3. Inform other participants about the voice bot
4. Use the wake word **"Hey AI Foundry"** to ask questions
5. The bot will respond with voice for everyone to hear
6. Other participants can also use voice commands

#### Scenario 3: Meeting with AI Note-Taking
1. Start your Teams meeting
2. Add the AI Foundry Voice Bot at the beginning
3. Say **"Hey AI Foundry, please take notes during this meeting"**
4. During the meeting, ask for summaries: **"Hey AI Foundry, summarize what we've discussed so far"**
5. At the end: **"Hey AI Foundry, provide the meeting action items"**

#### Scenario 4: Technical Support During Calls
1. When you encounter a technical issue during a call
2. Say **"Hey AI Foundry, I need help with [specific topic]"**
3. The bot provides immediate voice assistance
4. Ask follow-up questions as needed
5. Use **"Hey AI Foundry, speak slower"** if the response is too fast

### Voice Interaction Best Practices

#### For Optimal Voice Recognition
- **Speak clearly** and at normal pace
- **Use the wake word** consistently: "Hey AI Foundry"
- **Wait for responses** before asking follow-up questions
- **Minimize background noise** when possible
- **Use a good microphone** for better recognition

#### For Better Conversations
- **Be specific** in your questions
- **Use natural language** - the bot understands conversational tone
- **Ask for clarification** if responses aren't clear
- **Use voice commands** to control the interaction pace

#### Managing Bot in Group Calls
- **Introduce the bot** to other participants
- **Explain voice commands** to team members
- **Use text commands** as backup if voice isn't working
- **Mute the bot** if needed: "Hey AI Foundry, go silent"

## Development

### Project Structure

```
├── src/
│   ├── index.ts              # Main server file
│   └── aiFoundryVoiceBot.ts  # Bot implementation
├── appPackage/
│   ├── manifest.json         # Teams app manifest
│   ├── color.png            # App icon (color)
│   └── outline.png          # App icon (outline)
├── dist/                    # Compiled JavaScript
├── .env                     # Environment variables
└── package.json            # Dependencies and scripts
```

### Available Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Start the production server
- `npm run dev`: Build and start in one command
- `npm test`: Run unit tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report
- `npm run clean`: Remove compiled files
- `./setup.sh`: Automated setup script
- `./verify.js`: Verify bot functionality
- `node voice-verification.js`: **Verify voice configuration specifically**
- `./package-teams-app.sh`: Create Teams app package

## Troubleshooting

### Voice-Specific Issues

#### Voice Recognition Problems

**Issue**: Bot doesn't respond to "Hey AI Foundry" wake word
- **Check microphone permissions** in Teams and browser
- **Verify Speech Services configuration**:
  ```bash
  # Test speech service connection
  curl -X POST "https://{region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken" \
    -H "Ocp-Apim-Subscription-Key: {subscription-key}" \
    -H "Content-type: application/x-www-form-urlencoded"
  ```
- **Test wake word detection** by typing "Hey AI Foundry test" in chat first
- **Check background noise levels** - try in a quiet environment
- **Verify language settings** match your speech configuration

**Issue**: Bot hears wake word but doesn't understand the question
- **Speak more clearly** and slower
- **Check Speech Recognition language** settings in Azure
- **Test with simple questions** first: "Hey AI Foundry, hello"
- **Review speech logs** in Azure Speech Services dashboard

**Issue**: Intermittent voice recognition
- **Check network latency** to Azure Speech Services
- **Verify microphone quality** and positioning
- **Monitor Azure Speech Service quotas** and usage limits
- **Test during different times** to rule out service load issues

#### Audio Output Problems

**Issue**: No voice responses from bot
- **Check Teams audio settings** - ensure speakers are working
- **Verify Text-to-Speech configuration**:
  ```typescript
  // Test TTS directly
  const speechConfig = SpeechConfig.fromSubscription(key, region);
  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
  ```
- **Test with text-to-speech online** using same voice
- **Check bot logs** for TTS errors
- **Verify audio codec compatibility** with Teams

**Issue**: Robotic or poor quality voice responses
- **Switch to Neural voices** in Azure Speech Services
- **Adjust speech rate**:
  ```xml
  <speak><prosody rate="0.9">Your text here</prosody></speak>
  ```
- **Configure audio sampling rate** for better quality
- **Test different voice personalities** for better fit

**Issue**: Audio delay or echo
- **Check Teams audio settings** for echo cancellation
- **Verify bot audio processing** isn't adding latency
- **Test with headphones** to eliminate speaker feedback
- **Configure audio buffering** settings in the bot

#### Teams Integration Issues

**Issue**: Can't add bot to Teams calls
- **Verify bot permissions** in Azure AD:
  ```bash
  # Check bot permissions
  az ad app permission list --id {bot-app-id}
  ```
- **Confirm Teams channel** is properly configured
- **Check Teams admin policies** for custom app installation
- **Verify manifest.json** has correct calling permissions
- **Test bot installation** in Teams admin center first

**Issue**: Bot joins call but doesn't respond to voice
- **Check calling webhook** configuration in Bot Framework
- **Verify media permissions** in bot manifest
- **Test bot response** with text commands first
- **Check call audio routing** configuration
- **Monitor bot logs** during call join events

**Issue**: Bot works in chat but not in calls
- **Enable calling features** in Teams channel configuration
- **Check bot scopes** include team and groupchat
- **Verify calling permissions** in Azure bot registration
- **Test with different call types** (1:1 vs group)

### Common Issues (General)

1. **Bot not responding**: Check if BOT_ID and BOT_PASSWORD are correct
2. **Voice not working**: Verify SPEECH_KEY and SPEECH_REGION
3. **AI Foundry errors**: Confirm API endpoint and key are valid
4. **Teams app not loading**: Ensure manifest.json has correct app IDs

### Advanced Troubleshooting

#### Enable Debug Logging
```bash
# Enable detailed voice logging
DEBUG=voice,audio,speech npm start

# Or set environment variables
export DEBUG_VOICE=true
export DEBUG_AUDIO=true
npm start
```

#### Test Components Individually

1. **Test Speech Recognition**:
   ```javascript
   // Create test script: test-speech.js
   const sdk = require('microsoft-cognitiveservices-speech-sdk');
   const speechConfig = sdk.SpeechConfig.fromSubscription('key', 'region');
   // Test recognition here
   ```

2. **Test Text-to-Speech**:
   ```bash
   # Using Azure CLI
   az cognitiveservices speech synthesize \
     --text "Hello, this is a test" \
     --voice "en-US-JennyNeural" \
     --subscription-key "your-key" \
     --region "your-region"
   ```

3. **Test AI Foundry Connection**:
   ```bash
   curl -X POST "your-ai-foundry-endpoint" \
     -H "Authorization: Bearer your-api-key" \
     -H "Content-Type: application/json" \
     -d '{"query": "test message"}'
   ```

#### Monitor Performance

1. **Check Speech Service Metrics** in Azure Portal
2. **Monitor bot response times** in Application Insights
3. **Track audio quality metrics** in Teams admin center
4. **Set up alerts** for service availability

### Logs

Check console output for detailed error messages and configuration status.

#### Key Log Locations
- **Bot Framework logs**: Console output from `npm start`
- **Azure Speech Services**: Azure Portal → Speech Service → Metrics
- **Teams Calling**: Teams Admin Center → Call Analytics
- **AI Foundry**: Your AI Foundry platform logging

#### Important Log Patterns
```bash
# Successful voice interaction
"Voice interaction detected" → "Speech synthesis completed"

# Failed voice recognition
"Speech recognition failed" → Check microphone/permissions

# Failed TTS
"Speech synthesis failed" → Check Azure Speech Services

# AI Foundry connection issues
"AI Foundry API error" → Check endpoint and authentication
```

## Audio Quality Optimization

### Microphone Setup for Best Voice Recognition

#### Hardware Recommendations
- **Use a dedicated headset** or high-quality USB microphone
- **Position microphone** 6-12 inches from your mouth
- **Avoid built-in laptop mics** when possible for better clarity
- **Test microphone levels** in Teams settings before bot interactions

#### Teams Audio Configuration
1. Open Teams → **Settings** → **Devices**
2. Select **optimal microphone** from dropdown
3. Test microphone and adjust **input volume**
4. Enable **noise cancellation** for cleaner input
5. Configure **echo cancellation** if using speakers

#### Environment Optimization
- **Use a quiet room** when possible
- **Minimize background noise** (fans, traffic, other conversations)
- **Face the microphone** when speaking to the bot
- **Speak at consistent volume** for reliable recognition

### Speaker/Audio Output Optimization

#### Teams Speaker Settings
1. Go to Teams → **Settings** → **Devices**
2. Select **high-quality speakers** or headphones
3. Test speaker output and adjust **volume levels**
4. Enable **high fidelity audio** if available
5. Use **stereo mode** for better voice quality

#### Voice Response Quality
- **Neural voices** provide more natural responses
- **Adjust speech rate** if responses are too fast/slow
- **Configure voice personality** to match your preference
- **Enable SSML processing** for better pronunciation

### Network Optimization for Voice

#### Bandwidth Requirements
- **Minimum**: 100 kbps for basic voice functionality
- **Recommended**: 500 kbps for optimal quality
- **Premium**: 1 Mbps for highest quality with minimal latency

#### Latency Optimization
- **Use wired connection** when possible
- **Choose nearest Azure region** for Speech Services
- **Minimize network hops** between bot and Azure
- **Configure QoS settings** for voice traffic priority

### Performance Monitoring

#### Real-time Metrics
```bash
# Monitor voice processing performance
curl "https://your-bot-domain.com/health?include=voice"
```

#### Key Performance Indicators
- **Speech Recognition Latency**: < 500ms optimal
- **Text-to-Speech Generation**: < 800ms optimal  
- **End-to-End Response Time**: < 2 seconds optimal
- **Recognition Accuracy**: > 95% for clear speech

## Frequently Asked Questions (Voice Features)

### Setup and Configuration

**Q: Can I use the bot without Azure Speech Services?**
A: No, Azure Speech Services are required for voice functionality. However, the bot can work in text-only mode without speech services configured.

**Q: What's the cost of using voice features?**
A: Azure Speech Services charges per transaction:
- Speech-to-Text: ~$1 per hour of audio
- Text-to-Speech: ~$4 per 1M characters
- See [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) for current rates

**Q: Can I use the bot in different languages?**
A: Yes, configure the speech language in your environment:
```env
SPEECH_RECOGNITION_LANGUAGE=es-ES  # For Spanish
SPEECH_SYNTHESIS_VOICE_NAME=es-ES-ElviraNeural
```

**Q: How many people can use voice commands simultaneously?**
A: The bot processes voice commands sequentially. Multiple users can issue commands, but responses are handled one at a time.

### Usage and Functionality

**Q: Does the bot always listen for the wake word?**
A: Yes, when added to a call, the bot continuously listens for "Hey AI Foundry". You can disable this with "stop voice" command.

**Q: Can I change the wake word?**
A: Currently, "Hey AI Foundry" is hardcoded. Customization requires code modification in `aiFoundryVoiceBot.ts`.

**Q: What happens if multiple people say the wake word simultaneously?**
A: The bot processes the first detected wake word and ignores simultaneous requests until the current interaction completes.

**Q: Can the bot distinguish between different speakers?**
A: The current implementation doesn't include speaker identification, but this can be added using Azure Speaker Recognition services.

### Troubleshooting and Support

**Q: Why doesn't the bot respond to my voice sometimes?**
A: Common causes:
- Background noise interfering with recognition
- Speaking too quickly or unclearly
- Network latency affecting speech processing
- Azure Speech Services quota limits reached

**Q: Can I test voice functionality without Teams?**
A: Yes, use the Bot Framework Emulator with the verification script:
```bash
node verify.js --test-voice
```

**Q: How do I improve voice recognition accuracy?**
A: Tips for better recognition:
- Speak clearly and at moderate pace
- Use a quality microphone in quiet environment
- Train custom speech models for domain-specific vocabulary
- Enable audio enhancement features

**Q: What if the bot's voice responses are too robotic?**
A: Switch to neural voices and configure SSML:
```env
SPEECH_SYNTHESIS_VOICE_NAME=en-US-JennyNeural
ENABLE_SSML_PROCESSING=true
```

### Privacy and Security

**Q: Is my voice data stored or recorded?**
A: Voice data is processed by Azure Speech Services according to their data retention policies. Configure your Speech Service for minimal data retention if privacy is a concern.

**Q: Can I use the bot in confidential meetings?**
A: Review your organization's security policies. Consider using on-premises speech services for highly sensitive environments.

**Q: How do I audit voice interactions?**
A: Enable Application Insights logging to track all bot interactions:
```env
APPINSIGHTS_INSTRUMENTATIONKEY=your-key
## Security Notes

### General Security
- Never commit `.env` file to version control
- Rotate API keys regularly
- Use HTTPS in production
- Implement proper error handling for production use

### Voice-Specific Security Considerations
- **Audio Data Privacy**: Voice interactions are processed by Azure Speech Services - review their data retention policies
- **Meeting Confidentiality**: Consider data sovereignty requirements for sensitive meetings
- **Access Control**: Limit bot installation to authorized Teams environments
- **Audit Logging**: Enable comprehensive logging for voice interactions
- **Speech Service Regions**: Choose Azure regions that comply with your data residency requirements

### Recommended Security Configuration
```env
# Enable security features
ENABLE_AUDIT_LOGGING=true
REQUIRE_AUTHENTICATION=true
SPEECH_DATA_RETENTION=minimal
VOICE_INTERACTION_LOGGING=encrypted
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details