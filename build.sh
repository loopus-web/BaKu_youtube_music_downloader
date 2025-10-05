#!/usr/bin/env bash
# Build script for Render.com deployment
set -e

echo "🚀 Starting build process..."

# Install system dependencies
echo "📦 Installing system dependencies..."
apt-get update
apt-get install -y ffmpeg python3-pip
pip3 install yt-dlp

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

echo "✅ Build completed successfully!"