import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaFilm, FaTicketAlt, FaUser, FaSignInAlt, FaHome, 
  FaBell, FaSearch, FaTimes, FaBars, FaMapMarkerAlt, FaBuilding, FaChevronDown 
} from 'react-icons/fa';
import '../styles/global.css';
import { CityContext } from '../context/CityContext';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [user, setUser] = useState({ email: '', role: '' });
  const location = useLocation();
  const navigate = useNavigate();
  const { cities, selectedCity, setSelectedCity, loading, theaters, selectedTheater, setSelectedTheater, theatersLoading } = useContext(CityContext);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [theaterDropdownOpen, setTheaterDropdownOpen] = useState(false);
  const cityDropdownRef = useRef(null);
  const theaterDropdownRef = useRef(null);

  // Sync user info from localStorage
  useEffect(() => {
    const email = localStorage.getItem('email') || '';
    const role = localStorage.getItem('role') || '';
    console.log('User data from localStorage:', { email, role }); // Debug log
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setCityDropdownOpen(false);
      }
      if (theaterDropdownRef.current && !theaterDropdownRef.current.contains(event.target)) {
        setTheaterDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            <div className="logo-icon-container">
              <FaFilm className="logo-icon" />
              <div className="logo-icon-glow"></div>
            </div>
            <span className="logo-text">CineNow</span>
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

            {/* Enhanced City & Theater Selector */}
            <div className="location-selector">
              {/* City Dropdown */}
              <div className="dropdown-container" ref={cityDropdownRef}>
                <button
                  className={`location-dropdown-btn ${cityDropdownOpen ? 'active' : ''}`}
                  onClick={() => setCityDropdownOpen(v => !v)}
                  disabled={loading || cities.length === 0}
                  aria-haspopup="listbox"
                  aria-expanded={cityDropdownOpen}
                >
                  <FaMapMarkerAlt className="dropdown-icon" />
                  <span className="dropdown-text">
                    {selectedCity ? selectedCity.name : 'Select City'}
                  </span>
                  <FaChevronDown className={`dropdown-arrow ${cityDropdownOpen ? 'rotated' : ''}`} />
                </button>
                {cityDropdownOpen && cities.length > 0 && (
                  <ul className="dropdown-menu">
                    {cities.map(city => (
                      <li
                        key={city._id}
                        className={`dropdown-item ${selectedCity && selectedCity._id === city._id ? 'selected' : ''}`}
                        onClick={() => { setSelectedCity(city); setCityDropdownOpen(false); }}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter') { setSelectedCity(city); setCityDropdownOpen(false); }}}
                        role="option"
                        aria-selected={selectedCity && selectedCity._id === city._id}
                      >
                        {city.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="dropdown-separator"></div>
              
              {/* Theater Dropdown */}
              <div className="dropdown-container" ref={theaterDropdownRef}>
                <button
                  className={`location-dropdown-btn ${theaterDropdownOpen ? 'active' : ''}`}
                  onClick={() => setTheaterDropdownOpen(v => !v)}
                  disabled={theatersLoading || theaters.length === 0}
                  aria-haspopup="listbox"
                  aria-expanded={theaterDropdownOpen}
                >
                  <FaBuilding className="dropdown-icon" />
                  <span className="dropdown-text">
                    {selectedTheater ? selectedTheater.name : 'Select Theater'}
                  </span>
                  <FaChevronDown className={`dropdown-arrow ${theaterDropdownOpen ? 'rotated' : ''}`} />
                </button>
                {theaterDropdownOpen && theaters.length > 0 && (
                  <ul className="dropdown-menu">
                    {theaters.map(theater => (
                      <li
                        key={theater._id}
                        className={`dropdown-item ${selectedTheater && selectedTheater._id === theater._id ? 'selected' : ''}`}
                        onClick={() => { setSelectedTheater(theater); setTheaterDropdownOpen(false); }}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter') { setSelectedTheater(theater); setTheaterDropdownOpen(false); }}}
                        role="option"
                        aria-selected={selectedTheater && selectedTheater._id === theater._id}
                      >
                        {theater.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="nav-actions">
              <button className="action-btn search-btn" onClick={toggleSearch} aria-label="Search">
                <FaSearch />
              </button>
              
              <Link to="/notifications" className="action-btn notification-btn" aria-label="Notifications">
                <FaBell />
                <span className="notification-badge">3</span>
              </Link>
              
              {/* Enhanced User Section */}
              {user.email ? (
                <div className="user-section">
                  <div className="user-info">
                    {user.role === 'admin' && <span className="admin-badge">Admin</span>}
                    <span className="user-email">{user.email}</span>
                  </div>
                  <Link to="/profile" className="action-btn profile-btn" aria-label="Profile">
                    <div className="profile-icon-container">
                      <FaUser className="profile-icon" />
                      <div className="profile-icon-glow"></div>
                    </div>
                  </Link>
                  <button className="logout-btn" onClick={handleLogout} aria-label="Logout">
                    <FaSignInAlt className="logout-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="auth-section">
                  <Link to="/login" className="auth-btn login-btn" aria-label="Login">
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  <Link to="/signup" className="auth-btn signup-btn" aria-label="Signup">
                    <FaUser />
                    <span>Sign Up</span>
                  </Link>
                </div>
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
        <div className="search-overlay active">
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
          className="mobile-menu-overlay active"
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
