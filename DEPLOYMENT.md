# Deployment Guide

This guide walks you through deploying the AI Foundry Teams Bot to production.

## Prerequisites

- Azure subscription
- Microsoft 365 admin access
- AI Foundry access
- Domain for hosting the bot

## Step 1: Azure Bot Service Registration

1. **Create Bot Registration**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create resource → "Azure Bot"
   - Choose "Multi Tenant" for app type
   - Note the **Application ID** (BOT_ID)
   - Create a new **Client Secret** (BOT_PASSWORD)

2. **Configure Messaging Endpoint**
   - Set to: `https://yourdomain.com/api/messages`
   - Enable Teams channel

## Step 2: Azure Speech Services

1. **Create Speech Resource**
   - Azure Portal → Create resource → "Speech Services"
   - Choose your region (recommend: East US)
   - Note the **Subscription Key** and **Region**

2. **Configure Speech Features**
   - Enable Speech-to-Text
   - Enable Text-to-Speech
   - Consider using Neural voices for better quality

## Step 3: AI Foundry Setup

1. **Get AI Foundry Credentials**
   - Obtain your AI Foundry endpoint URL
   - Get your API key/access token
   - Test the endpoint with a simple curl request

2. **API Format**
   ```bash
   curl -X POST "YOUR_AI_FOUNDRY_ENDPOINT" \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"query": "Hello, how are you?"}'
   ```

## Step 4: Host Deployment

### Option A: Azure App Service

1. **Create App Service**
   - Runtime: Node.js 18+
   - Operating System: Linux
   - Enable HTTPS

2. **Configure Environment Variables**
   ```
   BOT_ID=your-bot-app-id
   BOT_PASSWORD=your-bot-password
   SPEECH_KEY=your-speech-key
   SPEECH_REGION=your-speech-region
   AI_FOUNDRY_ENDPOINT=your-ai-foundry-endpoint
   AI_FOUNDRY_API_KEY=your-ai-foundry-key
   TEAMS_APP_ID=your-teams-app-id
   AAD_APP_CLIENT_ID=your-aad-app-id
   BOT_DOMAIN=yourdomain.azurewebsites.net
   ```

3. **Deploy Code**
   - Use ZIP deployment or GitHub Actions
   - Ensure `npm install` and `npm run build` run during deployment

### Option B: Docker Container

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3978
   CMD ["npm", "start"]
   ```

2. **Build and Deploy**
   ```bash
   docker build -t aifoundry-teams .
   docker run -p 3978:3978 --env-file .env aifoundry-teams
   ```

## Step 5: Teams App Registration

1. **Update Manifest**
   ```json
   {
     "id": "your-generated-teams-app-id",
     "developer": {
       "name": "Your Organization",
       "websiteUrl": "https://yourdomain.com",
       "privacyUrl": "https://yourdomain.com/privacy",
       "termsOfUseUrl": "https://yourdomain.com/terms"
     },
     "bots": [{
       "botId": "your-bot-app-id"
     }],
     "validDomains": ["yourdomain.com"],
     "webApplicationInfo": {
       "id": "your-bot-app-id"
     }
   }
   ```

2. **Create App Package**
   - Create icons (192x192 color, 32x32 outline)
   - ZIP manifest.json + icons
   - Upload to Teams Admin Center or direct install

## Step 6: Security Configuration

1. **SSL Certificate**
   - Ensure HTTPS is enabled
   - Use valid SSL certificate

2. **Environment Variables**
   - Never commit secrets to source control
   - Use Azure Key Vault for production secrets
   - Rotate API keys regularly

3. **Network Security**
   - Configure firewall rules if needed
   - Consider using Azure Application Gateway

## Step 7: Testing

1. **Bot Framework Emulator**
   - Download and install Bot Framework Emulator
   - Test with endpoint: `http://localhost:3978/api/messages`

2. **Teams Testing**
   - Install app in Teams
   - Test text interactions
   - Test voice commands
   - Test during Teams calls

## Step 8: Monitoring

1. **Application Insights**
   - Add Application Insights to your app
   - Monitor bot conversations
   - Track errors and performance

2. **Health Checks**
   - Monitor `/health` endpoint
   - Set up alerts for downtime

## Step 9: Scaling (Optional)

1. **Horizontal Scaling**
   - Use Azure App Service scaling
   - Consider container orchestration

2. **Database Integration**
   - Add persistent storage if needed
   - Use Azure Cosmos DB or SQL Database

## Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check messaging endpoint URL
   - Verify BOT_ID and BOT_PASSWORD
   - Check application logs

2. **Voice not working**
   - Verify Speech Services credentials
   - Check SPEECH_REGION matches your resource
   - Test speech services separately

3. **AI Foundry errors**
   - Validate API endpoint and credentials
   - Check API rate limits
   - Test endpoint with curl

4. **Teams app not loading**
   - Verify manifest.json format
   - Check all required domains are listed
   - Ensure bot is registered in Bot Framework

### Log Analysis

Check application logs for:
- HTTP request errors
- Authentication failures
- Speech service errors
- AI Foundry API errors

### Support Resources

- [Bot Framework Documentation](https://docs.microsoft.com/en-us/azure/bot-service/)
- [Teams Platform Documentation](https://docs.microsoft.com/en-us/microsoftteams/platform/)
- [Azure Speech Services](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/)

## Security Checklist

- [ ] HTTPS enabled
- [ ] Secrets stored securely
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] Monitoring and alerting set up
- [ ] Regular security updates
- [ ] API keys rotated regularly