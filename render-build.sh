#!/usr/bin/env bash
# Build script optimized for Render.com
set -e

echo "🚀 Starting Render build process..."

# Install Python dependencies (yt-dlp)
echo "📦 Installing yt-dlp..."
pip install --upgrade pip
pip install yt-dlp

# Build frontend
echo "🎨 Building frontend..."
cd frontend
npm ci --production=false
npm run build
cd ..

# Install backend dependencies
echo "⚙️ Installing backend dependencies..."
cd backend
npm ci --production
cd ..

# Make scripts executable
chmod +x start-render.sh

echo "✅ Build completed successfully!"