import React, { useEffect, useState } from 'react';
import './magical-animations.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: 'particle' | 'star' | 'orb';
}

const MagicalParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      
      // Generate floating particles
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 2,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 20,
          type: 'particle'
        });
      }

      // Generate twinkling stars
      for (let i = 30; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 5,
          type: 'star'
        });
      }

      // Generate floating orbs
      for (let i = 50; i < 55; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 30 + 15,
          duration: Math.random() * 15 + 10,
          delay: Math.random() * 10,
          type: 'orb'
        });
      }

      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="magical-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={particle.type}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.type === 'star' && (
            <svg width="100%" height="100%" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,2 L14,8 L20,8 L15,12 L17,18 L12,14 L7,18 L9,12 L4,8 L10,8 Z"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

export default MagicalParticles;