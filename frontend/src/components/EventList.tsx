import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { config } from '../config/config';
import type { EventInboxItem, EventStatus } from '../types/event';
import EventCard from './EventCard';
import LoadingSpinner from './LoadingSpinner';
import './EventList.css';

interface EventListProps {
  statusFilter?: EventStatus;
  limit?: number;
}

export default function EventList({ statusFilter, limit = config.defaultPageSize }: EventListProps) {
  const [cursor, setCursor] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | undefined>(statusFilter);
  const queryClient = useQueryClient();

  // Query for inbox events
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['inbox', selectedStatus, cursor, limit],
    queryFn: () => api.getInbox(limit, cursor, selectedStatus),
    refetchInterval: config.enablePolling ? config.pollInterval : false,
  });

  // Mutation for acknowledging events
  const acknowledgeMutation = useMutation({
    mutationFn: (eventId: string) => api.acknowledgeEvent(eventId),
    onSuccess: () => {
      // Invalidate and refetch inbox data
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });

  const handleAcknowledged = () => {
    refetch();
  };

  const handleNextPage = () => {
    if (data?.next_cursor) {
      setCursor(data.next_cursor);
    }
  };

  const handlePreviousPage = () => {
    // Simple implementation: reset to first page
    // For a full implementation, you'd need to maintain cursor history
    setCursor(null);
  };

  const handleStatusFilterChange = (status: EventStatus | 'all') => {
    setSelectedStatus(status === 'all' ? undefined : status);
    setCursor(null); // Reset to first page when filter changes
  };

  if (isLoading && !data) {
    return <LoadingSpinner size="large" message="Loading events..." />;
  }

  if (error) {
    return (
      <div className="event-list-error">
        <p>Error loading events: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  const events = data?.events || [];
  const hasNextPage = !!data?.next_cursor;
  const hasPreviousPage = cursor !== null;

  return (
    <div className="event-list">
      <div className="event-list-header">
        <h2>Events</h2>
        <div className="event-list-controls">
          <select
            value={selectedStatus || 'all'}
            onChange={(e) => handleStatusFilterChange(e.target.value as EventStatus | 'all')}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="failed">Failed</option>
          </select>
          <button onClick={() => refetch()} className="refresh-button">
            Refresh
          </button>
        </div>
      </div>

      {data && (
        <div className="event-list-info">
          Showing {events.length} of {data.total_count} events
        </div>
      )}

      {events.length === 0 ? (
        <div className="event-list-empty">
          <p>No events found</p>
        </div>
      ) : (
        <>
          <div className="event-list-items">
            {events.map((event: EventInboxItem) => (
              <EventCard
                key={event.event_id}
                event={event}
                onAcknowledged={handleAcknowledged}
              />
            ))}
          </div>

          <div className="event-list-pagination">
            <button
              onClick={handlePreviousPage}
              disabled={!hasPreviousPage}
              className="pagination-button"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {cursor ? '2+' : '1'}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}

      {isLoading && data && (
        <div className="event-list-loading-more">
          <LoadingSpinner size="small" message="Loading more..." />
        </div>
      )}
    </div>
  );
}
