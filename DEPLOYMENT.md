# Living Loom PWA + Capacitor Deployment Guide

## Overview
Your React Native app is now ready for PWA deployment with Capacitor for app store distribution. This guide covers the complete deployment process.

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │   iOS App    │    │ Android App  │    │  Web Browser │         │
│  │ (Capacitor)  │    │ (Capacitor)  │    │    (PWA)     │         │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘         │
│         └────────────────────┴────────────────────┘                 │
│                              │                                       │
│                    ┌─────────▼─────────┐                           │
│                    │   React PWA       │                           │
│                    │ (Your Expo App)   │                           │
│                    └─────────┬─────────┘                           │
└─────────────────────────────┼─────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   CloudFront CDN  │ ← Static Assets
                    └─────────┬─────────┘
                              │
┌─────────────────────────────┼─────────────────────────────────────┐
│                         AWS CLOUD                                   │
├─────────────────────────────┼─────────────────────────────────────┤
│                    ┌─────────▼─────────┐                           │
│                    │   Your Backend    │                           │
│                    │   (Hono + tRPC)   │                           │
│                    └───────────────────┘                           │
└─────────────────────────────────────────────────────────────────────┘
```

## Step 1: PWA Features Added

### ✅ Service Worker (`public/sw.js`)
- **Offline Caching**: Caches conversations and messages
- **Background Sync**: Syncs offline messages when connection returns
- **Push Notifications**: Ready for future implementation
- **Cache Strategies**: Network-first for API, cache-first for static assets

### ✅ Web App Manifest (`public/manifest.json`)
- **App Installation**: "Add to Home Screen" prompt
- **Standalone Mode**: Runs without browser UI
- **App Icons**: Multiple sizes for different devices
- **Shortcuts**: Quick actions from home screen

### ✅ Offline Page (`public/offline.html`)
- **Branded Experience**: Maintains Living Loom aesthetic
- **Connection Monitoring**: Auto-reconnect when online
- **User Guidance**: Clear messaging about offline state

### ✅ Enhanced Chat Context
- **Service Worker Integration**: Registers and communicates with SW
- **Offline Queue**: Persistent message storage
- **Connection Monitoring**: Web and mobile network detection
- **Background Sync**: Automatic retry of failed messages

## Step 2: Mobile App Strategy (Expo Limitations)

### Current Limitation
Your app uses Expo Go, which doesn't support Capacitor plugins. You have three options:

### Option A: PWA-First Approach (Recommended)
```bash
# Deploy as PWA only
# Users install via "Add to Home Screen"
# Full offline functionality included
# No app store approval needed
```

### Option B: Expo EAS Build (Future)
```bash
# Requires Expo EAS subscription
npx install -g @expo/cli
npx eas build --platform all

# Builds standalone apps for stores
# Full native API access
# App store distribution
```

### Option C: Eject to Bare React Native + Capacitor
```bash
# WARNING: This is irreversible
npx expo eject

# Then follow Capacitor setup
npm install @capacitor/core @capacitor/cli
npx cap init "Living Loom" "com.livingloom.app"
```

## Step 3: AWS Deployment Architecture

### Frontend Hosting
```yaml
S3 Bucket: living-loom-web-app
├── Static Files: Built Expo web app
├── Service Worker: /sw.js
├── Manifest: /manifest.json
└── Offline Page: /offline.html

CloudFront Distribution:
├── Origin: S3 bucket
├── Custom Domain: app.livingloom.com
├── SSL Certificate: AWS Certificate Manager
├── Caching: Optimized for PWA assets
└── Compression: Gzip enabled
```

### Backend Services
```yaml
Your Existing Backend:
├── Hono Server: Already running
├── tRPC API: /api/trpc/*
├── Database: Your current setup
└── AI Integration: External API calls
```

## Step 4: Deployment Commands

### 1. Build and Deploy Web App
```bash
# Build Expo web app
npx expo export:web

# Upload to S3 (replace with your bucket)
aws s3 sync dist/ s3://living-loom-web-app --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 2. Build Mobile Apps (If using EAS)
```bash
# Configure EAS
npx eas build:configure

# Build for iOS
npx eas build --platform ios

# Build for Android
npx eas build --platform android

# Submit to stores
npx eas submit --platform all
```

## Step 5: App Store Submission

### iOS App Store
1. **Xcode Configuration**:
   - Set bundle identifier: `com.livingloom.app`
   - Configure app icons and launch screens
   - Set deployment target (iOS 13+)

2. **App Store Connect**:
   - Create app listing
   - Upload screenshots
   - Set app description and keywords
   - Submit for review

### Google Play Store
1. **Android Studio Configuration**:
   - Set package name: `com.livingloom.app`
   - Configure app icons and splash screens
   - Set minimum SDK version (API 21+)

2. **Play Console**:
   - Create app listing
   - Upload APK/AAB
   - Set store listing details
   - Submit for review

## Step 6: PWA Installation

### Web Installation
Users can install your PWA by:
1. **Chrome/Edge**: Click "Install" button in address bar
2. **Safari**: Share → Add to Home Screen
3. **Manual**: Browser menu → Install app

### Installation Prompt
Your app will automatically show install prompts when:
- User visits multiple times
- User engages with the app
- PWA criteria are met

## Step 7: Monitoring and Analytics

### Performance Monitoring
```javascript
// Already implemented in your app
- FPS tracking
- Memory usage monitoring
- Connection status tracking
- Offline queue metrics
```

### Service Worker Monitoring
```javascript
// Check service worker status
navigator.serviceWorker.ready.then(registration => {
  console.log('SW registered:', registration);
});
```

## Step 8: Future Enhancements

### Push Notifications
```javascript
// Service worker already has push notification handlers
// Add server-side push notification service
```

### Background Sync
```javascript
// Already implemented for offline messages
// Can extend for other background tasks
```

### App Shortcuts
```json
// Already configured in manifest.json
// Users can right-click app icon for quick actions
```

## Troubleshooting

### Common Issues
1. **Service Worker Not Updating**: Clear cache and hard refresh
2. **Offline Page Not Showing**: Check service worker registration
3. **PWA Not Installing**: Verify manifest.json and HTTPS
4. **Capacitor Build Errors**: Check native dependencies

### Debug Commands
```bash
# Check service worker
chrome://serviceworker-internals/

# Check PWA status
chrome://flags/#enable-desktop-pwas

# Capacitor logs
npx cap run ios --livereload
npx cap run android --livereload
```

## Production Checklist

### Before Deployment
- [ ] Test offline functionality
- [ ] Verify service worker caching
- [ ] Test PWA installation
- [ ] Check responsive design
- [ ] Validate manifest.json
- [ ] Test on multiple devices
- [ ] Performance audit with Lighthouse

### After Deployment
- [ ] Monitor service worker updates
- [ ] Track PWA installation metrics
- [ ] Monitor offline queue processing
- [ ] Check app store reviews
- [ ] Update app store listings

Your Living Loom app is now ready for production deployment as both a PWA and native mobile apps through Capacitor! 🚀