import React from 'react';
import { useLanguage } from './LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
        aria-label="English"
      >
        <span className="flag">🇬🇧</span>
        <span className="lang-code">EN</span>
      </button>
      <button
        className={`lang-btn ${language === 'fr' ? 'active' : ''}`}
        onClick={() => setLanguage('fr')}
        aria-label="Français"
      >
        <span className="flag">🇫🇷</span>
        <span className="lang-code">FR</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;