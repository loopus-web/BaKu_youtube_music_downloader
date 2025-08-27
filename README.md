# Music Downloader 🎵

A modern web application built with React/Express and Vite that allows you to search and download music from YouTube as MP3 files. The application extracts only the audio track without displaying any video content.

![Node.js](https://img.shields.io/badge/Node.js-v20.13.1+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-yellow)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey)

## Features ✨

- 🔍 **Smart Search**: Search for any song by title, artist, or lyrics
- 💿 **High-Quality Audio**: Download music in MP3 format with 192kbps bitrate
- ⚡ **Fast Performance**: Built with Vite for instant HMR and optimized builds
- 🎨 **Modern UI**: Clean and responsive interface with gradient design
- 🔒 **Privacy Focused**: No video content displayed, audio extraction only
- 🗑️ **Auto-Cleanup**: Temporary files are automatically deleted after download

## Prerequisites 📋

Before you begin, ensure you have the following installed:

- **Node.js** (v20.13.1 or higher)
- **npm** (v10.5.2 or higher)
- **FFmpeg** (required for audio conversion)

### Installing FFmpeg

FFmpeg is essential for converting YouTube audio streams to MP3 format:

#### Windows
1. Download FFmpeg from [ffmpeg.org](https://ffmpeg.org/download.html)
2. Extract the archive
3. Add FFmpeg to your system PATH environment variable
4. Verify installation: `ffmpeg -version`

#### macOS
```bash
brew install ffmpeg
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Linux (Fedora)
```bash
sudo dnf install ffmpeg
```

## Installation 🚀

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/musicDownloader.git
cd musicDownloader
```

### 2. Automatic Installation (Recommended)
```bash
npm run setup
```
This will install all dependencies for both frontend and backend automatically.

### 3. Manual Installation (Alternative)
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Running the Application 🎯

### Quick Start (Recommended) 🚀

#### Windows
Double-click on `start.bat` or run:
```cmd
start.bat
```

#### macOS/Linux
```bash
./start.sh
```

#### Using npm
```bash
npm run dev
```

This will automatically:
- Check and install missing dependencies
- Start the backend server on http://localhost:5000
- Start the frontend dev server on http://localhost:5173
- Open your browser to the application

### Manual Start (Alternative)

If you prefer to run servers separately:

#### Terminal 1 - Backend Server
```bash
cd backend
npm start
```
The backend server will start on http://localhost:5000

#### Terminal 2 - Frontend Development Server
```bash
cd frontend
npm run dev
```
The application will open at http://localhost:5173

### Available Scripts

From the root directory, you can run:

- `npm run setup` - Install all dependencies
- `npm run dev` - Start both frontend and backend
- `npm run install:all` - Install dependencies for frontend and backend
- `npm run dev:backend` - Start only the backend server
- `npm run dev:frontend` - Start only the frontend server

## Usage Guide 📖

1. **Open the Application**: Navigate to http://localhost:5173 in your browser
2. **Search for Music**: Enter a song title in the search bar (e.g., "Waiting in Vain Bob Marley")
3. **View Results**: Browse through the search results with thumbnails and duration
4. **Download**: Click the "Download MP3" button next to your desired track
5. **Save**: The MP3 file will be automatically downloaded to your default downloads folder

## Technology Stack 🛠️

### Backend
- **Express.js**: Fast, minimalist web framework for Node.js
- **@distube/ytdl-core**: YouTube downloading library (maintained fork)
- **yt-search**: YouTube search without API key
- **fluent-ffmpeg**: FFmpeg wrapper for audio conversion
- **cors**: Cross-origin resource sharing middleware

### Frontend
- **React 18**: Modern UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Next-generation frontend build tool
- **Axios**: Promise-based HTTP client
- **CSS3**: Custom styling with gradients and animations

## Project Structure 📁

```
musicDownloader/
├── backend/
│   ├── server.js           # Express server with API endpoints
│   ├── package.json        # Backend dependencies
│   ├── .env               # Environment variables
│   └── temp/              # Temporary files (auto-created)
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   ├── App.css        # Application styles
│   │   ├── index.tsx      # Application entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── vite.config.ts     # Vite configuration
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## API Endpoints 🔌

### Search for Music
```http
GET /api/search?query={searchTerm}
```
Returns an array of video objects with id, title, url, duration, thumbnail, and author.

### Download as MP3
```http
GET /api/download?url={videoUrl}&title={optionalTitle}
```
Streams the MP3 file directly to the client.

### Server Status
```http
GET /api/test
```
Returns server status and timestamp.

## Development 👩‍💻

### Running in Development Mode

Backend with auto-reload:
```bash
cd backend
npm run dev
```

Frontend with HMR:
```bash
cd frontend
npm run dev
```

### Building for Production

Build the frontend:
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

## Troubleshooting 🔧

### Common Issues

1. **"FFmpeg not found" error**
   - Ensure FFmpeg is installed and added to your system PATH
   - Restart your terminal after installation

2. **"ENOTFOUND www.youtube.com" error**
   - Check your internet connection
   - Verify that YouTube is accessible from your network
   - Check if you're behind a proxy or firewall

3. **Download fails or returns empty file**
   - Ensure the video is available in your region
   - Check if the video has age restrictions
   - Try with a different video URL

4. **Port already in use**
   - Change the port in backend/.env file
   - Or kill the process using the port

### Debug Mode

To see detailed logs, you can check the console output in:
- Backend terminal for server-side errors
- Browser DevTools console for client-side errors

## Security & Legal Notice ⚠️

- This application is for personal use only
- Respect copyright laws in your jurisdiction
- Do not use this tool to download copyrighted content without permission
- The application does not store or cache downloaded content
- All downloads are streamed directly to the user

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is for educational purposes. Please ensure you comply with YouTube's Terms of Service and respect copyright laws.

## Acknowledgments 🙏

- FFmpeg team for the excellent audio processing library
- @distube/ytdl-core maintainers for the YouTube downloading functionality
- The React and Vite teams for their amazing tools

---

Made with ❤️ using React, Express, and Vite