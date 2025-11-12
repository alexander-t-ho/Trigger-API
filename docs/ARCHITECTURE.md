# Dashboard Architecture

## Overview

The Zapier Triggers Dashboard is a **disconnected microservice** built as a React single-page application (SPA) that communicates with the Zapier Triggers API via REST. It's designed to be easily swappable with alternative implementations.

## Architecture Principles

### 1. Disconnected Design

The dashboard is completely separate from the API:
- **Separate repository**: Independent versioning and deployment
- **REST API communication**: No direct AWS service dependencies
- **Configurable endpoint**: API URL via environment variables
- **Stateless**: No server-side components

### 2. Microservices Pattern

- **Frontend**: React SPA hosted on AWS Amplify
- **Backend**: Existing Zapier Triggers API (Lambda + API Gateway)
- **Communication**: HTTP/REST with API key authentication
- **Data Storage**: API manages all data (DynamoDB)

### 3. Swappability

The dashboard can be easily replaced with alternative implementations:
- **API endpoint**: Environment variable configuration
- **Authentication**: Pluggable API key management
- **UI Framework**: React can be swapped for Vue, Angular, etc.
- **Hosting**: Amplify can be swapped for S3+CloudFront, Netlify, Vercel, etc.

## Technology Stack

### Frontend

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **React Query**: Data fetching and caching
- **Axios**: HTTP client
- **date-fns**: Date formatting

### Hosting

- **AWS Amplify**: Hosting, CI/CD, and environment management
- **S3 + CloudFront**: Alternative hosting option (not implemented)

### API Integration

- **REST API**: Communication with Zapier Triggers API
- **API Key Auth**: Bearer token authentication
- **Polling**: Real-time updates via periodic polling

## Project Structure

```
zapier-triggers-dashboard/
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── EventList.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── AcknowledgeButton.tsx
│   │   │   ├── ApiKeyManager.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── services/          # API service layer
│   │   │   └── api.ts
│   │   ├── config/            # Configuration
│   │   │   └── config.ts
│   │   ├── types/             # TypeScript types
│   │   │   └── event.ts
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
├── docs/                      # Documentation
├── amplify.yml                # Amplify build config
└── README.md
```

## Data Flow

```
User Action
    ↓
React Component
    ↓
API Service (api.ts)
    ↓
HTTP Request (Axios)
    ↓
Zapier Triggers API (API Gateway + Lambda)
    ↓
DynamoDB
    ↓
Response
    ↓
React Query Cache
    ↓
UI Update
```

## Component Architecture

### EventList Component

- **Purpose**: Main container for displaying events
- **Features**: Filtering, pagination, polling
- **State Management**: React Query for server state
- **Dependencies**: EventCard, LoadingSpinner

### EventCard Component

- **Purpose**: Display individual event details
- **Features**: Event metadata, payload display, acknowledge button
- **Dependencies**: AcknowledgeButton

### AcknowledgeButton Component

- **Purpose**: Handle event acknowledgment
- **Features**: Loading states, error handling, success feedback
- **API**: Calls `/inbox/{event_id}/acknowledge`

### ApiKeyManager Component

- **Purpose**: Manage API key configuration
- **Features**: Input validation, localStorage persistence, API key testing
- **Storage**: localStorage (browser)

## Configuration

### Environment Variables

- `VITE_API_ENDPOINT`: Base URL of the Zapier Triggers API
- `VITE_API_KEY`: Default API key (optional, can be set in UI)
- `VITE_POLL_INTERVAL`: Polling interval in milliseconds
- `VITE_DEFAULT_PAGE_SIZE`: Default number of events per page
- `VITE_ENABLE_POLLING`: Enable/disable automatic polling

### Configuration Loading

1. Environment variables (build-time)
2. localStorage (runtime, API key only)
3. Default values (fallback)

## Authentication

### API Key Management

- **Storage**: localStorage (browser)
- **Validation**: Health check endpoint
- **Format**: Bearer token in Authorization header
- **Scope**: Per-browser, not shared across devices

### Security Considerations

- API keys stored in browser localStorage (not secure for production)
- Consider implementing:
  - OAuth 2.0 / OpenID Connect
  - AWS Cognito integration
  - Server-side proxy for API calls

## Real-time Updates

### Polling Strategy

- **Interval**: Configurable (default: 5 seconds)
- **Implementation**: React Query `refetchInterval`
- **Optimization**: Only refetches when component is mounted
- **Alternative**: WebSockets or Server-Sent Events (not implemented)

## Error Handling

### Error Boundaries

- **Component**: ErrorBoundary
- **Purpose**: Catch React component errors
- **Display**: User-friendly error message with retry option

### API Error Handling

- **HTTP Errors**: Intercepted by Axios interceptor
- **Display**: Error messages in UI components
- **Retry**: Manual retry buttons, React Query automatic retry

## Performance Optimizations

1. **React Query Caching**: Reduces unnecessary API calls
2. **Pagination**: Load events in chunks
3. **Lazy Loading**: Components loaded on demand
4. **Code Splitting**: Vite automatic code splitting

## Deployment

### AWS Amplify

- **Build**: Automated via `amplify.yml`
- **Hosting**: Static files on S3 + CloudFront
- **CI/CD**: Automatic deployment on git push
- **Environment Variables**: Configured in Amplify Console

### Alternative Deployments

See `SWAPPING_IMPLEMENTATIONS.md` for alternatives.

## Future Enhancements

1. **Real-time Updates**: WebSockets or AppSync
2. **User Authentication**: AWS Cognito integration
3. **Event Filtering**: Advanced search and filters
4. **Bulk Operations**: Bulk acknowledge/delete
5. **Analytics**: Event statistics and charts
6. **Export**: CSV/JSON export functionality
