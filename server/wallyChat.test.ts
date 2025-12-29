import { describe, it, expect } from 'vitest';
import { chatWithWally } from './wallyChat';

describe('REPAYZ Wally Chat', () => {
  it('should respond to a simple question', async () => {
    const response = await chatWithWally({
      messages: [
        { role: 'user', content: 'Wat is REPAYZ?' }
      ]
    });

    expect(response).toBeDefined();
    expect(response.message).toBeTruthy();
    expect(response.error).toBeUndefined();
    expect(response.message.length).toBeGreaterThan(10);
  }, 30000); // 30 second timeout for API call

  it('should handle OpenAI API key validation', async () => {
    const response = await chatWithWally({
      messages: [
        { role: 'user', content: 'Hello' }
      ]
    });

    // If API key is invalid, we should get an error
    // If API key is valid, we should get a message
    expect(response).toBeDefined();
    
    if (response.error) {
      console.error('OpenAI API Error:', response.error);
      expect(response.error).toContain('API');
    } else {
      expect(response.message).toBeTruthy();
    }
  }, 30000);
});
