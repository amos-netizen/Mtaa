-- Manual migration: Add Places table for real-world services
-- Run this SQL directly on your PostgreSQL database

-- Create Place table
CREATE TABLE IF NOT EXISTS "Place" (
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

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS "Place_category_latitude_longitude_idx" ON "Place"("category", "latitude", "longitude");
CREATE INDEX IF NOT EXISTS "Place_neighborhoodId_idx" ON "Place"("neighborhoodId");
CREATE INDEX IF NOT EXISTS "Place_latitude_longitude_idx" ON "Place"("latitude", "longitude");

-- Add foreign key constraints
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Place_neighborhoodId_fkey'
    ) THEN
        ALTER TABLE "Place" 
        ADD CONSTRAINT "Place_neighborhoodId_fkey" 
        FOREIGN KEY ("neighborhoodId") 
        REFERENCES "Neighborhood"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Place_addedById_fkey'
    ) THEN
        ALTER TABLE "Place" 
        ADD CONSTRAINT "Place_addedById_fkey" 
        FOREIGN KEY ("addedById") 
        REFERENCES "User"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Add comment
COMMENT ON TABLE "Place" IS 'Real-world places like hospitals, pharmacies, clinics, banks, etc.';

