# 🚀 Complete Setup Instructions - Real-World Services Feature

## ✅ **All Code is Ready!**

The feature is fully implemented. You just need to run the database migration and seed script.

---

## 🎯 **Quick Setup (Recommended)**

### **Option 1: Automated Script**

```bash
cd apps/backend
./scripts/setup-places.sh
```

This script will:
- ✅ Check for DATABASE_URL
- ✅ Generate Prisma Client
- ✅ Run database migration
- ✅ Seed places data
- ✅ Verify setup

---

### **Option 2: Manual Steps**

#### **Step 1: Set Database Connection**

Make sure your `DATABASE_URL` is set in `.env.local` or `.env`:

```bash
cd apps/backend

# Check current DATABASE_URL
cat .env.local | grep DATABASE_URL
# OR
cat .env | grep DATABASE_URL
```

If using Supabase or Render, your DATABASE_URL should look like:
```
DATABASE_URL="postgresql://user:password@host:port/database"
```

#### **Step 2: Generate Prisma Client**

```bash
cd apps/backend
npx prisma generate
```

#### **Step 3: Run Migration**

**Option A: Using Prisma Migrate (Recommended)**
```bash
npx prisma migrate dev --name add_places_model
```

**Option B: Using Prisma DB Push (Faster, for development)**
```bash
npx prisma db push --accept-data-loss
```

**Option C: Manual SQL (If migrations fail)**
```bash
# Connect to your database and run:
psql $DATABASE_URL < prisma/migrations/manual_add_places.sql

# Or copy the SQL from prisma/migrations/manual_add_places.sql
# and run it in your database admin tool (Supabase SQL Editor, etc.)
```

#### **Step 4: Seed Places Data**

```bash
cd apps/backend
npx ts-node prisma/seed-places.ts
```

This will add:
- 🏥 Hospitals (Kenyatta National, Aga Khan, Nairobi Hospital, etc.)
- 💊 Pharmacies (Goodlife Pharmacy locations)
- 🏥 Clinics (Avenue Healthcare)
- 🏦 Banks (Equity Bank, KCB Bank)
- 🚔 Police Stations (Parklands, Westlands)

#### **Step 5: Restart Backend**

```bash
# Stop your current backend server (Ctrl+C)
# Then restart it
npm run dev
# OR
yarn dev
# OR
pnpm dev
```

---

## 🧪 **Verify It Works**

### **1. Test API Endpoint**

```bash
# Get nearby hospitals (replace coordinates with your location)
curl "http://localhost:3001/api/v1/places/nearby?latitude=-1.2921&longitude=36.8219&radius=10&category=HOSPITAL"

# Get all places
curl "http://localhost:3001/api/v1/places"

# Search for places
curl "http://localhost:3001/api/v1/places/nearby?latitude=-1.2921&longitude=36.8219&radius=10&search=hospital"
```

### **2. Test in Frontend**

1. Start frontend (if not running):
   ```bash
   cd apps/frontend
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/nearby`

3. Enable location access

4. Search for:
   - "hospital" → Should show hospitals
   - "pharmacy" → Should show pharmacies
   - "clinic" → Should show clinics
   - "bank" → Should show banks

---

## 📋 **For Production (Render/Supabase)**

### **If Deployed on Render:**

1. **Add Migration to Build Command:**
   
   Update `render.yaml` or Render dashboard:
   ```yaml
   buildCommand: cd ../.. && npm install && cd apps/backend && npm run prisma:generate && npm run build && npx prisma migrate deploy
   ```

2. **Run Migration Manually (One-time):**
   
   In Render dashboard → Your Service → Shell:
   ```bash
   cd apps/backend
   npx prisma migrate deploy
   ```

3. **Seed Data (One-time):**
   
   In Render dashboard → Your Service → Shell:
   ```bash
   cd apps/backend
   npx ts-node prisma/seed-places.ts
   ```

### **If Using Supabase:**

1. **Run Migration:**
   - Go to Supabase Dashboard → SQL Editor
   - Copy contents of `prisma/migrations/manual_add_places.sql`
   - Paste and run in SQL Editor

2. **Seed Data:**
   - Use Supabase SQL Editor or connect via psql:
   ```bash
   psql $DATABASE_URL < apps/backend/prisma/seed-places.ts
   ```
   - Or run the TypeScript seed script with proper DATABASE_URL

---

## 🔧 **Troubleshooting**

### **Error: DATABASE_URL not found**
- Check `.env.local` or `.env` file exists
- Verify DATABASE_URL is set correctly
- Make sure it starts with `postgresql://` or `postgres://`

### **Error: Migration fails**
- Try `npx prisma db push --accept-data-loss` instead
- Or use manual SQL from `prisma/migrations/manual_add_places.sql`
- Check database connection is working

### **Error: Seed script fails**
- Make sure migration ran successfully first
- Check that neighborhoods exist (script creates them if missing)
- Verify database connection

### **Places not showing in frontend**
- Check backend logs for errors
- Verify API endpoint works: `curl http://localhost:3001/api/v1/places`
- Check browser console for errors
- Verify location permissions are granted

### **"Cannot find module '@prisma/client'"**
- Run: `npx prisma generate`
- Or: `npm install` in backend directory

---

## 📊 **What Was Added**

✅ **Database:**
- `Place` table with all fields
- Indexes for efficient location queries
- Relations to `User` and `Neighborhood`

✅ **Backend:**
- Places API (`/api/v1/places`)
- Nearby search integration
- Seed data script

✅ **Frontend:**
- Enhanced search functionality
- Place icons and display
- Map integration

---

## 🎉 **You're All Set!**

Once you run the migration and seed script, the feature will be fully functional. Users can search for "hospital", "pharmacy", or any service and see real-world places near them!

---

## 📝 **Quick Reference**

```bash
# Full setup (one command)
cd apps/backend && ./scripts/setup-places.sh

# Or manual:
cd apps/backend
npx prisma generate
npx prisma migrate dev --name add_places_model
npx ts-node prisma/seed-places.ts

# Restart backend
npm run dev
```

**That's it! The feature is ready to use!** 🎉

