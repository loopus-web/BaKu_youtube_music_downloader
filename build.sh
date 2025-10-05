#!/usr/bin/env bash
# Build script optimized for Render.com (no apt-get)
set -e

echo "🚀 Starting Render build process..."

# Install Python dependencies (yt-dlp) via pip
echo "📦 Installing yt-dlp via pip..."
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