/**
 * Security utilities for input validation and sanitization
 */

// Maximum lengths for various inputs to prevent DoS and storage issues
export const INPUT_LIMITS = {
  VALUE_NAME: 100,
  VALUE_DESCRIPTION: 500,
  DECISION_TEXT: 2000,
  REFLECTION_RESPONSE: 5000,
  API_KEY: 200,
} as const;

/**
 * Sanitizes user input by removing potentially dangerous characters
 * React auto-escapes by default, but this adds an extra layer
 */
export function sanitizeInput(input: string, maxLength?: number): string {
  if (!input) return '';

  let sanitized = input
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Trim to max length if specified
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized.trim();
}

/**
 * Validates value name - only allows letters, spaces, hyphens, and apostrophes
 */
export function validateValueName(name: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeInput(name, INPUT_LIMITS.VALUE_NAME);

  if (!sanitized) {
    return { valid: false, error: 'Value name is required' };
  }

  if (sanitized.length > INPUT_LIMITS.VALUE_NAME) {
    return { valid: false, error: `Value name must be ${INPUT_LIMITS.VALUE_NAME} characters or less` };
  }

  const validPattern = /^[a-zA-Z\s\-']+$/;
  if (!validPattern.test(sanitized)) {
    return { valid: false, error: 'Value name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { valid: true };
}

/**
 * Validates text input with length limit
 */
export function validateTextInput(
  text: string,
  maxLength: number,
  fieldName: string = 'Input'
): { valid: boolean; error?: string } {
  const sanitized = sanitizeInput(text, maxLength);

  if (sanitized.length > maxLength) {
    return { valid: false, error: `${fieldName} must be ${maxLength} characters or less` };
  }

  return { valid: true };
}

/**
 * Validates API key format (basic check for OpenAI format)
 */
export function validateApiKey(apiKey: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeInput(apiKey, INPUT_LIMITS.API_KEY);

  if (!sanitized) {
    return { valid: false, error: 'API key is required' };
  }

  // OpenAI API keys start with 'sk-' and are followed by characters
  if (!sanitized.startsWith('sk-')) {
    return { valid: false, error: 'Invalid API key format. OpenAI keys start with "sk-"' };
  }

  if (sanitized.length < 20) {
    return { valid: false, error: 'API key appears to be too short' };
  }

  return { valid: true };
}

/**
 * Validates URL for external links
 */
export function validateURL(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Rate limiter for API calls to prevent excessive requests
 */
export class RateLimiter {
  private lastCallTime: number = 0;
  private callCount: number = 0;
  private readonly minInterval: number; // milliseconds between calls
  private readonly maxCallsPerMinute: number;
  private readonly windowStart: number = Date.now();

  constructor(minInterval: number = 2000, maxCallsPerMinute: number = 10) {
    this.minInterval = minInterval;
    this.maxCallsPerMinute = maxCallsPerMinute;
  }

  /**
   * Check if a call can be made and update tracking
   */
  canMakeCall(): { allowed: boolean; error?: string; waitTime?: number } {
    const now = Date.now();

    // Check minimum interval between calls
    const timeSinceLastCall = now - this.lastCallTime;
    if (timeSinceLastCall < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastCall;
      return {
        allowed: false,
        error: `Please wait ${Math.ceil(waitTime / 1000)} seconds before making another request`,
        waitTime,
      };
    }

    // Check max calls per minute
    const windowElapsed = now - this.windowStart;
    if (windowElapsed < 60000) {
      if (this.callCount >= this.maxCallsPerMinute) {
        return {
          allowed: false,
          error: 'Rate limit exceeded. Please wait a minute before trying again',
          waitTime: 60000 - windowElapsed,
        };
      }
    } else {
      // Reset window
      this.callCount = 0;
    }

    // Allow the call and update tracking
    this.lastCallTime = now;
    this.callCount++;

    return { allowed: true };
  }

  reset(): void {
    this.lastCallTime = 0;
    this.callCount = 0;
  }
}
