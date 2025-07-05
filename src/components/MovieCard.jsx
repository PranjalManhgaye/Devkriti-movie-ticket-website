import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MovieCard.css';

// Format time in seconds to MM:SS
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { id, name, rating, language, genre, format, image, videoUrl, duration, year } = movie;
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const progressBarRef = useRef(null);

  // Unified event listener setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setVideoDuration(video.duration);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // Hover effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    let hoverTimer;
    if (isHovered) {
      hoverTimer = setTimeout(() => {
        if (video.paused) {
          video.play().catch(err => console.error("Hover play failed:", err));
        }
      }, 500);
    } else {
      video.pause();
      video.currentTime = 0;
    }

    return () => clearTimeout(hoverTimer);
  }, [isHovered, videoUrl]);

  // Video settings
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
      video.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Centralized handler to stop navigation
  const handleControlClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    action(e);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      video.paused ? video.play().catch(err => console.error("Play failed:", err)) : video.pause();
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    if (videoRef.current && videoDuration > 0) {
      videoRef.current.currentTime = (clickPosition / progressBarWidth) * videoDuration;
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    const container = videoContainerRef.current;
    if (container) {
      document.fullscreenElement ? document.exitFullscreen() : container.requestFullscreen().catch(err => console.error("Fullscreen failed:", err));
    }
  };

  const handleBookNowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/booking', { state: { movie } });
  };

  return (
    <Link to={`/movies/${id}`} className="movie-card-link-wrapper">
      <div 
        className="movie-card"
        onMouseEnter={() => setIsHovered(!!videoUrl)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="movie-media-container">
          <div className={`movie-image-container ${isHovered && videoUrl ? 'hidden' : ''}`}>
            <img 
              src={image} 
              alt={name} 
              className="movie-image"
              onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-movie.jpg'; }}
            />
            <div className="movie-rating"><span>{rating}</span></div>
            <div className="movie-format">{format}</div>
          </div>
          
          {videoUrl && (
            <div className={`video-container ${isHovered ? 'visible' : ''}`} ref={videoContainerRef}>
              {/* YouTube Embed Support */}
              {(videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) ? (
                <iframe
                  className="movie-video"
                  width="320"
                  height="180"
                  src={(() => {
                    // Convert YouTube URL to embed format
                    if (videoUrl.includes('youtube.com/watch?v=')) {
                      return videoUrl.replace('watch?v=', 'embed/').split('&')[0];
                    } else if (videoUrl.includes('youtu.be/')) {
                      return 'https://www.youtube.com/embed/' + videoUrl.split('youtu.be/')[1].split('?')[0];
                    } else {
                      return videoUrl;
                    }
                  })()}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Trailer"
                ></iframe>
              ) : (
                <>
                  <video ref={videoRef} className="movie-video" muted loop playsInline preload="metadata" poster={image}>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
  
                  <div className="video-controls">
                    <button className="control-button play-pause" onClick={(e) => handleControlClick(e, togglePlayPause)} aria-label={isPlaying ? 'Pause' : 'Play'}>
                      <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
                    </button>
                    
                    <div className="progress-container" onClick={(e) => handleControlClick(e, () => handleProgressClick(e))}>
                      <div className="progress-bar">
                        <div className="progress" ref={progressBarRef} style={{ transform: `scaleX(${videoDuration ? currentTime / videoDuration : 0})` }}></div>
                      </div>
                    </div>
                    
                    <div className="time-display">{formatTime(currentTime)} / {formatTime(videoDuration)}</div>
                    
                    <div className="volume-controls">
                      <button className="control-button volume" onClick={(e) => handleControlClick(e, toggleMute)} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                        <i className={`fas fa-${isMuted ? 'volume-mute' : volume > 0.5 ? 'volume-up' : 'volume-down'}`}></i>
                      </button>
                      <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={(e) => handleControlClick(e, () => handleVolumeChange(e))} className="volume-slider" aria-label="Volume control" />
                    </div>
                    
                    <button className="control-button fullscreen" onClick={(e) => handleControlClick(e, toggleFullscreen)} aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                      <i className={`fas fa-${isFullscreen ? 'compress' : 'expand'}`}></i>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="movie-details">
          <h3 className="movie-title">{name}</h3>
          <div className="movie-meta">
            <span>{language}</span>
            <span>•</span>
            <span>{genre}</span>
            <span>•</span>
            <span>{duration}</span>
          </div>
          <div className="movie-year">{year}</div>
          <button className="book-now-btn" onClick={handleBookNowClick}>
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
