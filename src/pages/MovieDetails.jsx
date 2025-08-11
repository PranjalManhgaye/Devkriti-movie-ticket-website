import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaTicketAlt } from 'react-icons/fa';
import './MovieDetails.css';
import moviesData from '../data/movies';

const FALLBACK_POSTER = 'https://via.placeholder.com/250x370?text=No+Image';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const selectedMovie = moviesData.find(m => m.id === parseInt(id));
    if (selectedMovie) {
      setMovie(selectedMovie);
      // Remove duplicates and the current movie from recommendations
      const recs = moviesData.filter(m => m.id !== selectedMovie.id);
      // Remove duplicate titles
      const uniqueRecs = recs.filter((rec, idx, arr) => arr.findIndex(r => r.title === rec.title) === idx);
      setRecommendations(uniqueRecs.slice(0, 5));
    }
  }, [id]);

  if (!movie) return <div className="loading">Loading...</div>;

  // Cast grid
  let castMembers = [];
  try {
    if (movie && movie.cast) {
      castMembers = movie.cast.split(',').map(actor => ({
        name: actor.trim(),
        role: 'Actor',
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.trim())}&background=2a2a3c&color=fff&size=150`
      }));
    }
  } catch {}

  // Poster src with fallback
  const posterSrc = movie.image || FALLBACK_POSTER;

  return (
    <div className="movie-detail-root">
      {/* Hero Section with background */}
      <section className="movie-hero-bg" style={{ backgroundImage: `linear-gradient(rgba(20,20,30,0.85),rgba(20,20,30,0.85)), url(${posterSrc})` }}>
        <div className="movie-hero-flex">
          {/* Poster on left (desktop) or top (mobile) */}
          <div className="movie-poster-standalone">
            <img
              src={posterSrc}
              alt={movie.title + ' poster'}
              onError={e => { e.target.onerror = null; e.target.src = FALLBACK_POSTER; }}
              className="movie-poster-img"
            />
          </div>
          {/* Info on right (desktop) or below (mobile) */}
          <div className="movie-hero-main">
            <h1 className="movie-title">{movie.title}</h1>
            <div className="movie-release-date">{movie.year}</div>
            {movie.tagline && <div className="movie-tagline">{movie.tagline}</div>}
            <div className="movie-summary">{movie.plot}</div>
            <button className="book-now-btn-accent" onClick={() => navigate(`/booking`, { state: { movie } })}>
              <FaTicketAlt /> Book Now
            </button>
          </div>
        </div>
      </section>

      {/* Movie Details Section */}
      <section className="movie-details-section">
        <div className="movie-details-grid">
          <div className="detail-label">Director</div>
          <div className="detail-value">{movie.director}</div>
          <div className="detail-label">Release Date</div>
          <div className="detail-value">{movie.year}</div>
          <div className="detail-label">Genre</div>
          <div className="detail-value">{movie.genre}</div>
          <div className="detail-label">Format</div>
          <div className="detail-value">{movie.format}</div>
          <div className="detail-label">Language</div>
          <div className="detail-value">{movie.language}</div>
          <div className="detail-label">Rating</div>
          <div className="detail-value"><FaStar className="star-icon" /> {movie.rating}/10</div>
          <div className="detail-label">Duration</div>
          <div className="detail-value">{movie.duration}</div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="movie-overview-section">
        <h2>Overview</h2>
        <p className="movie-overview-text">{movie.plot}</p>
      </section>

      {/* Cast & Crew Grid */}
      {castMembers.length > 0 && (
        <section className="movie-cast-crew-section">
          <h2>Cast & Crew</h2>
          <div className="movie-cast-grid">
            {castMembers.map((member, idx) => (
              <div className="movie-cast-card text-center" key={idx}>
                <img
                  className="movie-cast-avatar"
                  src={member.image || 'https://via.placeholder.com/100'}
                  alt={member.name}
                  style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto' }}
                  onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100'; }}
                />
                <p className="movie-cast-name font-semibold mt-2">{member.name}</p>
                <p className="movie-cast-role text-sm text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Movies */}
      {recommendations.length > 0 && (
        <section className="movie-recommend-section">
          <h2>You May Also Like</h2>
          <div className="movie-recommend-scroll">
            {recommendations.map(rec => (
              <div className="movie-recommend-card" key={rec.id} onClick={() => navigate(`/movies/${rec.id}`)}>
                <img src={rec.image} alt={rec.title} className="movie-recommend-img" />
                <div className="movie-recommend-title">{rec.title}</div>
                <div className="movie-recommend-meta">
                  <span>{rec.year}</span>
                  <span><FaStar className="star-icon" /> {rec.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
