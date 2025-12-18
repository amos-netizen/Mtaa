# ⚡ Quick Mobile Deployment

## 🚀 **Fastest Way to Deploy**

### **1. Install EAS CLI**
```bash
npm install -g eas-cli
```

### **2. Login**
```bash
cd apps/mobile
eas login
```

### **3. Configure**
```bash
eas build:configure
```

### **4. Update API URL**

Edit `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://mtaa-16.onrender.com/api/v1"
    }
  }
}
```

### **5. Build**
```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

### **6. Submit**
```bash
# Android
eas submit --platform android

# iOS
eas submit --platform ios
```

---

## 📱 **That's It!**

Your app will be built and submitted to the stores automatically.

See `MOBILE_DEPLOYMENT.md` for detailed instructions.

