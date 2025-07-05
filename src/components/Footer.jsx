import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, FaTwitter, FaInstagram, FaYoutube, 
  FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay 
} from 'react-icons/fa';
import '../styles/global.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const aboutLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
  ];

  const quickLinks = [
    { name: 'Movies', path: '/movies' },
    { name: 'Theaters', path: '/theaters' },
    { name: 'Offers', path: '/offers' },
    { name: 'Gift Cards', path: '/gift-cards' },
  ];

  const legalLinks = [
    { name: 'Terms of Use', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Cookie Policy', path: '/cookie-policy' },
    { name: 'Sitemap', path: '/sitemap' },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h3>About MovieHub</h3>
            <p>Your premier destination for the latest movies, showtimes, and ticket bookings. Experience the magic of cinema like never before.</p>
            
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div className="footer-section">
            <h3>About Us</h3>
            <ul>
              {aboutLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h3>Newsletter</h3>
            <p>Subscribe to our newsletter for the latest updates, offers and movie news.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="payment-methods">
            <FaCcVisa title="Visa" />
            <FaCcMastercard title="Mastercard" />
            <FaCcPaypal title="PayPal" />
            <FaCcApplePay title="Apple Pay" />
          </div>
          <p>&copy; {currentYear} MovieHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
