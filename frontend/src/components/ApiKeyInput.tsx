import React, { useState, useEffect } from 'react';
import { getApiKey, setApiKey, clearApiKey } from '../config/config';

interface ApiKeyInputProps {
  onApiKeySet: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKeyState] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const stored = getApiKey();
    if (stored) {
      setApiKeyState(stored);
      onApiKeySet(stored);
    } else {
      setIsEditing(true);
    }
  }, [onApiKeySet]);

  const handleSave = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      onApiKeySet(apiKey.trim());
      setIsEditing(false);
    }
  };

  const handleClear = () => {
    clearApiKey();
    setApiKeyState('');
    setIsEditing(true);
    onApiKeySet('');
  };

  const maskedKey = apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : '';

  if (!isEditing && apiKey) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <p className="text-sm text-gray-600 font-mono">
              {showKey ? apiKey : maskedKey}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowKey(!showKey)}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Change
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        API Key
      </label>
      <div className="flex gap-2">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKeyState(e.target.value)}
          placeholder="Enter your API key"
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
        />
        <button
          onClick={handleSave}
          disabled={!apiKey.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Save
        </button>
        {apiKey && (
          <button
            onClick={() => {
              setApiKeyState(getApiKey());
              setIsEditing(false);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Your API key is stored locally in your browser and never sent to our servers.
      </p>
    </div>
  );
};
