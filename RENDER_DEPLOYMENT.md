# Render Deployment Configuration

## Exact Render Settings

### Service Configuration
- **Name**: `mtaa-backend`
- **Type**: Web Service
- **Environment**: Node
- **Region**: Oregon (or your preferred region)
- **Plan**: Starter (or Free for testing)

### Build Settings
- **Root Directory**: `apps/backend`
- **Build Command**: `cd ../.. && npm install && cd apps/backend && npm run prisma:generate && npm run build && npx prisma db push --accept-data-loss`
- **Start Command**: `node dist/main.js`

### Environment Variables (Minimum Required)
1. `NODE_ENV` = `production`
2. `PORT` = `10000` (or let Render assign automatically)
3. `DATABASE_URL` = (Auto-linked from PostgreSQL database)
4. `JWT_SECRET` = (Generate a secure random string, 32+ characters)
5. `JWT_EXPIRES_IN` = `15m`
6. `JWT_REFRESH_EXPIRES_IN` = `30d`
7. `FRONTEND_URL` = (Your Vercel frontend URL, e.g., `https://your-app.vercel.app`)

### Database Configuration
- **Name**: `mtaa-database`
- **Type**: PostgreSQL
- **Database Name**: `mtaa`
- **User**: `mtaa_user`
- **Plan**: Starter (or Free for testing)

## Initial Setup Steps

1. **Create PostgreSQL Database in Render**
   - Go to Render Dashboard → New → PostgreSQL
   - Name: `mtaa-database`
   - Plan: Starter (or Free)
   - Note the connection string

2. **Create Web Service in Render**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Use the settings above
   - Link the PostgreSQL database

3. **Set Environment Variables**
   - In Render Dashboard → Your Service → Environment
   - Add all required variables listed above
   - Generate JWT_SECRET: `openssl rand -base64 32`

4. **Deploy**
   - Render will automatically build and deploy
   - Check logs for any errors
   - Verify health endpoint: `https://your-service.onrender.com/api/v1/health`

## Migration Notes

Since you're migrating from SQLite to PostgreSQL:
1. The schema has been updated to use PostgreSQL
2. You'll need to create an initial migration: `cd apps/backend && npx prisma migrate dev --name init`
3. For production, migrations run automatically via `prisma:migrate:deploy` in the build command

## Troubleshooting

- **Build fails**: Check that `rootDir` is set to `apps/backend`
- **Database connection fails**: Verify `DATABASE_URL` is correctly linked
- **Prisma errors**: Ensure `prisma:generate` runs before `build`
- **Port issues**: Render assigns PORT automatically, but you can set it to 10000








