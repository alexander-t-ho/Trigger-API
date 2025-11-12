import { useState } from 'react';
import { api } from '../services/api';
import './AcknowledgeButton.css';

interface AcknowledgeButtonProps {
  eventId: string;
  onAcknowledged?: () => void;
  disabled?: boolean;
}

export default function AcknowledgeButton({
  eventId,
  onAcknowledged,
  disabled = false,
}: AcknowledgeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const handleAcknowledge = async () => {
    if (disabled || isLoading || acknowledged) return;

    setIsLoading(true);
    setError(null);

    try {
      await api.acknowledgeEvent(eventId);
      setAcknowledged(true);
      onAcknowledged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to acknowledge event');
    } finally {
      setIsLoading(false);
    }
  };

  if (acknowledged) {
    return (
      <span className="acknowledge-status acknowledged">
        ✓ Acknowledged
      </span>
    );
  }

  return (
    <div className="acknowledge-button-container">
      <button
        className="acknowledge-button"
        onClick={handleAcknowledge}
        disabled={disabled || isLoading}
        title={error || undefined}
      >
        {isLoading ? 'Acknowledging...' : 'Acknowledge'}
      </button>
      {error && (
        <span className="acknowledge-error" title={error}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
}
