import { format } from 'date-fns';
import type { EventInboxItem } from '../types/event';
import AcknowledgeButton from './AcknowledgeButton';
import './EventCard.css';

interface EventCardProps {
  event: EventInboxItem;
  onAcknowledged?: () => void;
}

export default function EventCard({ event, onAcknowledged }: EventCardProps) {
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

  return (
    <div className="event-card">
      <div className="event-card-header">
        <div className="event-card-title">
          <h3 className="event-type">{event.event_type}</h3>
          <span
            className="event-status"
            style={{ backgroundColor: getStatusColor(event.status) }}
          >
            {event.status}
          </span>
        </div>
        <div className="event-card-meta">
          <span className="event-source">Source: {event.source}</span>
          <span className="event-date">{formatDate(event.ingested_at)}</span>
        </div>
      </div>

      <div className="event-card-body">
        <div className="event-id">
          <strong>Event ID:</strong> {event.event_id}
        </div>

        <div className="event-payload">
          <strong>Payload:</strong>
          <pre>{JSON.stringify(event.payload, null, 2)}</pre>
        </div>
      </div>

      <div className="event-card-footer">
        <AcknowledgeButton
          eventId={event.event_id}
          onAcknowledged={onAcknowledged}
          disabled={event.status === 'acknowledged'}
        />
      </div>
    </div>
  );
}
