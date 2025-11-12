# Local Testing Guide

## Prerequisites

1. **Node.js 18+** installed
2. **npm** (comes with Node.js)

## Setup Instructions

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment (Optional)

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
# Edit .env if needed
```

The default API endpoint is already configured to point to the production API.

### Step 3: Start Development Server

```bash
npm run dev
```

The dashboard will be available at: **http://localhost:3001**

## Troubleshooting

### Node.js Library Issues

If you encounter `Library not loaded: /usr/local/opt/icu4c/lib/libicui18n.69.dylib`:

**Option 1: Reinstall Node.js via Homebrew**
```bash
brew uninstall node
brew install node
```

**Option 2: Use nvm (Node Version Manager)**
```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 18
nvm install 18
nvm use 18

# Then try npm install again
cd frontend
npm install
npm run dev
```

**Option 3: Use system Node.js**
```bash
# Check if system Node.js is available
/usr/bin/node --version

# If available, use it directly
/usr/bin/npm install
/usr/bin/npm run dev
```

### Port Already in Use

If port 3001 is already in use:

1. **Change the port** in `frontend/vite.config.ts`:
   ```typescript
   server: {
     port: 3002, // or any other port
   }
   ```

2. **Or kill the process using port 3001**:
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

## Testing the Dashboard

1. **Open browser**: Navigate to http://localhost:3001

2. **Enter API Key**:
   - Get your API key from AWS Secrets Manager:
     ```bash
     aws secretsmanager get-secret-value \
       --secret-id alexho/zapier-triggers/api-keys \
       --region us-east-1 \
       --query SecretString \
       --output text | python3 -c "import sys, json; data=json.load(sys.stdin); print(list(data.values())[-1])"
     ```
   - Or use the generation script from the API repository

3. **Test Features**:
   - View events in the inbox
   - Filter by status
   - Acknowledge events
   - Test pagination
   - Verify real-time polling

## API Endpoint

The dashboard connects to:
- **Production API**: `https://k6peopo7ve.execute-api.us-east-1.amazonaws.com/prod`

To change the API endpoint, update `VITE_API_ENDPOINT` in `.env` file.

## Build for Production

To build the production version:

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/` directory.

