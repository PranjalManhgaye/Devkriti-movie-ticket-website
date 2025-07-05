import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaFilm, FaTicketAlt } from 'react-icons/fa';
import '../styles/PageNotFound.css';

const PageNotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-header">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        </div>
        
        <div className="not-found-actions">
          <Link to="/" className="action-btn home-btn">
            <FaHome className="btn-icon" />
            <span>Go to Homepage</span>
          </Link>
          
          <Link to="/movies" className="action-btn movies-btn">
            <FaFilm className="btn-icon" />
            <span>Browse Movies</span>
          </Link>
          
          <Link to="/booking" className="action-btn booking-btn">
            <FaTicketAlt className="btn-icon" />
            <span>Book Tickets</span>
          </Link>
        </div>
        
        <div className="not-found-search">
          <p>Or try searching for what you're looking for:</p>
          <form className="search-form">
            <input 
              type="text" 
              placeholder="Search movies, cinemas, or showtimes..." 
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
