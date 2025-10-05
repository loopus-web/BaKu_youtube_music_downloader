import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import './magical-animations.css';
import DownloadProgress from './DownloadProgress';
import MagicalParticles from './MagicalParticles';
import DownloadQueue from './DownloadQueue';
import type { QueueItem } from './DownloadQueue';
import { LanguageProvider, useLanguage } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import PenguinFooter from './PenguinFooter';

interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  thumbnail: string;
  author: string;
}


function AppContent() {
  const { t, language } = useLanguage();
  
  // Update document title based on language
  useEffect(() => {
    document.title = t.header.title;
  }, [language, t.header.title]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadQueue, setDownloadQueue] = useState<QueueItem[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const processingRef = useRef(false);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      setError(t.errors.searchFailed);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add video to download queue
  const handleDownload = (video: Video) => {
    const queueItem: QueueItem = {
      id: video.id,
      title: video.title,
      author: video.author,
      url: video.url,
      status: 'waiting'
    };
    
    setDownloadQueue(prev => [...prev, queueItem]);
  };

  // Process download queue
  useEffect(() => {
    const processQueue = async () => {
      if (processingRef.current || downloadQueue.length === 0) return;
      
      const currentItem = downloadQueue.find(item => item.status === 'waiting');
      if (!currentItem) return;
      
      processingRef.current = true;
      setIsProcessingQueue(true);
      
      // Update status to downloading
      setDownloadQueue(prev => prev.map(item => 
        item.id === currentItem.id 
          ? { ...item, status: 'downloading', progress: 0 }
          : item
      ));
      
      try {
        // Simulate download progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setDownloadQueue(prev => prev.map(item => 
            item.id === currentItem.id 
              ? { ...item, progress: i }
              : item
          ));
        }
        
        // Update status to processing
        setDownloadQueue(prev => prev.map(item => 
          item.id === currentItem.id 
            ? { ...item, status: 'processing' }
            : item
        ));
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Download the file
        const response = await axios.get('/api/download', {
          params: { 
            url: currentItem.url,
            title: currentItem.title 
          },
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${currentItem.title.replace(/[^a-z0-9]/gi, '_')}.mp3`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        // Update status to completed
        setDownloadQueue(prev => prev.map(item => 
          item.id === currentItem.id 
            ? { ...item, status: 'completed' }
            : item
        ));
        
      } catch (err) {
        console.error('Download error:', err);
        setDownloadQueue(prev => prev.map(item => 
          item.id === currentItem.id 
            ? { ...item, status: 'error', error: t.download.queue.downloadFailed }
            : item
        ));
      } finally {
        processingRef.current = false;
        setIsProcessingQueue(false);
      }
    };
    
    processQueue();
  }, [downloadQueue]);

  // Remove item from queue
  const handleRemoveFromQueue = (id: string) => {
    setDownloadQueue(prev => prev.filter(item => item.id !== id));
  };

  // Retry failed download
  const handleRetryDownload = (id: string) => {
    setDownloadQueue(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: 'waiting', error: undefined, progress: undefined }
        : item
    ));
  };

  // Handle preview play/pause
  const handlePreviewToggle = (video: Video) => {
    if (playingPreview === video.id) {
      // Stop current preview
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
        previewTimerRef.current = null;
      }
      setPlayingPreview(null);
    } else {
      // Stop any current preview
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
      
      // Start new preview
      const audio = new Audio(`/api/stream?url=${encodeURIComponent(video.url)}`);
      audioRef.current = audio;
      
      audio.play().catch(err => {
        console.error('Preview playback failed:', err);
        setPlayingPreview(null);
      });
      
      setPlayingPreview(video.id);
      
      // Stop after 5 seconds
      previewTimerRef.current = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        setPlayingPreview(null);
        previewTimerRef.current = null;
      }, 5000);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  // Add magical cursor trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'cursor-sparkle';
      sparkle.style.left = e.clientX + 'px';
      sparkle.style.top = e.clientY + 'px';
      document.body.appendChild(sparkle);
      
      setTimeout(() => {
        sparkle.remove();
      }, 1000);
    };

    let throttle = false;
    const throttledMouseMove = (e: MouseEvent) => {
      if (!throttle) {
        handleMouseMove(e);
        throttle = true;
        setTimeout(() => {
          throttle = false;
        }, 50);
      }
    };

    document.addEventListener('mousemove', throttledMouseMove);
    return () => document.removeEventListener('mousemove', throttledMouseMove);
  }, []);

  return (
    <div className="App">
      <MagicalParticles />
      <LanguageSwitcher />
      <DownloadQueue 
        queue={downloadQueue}
        onRemove={handleRemoveFromQueue}
        onRetry={handleRetryDownload}
      />
      
      <header className="App-header">
        <div className="aurora-layer"></div>
        <h1>
          <span className="magic-icon">✨</span> 
          {t.header.title}
          <span className="magic-icon">✨</span>
        </h1>
        <p className="subtitle">{t.header.subtitle}</p>
      </header>

      <main className="App-main">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder={t.search.placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            disabled={loading || isProcessingQueue}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || isProcessingQueue}
          >
            {loading ? t.search.searching : t.search.button}
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
              <div className="thumbnail-container">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="result-thumbnail"
                />
                <button
                  className={`preview-button ${playingPreview === video.id ? 'playing' : ''}`}
                  onClick={() => handlePreviewToggle(video)}
                  aria-label={playingPreview === video.id ? "Pause preview" : "Play preview"}
                >
                  {playingPreview === video.id ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="result-info">
                <h3>{video.title}</h3>
                <p className="result-author">{video.author}</p>
                <p className="result-duration">{video.duration}</p>
              </div>
              <button
                onClick={() => handleDownload(video)}
                className="download-button"
                disabled={downloadQueue.some(item => item.id === video.id && item.status !== 'completed' && item.status !== 'error')}
              >
                {downloadQueue.some(item => item.id === video.id && item.status === 'waiting') 
                  ? t.download.waiting
                  : downloadQueue.some(item => item.id === video.id && item.status === 'downloading')
                  ? t.download.downloading
                  : downloadQueue.some(item => item.id === video.id && item.status === 'processing')
                  ? t.download.processing
                  : t.download.button
                }
              </button>
            </div>
          ))}
        </div>
      </main>
      <PenguinFooter />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;