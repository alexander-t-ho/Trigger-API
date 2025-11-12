/**
 * TypeScript types for Zapier Triggers API
 * These match the Python Pydantic models in the API
 */

export type EventStatus = 'pending' | 'delivered' | 'acknowledged' | 'failed';

export interface EventMetadata {
  correlation_id?: string;
  timestamp?: string;
  user_agent?: string;
  ip_address?: string;
}

export interface EventInboxItem {
  event_id: string;
  event_type: string;
  source: string;
  payload: Record<string, any>;
  ingested_at: string;
  status: EventStatus;
}

export interface InboxResponse {
  events: EventInboxItem[];
  next_cursor: string | null;
  total_count: number;
}

export interface AcknowledgeResponse {
  event_id: string;
  status: string;
  acknowledged_at: string;
}

export interface EventResponse {
  event_id: string;
  status: string;
  timestamp: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}
