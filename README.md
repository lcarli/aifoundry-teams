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

## Usage

### Voice Commands

- **"Hey AI Foundry [your question]"**: Direct voice interaction
- **"start voice"**: Begin a voice session
- **"stop voice"**: End the voice session

### Text Commands

- Type any message to interact with the AI Foundry agent
- The bot responds with both text and optional audio

### During Teams Calls

1. Add the bot to your Teams call
2. Use voice commands or @mention the bot
3. The bot will respond with both text and speech

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
- `npm run clean`: Remove compiled files

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check if BOT_ID and BOT_PASSWORD are correct
2. **Voice not working**: Verify SPEECH_KEY and SPEECH_REGION
3. **AI Foundry errors**: Confirm API endpoint and key are valid
4. **Teams app not loading**: Ensure manifest.json has correct app IDs

### Logs

Check console output for detailed error messages and configuration status.

## Security Notes

- Never commit `.env` file to version control
- Rotate API keys regularly
- Use HTTPS in production
- Implement proper error handling for production use

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details