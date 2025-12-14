#!/bin/bash
# Render build script for backend
set -e

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

echo "🗄️ Generating Prisma Client..."
npm run prisma:generate

echo "📊 Running database migrations..."
npm run prisma:migrate:deploy

echo "✅ Build complete!"


