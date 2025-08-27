@echo off
echo ============================================
echo      Music Downloader - Starting App
echo ============================================
echo.

REM Check if node_modules exists in root
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
    echo.
)

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
)

echo Starting Music Downloader...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo ============================================
echo.

npm run dev