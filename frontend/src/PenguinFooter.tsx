import React from 'react';
import './PenguinFooter.css';

const PenguinFooter: React.FC = () => {
  return (
    <footer className="penguin-footer">
      <div className="penguin-container">
        <span className="penguin">🐧</span>
        <div className="shadow"></div>
      </div>
    </footer>
  );
};

export default PenguinFooter;