/**
 * Application configuration
 * 
 * Configuration is loaded from environment variables with fallback defaults.
 * For local development, create a .env file in the frontend directory.
 */

export const config = {
  /**
   * Base URL of the Zapier Triggers API
   * Default: Production API endpoint
   */
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 
    'https://k6peopo7ve.execute-api.us-east-1.amazonaws.com/prod',
  
  /**
   * API key for authentication
   * Can be set via environment variable or entered in UI
   */
  apiKey: import.meta.env.VITE_API_KEY || '',
  
  /**
   * Polling interval in milliseconds for real-time updates
   * Default: 5 seconds
   */
  pollInterval: parseInt(import.meta.env.VITE_POLL_INTERVAL || '5000', 10),
  
  /**
   * Maximum number of events to fetch per page
   * Default: 100
   */
  defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '100', 10),
  
  /**
   * Enable/disable polling
   * Default: true
   */
  enablePolling: import.meta.env.VITE_ENABLE_POLLING !== 'false',
};

/**
 * Get API endpoint with trailing slash removed
 */
export const getApiEndpoint = (): string => {
  return config.apiEndpoint.replace(/\/$/, '');
};

/**
 * Check if running in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Check if running in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};
