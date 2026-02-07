/**
 * Environment Variable Validation
 * 
 * This module validates required environment variables at build/runtime.
 * It ensures API keys are configured before the application can start.
 */

// Helper to get env var with validation
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${key}\n` +
      `   Please add it to your .env.local file.\n` +
      `   See .env.example for reference.`
    );
  }
  
  return value;
}

// Lazy validation - only validates when accessed
// This prevents build failures during static analysis
export const env = {
  get GROQ_API_KEY() {
    return getRequiredEnv('GROQ_API_KEY');
  },
  get NVIDIA_API_KEY() {
    return getRequiredEnv('NVIDIA_API_KEY');
  },
};

/**
 * Call this at app startup to eagerly validate all required env vars.
 * Use in API routes or server components where early failure is preferred.
 */
export function validateEnv(): void {
  const requiredKeys = ['GROQ_API_KEY', 'NVIDIA_API_KEY'];
  const missing: string[] = [];
  
  for (const key of requiredKeys) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    console.error('\n🚨 SYNTHESIS AI - Environment Configuration Error 🚨');
    console.error('═'.repeat(50));
    console.error('The following required environment variables are missing:\n');
    missing.forEach(key => console.error(`  • ${key}`));
    console.error('\nPlease create a .env.local file with these keys.');
    console.error('See .env.example for reference.\n');
    console.error('═'.repeat(50) + '\n');
    
    // In production, throw to halt the app
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}
