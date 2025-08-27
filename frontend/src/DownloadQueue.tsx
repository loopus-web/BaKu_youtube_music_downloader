import React from 'react';
import './DownloadQueue.css';
import { useLanguage } from './LanguageContext';

export type QueueItem = {
  id: string;
  title: string;
  author: string;
  url: string;
  status: 'waiting' | 'downloading' | 'processing' | 'completed' | 'error';
  progress?: number;
  error?: string;
};

interface DownloadQueueProps {
  queue: QueueItem[];
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

const DownloadQueue: React.FC<DownloadQueueProps> = ({ queue, onRemove, onRetry }) => {
  const { t } = useLanguage();
  
  if (queue.length === 0) return null;

  const getStatusIcon = (status: QueueItem['status']) => {
    switch (status) {
      case 'waiting':
        return '⏳';
      case 'downloading':
        return '⬇️';
      case 'processing':
        return '⚡';
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStatusText = (status: QueueItem['status'], progress?: number) => {
    switch (status) {
      case 'waiting':
        return t.download.queue.waiting;
      case 'downloading':
        return progress ? `${t.download.queue.downloading} ${progress}%` : t.download.queue.downloading;
      case 'processing':
        return t.download.queue.processing;
      case 'completed':
        return t.download.queue.completed;
      case 'error':
        return t.download.queue.error;
      default:
        return t.download.queue.waiting;
    }
  };

  return (
    <div className="download-queue">
      <div className="queue-header">
        <h3>
          <span className="queue-icon">📥</span>
          {t.download.queue.title}
          <span className="queue-count">{queue.length}</span>
        </h3>
      </div>
      <div className="queue-list">
        {queue.map((item, index) => (
          <div key={item.id} className={`queue-item ${item.status}`}>
            <div className="queue-item-number">{index + 1}</div>
            <div className="queue-item-info">
              <div className="queue-item-title">{item.title}</div>
              <div className="queue-item-author">{item.author}</div>
              <div className="queue-item-status">
                <span className="status-icon">{getStatusIcon(item.status)}</span>
                <span className="status-text">{getStatusText(item.status, item.progress)}</span>
              </div>
              {item.status === 'downloading' && item.progress && (
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
              {item.error && (
                <div className="queue-item-error">{item.error}</div>
              )}
            </div>
            <div className="queue-item-actions">
              {item.status === 'error' && (
                <button 
                  className="retry-button"
                  onClick={() => onRetry(item.id)}
                  title={t.download.queue.retry}
                >
                  🔄
                </button>
              )}
              {(item.status === 'waiting' || item.status === 'error' || item.status === 'completed') && (
                <button 
                  className="remove-button"
                  onClick={() => onRemove(item.id)}
                  title={t.download.queue.remove}
                >
                  ✖
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadQueue;