# Swapping Implementations Guide

This guide explains how to swap the dashboard implementation with alternatives, maintaining the same API integration.

## Design Philosophy

The dashboard is designed to be **implementation-agnostic**:
- API communication via REST (standard HTTP)
- Configuration via environment variables
- No framework-specific API dependencies
- Clear separation of concerns

## What Can Be Swapped

### 1. Frontend Framework

#### Current: React

**Swap to Vue.js**:
```bash
# Create new Vue project
npm create vue@latest zapier-triggers-dashboard-vue

# Copy API service layer
cp frontend/src/services/api.ts <vue-project>/src/services/
cp frontend/src/types/event.ts <vue-project>/src/types/
cp frontend/src/config/config.ts <vue-project>/src/config/

# Adapt components to Vue syntax
# Use Vue's composition API or options API
```

**Swap to Angular**:
```bash
# Create new Angular project
ng new zapier-triggers-dashboard-angular

# Copy API service layer
cp frontend/src/services/api.ts <angular-project>/src/app/services/
cp frontend/src/types/event.ts <angular-project>/src/app/types/
cp frontend/src/config/config.ts <angular-project>/src/app/config/

# Adapt to Angular services and components
```

**Swap to Svelte**:
```bash
# Create new Svelte project
npm create svelte@latest zapier-triggers-dashboard-svelte

# Copy and adapt API service layer
```

### 2. Hosting Platform

#### Current: AWS Amplify

**Swap to Vercel**:
1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:
   ```json
   {
     "buildCommand": "cd frontend && npm run build",
     "outputDirectory": "frontend/dist",
     "framework": "vite"
   }
   ```
3. Deploy: `vercel`
4. Set environment variables in Vercel dashboard

**Swap to Netlify**:
1. Create `netlify.toml`:
   ```toml
   [build]
     command = "cd frontend && npm run build"
     publish = "frontend/dist"
   ```
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard

**Swap to S3 + CloudFront**:
1. Build: `cd frontend && npm run build`
2. Upload to S3: `aws s3 sync frontend/dist s3://your-bucket-name`
3. Configure CloudFront distribution
4. Set up CI/CD for automatic deployments

**Swap to GitHub Pages**:
1. Install `gh-pages`: `npm install -D gh-pages`
2. Add to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "cd frontend && npm run build && gh-pages -d dist"
     }
   }
   ```
3. Deploy: `npm run deploy`

### 3. Build Tool

#### Current: Vite

**Swap to Create React App**:
- Already uses React, minimal changes needed
- Update build scripts in `package.json`

**Swap to Webpack**:
- More configuration required
- Update `webpack.config.js` for Vite-specific features

**Swap to Parcel**:
- Minimal configuration
- Update build scripts

### 4. State Management

#### Current: React Query

**Swap to Redux**:
```typescript
// Install Redux Toolkit
npm install @reduxjs/toolkit react-redux

// Create store and slices
// Replace React Query hooks with Redux actions
```

**Swap to Zustand**:
```typescript
// Install Zustand
npm install zustand

// Create stores
// Replace React Query with Zustand stores
```

**Swap to MobX**:
```typescript
// Install MobX
npm install mobx mobx-react-lite

// Create stores
// Replace React Query with MobX observables
```

### 5. HTTP Client

#### Current: Axios

**Swap to Fetch API**:
```typescript
// Replace axios with native fetch
const response = await fetch(`${baseURL}/inbox`, {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
});
```

**Swap to ky**:
```typescript
// Install ky
npm install ky

// Replace axios with ky
import ky from 'ky';
const response = await ky.get(`${baseURL}/inbox`, {
  headers: { 'Authorization': `Bearer ${apiKey}` },
});
```

## Configuration Points

All implementations should support these configuration points:

### 1. API Endpoint

**Environment Variable**: `VITE_API_ENDPOINT` (or framework equivalent)

**Default**: `https://k6peopo7ve.execute-api.us-east-1.amazonaws.com/prod`

**Usage**: Base URL for all API calls

### 2. API Key

**Storage**: localStorage (or framework equivalent)

**Key**: `zapier_api_key`

**Usage**: Bearer token in Authorization header

### 3. Polling Configuration

**Environment Variables**:
- `VITE_POLL_INTERVAL`: Polling interval in milliseconds
- `VITE_ENABLE_POLLING`: Enable/disable polling

## API Service Interface

Any implementation should provide these methods:

```typescript
interface ZapierTriggersAPI {
  getHealth(): Promise<HealthResponse>;
  getInbox(limit: number, cursor?: string, status?: EventStatus): Promise<InboxResponse>;
  acknowledgeEvent(eventId: string): Promise<AcknowledgeResponse>;
  deleteEvent(eventId: string): Promise<void>;
  ingestEvent(eventType: string, source: string, payload: Record<string, any>): Promise<EventResponse>;
}
```

## Migration Checklist

When swapping implementations:

- [ ] Copy API service layer (`api.ts`)
- [ ] Copy TypeScript types (`types/event.ts`)
- [ ] Copy configuration (`config/config.ts`)
- [ ] Adapt components to new framework
- [ ] Update build configuration
- [ ] Update deployment configuration
- [ ] Test API integration
- [ ] Update documentation
- [ ] Set environment variables
- [ ] Test in production-like environment

## Example: Vue.js Migration

### Step 1: Create Vue Project

```bash
npm create vue@latest zapier-triggers-dashboard-vue
cd zapier-triggers-dashboard-vue
npm install axios @tanstack/vue-query date-fns
```

### Step 2: Copy Core Files

```bash
# Copy API service (minimal changes needed)
cp ../zapier-triggers-dashboard/frontend/src/services/api.ts src/services/
cp ../zapier-triggers-dashboard/frontend/src/types/event.ts src/types/
cp ../zapier-triggers-dashboard/frontend/src/config/config.ts src/config/
```

### Step 3: Create Vue Components

```vue
<!-- EventList.vue -->
<template>
  <div class="event-list">
    <EventCard
      v-for="event in events"
      :key="event.event_id"
      :event="event"
      @acknowledged="handleAcknowledged"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/services/api';
import EventCard from './EventCard.vue';

const { data } = useQuery({
  queryKey: ['inbox'],
  queryFn: () => api.getInbox(100),
});
</script>
```

### Step 4: Update Configuration

```typescript
// config.ts - Update for Vite (same as React)
export const config = {
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT || '...',
  // ...
};
```

## Benefits of This Design

1. **Flexibility**: Easy to try different frameworks
2. **Maintainability**: Clear separation of concerns
3. **Testability**: API layer can be tested independently
4. **Scalability**: Can evolve without breaking changes
5. **Team Preferences**: Different teams can use preferred tools

## Recommendations

1. **Keep API service layer framework-agnostic**
2. **Use TypeScript for type safety**
3. **Maintain consistent API interface**
4. **Document configuration requirements**
5. **Test API integration thoroughly**

## Support

For questions about swapping implementations:
1. Check framework-specific documentation
2. Review API service layer code
3. Test with API directly (using curl or Postman)
4. Consult framework migration guides

