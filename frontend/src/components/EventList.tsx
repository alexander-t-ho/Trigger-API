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
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
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
    setSelectedEvents(new Set()); // Clear selection after action
  };

  const handleDeleted = () => {
    refetch();
    setSelectedEvents(new Set()); // Clear selection after deletion
  };

  const handleSelectEvent = (eventId: string, checked: boolean) => {
    const newSelection = new Set(selectedEvents);
    if (checked) {
      newSelection.add(eventId);
    } else {
      newSelection.delete(eventId);
    }
    setSelectedEvents(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    const currentEvents = data?.events || [];
    if (checked) {
      setSelectedEvents(new Set(currentEvents.map(e => e.event_id)));
    } else {
      setSelectedEvents(new Set());
    }
  };

  const handleBulkAcknowledge = async () => {
    if (selectedEvents.size === 0) return;

    setBulkActionLoading(true);
    try {
      const promises = Array.from(selectedEvents).map(eventId =>
        api.acknowledgeEvent(eventId)
      );
      await Promise.all(promises);
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      setSelectedEvents(new Set());
      refetch();
    } catch (error) {
      console.error('Bulk acknowledge failed:', error);
      alert(`Failed to acknowledge some events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEvents.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedEvents.size} event(s)?`)) {
      return;
    }

    setBulkActionLoading(true);
    try {
      const promises = Array.from(selectedEvents).map(eventId =>
        api.deleteEvent(eventId)
      );
      await Promise.all(promises);
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      setSelectedEvents(new Set());
      refetch();
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert(`Failed to delete some events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setBulkActionLoading(false);
    }
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
          {selectedEvents.size > 0 && (
            <span className="selection-info">
              ({selectedEvents.size} selected)
            </span>
          )}
        </div>
      )}

      {selectedEvents.size > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-actions-info">
            {selectedEvents.size} event(s) selected
          </div>
          <div className="bulk-actions-buttons">
            <button
              onClick={handleBulkAcknowledge}
              disabled={bulkActionLoading}
              className="bulk-action-button acknowledge"
            >
              {bulkActionLoading ? 'Processing...' : `✓ Acknowledge ${selectedEvents.size}`}
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkActionLoading}
              className="bulk-action-button delete"
            >
              {bulkActionLoading ? 'Processing...' : `🗑️ Delete ${selectedEvents.size}`}
            </button>
            <button
              onClick={() => setSelectedEvents(new Set())}
              disabled={bulkActionLoading}
              className="bulk-action-button cancel"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="event-list-empty">
          <p>No events found</p>
        </div>
      ) : (
        <>
          <div className="event-list-select-all">
            <label className="select-all-checkbox">
              <input
                type="checkbox"
                checked={events.length > 0 && selectedEvents.size === events.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <span>Select All</span>
            </label>
          </div>
          <div className="event-list-items">
            {events.map((event: EventInboxItem) => (
              <div key={event.event_id} className="event-item-wrapper">
                <label className="event-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedEvents.has(event.event_id)}
                    onChange={(e) => handleSelectEvent(event.event_id, e.target.checked)}
                  />
                </label>
                <EventCard
                  event={event}
                  onAcknowledged={handleAcknowledged}
                  onDeleted={handleDeleted}
                />
              </div>
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
