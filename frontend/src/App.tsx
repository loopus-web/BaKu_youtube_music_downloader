import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import DownloadProgress from './DownloadProgress';

interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  thumbnail: string;
  author: string;
}

interface DownloadState {
  isDownloading: boolean;
  videoTitle: string;
  isProcessing: boolean;
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadState, setDownloadState] = useState<DownloadState>({
    isDownloading: false,
    videoTitle: '',
    isProcessing: false
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const response = await axios.get('/api/search', {
        params: { query: searchQuery }
      });
      setSearchResults(response.data);
    } catch (err) {
      setError('Failed to search. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (video: Video) => {
    setDownloading(video.id);
    setError(null);
    
    // Initialize download state
    setDownloadState({
      isDownloading: true,
      videoTitle: video.title,
      isProcessing: false
    });

    try {
      // Simulate processing state after a delay
      const processingTimeout = setTimeout(() => {
        setDownloadState(prev => ({
          ...prev,
          isProcessing: true
        }));
      }, 3000);

      const response = await axios.get('/api/download', {
        params: { 
          url: video.url,
          title: video.title 
        },
        responseType: 'blob'
      });

      clearTimeout(processingTimeout);

      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${video.title.replace(/[^a-z0-9]/gi, '_')}.mp3`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      // Hide progress modal after download starts
      setTimeout(() => {
        setDownloadState({
          isDownloading: false,
          videoTitle: '',
          isProcessing: false
        });
      }, 1000);
    } catch (err) {
      setError('Failed to download. Please try again.');
      console.error(err);
      setDownloadState({
        isDownloading: false,
        videoTitle: '',
        isProcessing: false
      });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="App">
      {downloadState.isDownloading && (
        <DownloadProgress 
          videoTitle={downloadState.videoTitle}
          isProcessing={downloadState.isProcessing}
        />
      )}
      
      <header className="App-header">
        <h1>🎵 BaKu Music Downloader</h1>
        <p>Search for music and download as MP3</p>
      </header>

      <main className="App-main">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter song title (e.g., 'Waiting Bob Marley')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            disabled={loading || downloading !== null}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || downloading !== null}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="results-container">
          {searchResults.map((video) => (
            <div key={video.id} className="result-item">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="result-thumbnail"
              />
              <div className="result-info">
                <h3>{video.title}</h3>
                <p className="result-author">{video.author}</p>
                <p className="result-duration">{video.duration}</p>
              </div>
              <button
                onClick={() => handleDownload(video)}
                className="download-button"
                disabled={downloading !== null}
              >
                {downloading === video.id ? 'Downloading...' : 'Download MP3'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;