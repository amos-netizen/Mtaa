# 🏥 Setup Guide: Real-World Services Feature

## ✅ **Prerequisites Completed**

- ✅ Place model added to Prisma schema
- ✅ Places service and controller created
- ✅ Nearby service updated to include places
- ✅ Frontend updated to display places
- ✅ Seed data script created
- ✅ Prisma client generated

---

## 🚀 **Next Steps to Activate**

### **Step 1: Run Database Migration**

When your database is available, run:

```bash
cd apps/backend
npx prisma migrate dev --name add_places_model
```

This will:
- Create the `Place` table in your database
- Add indexes for efficient location-based queries
- Set up relations with `User` and `Neighborhood` tables

**Alternative (if migration fails):**
You can manually run the SQL migration. The migration will create:
- `Place` table with all fields
- Indexes on `category`, `latitude`, `longitude`, `neighborhoodId`
- Foreign key relations

---

### **Step 2: Seed Places Data**

After migration, seed the database with initial places:

```bash
cd apps/backend
npx ts-node prisma/seed-places.ts
```

This will add:
- **Hospitals**: Kenyatta National, Aga Khan, Nairobi Hospital, Mater, MP Shah, Gertrude's
- **Pharmacies**: Goodlife Pharmacy locations
- **Clinics**: Avenue Healthcare
- **Banks**: Equity Bank, KCB Bank
- **Police Stations**: Parklands, Westlands

**Note**: The seed script will:
- Create neighborhoods if they don't exist (Nairobi Central, Mombasa Central)
- Skip places that already exist (based on name and location)

---

### **Step 3: Restart Backend Server**

Restart your backend server to load the new Places module:

```bash
# If using npm
npm run start:dev

# If using yarn
yarn start:dev

# If using pnpm
pnpm start:dev
```

---

### **Step 4: Verify It Works**

1. **Test the API:**
   ```bash
   # Get nearby places (replace with your coordinates)
   curl "http://localhost:3000/api/v1/places/nearby?latitude=-1.2921&longitude=36.8219&radius=10&category=HOSPITAL"
   ```

2. **Test in Frontend:**
   - Go to `/nearby` page
   - Enable location
   - Search for "hospital" or "pharmacy"
   - You should see real-world places appear!

---

## 📋 **Manual SQL Migration (If Needed)**

If Prisma migrate doesn't work, you can run this SQL manually:

```sql
-- Create Place table
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "website" TEXT,
    "openingHours" TEXT,
    "rating" DOUBLE PRECISION,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "addedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "neighborhoodId" TEXT,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "Place_category_latitude_longitude_idx" ON "Place"("category", "latitude", "longitude");
CREATE INDEX "Place_neighborhoodId_idx" ON "Place"("neighborhoodId");
CREATE INDEX "Place_latitude_longitude_idx" ON "Place"("latitude", "longitude");

-- Add foreign keys
ALTER TABLE "Place" ADD CONSTRAINT "Place_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "Neighborhood"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Place" ADD CONSTRAINT "Place_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

---

## 🎯 **What's Ready**

✅ **Backend:**
- Places API endpoints (`/api/v1/places`)
- Nearby search includes places
- Seed data script ready

✅ **Frontend:**
- Search enhanced to find places
- Place icons and display
- Map integration
- Distance calculation

✅ **Database:**
- Schema defined
- Relations set up
- Indexes configured

---

## 🧪 **Testing**

### **Test Places API:**

```bash
# Get all places
curl http://localhost:3000/api/v1/places

# Get nearby hospitals
curl "http://localhost:3000/api/v1/places/nearby?latitude=-1.2921&longitude=36.8219&radius=10&category=HOSPITAL"

# Search for places
curl "http://localhost:3000/api/v1/places/nearby?latitude=-1.2921&longitude=36.8219&radius=10&search=hospital"
```

### **Test in Frontend:**

1. Navigate to `/nearby`
2. Enable location
3. Search for:
   - "hospital" → Should show hospitals
   - "pharmacy" → Should show pharmacies
   - "clinic" → Should show clinics
   - "bank" → Should show banks

---

## 📝 **Adding More Places**

### **Via API (Authenticated):**

```bash
POST /api/v1/places
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Hospital",
  "category": "HOSPITAL",
  "description": "Private hospital",
  "address": "123 Main Street, Nairobi",
  "latitude": -1.2921,
  "longitude": 36.8219,
  "phoneNumber": "+254 20 1234567",
  "email": "info@hospital.com"
}
```

### **Via Seed Script:**

Edit `apps/backend/prisma/seed-places.ts` and add more places to the arrays, then run:

```bash
npx ts-node prisma/seed-places.ts
```

---

## ✅ **Status**

Everything is **ready to go**! Just run the migration and seed script when your database is available.

---

## 🆘 **Troubleshooting**

**Migration fails:**
- Check DATABASE_URL in `.env` file
- Ensure database is running
- Try manual SQL migration above

**Seed script fails:**
- Ensure migration ran successfully first
- Check database connection
- Verify neighborhoods exist

**Places not showing:**
- Check backend logs for errors
- Verify places were seeded
- Check API endpoint is working
- Verify location permissions in browser

---

**Once migration and seeding are complete, the feature will be fully functional!** 🎉

