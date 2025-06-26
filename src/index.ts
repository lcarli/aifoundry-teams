import * as restify from "restify";
import { BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } from "botbuilder";
import { AIFoundryVoiceBot } from "./aiFoundryVoiceBot";
import * as path from "path";

// Load environment variables
require("dotenv").config();

// Create adapter
const adapter = new BotFrameworkAdapter({
  appId: process.env.BOT_ID,
  appPassword: process.env.BOT_PASSWORD
});

// Catch-all for errors
adapter.onTurnError = async (context, error) => {
  console.error(`\n [onTurnError] unhandled error: ${error}`);
  console.error(error);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
    "OnTurnError Trace",
    `${error}`,
    "https://www.botframework.com/schemas/error",
    "TurnError"
  );

  // Send a message to the user
  await context.sendActivity("The bot encountered an error or bug.");
  await context.sendActivity("To continue to run this bot, please fix the bot source code.");
};

// Create conversation and user state
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Create the main dialog
const bot = new AIFoundryVoiceBot();

// Create HTTP server
const server = restify.createServer();

// Listen for incoming requests
server.post("/api/messages", async (req, res) => {
  await adapter.processActivity(req, res, async (context) => {
    await bot.run(context);
  });
});

// Serve static files
server.get("/*", restify.plugins.serveStatic({
  directory: path.join(__dirname, "../appPackage"),
  default: "index.html"
}));

// Health check endpoint
server.get("/health", (req, res, next) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
  return next();
});

// Start the server
const port = process.env.PORT || 3978;
server.listen(port, () => {
  console.log(`\n${server.name} listening on port ${port}`);
  console.log("\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator");
  console.log('\nTo test your bot in Teams, sideload the app manifest.json within Microsoft Teams');
  console.log('\nEnvironment configuration:');
  console.log(`- BOT_ID: ${process.env.BOT_ID ? '✓ Set' : '✗ Not set'}`);
  console.log(`- BOT_PASSWORD: ${process.env.BOT_PASSWORD ? '✓ Set' : '✗ Not set'}`);
  console.log(`- SPEECH_KEY: ${process.env.SPEECH_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`- SPEECH_REGION: ${process.env.SPEECH_REGION ? '✓ Set' : '✗ Not set'}`);
  console.log(`- AI_FOUNDRY_ENDPOINT: ${process.env.AI_FOUNDRY_ENDPOINT ? '✓ Set' : '✗ Not set'}`);
  console.log(`- AI_FOUNDRY_API_KEY: ${process.env.AI_FOUNDRY_API_KEY ? '✓ Set' : '✗ Not set'}`);
});