import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaPlay, 
  FaTicketAlt, 
  FaChair, 
  FaCreditCard, 
  FaStar, 
  FaArrowRight,
  FaFilm,
  FaCalendar,
  FaClock,
  FaUsers,
  FaShieldAlt,
  FaMobileAlt
} from "react-icons/fa";
import "./Home.css";
import { CityContext } from "../context/CityContext";

function Home() {
  const navigate = useNavigate();
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const { cities, selectedCity, setSelectedCity, loading: cityLoading } = useContext(CityContext);

  // Featured movies for the hero section
  const featuredMovies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      genre: "Action • Adventure • Drama",
      rating: "9.0",
      year: "2019",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80"
    },
    {
      id: 2,
      title: "Inception",
      genre: "Action • Sci-Fi • Thriller",
      rating: "8.8",
      year: "2010",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 3,
      title: "The Dark Knight",
      genre: "Action • Crime • Drama",
      rating: "9.0",
      year: "2008",
      image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  // Auto-rotate featured movies
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovieIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const currentMovie = featuredMovies[currentMovieIndex];

  // Example: fetch theaters when selectedCity changes (logic only)
  // useEffect(() => {
  //   if (selectedCity) {
  //     fetch(`/api/theaters?city=${selectedCity._id}`)
  //       .then(res => res.json())
  //       .then(data => {
  //         // Store theaters in state/context as needed
  //       });
  //   }
  // }, [selectedCity]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img src={currentMovie.image} alt={currentMovie.title} />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Experience Cinema Like Never Before
            </h1>
            <p className="hero-subtitle">
              Book your favorite movies, choose the perfect seats, and enjoy an unforgettable cinematic experience
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-primary"
                onClick={() => navigate('/movies')}
              >
                <FaTicketAlt />
                Book Now
              </button>
              <button className="btn-secondary">
                <FaPlay />
                Watch Trailer
              </button>
            </div>
          </div>
          
          <div className="hero-movie-card">
            <div className="movie-poster">
              <img src={currentMovie.image} alt={currentMovie.title} />
              <div className="movie-overlay">
                <FaPlay />
              </div>
            </div>
            <div className="movie-info">
              <h3>{currentMovie.title}</h3>
              <p className="movie-genre">{currentMovie.genre}</p>
              <div className="movie-rating">
                <FaStar />
                <span>{currentMovie.rating}</span>
              </div>
              <p className="movie-year">{currentMovie.year}</p>
            </div>
          </div>
        </div>
        
        <div className="hero-indicators">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentMovieIndex ? 'active' : ''}`}
              onClick={() => setCurrentMovieIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose BookMyCinema?</h2>
            <p>Experience the best in movie booking with our premium features</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaTicketAlt />
              </div>
              <h3>Easy Booking</h3>
              <p>Book your tickets in just a few clicks with our streamlined booking process</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaChair />
              </div>
              <h3>Seat Selection</h3>
              <p>Choose your perfect seat with our interactive seat map</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaCreditCard />
              </div>
              <h3>Secure Payments</h3>
              <p>Safe and secure payment processing with multiple payment options</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaMobileAlt />
              </div>
              <h3>Mobile Friendly</h3>
              <p>Book tickets on any device with our responsive design</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Secure & Reliable</h3>
              <p>Your data and payments are protected with industry-standard security</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>24/7 Support</h3>
              <p>Get help anytime with our round-the-clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get your movie tickets in 3 simple steps</p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">
                <FaFilm />
              </div>
              <h3>Choose Your Movie</h3>
              <p>Browse through our extensive collection of movies and select your favorite</p>
            </div>
            
            <div className="step-arrow">
              <FaArrowRight />
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">
                <FaChair />
              </div>
              <h3>Select Your Seats</h3>
              <p>Pick the perfect seats from our interactive seat map</p>
            </div>
            
            <div className="step-arrow">
              <FaArrowRight />
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">
                <FaCreditCard />
              </div>
              <h3>Pay & Enjoy</h3>
              <p>Complete your payment and get ready for an amazing movie experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready for an Amazing Movie Experience?</h2>
            <p>Join thousands of movie lovers who trust BookMyCinema for their entertainment</p>
            <button 
              className="btn-primary btn-large"
              onClick={() => navigate('/movies')}
            >
              Start Booking Now
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Movies Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Section - Remove this later */}
      <section style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.1)' }}>
        <button 
          onClick={() => {
            localStorage.removeItem('hasSeenLoading');
            window.location.reload();
          }}
          style={{
            background: '#f72585',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          Reset Loading Animation (Test)
        </button>
      </section>
    </div>
  );
}

export default Home;
