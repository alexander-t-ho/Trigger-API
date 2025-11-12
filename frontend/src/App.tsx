import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import ApiKeyManager from './components/ApiKeyManager';
import EventList from './components/EventList';
import { config } from './config/config';
import './App.css';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiKeyManager, setShowApiKeyManager] = useState(true);

  useEffect(() => {
    // Check if API key exists
    const apiKey = localStorage.getItem('zapier_api_key') || config.apiKey;
    if (apiKey) {
      setHasApiKey(true);
      setShowApiKeyManager(false);
    }
  }, []);

  const handleApiKeySet = () => {
    setHasApiKey(true);
    setShowApiKeyManager(false);
  };

  const handleShowApiKeyManager = () => {
    setShowApiKeyManager(true);
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="app">
          <header className="app-header">
            <h1>Zapier Triggers Dashboard</h1>
            <div className="app-header-actions">
              {hasApiKey && !showApiKeyManager && (
                <button
                  onClick={handleShowApiKeyManager}
                  className="settings-button"
                >
                  API Settings
                </button>
              )}
            </div>
          </header>

          <main className="app-main">
            {showApiKeyManager && (
              <ApiKeyManager onApiKeySet={handleApiKeySet} />
            )}

            {hasApiKey && !showApiKeyManager && (
              <div className="app-content">
                <EventList />
              </div>
            )}

            {!hasApiKey && !showApiKeyManager && (
              <div className="app-welcome">
                <p>Please configure your API key to get started.</p>
              </div>
            )}
          </main>

          <footer className="app-footer">
            <p>
              API Endpoint: <code>{config.apiEndpoint}</code>
            </p>
            <p>
              Polling: {config.enablePolling ? `Enabled (${config.pollInterval}ms)` : 'Disabled'}
            </p>
          </footer>
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
