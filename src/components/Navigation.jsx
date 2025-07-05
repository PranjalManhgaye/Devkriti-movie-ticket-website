import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaFilm, FaTicketAlt, FaUser, FaSignInAlt, FaHome, 
  FaBell, FaSearch, FaTimes, FaBars 
} from 'react-icons/fa';
import '../styles/global.css';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [user, setUser] = useState({ email: '', role: '' });
  const location = useLocation();
  const navigate = useNavigate();

  // Sync user info from localStorage
  useEffect(() => {
    const email = localStorage.getItem('email') || '';
    const role = localStorage.getItem('role') || '';
    setUser({ email, role });
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUser({ email: '', role: '' });
    navigate('/login');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setHasScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Check if a nav link is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <header className={`header ${hasScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <Link to="/" className="logo">
            <FaFilm className="logo-icon" />
            <span>MovieHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`nav ${isMobileMenuOpen ? 'active' : ''}`}>
            <ul className="nav-links">
              <li>
                <Link to="/" className={`nav-link ${isActive('/')}`}>
                  <FaHome className="nav-icon" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/movies" className={`nav-link ${isActive('/movies')}`}>
                  <FaFilm className="nav-icon" />
                  <span>Movies</span>
                </Link>
              </li>
              <li>
                <Link to="/booking" className={`nav-link ${isActive('/booking')}`}>
                  <FaTicketAlt className="nav-icon" />
                  <span>Book Tickets</span>
                </Link>
              </li>
            </ul>

            <div className="nav-actions">
              <button className="search-btn" onClick={toggleSearch} aria-label="Search">
                <FaSearch />
              </button>
              
              <Link to="/notifications" className="notification-btn" aria-label="Notifications">
                <FaBell />
                <span className="notification-badge">3</span>
              </Link>
              
              {/* Show profile and logout if logged in, else login/signup */}
              {user.email ? (
                <>
                  <span style={{marginRight: 10, fontWeight: 500}}>
                    {user.role === 'admin' && <span style={{color: '#f72585'}}>Admin</span>} {user.email}
                  </span>
                  <Link to="/profile" className="profile-btn" aria-label="Profile">
                    <FaUser />
                  </Link>
                  <button className="logout-btn" style={{marginLeft: 10}} onClick={handleLogout} aria-label="Logout">
                    <FaSignInAlt style={{transform: 'rotate(180deg)'}} />
                    <span className="login-text">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="login-btn" aria-label="Login">
                    <FaSignInAlt />
                    <span className="login-text">Login</span>
                  </Link>
                  <Link to="/signup" className="login-btn" aria-label="Signup">
                    <FaUser />
                    <span className="login-text">Sign Up</span>
                  </Link>
                </>
              )}

            </div>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-menu-btn" 
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay">
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="Search for movies..." 
              autoFocus 
            />
            <button type="submit" aria-label="Search">
              <FaSearch />
            </button>
          </form>
          <button className="close-search" onClick={toggleSearch} aria-label="Close search">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={toggleMobileMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleMobileMenu()}
          aria-label="Close menu"
        />
      )}
    </>
  );
};

export default Navigation;
