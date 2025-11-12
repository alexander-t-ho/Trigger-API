import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { config } from '../config/config';
import './ApiKeyManager.css';

interface ApiKeyManagerProps {
  onApiKeySet?: () => void;
}

export default function ApiKeyManager({ onApiKeySet }: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('zapier_api_key') || config.apiKey;
    if (storedKey) {
      setApiKey(storedKey);
      validateApiKey(storedKey);
    }
  }, []);

  const validateApiKey = async (key: string) => {
    if (!key) {
      setIsValid(false);
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      // Update API client with new key
      localStorage.setItem('zapier_api_key', key);
      api.updateClient();

      // Test the API key by calling health endpoint
      await api.getHealth();
      setIsValid(true);
      onApiKeySet?.();
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid API key');
      localStorage.removeItem('zapier_api_key');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateApiKey(apiKey);
  };

  const handleClear = () => {
    setApiKey('');
    setIsValid(false);
    setError(null);
    localStorage.removeItem('zapier_api_key');
    api.updateClient();
  };

  return (
    <div className="api-key-manager">
      <div className="api-key-form">
        <h3>API Key Configuration</h3>
        <form onSubmit={handleSubmit}>
          <div className="api-key-input-group">
            <label htmlFor="api-key">API Key:</label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError(null);
                setIsValid(false);
              }}
              placeholder="Enter your API key"
              className={error ? 'error' : isValid ? 'valid' : ''}
              disabled={isValidating}
            />
            {isValidating && <span className="validating">Validating...</span>}
            {isValid && !isValidating && (
              <span className="valid-indicator">✓ Valid</span>
            )}
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="api-key-actions">
            <button type="submit" disabled={!apiKey || isValidating}>
              {isValidating ? 'Validating...' : 'Set API Key'}
            </button>
            {apiKey && (
              <button type="button" onClick={handleClear} className="clear-button">
                Clear
              </button>
            )}
          </div>
        </form>
        <div className="api-key-help">
          <p>
            <strong>How to get your API key:</strong>
          </p>
          <ol>
            <li>Retrieve from AWS Secrets Manager: <code>alexho/zapier-triggers/api-keys</code></li>
            <li>Or use the API key generation script in the API repository</li>
          </ol>
          <p className="api-key-note">
            Your API key is stored locally in your browser and never sent to any server except the Zapier Triggers API.
          </p>
        </div>
      </div>
    </div>
  );
}

