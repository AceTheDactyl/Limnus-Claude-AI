# 🚀 Living Loom Deployment Guide

## Prerequisites

1. **AWS CLI installed and configured**
   ```bash
   # Install AWS CLI (macOS)
   brew install awscli
   
   # Or Ubuntu/Linux
   sudo apt-get install awscli
   
   # Configure with your credentials
   aws configure
   ```

2. **Domain name ready** (optional but recommended)
   - You can use any domain you own
   - The script will create Route 53 hosted zone and SSL certificates

## Quick Deploy

### 1. Deploy to Staging
```bash
chmod +x deploy.sh
./deploy.sh staging yourdomain.com
```

### 2. Deploy to Production
```bash
./deploy.sh production yourdomain.com us-east-1
```

## What Gets Deployed

### Infrastructure (AWS CloudFormation)
- **S3 Bucket**: Static web hosting for your PWA
- **CloudFront CDN**: Global content delivery with HTTPS
- **Route 53**: DNS management and SSL certificates
- **RDS PostgreSQL**: Database for conversations and messages
- **API Gateway**: REST API endpoints
- **Lambda Functions**: Serverless backend processing
- **VPC & Security Groups**: Secure network configuration

### Application
- **PWA Build**: Expo web export optimized for production
- **Service Worker**: Offline functionality and caching
- **Manifest**: PWA installation and app-like experience

## Cost Estimate

### Staging Environment
- **S3**: ~$1-5/month (depending on usage)
- **CloudFront**: ~$1-10/month (first 1TB free)
- **RDS (db.t3.micro)**: ~$15/month
- **Route 53**: ~$0.50/month per hosted zone
- **Lambda**: Free tier covers most usage
- **Total**: ~$20-30/month

### Production Environment
- **S3**: ~$5-15/month
- **CloudFront**: ~$10-50/month (depending on traffic)
- **RDS (db.t3.small)**: ~$30/month
- **Route 53**: ~$0.50/month
- **Lambda**: ~$5-20/month (depending on usage)
- **Total**: ~$50-100/month

## Post-Deployment Steps

### 1. Update Backend Configuration
After deployment, update your backend to use the new database:

```typescript
// In your backend/hono.ts or database config
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://livingloom:PASSWORD@ENDPOINT:5432/postgres'
```

### 2. Test PWA Installation
1. Visit your deployed URL in Chrome/Edge
2. Look for "Install" button in address bar
3. Test offline functionality
4. Verify push notifications (if implemented)

### 3. Configure Custom Domain (if using)
The script automatically creates Route 53 records, but you may need to:
1. Update your domain registrar's nameservers to point to Route 53
2. Wait for DNS propagation (up to 48 hours)

### 4. Monitor Your Application
- Check CloudWatch logs for errors
- Monitor RDS performance
- Set up billing alerts

## Troubleshooting

### Build Fails
```bash
# Clear Expo cache
npx expo start --clear

# Rebuild
npx expo export --platform web
```

### AWS Deployment Fails
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name living-loom-staging
```

### Database Connection Issues
1. Check security groups allow Lambda access
2. Verify database endpoint in deployment-info.json
3. Test connection from Lambda function

## Security Notes

- Database password is auto-generated and stored in `deployment-info.json`
- Keep `deployment-info.json` secure and never commit to git
- SSL certificates are automatically provisioned via ACM
- All traffic is HTTPS-only via CloudFront

## Updating Your App

To deploy updates:
```bash
# Build new version
npx expo export --platform web

# Deploy (reuses existing infrastructure)
./deploy.sh staging yourdomain.com
```

The script will:
1. Upload new files to S3
2. Invalidate CloudFront cache
3. Your users get the update immediately

## Rollback

To rollback to a previous version:
```bash
# List S3 versions (if versioning enabled)
aws s3api list-object-versions --bucket your-bucket-name

# Or redeploy from a previous git commit
git checkout previous-commit
./deploy.sh staging yourdomain.com
```