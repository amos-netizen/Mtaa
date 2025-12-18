# 📱 Mobile App Deployment Guide

## 🎯 **Overview**

Your mobile app is built with **Expo React Native** and can be deployed to:
- 📱 **Android** (Google Play Store)
- 🍎 **iOS** (Apple App Store)
- 🌐 **Web** (Optional)

---

## 🚀 **Deployment Options**

### **Option 1: EAS Build (Recommended - Modern Way)**

EAS (Expo Application Services) is the modern, recommended way to build and deploy Expo apps.

#### **Prerequisites:**
1. **Expo Account**: Sign up at https://expo.dev
2. **EAS CLI**: Install globally
   ```bash
   npm install -g eas-cli
   ```

#### **Step 1: Install EAS CLI**
```bash
cd apps/mobile
npm install -g eas-cli
```

#### **Step 2: Login to Expo**
```bash
eas login
```

#### **Step 3: Configure EAS**
```bash
eas build:configure
```

This creates an `eas.json` file with build configurations.

#### **Step 4: Update app.json**
Make sure your `app.json` has:
- ✅ Bundle identifier (iOS): `com.mtaa.app`
- ✅ Package name (Android): `com.mtaa.app`
- ✅ EAS project ID (will be generated)

#### **Step 5: Set Environment Variables**
Create `.env` file in `apps/mobile/`:
```env
EXPO_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
```

Or update `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://your-backend.onrender.com/api/v1"
    }
  }
}
```

#### **Step 6: Build for Android**
```bash
cd apps/mobile

# Build APK (for testing)
eas build --platform android --profile preview

# Build AAB (for Play Store)
eas build --platform android --profile production
```

#### **Step 7: Build for iOS**
```bash
cd apps/mobile

# Build for simulator (testing)
eas build --platform ios --profile preview

# Build for App Store
eas build --platform ios --profile production
```

#### **Step 8: Submit to Stores**

**Android (Play Store):**
```bash
eas submit --platform android
```

**iOS (App Store):**
```bash
eas submit --platform ios
```

---

### **Option 2: Classic Expo Build (Older Method)**

If you prefer the classic Expo build service:

#### **Step 1: Install Expo CLI**
```bash
npm install -g expo-cli
```

#### **Step 2: Login**
```bash
expo login
```

#### **Step 3: Build**
```bash
cd apps/mobile

# Android APK
expo build:android

# iOS (requires Apple Developer account)
expo build:ios
```

---

## 📋 **Detailed Steps for EAS Build**

### **1. Initial Setup**

```bash
cd apps/mobile

# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Initialize EAS
eas build:configure
```

### **2. Create eas.json**

After running `eas build:configure`, you'll get an `eas.json` file. Here's a recommended configuration:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "bundleIdentifier": "com.mtaa.app"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### **3. Update app.json**

Ensure your `app.json` has all required fields:

```json
{
  "expo": {
    "name": "Mtaa",
    "slug": "mtaa-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0ea5e9"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mtaa.app",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0ea5e9"
      },
      "package": "com.mtaa.app",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      },
      "apiUrl": "https://your-backend.onrender.com/api/v1"
    }
  }
}
```

### **4. Create Assets**

Make sure you have these assets in `apps/mobile/assets/`:
- `icon.png` (1024x1024)
- `splash.png` (1242x2436)
- `adaptive-icon.png` (1024x1024, Android)
- `favicon.png` (48x48, Web)

### **5. Build Commands**

```bash
cd apps/mobile

# Development build (for testing)
eas build --profile development --platform android
eas build --profile development --platform ios

# Preview build (APK for Android, Simulator for iOS)
eas build --profile preview --platform android
eas build --profile preview --platform ios

# Production build (for stores)
eas build --profile production --platform android
eas build --profile production --platform ios
```

---

## 🍎 **iOS Deployment (App Store)**

### **Prerequisites:**
1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com
2. **Xcode** (for local builds, optional with EAS)

### **Steps:**

1. **Get EAS Project ID:**
   ```bash
   eas init
   ```

2. **Build for iOS:**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Submit to App Store:**
   ```bash
   eas submit --platform ios
   ```

   Or manually:
   - Download the `.ipa` file from Expo
   - Use Transporter app or Xcode to upload

4. **App Store Connect:**
   - Go to https://appstoreconnect.apple.com
   - Create your app
   - Fill in app information
   - Submit for review

---

## 🤖 **Android Deployment (Play Store)**

### **Prerequisites:**
1. **Google Play Developer Account** ($25 one-time)
   - Sign up at https://play.google.com/console

### **Steps:**

1. **Build for Android:**
   ```bash
   eas build --platform android --profile production
   ```

2. **Submit to Play Store:**
   ```bash
   eas submit --platform android
   ```

   Or manually:
   - Download the `.aab` file from Expo
   - Upload to Google Play Console

3. **Play Console:**
   - Go to https://play.google.com/console
   - Create your app
   - Fill in store listing
   - Upload AAB file
   - Submit for review

---

## 🔧 **Environment Configuration**

### **Update API URL**

**Option 1: Environment Variable**
Create `apps/mobile/.env`:
```env
EXPO_PUBLIC_API_URL=https://mtaa-16.onrender.com/api/v1
```

**Option 2: app.json**
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://mtaa-16.onrender.com/api/v1"
    }
  }
}
```

The mobile app will use this in `src/lib/api/client.ts`.

---

## 📦 **Build Profiles Explained**

### **Development:**
- For testing with Expo Go or development client
- Fast builds
- Internal distribution

### **Preview:**
- APK for Android (easy to share)
- Simulator build for iOS
- For testing before production

### **Production:**
- AAB for Android (required for Play Store)
- App Store build for iOS
- Optimized and signed

---

## 🧪 **Testing Before Deployment**

### **1. Local Testing:**
```bash
cd apps/mobile
npm run dev
# Scan QR code with Expo Go app
```

### **2. Preview Build:**
```bash
# Android APK
eas build --platform android --profile preview

# Download and install APK on Android device
```

### **3. TestFlight (iOS):**
```bash
# Build for TestFlight
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios
```

---

## 📝 **Checklist Before Deployment**

### **App Configuration:**
- [ ] App name set correctly
- [ ] Bundle identifier unique (com.mtaa.app)
- [ ] Version number set
- [ ] Icon and splash screen added
- [ ] API URL configured
- [ ] EAS project ID set

### **Build:**
- [ ] EAS CLI installed and logged in
- [ ] eas.json configured
- [ ] Build successful
- [ ] App tested on device

### **Store Submission:**
- [ ] App Store/Play Store account ready
- [ ] App description written
- [ ] Screenshots prepared
- [ ] Privacy policy URL (if required)
- [ ] Terms of service URL (if required)

---

## 🚨 **Common Issues & Solutions**

### **Issue: "EAS project ID not found"**
**Solution:**
```bash
eas init
# This will create/update the project ID in app.json
```

### **Issue: "Build fails"**
**Solution:**
- Check `eas.json` configuration
- Verify all dependencies in `package.json`
- Check build logs on Expo dashboard

### **Issue: "API not connecting"**
**Solution:**
- Verify `EXPO_PUBLIC_API_URL` is set
- Check backend CORS settings
- Ensure backend is accessible

### **Issue: "App crashes on startup"**
**Solution:**
- Check console logs
- Verify all assets exist
- Test with `expo start` first

---

## 📚 **Resources**

- **Expo Docs**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Submit**: https://docs.expo.dev/submit/introduction/
- **App Store Guide**: https://docs.expo.dev/submit/ios/
- **Play Store Guide**: https://docs.expo.dev/submit/android/

---

## 🎯 **Quick Start Commands**

```bash
# Setup
cd apps/mobile
npm install -g eas-cli
eas login
eas build:configure

# Build
eas build --platform android --profile production
eas build --platform ios --profile production

# Submit
eas submit --platform android
eas submit --platform ios
```

---

## ✅ **Status**

Your mobile app is ready for deployment! Just follow the steps above.

**Recommended:** Start with EAS Build for the easiest deployment experience.

---

**Need help?** Check Expo documentation or Expo Discord community.

