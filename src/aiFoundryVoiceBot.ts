import { ActivityHandler, TurnContext, MessageFactory, CardFactory, Attachment } from "botbuilder";
import { SpeechConfig as AzureSpeechConfig, SpeechSynthesizer, AudioConfig, SpeechRecognizer, ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import axios from "axios";
import * as path from "path";

interface AIFoundryConfig {
  endpoint: string;
  apiKey: string;
}

interface SpeechServiceConfig {
  subscriptionKey: string;
  region: string;
}

export class AIFoundryVoiceBot extends ActivityHandler {
  private speechServiceConfig: SpeechServiceConfig;
  private aiFoundryConfig: AIFoundryConfig;

  constructor() {
    super();

    // Initialize speech services configuration
    this.speechServiceConfig = {
      subscriptionKey: process.env.SPEECH_KEY || "",
      region: process.env.SPEECH_REGION || "eastus"
    };

    // Initialize AI Foundry configuration
    this.aiFoundryConfig = {
      endpoint: process.env.AI_FOUNDRY_ENDPOINT || "",
      apiKey: process.env.AI_FOUNDRY_API_KEY || ""
    };

    // Handle member additions
    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      const welcomeText = `Welcome to AI Foundry Voice Bot! 🎤\n\nI can help you during Teams calls with voice interactions. Try saying "Hey AI Foundry" to start a conversation.`;
      
      if (membersAdded) {
        for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
          if (membersAdded[cnt].id !== context.activity.recipient.id) {
            const welcomeCard = this.createWelcomeCard();
            await context.sendActivity(MessageFactory.attachment(welcomeCard));
          }
        }
      }
      
      await next();
    });

    // Handle message activities
    this.onMessage(async (context, next) => {
      const userMessage = context.activity.text;
      
      // Check if this is a voice command trigger
      if (userMessage && userMessage.toLowerCase().includes("hey ai foundry")) {
        await this.handleVoiceInteraction(context, userMessage);
      } else if (userMessage && userMessage.toLowerCase().includes("start voice")) {
        await this.startVoiceSession(context);
      } else if (userMessage && userMessage.toLowerCase().includes("stop voice")) {
        await this.stopVoiceSession(context);
      } else {
        // Regular text interaction with AI Foundry
        await this.handleTextInteraction(context, userMessage);
      }
      
      await next();
    });
  }

  private createWelcomeCard(): Attachment {
    const card = {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.2",
      body: [
        {
          type: "TextBlock",
          text: "🎤 AI Foundry Voice Bot",
          weight: "Bolder",
          size: "Large",
          color: "Accent"
        },
        {
          type: "TextBlock",
          text: "Your voice-enabled AI assistant for Teams calls",
          wrap: true,
          spacing: "Medium"
        },
        {
          type: "FactSet",
          facts: [
            {
              title: "Voice Commands:",
              value: "Say 'Hey AI Foundry' to start"
            },
            {
              title: "Text Commands:",
              value: "'start voice' or 'stop voice'"
            },
            {
              title: "Features:",
              value: "Real-time voice interaction during calls"
            }
          ]
        }
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Start Voice Session",
          data: {
            action: "startVoice"
          }
        }
      ]
    };

    return CardFactory.adaptiveCard(card);
  }

  private async handleVoiceInteraction(context: TurnContext, userMessage: string): Promise<void> {
    try {
      await context.sendActivity(MessageFactory.text("🎤 Voice interaction detected! Processing your request..."));
      
      // Extract the actual query after "hey ai foundry"
      const query = userMessage.toLowerCase().replace(/hey ai foundry/gi, "").trim();
      
      if (query) {
        // Send to AI Foundry
        const aiResponse = await this.callAIFoundry(query);
        
        // Convert response to speech
        const audioResponse = await this.textToSpeech(aiResponse);
        
        // Send both text and indicate audio is being processed
        const responseCard = this.createResponseCard(aiResponse, true);
        await context.sendActivity(MessageFactory.attachment(responseCard));
      } else {
        await context.sendActivity(MessageFactory.text("👋 Hello! I'm ready to help. What would you like to know?"));
      }
    } catch (error) {
      console.error("Error in voice interaction:", error);
      await context.sendActivity(MessageFactory.text("❌ Sorry, I encountered an error processing your voice request."));
    }
  }

  private async handleTextInteraction(context: TurnContext, userMessage: string): Promise<void> {
    try {
      if (!userMessage || userMessage.trim() === "") {
        await context.sendActivity(MessageFactory.text("Please provide a message for me to process."));
        return;
      }

      await context.sendActivity(MessageFactory.text("🤖 Processing your request..."));
      
      // Send to AI Foundry
      const aiResponse = await this.callAIFoundry(userMessage);
      
      // Send response
      const responseCard = this.createResponseCard(aiResponse, false);
      await context.sendActivity(MessageFactory.attachment(responseCard));
    } catch (error) {
      console.error("Error in text interaction:", error);
      await context.sendActivity(MessageFactory.text("❌ Sorry, I encountered an error processing your request."));
    }
  }

  private async startVoiceSession(context: TurnContext): Promise<void> {
    try {
      const card = {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.2",
        body: [
          {
            type: "TextBlock",
            text: "🎤 Voice Session Active",
            weight: "Bolder",
            size: "Medium",
            color: "Good"
          },
          {
            type: "TextBlock",
            text: "You can now speak to the AI Foundry agent. Say 'Hey AI Foundry' followed by your question.",
            wrap: true
          },
          {
            type: "TextBlock",
            text: "💡 Tip: Speak clearly and wait for the response before asking your next question.",
            wrap: true,
            isSubtle: true
          }
        ]
      };

      await context.sendActivity(MessageFactory.attachment(CardFactory.adaptiveCard(card)));
    } catch (error) {
      console.error("Error starting voice session:", error);
      await context.sendActivity(MessageFactory.text("❌ Error starting voice session."));
    }
  }

  private async stopVoiceSession(context: TurnContext): Promise<void> {
    try {
      await context.sendActivity(MessageFactory.text("🔇 Voice session stopped. You can still interact via text."));
    } catch (error) {
      console.error("Error stopping voice session:", error);
      await context.sendActivity(MessageFactory.text("❌ Error stopping voice session."));
    }
  }

  private async callAIFoundry(query: string): Promise<string> {
    try {
      if (!this.aiFoundryConfig.endpoint || !this.aiFoundryConfig.apiKey) {
        return "AI Foundry is not configured. Please set AI_FOUNDRY_ENDPOINT and AI_FOUNDRY_API_KEY environment variables.";
      }

      const response = await axios.post(
        this.aiFoundryConfig.endpoint,
        {
          query: query,
          max_tokens: 150,
          temperature: 0.7
        },
        {
          headers: {
            "Authorization": `Bearer ${this.aiFoundryConfig.apiKey}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );

      if (response.data && response.data.response) {
        return response.data.response;
      } else if (response.data && response.data.choices && response.data.choices[0]) {
        return response.data.choices[0].text || response.data.choices[0].message?.content || "No response received.";
      } else {
        return "Received an unexpected response format from AI Foundry.";
      }
    } catch (error) {
      console.error("Error calling AI Foundry:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          return "AI Foundry request timed out. Please try again.";
        } else if (error.response?.status === 401) {
          return "Authentication failed with AI Foundry. Please check your API key.";
        } else if (error.response && error.response.status >= 500) {
          return "AI Foundry service is currently unavailable. Please try again later.";
        }
      }
      return "I'm having trouble connecting to AI Foundry right now. Please try again in a moment.";
    }
  }

  private async textToSpeech(text: string): Promise<boolean> {
    try {
      if (!this.speechServiceConfig.subscriptionKey || !this.speechServiceConfig.region) {
        console.log("Speech services not configured - skipping text-to-speech");
        return false;
      }

      const speechConfig = AzureSpeechConfig.fromSubscription(
        this.speechServiceConfig.subscriptionKey, 
        this.speechServiceConfig.region
      );
      speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

      const synthesizer = new SpeechSynthesizer(speechConfig);
      
      return new Promise((resolve) => {
        synthesizer.speakTextAsync(
          text,
          (result) => {
            if (result.reason === ResultReason.SynthesizingAudioCompleted) {
              console.log("Speech synthesis completed");
              resolve(true);
            } else {
              console.error("Speech synthesis failed:", result.errorDetails);
              resolve(false);
            }
            synthesizer.close();
          },
          (error) => {
            console.error("Speech synthesis error:", error);
            synthesizer.close();
            resolve(false);
          }
        );
      });
    } catch (error) {
      console.error("Error in text-to-speech:", error);
      return false;
    }
  }

  private createResponseCard(response: string, hasAudio: boolean): Attachment {
    const card = {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.2",
      body: [
        {
          type: "TextBlock",
          text: "🤖 AI Foundry Response",
          weight: "Bolder",
          size: "Medium",
          color: "Accent"
        },
        {
          type: "TextBlock",
          text: response,
          wrap: true,
          spacing: "Medium"
        }
      ]
    };

    if (hasAudio) {
      (card.body as any[]).push({
        type: "TextBlock",
        text: "🔊 Audio response is being processed...",
        size: "Small",
        wrap: true
      });
    }

    return CardFactory.adaptiveCard(card);
  }
}