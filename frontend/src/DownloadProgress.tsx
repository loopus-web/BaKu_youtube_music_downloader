import React from 'react';
import './DownloadProgress.css';

interface DownloadProgressProps {
  videoTitle: string;
  isProcessing: boolean;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ videoTitle, isProcessing }) => {
  return (
    <div className="download-overlay">
      <div className="download-modal">
        <div className="download-content">
          <div className="loader-animation">
            <div className="music-bars">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </div>
          
          <h3>Downloading</h3>
          <p className="download-title">{videoTitle}</p>
          
          <p className="download-status">
            {isProcessing ? 'Converting to MP3...' : 'Fetching audio...'}
          </p>
          
          <div className="pulse-loader">
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadProgress;