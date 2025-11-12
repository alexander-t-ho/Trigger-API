import { format } from 'date-fns';
import type { EventInboxItem } from '../types/event';
import './EventDetail.css';

interface EventDetailProps {
  event: EventInboxItem;
  onClose: () => void;
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPpp');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'delivered':
        return '#2196f3';
      case 'acknowledged':
        return '#4caf50';
      case 'failed':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('Copied to clipboard:', text);
    });
  };

  return (
    <div className="event-detail-overlay" onClick={onClose}>
      <div className="event-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="event-detail-header">
          <h2>Event Details</h2>
          <button className="event-detail-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="event-detail-content">
          <div className="event-detail-section">
            <h3>Basic Information</h3>
            <div className="event-detail-field">
              <label>Event ID:</label>
              <div className="event-detail-value-with-copy">
                <code>{event.event_id}</code>
                <button
                  className="copy-button"
                  onClick={() => copyToClipboard(event.event_id)}
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="event-detail-field">
              <label>Event Type:</label>
              <div className="event-detail-value">{event.event_type}</div>
            </div>
            <div className="event-detail-field">
              <label>Source:</label>
              <div className="event-detail-value">{event.source}</div>
            </div>
            <div className="event-detail-field">
              <label>Status:</label>
              <span
                className="event-status-badge"
                style={{ backgroundColor: getStatusColor(event.status) }}
              >
                {event.status}
              </span>
            </div>
            <div className="event-detail-field">
              <label>Ingested At:</label>
              <div className="event-detail-value">{formatDate(event.ingested_at)}</div>
            </div>
          </div>

          <div className="event-detail-section">
            <h3>Payload</h3>
            <div className="event-detail-payload">
              <div className="event-detail-payload-header">
                <span>JSON Payload</span>
                <button
                  className="copy-button"
                  onClick={() => copyToClipboard(JSON.stringify(event.payload, null, 2))}
                  title="Copy JSON to clipboard"
                >
                  📋 Copy JSON
                </button>
              </div>
              <pre>{JSON.stringify(event.payload, null, 2)}</pre>
            </div>
          </div>

          <div className="event-detail-section">
            <h3>Raw Data</h3>
            <div className="event-detail-raw">
              <div className="event-detail-payload-header">
                <span>Full Event Object</span>
                <button
                  className="copy-button"
                  onClick={() => copyToClipboard(JSON.stringify(event, null, 2))}
                  title="Copy full event to clipboard"
                >
                  📋 Copy All
                </button>
              </div>
              <pre>{JSON.stringify(event, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="event-detail-footer">
          <button className="event-detail-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

