#!/bin/bash
set -e

echo "📦 Installing dependencies..."
cd ../..
npm install

echo "🗄️ Generating Prisma Client..."
cd apps/backend
npm run prisma:generate

echo "🔨 Building application..."
npm run build

echo "📊 Running database migrations..."
npm run prisma:migrate:deploy

echo "✅ Build complete!"
echo "📁 Checking dist folder..."
ls -la dist/ || echo "⚠️ dist folder not found!"
