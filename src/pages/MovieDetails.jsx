import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaClock, FaCalendarAlt, FaFilm, FaGlobe, FaPlayCircle, FaArrowLeft } from 'react-icons/fa';
import './MovieDetails.css';

// Mock data - in a real app, this would come from an API
const movieDatabase = {
  1: {
    id: 1,
    title: 'Inception',
    rating: '8.8',
    language: 'English',
    genre: 'Sci-Fi',
    format: 'IMAX',
    image: 'https://via.placeholder.com/800x450/2a2a3c/ffffff?text=Inception',
    banner: 'https://via.placeholder.com/1920x500/1a1a2e/ffffff?text=Inception+Banner',
    duration: '2h 28m',
    year: '2010',
    director: 'Christopher Nolan',
    cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
    plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    trailer: 'https://www.youtube.com/embed/YoHD9XEInc0',
  },
  2: {
    id: 2,
    title: 'Parasite',
    rating: '8.6',
    language: 'Korean',
    genre: 'Thriller',
    format: '2D',
    image: 'https://via.placeholder.com/800x450/2a2a3c/ffffff?text=Parasite',
    banner: 'https://via.placeholder.com/1920x500/1a1a2e/ffffff?text=Parasite+Banner',
    duration: '2h 12m',
    year: '2019',
    director: 'Bong Joon Ho',
    cast: 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong',
    plot: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    trailer: 'https://www.youtube.com/embed/5xH0HfJHsaY',
  },
  // Add more movies as needed
};

// Mock recommendations based on the current movie
const getRecommendations = (currentMovieId) => {
  const allMovies = Object.values(movieDatabase);
  return allMovies.filter(movie => movie.id !== currentMovieId).slice(0, 3);
};

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const selectedMovie = movieDatabase[parseInt(id)];
    if (selectedMovie) {
      setMovie(selectedMovie);
      setRecommendations(getRecommendations(selectedMovie.id));
    }
  }, [id]);

  if (!movie) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="movie-details">
      <div 
        className="movie-banner" 
        style={{ backgroundImage: `url(${movie.banner})` }}
      >
        <div className="banner-overlay">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to Movies
          </button>
          <div className="banner-content">
            <h1>{movie.title} <span className="year">({movie.year})</span></h1>
            <div className="movie-meta">
              <span className="rating"><FaStar className="icon" /> {movie.rating}/10</span>
              <span><FaClock className="icon" /> {movie.duration}</span>
              <span><FaFilm className="icon" /> {movie.genre}</span>
              <span><FaGlobe className="icon" /> {movie.language}</span>
            </div>
            <button 
              className="trailer-button"
              onClick={() => setShowTrailer(true)}
            >
              <FaPlayCircle /> Watch Trailer
            </button>
          </div>
        </div>
      </div>

      {showTrailer && (
        <div className="trailer-modal">
          <div className="trailer-container">
            <button className="close-trailer" onClick={() => setShowTrailer(false)}>×</button>
            <iframe
              title={`${movie.title} Trailer`}
              width="100%"
              height="100%"
              src={movie.trailer}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="movie-content">
        <div className="movie-info">
          <div className="movie-poster">
            <img src={movie.image} alt={movie.title} />
          </div>
          <div className="movie-desc">
            <h2>Overview</h2>
            <p>{movie.plot}</p>
            
            <div className="movie-details-grid">
              <div className="detail-item">
                <span className="detail-label">Director</span>
                <span className="detail-value">{movie.director}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cast</span>
                <span className="detail-value">{movie.cast}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Release Date</span>
                <span className="detail-value">{movie.year}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Format</span>
                <span className="detail-value">{movie.format}</span>
              </div>
            </div>
            
            <button 
              className="book-now-button"
              onClick={() => navigate(`/booking`, { state: { movie } })}
            >
              <FaTicketAlt /> Book Now
            </button>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="recommendations">
            <h2>You May Also Like</h2>
            <div className="recommendations-grid">
              {recommendations.map(rec => (
                <div 
                  key={rec.id} 
                  className="recommendation-card"
                  onClick={() => navigate(`/movies/${rec.id}`)}
                >
                  <img src={rec.image} alt={rec.title} />
                  <h3>{rec.title}</h3>
                  <div className="rec-meta">
                    <span><FaStar /> {rec.rating}</span>
                    <span>{rec.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
