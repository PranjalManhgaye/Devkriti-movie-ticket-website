import React, { useState, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  
  const texts = ["BookMyCinema", "DEVKRITI 2025"];
  const buttonText = "Let's Continue";

  console.log('LoadingScreen component rendered');

  useEffect(() => {
    if (currentPhase >= texts.length) {
      setTimeout(() => {
        setShowButton(true);
      }, 1000);
      return;
    }

    let index = 0;
    const currentFullText = texts[currentPhase];
    
    const timer = setInterval(() => {
      if (index <= currentFullText.length) {
        setCurrentText(currentFullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setCurrentPhase(prev => prev + 1);
          setCurrentText('');
        }, 1500); // Wait 1.5 seconds before starting next text
      }
    }, 120);

    return () => clearInterval(timer);
  }, [currentPhase, texts.length]);

  const handleContinue = () => {
    setButtonHovered(true);
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      {/* Cinematic Space Background */}
      <div className="loading-background">
        {/* Stars Container */}
        <div className="stars-container"></div>
        
        {/* Racing Road Effect */}
        <div className="racing-road">
          <div className="road-lines">
            {[...Array(20)].map((_, index) => (
              <div 
                key={index} 
                className="road-line"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  zIndex: 20 - index
                }}
              ></div>
            ))}
          </div>
          
          {/* Road Side Lines */}
          <div className="road-sides">
            <div className="road-side left"></div>
            <div className="road-side right"></div>
          </div>
          
          {/* Speed Lines */}
          <div className="speed-lines">
            {[...Array(15)].map((_, index) => (
              <div 
                key={index} 
                className="speed-line"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  left: `${Math.random() * 100}%`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Floating Particles */}
        <div className="space-particles">
          {[...Array(30)].map((_, index) => (
            <div 
              key={index} 
              className="particle"
              style={{ 
                animationDelay: `${Math.random() * 3}s`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="loading-content">
        {/* Logo/Icon - DEVKRITI Style */}
        <div className="logo-section">
          <div className="logo-container">
            <div className="logo-circle">
              <div className="logo-inner">
                <span className="logo-text">DEVKRITI</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Text Section - DEVKRITI Style */}
        <div className="text-section">
          <div className="main-text-container">
            <h1 className="main-text">
              {currentText}
              <span className="cursor">|</span>
            </h1>
          </div>
          
          <div className="subtitle-container">
            <p className="subtitle">
              {currentPhase === 0 ? "Experience Cinema Like Never Before" : "Technical Festival"}
            </p>
          </div>
        </div>
        
        {/* Continue Button */}
        {showButton && (
          <div className="button-section">
            <button
              className={`continue-button ${buttonHovered ? 'hovered' : ''}`}
              onClick={handleContinue}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
            >
              <span className="button-text">{buttonText}</span>
              <FaPlay className="button-icon" />
            </button>
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 