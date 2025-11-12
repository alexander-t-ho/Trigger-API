# Deployment Guide

This guide covers deploying the Zapier Triggers Dashboard to AWS Amplify.

## Prerequisites

- AWS Account with appropriate permissions
- Git repository (GitHub, GitLab, Bitbucket, or CodeCommit)
- Node.js 18+ (for local testing)
- AWS CLI (optional, for manual configuration)

## Deployment Options

### Option 1: AWS Amplify Console (Recommended)

#### Step 1: Prepare Repository

1. **Push code to Git repository**:
   ```bash
   cd zapier-triggers-dashboard
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

#### Step 2: Create Amplify App

1. **Open AWS Amplify Console**:
   - Navigate to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"

2. **Connect Repository**:
   - Choose your Git provider (GitHub, GitLab, Bitbucket, CodeCommit)
   - Authorize AWS Amplify to access your repository
   - Select the repository and branch (usually `main`)

3. **Configure Build Settings**:
   - Amplify should auto-detect the `amplify.yml` file
   - If not, use these build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - cd frontend
             - npm ci
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: frontend/dist
         files:
           - '**/*'
     ```

4. **Configure Environment Variables**:
   - Click "Advanced settings"
   - Add environment variables:
     ```
     VITE_API_ENDPOINT=https://k6peopo7ve.execute-api.us-east-1.amazonaws.com/prod
     VITE_POLL_INTERVAL=5000
     VITE_DEFAULT_PAGE_SIZE=100
     VITE_ENABLE_POLLING=true
     ```
   - **Note**: Do NOT set `VITE_API_KEY` here (users enter it in the UI)

5. **Review and Deploy**:
   - Review settings
   - Click "Save and deploy"
   - Wait for build to complete (5-10 minutes)

#### Step 3: Access Your Dashboard

- Once deployment completes, Amplify provides a URL like:
  ```
  https://main.xxxxxxxxxxxx.amplifyapp.com
  ```
- Click the URL to access your dashboard

### Option 2: AWS Amplify CLI

#### Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
```

#### Step 2: Initialize Amplify

```bash
cd zapier-triggers-dashboard
amplify init
```

Follow the prompts:
- Project name: `zapier-triggers-dashboard`
- Environment: `dev` or `prod`
- Default editor: Your preferred editor
- App type: `javascript`
- Framework: `react`
- Source directory: `frontend`
- Distribution directory: `frontend/dist`
- Build command: `cd frontend && npm run build`
- Start command: `cd frontend && npm run dev`

#### Step 3: Add Hosting

```bash
amplify add hosting
```

Choose:
- Hosting with Amplify Console
- Manual deployment

#### Step 4: Configure Environment Variables

```bash
amplify env add
```

Or set in Amplify Console after deployment.

#### Step 5: Deploy

```bash
amplify publish
```

## Environment Configuration

### Required Variables

- `VITE_API_ENDPOINT`: Base URL of the Zapier Triggers API
  - Production: `https://k6peopo7ve.execute-api.us-east-1.amazonaws.com/prod`
  - Staging: (if you have a staging environment)

### Optional Variables

- `VITE_POLL_INTERVAL`: Polling interval in milliseconds (default: 5000)
- `VITE_DEFAULT_PAGE_SIZE`: Default page size (default: 100)
- `VITE_ENABLE_POLLING`: Enable polling (default: true)

### Setting Variables in Amplify Console

1. Go to your Amplify app
2. Click "Environment variables" in the left sidebar
3. Click "Manage variables"
4. Add variables and click "Save"
5. Redeploy the app

## Custom Domain (Optional)

### Step 1: Add Domain in Amplify

1. In Amplify Console, go to "Domain management"
2. Click "Add domain"
3. Enter your domain name
4. Follow DNS configuration instructions

### Step 2: Configure DNS

- Add CNAME record as instructed by Amplify
- Wait for DNS propagation (can take up to 48 hours)

## Branch Deployments

Amplify automatically creates preview deployments for each branch:

1. **Main branch**: Production deployment
2. **Other branches**: Preview deployments with unique URLs

To configure:
1. Go to "App settings" → "Branch management"
2. Configure branch-specific environment variables if needed

## Monitoring

### Build Logs

- View build logs in Amplify Console
- Check for build errors or warnings

### Access Logs

- View access logs in CloudWatch
- Monitor API usage and errors

### Performance

- Use Amplify Console metrics
- Monitor page load times and errors

## Troubleshooting

### Build Failures

1. **Check build logs** in Amplify Console
2. **Verify Node.js version**: Ensure compatibility (18+)
3. **Check dependencies**: Ensure `package.json` is correct
4. **Verify amplify.yml**: Check build configuration

### API Connection Issues

1. **Verify API endpoint**: Check `VITE_API_ENDPOINT` is correct
2. **Check CORS**: Ensure API Gateway allows requests from Amplify domain
3. **Test API key**: Verify API key works in API directly

### Environment Variables Not Working

1. **Rebuild**: Environment variables are injected at build time
2. **Check syntax**: Ensure variable names start with `VITE_`
3. **Redeploy**: Changes require a new build

## Rollback

To rollback to a previous deployment:

1. Go to Amplify Console
2. Click on your app
3. Go to "Deployments"
4. Find the deployment you want to rollback to
5. Click "Redeploy this version"

## CI/CD Integration

Amplify automatically deploys on:
- Push to connected branch
- Manual trigger in console
- Scheduled deployments (if configured)

To disable auto-deploy:
1. Go to "App settings" → "General"
2. Disable "Auto-deploy"

## Cost Estimation

AWS Amplify hosting costs:
- **Free tier**: 15 GB storage, 5 GB served per month
- **Paid**: $0.15 per GB served, $0.023 per GB stored
- **Estimated cost**: ~$5-20/month for moderate traffic

## Security Best Practices

1. **Don't commit API keys**: Use environment variables
2. **Enable HTTPS**: Amplify provides SSL certificates automatically
3. **Configure CORS**: Restrict API access to your domain
4. **Use IAM roles**: For Amplify service role
5. **Monitor access**: Review CloudWatch logs regularly

## Next Steps

After deployment:
1. Test all functionality
2. Configure custom domain (optional)
3. Set up monitoring and alerts
4. Document the dashboard URL for users
5. Consider adding authentication (Cognito)

