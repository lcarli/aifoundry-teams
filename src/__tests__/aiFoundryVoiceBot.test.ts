import { AIFoundryVoiceBot } from '../aiFoundryVoiceBot';
import { TestAdapter, TurnContext } from 'botbuilder';

describe('AI Foundry Voice Bot', () => {
  let bot: AIFoundryVoiceBot;
  let adapter: TestAdapter;

  beforeEach(() => {
    bot = new AIFoundryVoiceBot();
    adapter = new TestAdapter(async (context: TurnContext) => {
      await bot.run(context);
    });
  });

  test('should respond to welcome message', async () => {
    await adapter
      .send('hello')
      .assertReply((activity) => {
        // Should process the message and attempt to call AI Foundry
        expect(activity.text).toBeDefined();
        return true;
      });
  });

  test('should handle voice command trigger', async () => {
    await adapter
      .send('Hey AI Foundry, how are you?')
      .assertReply((activity) => {
        // Should detect voice command and process accordingly
        expect(activity.text || activity.attachments).toBeDefined();
        return true;
      });
  });

  test('should handle start voice command', async () => {
    await adapter
      .send('start voice')
      .assertReply((activity) => {
        // Should respond with voice session activation
        expect(activity.attachments || activity.text).toBeDefined();
        return true;
      });
  });

  test('should handle stop voice command', async () => {
    await adapter
      .send('stop voice')
      .assertReply((activity) => {
        // Should respond with voice session deactivation
        expect(activity.text).toContain('stopped');
        return true;
      });
  });
});

// Mock the Azure Speech SDK to avoid requiring actual credentials in tests
jest.mock('microsoft-cognitiveservices-speech-sdk', () => ({
  SpeechConfig: {
    fromSubscription: jest.fn(() => ({
      speechSynthesisVoiceName: ''
    }))
  },
  SpeechSynthesizer: jest.fn(() => ({
    speakTextAsync: jest.fn((text, success, error) => {
      success({ reason: 3 }); // ResultReason.SynthesizingAudioCompleted
    }),
    close: jest.fn()
  })),
  ResultReason: {
    SynthesizingAudioCompleted: 3
  }
}));

// Mock axios to avoid actual HTTP calls in tests
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({
    data: {
      response: 'Mock AI Foundry response'
    }
  })),
  isAxiosError: jest.fn(() => false)
}));