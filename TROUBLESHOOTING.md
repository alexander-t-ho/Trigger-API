# Dashboard Troubleshooting Guide

## Common Issues and Solutions

### CORS Errors

**Symptom**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**: 
- The API has been configured with proper CORS headers
- Ensure you're using the correct API endpoint: `https://crad1ucoc2.execute-api.us-east-1.amazonaws.com/prod`
- If issues persist, check that the API has been redeployed with the latest CORS configuration

### API Key Validation Fails

**Symptom**: "Network error: Unable to connect to the API" or "Unauthorized" error

**Solutions**:
1. **Verify API key is correct**:
   ```bash
   # Get your API key from AWS Secrets Manager
   aws secretsmanager get-secret-value \
     --secret-id alexho/zapier-triggers/api-keys \
     --region us-east-1 \
     --query SecretString \
     --output text | python3 -c "import sys, json; data=json.load(sys.stdin); print(list(data.values())[-1])"
   ```

2. **Test API key directly**:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://crad1ucoc2.execute-api.us-east-1.amazonaws.com/prod/health
   ```

3. **Check browser console** for detailed error messages
4. **Clear localStorage** and re-enter the API key

### Events Not Loading

**Symptom**: Event list is empty or shows "No events found"

**Solutions**:
1. **Check API key is set** and validated
2. **Verify events exist** in DynamoDB:
   ```bash
   aws dynamodb scan \
     --table-name alexho-zapier-triggers-events \
     --region us-east-1 \
     --limit 5
   ```

3. **Check browser console** for API errors
4. **Try refreshing** the page or clicking the "Refresh" button
5. **Check status filter** - make sure you're not filtering out all events

### Polling Not Working

**Symptom**: Events don't update automatically

**Solutions**:
1. **Check polling is enabled** in configuration
2. **Verify browser tab is active** - polling pauses when tab is inactive
3. **Check browser console** for errors
4. **Manually refresh** using the Refresh button

### Build Errors

**Symptom**: `npm run build` fails

**Solutions**:
1. **Clear node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version** (requires 18+):
   ```bash
   node --version
   ```

3. **Update dependencies**:
   ```bash
   npm update
   ```

### Port Already in Use

**Symptom**: `Error: Port 3001 is already in use`

**Solutions**:
1. **Kill the process using port 3001**:
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. **Change the port** in `vite.config.ts`:
   ```typescript
   server: {
     port: 3002, // or any other available port
   }
   ```

### API Endpoint Not Found

**Symptom**: "Network error" or "404 Not Found"

**Solutions**:
1. **Verify API endpoint** is correct in `frontend/src/config/config.ts`
2. **Check API is deployed**:
   ```bash
   aws cloudformation describe-stacks \
     --stack-name alexho-zapier-triggers-api-staging \
     --region us-east-1 \
     --query 'Stacks[0].Outputs[?OutputKey==`APIEndpoint`].OutputValue' \
     --output text
   ```

3. **Test API endpoint directly**:
   ```bash
   curl https://crad1ucoc2.execute-api.us-east-1.amazonaws.com/prod/health
   ```

## Debugging Tips

### Enable Detailed Logging

The dashboard includes detailed console logging. Open browser DevTools (F12) and check the Console tab for:
- API request/response details
- Error messages with full context
- Network request information

### Check Network Tab

In browser DevTools → Network tab:
1. Filter by "health" or "inbox" to see API requests
2. Check request headers (Authorization should be present)
3. Check response status and body
4. Look for CORS errors in red

### Test API Directly

Use curl or Postman to test the API independently:
```bash
# Health check
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://crad1ucoc2.execute-api.us-east-1.amazonaws.com/prod/health

# Get inbox
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://crad1ucoc2.execute-api.us-east-1.amazonaws.com/prod/inbox

# Acknowledge event
curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  https://crad1ucoc2.execute-api.us-east-1.amazonaws.com/prod/inbox/EVENT_ID/acknowledge
```

## Getting Help

If you encounter issues not covered here:

1. **Check the logs**:
   - Browser console (F12)
   - CloudWatch logs for Lambda functions
   - API Gateway logs

2. **Verify configuration**:
   - API endpoint URL
   - API key validity
   - Environment variables

3. **Review documentation**:
   - [Architecture](./docs/ARCHITECTURE.md)
   - [Deployment](./docs/DEPLOYMENT.md)
   - [API Documentation](../Zapier%20Triggers%20API/docs/API.md)

4. **Test with minimal setup**:
   - Use curl to test API directly
   - Check if issue is browser-specific
   - Try in incognito/private mode

