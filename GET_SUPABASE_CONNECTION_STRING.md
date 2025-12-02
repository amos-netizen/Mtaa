# 🔗 Get Your Supabase Connection String

## Step-by-Step Guide

### 1. Go to Your Supabase Project
- Open: https://bfemwxvpawdncyixnypl.supabase.co
- Or go to: https://supabase.com/dashboard/projects

### 2. Navigate to Database Settings
1. Click on **Settings** (⚙️ icon in sidebar)
2. Click on **Database**
3. Scroll down to **Connection string**

### 3. Copy the Connection String
- **Mode**: Select **"URI"** or **"Connection Pooling"**
- **Copy** the connection string that looks like:
  ```
  postgresql://postgres.bfemwxvpawdncyixnypl:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  ```

### 4. Get Your Password
- Your database password is the one you set when creating the project
- If you forgot it, click **"Reset Database Password"** in the same Database settings page

### 5. Update `.env.local`
Replace `[YOUR-PASSWORD]` in the file:
- File: `apps/backend/.env.local`
- Replace both occurrences of `[YOUR-PASSWORD]` with your actual password

## ✅ Final Check

Your `.env.local` should look like:
```env
DATABASE_URL="postgresql://postgres.bfemwxvpawdncyixnypl:your_actual_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres.bfemwxvpawdncyixnypl:your_actual_password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

## 🚀 Next Steps After Setting Password

```powershell
cd C:\Users\amosm\OneDrive\Documents\PROJECTS\Mtaa\apps\backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npm run prisma:seed

# Start backend
npm run dev
```

## ⚠️ Note on Region

The connection string I provided uses `aws-0-us-east-1`. If your project is in a different region, update it to match your actual region (check in Supabase dashboard).







