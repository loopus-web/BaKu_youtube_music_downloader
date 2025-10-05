#!/usr/bin/env bash
# Start script for Render.com production deployment

echo "🎵 Starting Music Downloader server in production mode..."

# Set production environment
export NODE_ENV=production

# Navigate to backend directory
cd backend

# Start the Node.js server
exec node server.js