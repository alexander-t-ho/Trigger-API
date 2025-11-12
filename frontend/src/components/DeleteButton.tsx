import { useState } from 'react';
import { api } from '../services/api';
import './DeleteButton.css';

interface DeleteButtonProps {
  eventId: string;
  onDeleted?: () => void;
  disabled?: boolean;
}

export default function DeleteButton({
  eventId,
  onDeleted,
  disabled = false,
}: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await api.deleteEvent(eventId);
      setShowConfirm(false);
      onDeleted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="delete-confirm-dialog">
        <p>Are you sure you want to delete this event?</p>
        <div className="delete-confirm-actions">
          <button
            className="delete-confirm-button confirm"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button
            className="delete-confirm-button cancel"
            onClick={() => {
              setShowConfirm(false);
              setError(null);
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
        {error && (
          <span className="delete-error" title={error}>
            ⚠ {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      className="delete-button"
      onClick={() => setShowConfirm(true)}
      disabled={disabled || isLoading}
      title="Delete event"
    >
      🗑️ Delete
    </button>
  );
}

