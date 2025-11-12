# Zapier Triggers Dashboard

A modern, responsive dashboard for viewing and managing events from the Zapier Triggers API.

## Features

- View events from the Zapier Triggers API inbox
- Acknowledge events with a single click
- Filter events by status
- Real-time polling for new events
- Pagination support
- Responsive design

## Architecture

This dashboard is built as a **disconnected microservice** that communicates with the Zapier Triggers API via REST. It's designed to be easily swappable with alternative implementations.

### Key Design Principles

- **Disconnected**: Separate repository, minimal coupling to API
- **API-driven**: Uses existing REST endpoints
- **Configurable**: API endpoint via environment variables
- **Swappable**: Easy to replace with alternative implementations

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Data Fetching**: React Query
- **Date Formatting**: date-fns
- **Hosting**: AWS Amplify

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- API key from Zapier Triggers API

### Local Development

1. **Clone and install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API endpoint**:
   ```bash
   cp .env.example .env
   # Edit .env and set VITE_API_ENDPOINT and VITE_API_KEY
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to `http://localhost:5173`

### Building for Production

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`.

## Configuration

The dashboard uses environment variables for configuration:

- `VITE_API_ENDPOINT`: Base URL of the Zapier Triggers API (default: production endpoint)
- `VITE_API_KEY`: API key for authentication (optional, can be entered in UI)

See `frontend/.env.example` for more details.

## Deployment

See `docs/DEPLOYMENT.md` for detailed deployment instructions to AWS Amplify.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - Design decisions and architecture
- [Deployment](./docs/DEPLOYMENT.md) - Deployment guide
- [Swapping Implementations](./docs/SWAPPING_IMPLEMENTATIONS.md) - How to swap with alternatives

## Project Structure

```
zapier-triggers-dashboard/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API service layer
│   │   ├── config/       # Configuration
│   │   └── App.tsx       # Main app component
│   └── package.json
├── docs/                 # Documentation
└── README.md
```

## License

MIT
