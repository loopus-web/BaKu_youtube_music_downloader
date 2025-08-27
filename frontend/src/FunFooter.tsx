import React, { useState, useEffect } from 'react';
import './FunFooter.css';

const FunFooter: React.FC = () => {
  const [dancingNotes, setDancingNotes] = useState<Array<{ id: number; emoji: string }>>([]);
  
  const musicEmojis = ['🎵', '🎶', '🎼', '🎤', '🎸', '🎹', '🥁', '🎺', '🎷', '🎻'];
  const dancingEmojis = ['🕺', '💃', '🦜', '🐧', '🦄', '🐸', '🦋'];
  
  useEffect(() => {
    const notes = [];
    for (let i = 0; i < 15; i++) {
      notes.push({
        id: i,
        emoji: i % 3 === 0 ? 
          dancingEmojis[Math.floor(Math.random() * dancingEmojis.length)] : 
          musicEmojis[Math.floor(Math.random() * musicEmojis.length)]
      });
    }
    setDancingNotes(notes);
  }, []);

  return (
    <footer className="fun-footer">
      <div className="dance-floor">
        {dancingNotes.map((note) => (
          <span 
            key={note.id} 
            className={`dancing-item item-${note.id % 5}`}
            style={{
              animationDelay: `${Math.random() * 5}s`,
              left: `${5 + (note.id * 6.5)}%`
            }}
          >
            {note.emoji}
          </span>
        ))}
      </div>
      
      <div className="disco-ball">
        <span className="ball">🪩</span>
        <div className="disco-lights">
          <span className="light light-1"></span>
          <span className="light light-2"></span>
          <span className="light light-3"></span>
          <span className="light light-4"></span>
        </div>
      </div>
      
      <div className="footer-message">
        <span className="bouncing-text">
          <span>M</span><span>a</span><span>d</span><span>e</span>
          <span> </span>
          <span>w</span><span>i</span><span>t</span><span>h</span>
          <span> </span>
          <span className="heart">❤️</span>
          <span> </span>
          <span>&</span>
          <span> </span>
          <span className="music-note">🎵</span>
        </span>
      </div>
      
      <div className="bubble-container">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="bubble" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      <div className="rainbow-wave">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path 
            className="wave-path"
            d="M0,50 Q300,10 600,50 T1200,50 L1200,100 L0,100 Z"
          />
        </svg>
      </div>
    </footer>
  );
};

export default FunFooter;