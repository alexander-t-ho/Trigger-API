/**
 * API service for Zapier Triggers API
 * 
 * This service provides methods to interact with the Zapier Triggers API.
 * All methods use the configurable API endpoint and handle authentication.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { getApiEndpoint } from '../config/config';
import type {
  InboxResponse,
  AcknowledgeResponse,
  EventResponse,
  HealthResponse,
  EventStatus,
} from '../types/event';

/**
 * Get API key from localStorage or return empty string
 */
const getApiKey = (): string => {
  return localStorage.getItem('zapier_api_key') || '';
};

/**
 * Create axios instance with base configuration
 */
const createApiClient = (): AxiosInstance => {
  const apiKey = getApiKey();
  const baseURL = getApiEndpoint();

  console.log('API Client: Creating with baseURL:', baseURL);
  console.log('API Client: API key present:', !!apiKey);

  const client = axios.create({
    baseURL,
      headers: {
        'Content-Type': 'application/json',
      ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
    },
    timeout: 30000, // 30 seconds
  });

  // Request interceptor to add API key if available
  client.interceptors.request.use(
    (config) => {
      const key = getApiKey();
      console.log('API Request:', config.method?.toUpperCase(), config.url);
      if (key) {
        config.headers.Authorization = `Bearer ${key}`;
        console.log('API Request: Authorization header added');
      } else {
        console.warn('API Request: No API key found');
      }
      return config;
    },
    (error) => {
      console.error('API Request Interceptor Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
      (response) => response,
    (error: AxiosError) => {
        if (error.response) {
          // Server responded with error status
        const status = error.response.status;
        const data = error.response.data as any;

        if (status === 401) {
          throw new Error('Unauthorized: Invalid or missing API key');
        } else if (status === 404) {
          throw new Error('Not found: The requested resource was not found');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded: Please try again later');
        } else if (status >= 500) {
          throw new Error(`Server error: ${data?.detail || 'Internal server error'}`);
        } else {
          throw new Error(data?.detail || `Request failed with status ${status}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('API Error: Request made but no response', {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          fullURL: error.config?.baseURL + error.config?.url,
        });
        throw new Error('Network error: Unable to connect to the API');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  );

  return client;
};

/**
 * API service class
 */
class ZapierTriggersAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = createApiClient();
  }

  /**
   * Update the API client (useful when API key changes)
   */
  updateClient(): void {
    this.client = createApiClient();
  }

  /**
   * Health check endpoint
   */
  async getHealth(): Promise<HealthResponse> {
    console.log('API: Calling health endpoint at', this.client.defaults.baseURL + '/health');
    try {
      const response = await this.client.get<HealthResponse>('/health');
      console.log('API: Health check successful', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Health check failed', error);
      throw error;
    }
  }

  /**
   * Get inbox events
   * 
   * @param limit Maximum number of events to return (default: 100, max: 1000)
   * @param cursor Pagination cursor for next page
   * @param status Filter by event status
   */
  async getInbox(
    limit: number = 100,
    cursor?: string | null,
    status?: EventStatus
  ): Promise<InboxResponse> {
    const params: Record<string, string | number> = { limit };
    
    if (cursor) {
      params.cursor = cursor;
    }
    
    if (status) {
      params.status = status;
    }

    const response = await this.client.get<InboxResponse>('/inbox', { params });
    return response.data;
  }

  /**
   * Acknowledge an event
   * 
   * @param eventId Event identifier (UUID)
   */
  async acknowledgeEvent(eventId: string): Promise<AcknowledgeResponse> {
    const response = await this.client.post<AcknowledgeResponse>(
      `/inbox/${eventId}/acknowledge`
    );
    return response.data;
  }

  /**
   * Delete an event
   * 
   * @param eventId Event identifier (UUID)
   */
  async deleteEvent(eventId: string): Promise<void> {
    await this.client.delete(`/inbox/${eventId}`);
  }

  /**
   * Ingest a new event (for testing purposes)
   * 
   * @param eventType Type of event
   * @param source Event source identifier
   * @param payload Event payload data
   * @param metadata Optional event metadata
   */
  async ingestEvent(
    eventType: string,
    source: string,
    payload: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<EventResponse> {
    const response = await this.client.post<EventResponse>('/events', {
      event_type: eventType,
      source,
      payload,
      metadata,
    });
    return response.data;
  }
}

// Export singleton instance
export const api = new ZapierTriggersAPI();

// Export class for testing
export default ZapierTriggersAPI;
