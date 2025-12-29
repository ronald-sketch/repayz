import { describe, expect, it } from "vitest";

const EPORTAL_BASE_URL = 'https://eportal.envipco.com/api';

describe("ePortal API Authentication", () => {
  it("should authenticate with ePortal API using provided credentials", async () => {
    const username = process.env.EPORTAL_USERNAME;
    const password = process.env.EPORTAL_PASSWORD;

    // Check credentials are provided
    expect(username).toBeDefined();
    expect(password).toBeDefined();
    expect(username).not.toBe('');
    expect(password).not.toBe('');

    // Attempt authentication
    const response = await fetch(
      `${EPORTAL_BASE_URL}/login?username=${encodeURIComponent(username!)}&password=${encodeURIComponent(password!)}`,
      {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      }
    );

    // Check response
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    
    // Verify API key is returned
    expect(data.ApiKey).toBeDefined();
    expect(typeof data.ApiKey).toBe('string');
    expect(data.ApiKey.length).toBeGreaterThan(0);
    
    console.log('[Test] ✅ ePortal authentication successful - API key received');
  }, 30000); // 30 second timeout for API call
});
