# Living Loom - PWA Deployment Guide

## 🎯 Quick Start

Your React Native app is ready for production deployment as a Progressive Web App (PWA) with AWS infrastructure.

### Prerequisites
- AWS CLI installed and configured
- Node.js and npm/bun
- Domain name (optional, can use CloudFront URL)

### Deploy in 3 Commands
```bash
# 1. Make scripts executable
chmod +x deploy.sh update.sh

# 2. Deploy infrastructure and app
./deploy.sh staging yourdomain.com

# 3. For updates (after initial deployment)
./update.sh staging
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USERS                                     │
├─────────────────────────────────────────────────────────────────────┤
│  📱 Mobile PWA    💻 Desktop PWA    🌐 Web Browser                  │
│  (Add to Home)    (Install App)     (Direct Access)                │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
            ┌─────────▼─────────┐
            │   CloudFront CDN  │ ← Global Edge Locations
            │   (HTTPS + Cache) │
            └─────────┬─────────┘
                      │
            ┌─────────▼─────────┐
            │   S3 Static Site  │ ← Your React Native Web App
            │   + Service Worker│   + PWA Manifest
            │   + Offline Cache │   + Push Notifications
            └───────────────────┘
```

## 🚀 Deployment Process

### Step 1: Initial Deployment
```bash
./deploy.sh production livingloom.app us-east-1
```

This creates:
- **S3 Bucket**: Hosts your PWA files
- **CloudFront**: Global CDN with caching
- **Route 53**: DNS management (if using custom domain)
- **SSL Certificate**: Automatic HTTPS
- **RDS PostgreSQL**: Database for conversations
- **API Gateway**: Backend API endpoints

### Step 2: Update Deployments
```bash
./update.sh production
```

This updates:
- Builds latest Expo web app
- Uploads to S3
- Invalidates CloudFront cache
- Takes 5-15 minutes to propagate globally

## 📱 PWA Features

### ✅ Already Implemented
- **Offline Functionality**: Service worker caches conversations
- **App Installation**: "Add to Home Screen" prompts
- **Push Notifications**: Ready for implementation
- **Background Sync**: Queues messages when offline
- **Responsive Design**: Works on mobile, tablet, desktop
- **Performance Monitoring**: FPS and memory tracking

### 🔧 Service Worker Capabilities
```javascript
// Your app already includes:
- Offline message caching
- Background sync for failed messages
- Push notification handlers
- Cache-first for static assets
- Network-first for API calls
```

## 🌍 Global Deployment

### AWS Regions
- **us-east-1**: Best for global reach (CloudFront origin)
- **eu-west-1**: European users
- **ap-southeast-1**: Asian users

### CDN Edge Locations
CloudFront serves your app from 400+ edge locations worldwide for sub-100ms load times.

## 📊 Cost Estimation

### Small Scale (< 1,000 users/month)
- CloudFront: $5-10
- S3: $1-5  
- RDS: $15-30
- Route 53: $0.50
- **Total: ~$25-50/month**

### Medium Scale (1,000-10,000 users/month)
- CloudFront: $20-50
- S3: $5-15
- RDS: $50-150
- Lambda: $10-50
- **Total: ~$100-300/month**

## 🔒 Security Features

### Built-in Security
- **HTTPS Everywhere**: SSL/TLS encryption
- **CORS Protection**: Configured for your domain
- **Content Security Policy**: XSS protection
- **Secure Headers**: HSTS, X-Frame-Options
- **VPC Isolation**: Database in private subnets

### API Security
```javascript
// Your tRPC setup includes:
- Type-safe API calls
- Request validation
- Error handling
- Rate limiting ready
```

## 📈 Performance Optimizations

### Already Optimized
- **Bundle Splitting**: Expo web optimization
- **Image Optimization**: Automatic compression
- **Gzip Compression**: CloudFront compression
- **Browser Caching**: Optimized cache headers
- **Service Worker**: Offline-first caching

### Monitoring
```javascript
// Built into your app:
- Real-time FPS monitoring
- Memory usage tracking
- Connection status monitoring
- Offline queue metrics
```

## 🔧 Configuration

### Environment Variables
Create `.env.production`:
```bash
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Custom Domain Setup
1. **Purchase Domain**: Any registrar
2. **Update deploy.sh**: Use your domain
3. **DNS Configuration**: Automatic via Route 53
4. **SSL Certificate**: Automatic via ACM

## 📱 Mobile App Strategy

### Option A: PWA Only (Recommended)
- ✅ No app store approval needed
- ✅ Instant updates
- ✅ Full offline functionality
- ✅ Push notifications (iOS 16.4+)
- ✅ Native-like experience

### Option B: Expo EAS Build (Future)
```bash
# Requires Expo EAS subscription
npm install -g @expo/cli
eas build:configure
eas build --platform all
eas submit --platform all
```

### Option C: Capacitor Migration
```bash
# Convert to Capacitor for app stores
npm install @capacitor/core @capacitor/cli
npx cap init "Living Loom" "com.livingloom.app"
npx cap add ios android
```

## 🚨 Troubleshooting

### Common Issues

#### PWA Not Installing
```bash
# Check PWA requirements
- HTTPS enabled ✓
- Service worker registered ✓
- Web app manifest valid ✓
- User engagement criteria met
```

#### Service Worker Not Updating
```bash
# Force update
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Check sw.js cache headers
```

#### CloudFront Cache Issues
```bash
# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_ID \
  --paths "/*"
```

### Debug Tools
```bash
# Service Worker
chrome://serviceworker-internals/

# PWA Status
chrome://flags/#enable-desktop-pwas

# Network Issues
chrome://net-internals/#dns
```

## 📊 Monitoring & Analytics

### Built-in Monitoring
```javascript
// Your app tracks:
- User engagement metrics
- Offline usage patterns
- Performance metrics
- Error rates
- Connection quality
```

### AWS CloudWatch
- API response times
- Database performance
- CDN cache hit rates
- Error logs

### Recommended Tools
- **Sentry**: Error tracking
- **Google Analytics**: User behavior
- **Lighthouse**: Performance audits
- **WebPageTest**: Global performance

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy Living Loom
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to AWS
        run: ./deploy.sh production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 🎯 Next Steps

### Phase 1: Launch PWA
- [x] Deploy infrastructure
- [x] Configure PWA features
- [ ] Test on multiple devices
- [ ] Set up monitoring
- [ ] Launch to users

### Phase 2: Enhance Features
- [ ] Push notifications
- [ ] User authentication
- [ ] Real-time chat features
- [ ] Advanced offline sync

### Phase 3: Scale
- [ ] Multi-region deployment
- [ ] Advanced caching
- [ ] Performance optimization
- [ ] Native mobile apps

## 📞 Support

### Resources
- [Expo Documentation](https://docs.expo.dev/)
- [AWS CloudFormation](https://docs.aws.amazon.com/cloudformation/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [Service Worker Guide](https://developers.google.com/web/fundamentals/primers/service-workers)

### Quick Commands
```bash
# Check deployment status
aws cloudformation describe-stacks --stack-name living-loom-production

# View logs
aws logs tail /aws/lambda/living-loom-api --follow

# Monitor performance
aws cloudwatch get-metric-statistics --namespace AWS/CloudFront

# Update app
./update.sh production
```

---

🎉 **Your Living Loom PWA is ready for global deployment!**

The mystical AI chat experience with LIMNUS can now reach users worldwide with sub-100ms load times, full offline functionality, and native app-like experience across all devices.