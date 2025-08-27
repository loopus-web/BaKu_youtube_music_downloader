#!/bin/bash

echo "============================================"
echo "      Music Downloader - Starting App"
echo "============================================"
echo

# Check if node_modules exists in root
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
    echo
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    echo
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    echo
fi

echo "Starting Music Downloader..."
echo
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers"
echo "============================================"
echo

npm run dev