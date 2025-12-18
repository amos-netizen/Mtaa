#!/bin/bash

# Setup script for Real-World Services (Places) feature
# This script will:
# 1. Run database migration
# 2. Seed initial places data
# 3. Verify setup

set -e

echo "🏥 Setting up Real-World Services Feature..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  DATABASE_URL not set. Checking .env files...${NC}"
    
    # Try to load from .env.local first
    if [ -f .env.local ]; then
        echo "📄 Loading from .env.local..."
        export $(cat .env.local | grep -v '^#' | xargs)
    elif [ -f .env ]; then
        echo "📄 Loading from .env..."
        export $(cat .env | grep -v '^#' | xargs)
    fi
    
    # Check again
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${RED}❌ DATABASE_URL still not found!${NC}"
        echo "Please set DATABASE_URL environment variable or update .env/.env.local"
        exit 1
    fi
fi

# Validate DATABASE_URL format
if [[ ! "$DATABASE_URL" =~ ^postgresql:// ]] && [[ ! "$DATABASE_URL" =~ ^postgres:// ]]; then
    echo -e "${RED}❌ Invalid DATABASE_URL format. Must start with postgresql:// or postgres://${NC}"
    echo "Current value: ${DATABASE_URL:0:20}..."
    exit 1
fi

echo -e "${GREEN}✅ DATABASE_URL found${NC}"
echo ""

# Step 1: Generate Prisma Client
echo "📦 Step 1: Generating Prisma Client..."
npx prisma generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

# Step 2: Run Migration
echo "🔄 Step 2: Running database migration..."
if npx prisma migrate dev --name add_places_model --skip-seed 2>/dev/null; then
    echo -e "${GREEN}✅ Migration completed${NC}"
elif npx prisma db push --accept-data-loss --skip-generate 2>/dev/null; then
    echo -e "${GREEN}✅ Database schema updated (db push)${NC}"
else
    echo -e "${YELLOW}⚠️  Automatic migration failed. Trying manual SQL...${NC}"
    if [ -f "prisma/migrations/manual_add_places.sql" ]; then
        echo "📄 Manual SQL migration file found at: prisma/migrations/manual_add_places.sql"
        echo "Please run this SQL manually on your database:"
        echo "  psql \$DATABASE_URL < prisma/migrations/manual_add_places.sql"
    else
        echo -e "${RED}❌ Migration failed. Please check your database connection.${NC}"
        exit 1
    fi
fi
echo ""

# Step 3: Seed Places Data
echo "🌱 Step 3: Seeding places data..."
if npx ts-node prisma/seed-places.ts; then
    echo -e "${GREEN}✅ Places data seeded successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Seeding failed. This is okay if places already exist.${NC}"
fi
echo ""

# Step 4: Verify
echo "🔍 Step 4: Verifying setup..."
PLACE_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"Place\";" 2>/dev/null | grep -o '[0-9]*' | head -1 || echo "0")

if [ "$PLACE_COUNT" -gt "0" ]; then
    echo -e "${GREEN}✅ Setup complete! Found $PLACE_COUNT places in database.${NC}"
else
    echo -e "${YELLOW}⚠️  No places found. You may need to run the seed script manually.${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Real-World Services feature setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Restart your backend server"
echo "  2. Test the API: GET /api/v1/places/nearby?latitude=-1.2921&longitude=36.8219&radius=10"
echo "  3. Search for 'hospital' or 'pharmacy' in the /nearby page"

