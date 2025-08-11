import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin,
  FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay, FaEnvelope,
  FaMapMarkerAlt, FaPhoneAlt, FaPaperPlane
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/global.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const aboutLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Story', path: '/our-story' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
    { name: 'Blog', path: '/blog' },
  ];

  const quickLinks = [
    { name: 'Movies', path: '/movies' },
    { name: 'Theaters', path: '/theaters' },
    { name: 'Coming Soon', path: '/coming-soon' },
    { name: 'Top Rated', path: '/top-rated' },
    { name: 'Gift Cards', path: '/gift-cards' },
  ];

  const supportLinks = [
    { name: 'Contact Us', path: '/contact' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Help Center', path: '/help' },
    { name: 'Accessibility', path: '/accessibility' },
  ];

  const legalLinks = [
    { name: 'Terms of Use', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Cookie Policy', path: '/cookie-policy' },
    { name: 'Sitemap', path: '/sitemap' },
    { name: 'Do Not Sell My Info', path: '/do-not-sell' },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaTwitter />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaInstagram />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaYoutube />, url: 'https://youtube.com', label: 'YouTube' },
    { icon: <FaLinkedin />, url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, text: '123 Cinema St, Movie City, GWALIOR 12345' },
    { icon: <FaPhoneAlt />, text: '+91 6263036465' },
    { icon: <FaEnvelope />, text: 'info@moviehub.example.com' },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, you would handle the subscription here
      console.log('Subscribed with email:', email);
      setIsSubscribed(true);
      setEmail('');
      // Reset subscription message after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512,64,583,67.3c66.2,3,127.1-15.88,175.39-38.39,23.4-10.8,50-19.71,75.54-28.15,73.9-24.35,147.9-30,222.8-3.11V0Z" opacity=".25" fill="var(--bg-secondary)"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="var(--bg-secondary)"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="var(--bg-secondary)"></path>
        </svg>
      </div>
      
      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section about">
            <div className="footer-logo">
              <span className="logo-icon">🎬</span>
              <h3>MovieHub</h3>
            </div>
            <p className="footer-about-text">
              Your premier destination for the latest movies, showtimes, and ticket bookings. 
              Experience the magic of cinema like never before.
            </p>
            
            <div className="contact-info">
              {contactInfo.map((item, index) => (
                <div key={index} className="contact-item">
                  <span className="contact-icon">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ y: -3, color: 'var(--primary)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={link.path}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Link to={link.path} className="footer-link">
                    <span className="link-arrow">→</span> {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div className="footer-section">
            <h3 className="footer-heading">About Us</h3>
            <ul className="footer-links">
              {aboutLinks.map((link, index) => (
                <motion.li 
                  key={link.path}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Link to={link.path} className="footer-link">
                    <span className="link-arrow">→</span> {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              {supportLinks.map((link, index) => (
                <motion.li 
                  key={link.path}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Link to={link.path} className="footer-link">
                    <span className="link-arrow">→</span> {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3 className="footer-heading">Legal</h3>
            <ul className="footer-links">
              {legalLinks.map((link, index) => (
                <motion.li 
                  key={link.path}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Link to={link.path} className="footer-link">
                    <span className="link-arrow">→</span> {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section newsletter">
            <h3 className="footer-heading">Newsletter</h3>
            <p className="newsletter-text">
              Subscribe to our newsletter for the latest updates, exclusive offers, and movie news 
              delivered straight to your inbox.
            </p>
            
            {isSubscribed ? (
              <div className="subscription-success">
                <FaPaperPlane className="success-icon" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <div className="form-group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address" 
                    required 
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-button">
                    <FaPaperPlane className="submit-icon" />
                    <span>Subscribe</span>
                  </button>
                </div>
              </form>
            )}
            
            <div className="app-download">
              <p>Download our app</p>
              <div className="app-buttons">
                <a href="#" className="app-button">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" />
                </a>
                <a href="#" className="app-button">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              &copy; {currentYear} MovieHub. All rights reserved.
            </div>
            
            <div className="legal-links">
              {legalLinks.slice(0, 3).map((link, index) => (
                <React.Fragment key={link.path}>
                  <Link to={link.path} className="legal-link">{link.name}</Link>
                  {index < 2 && <span className="divider">•</span>}
                </React.Fragment>
              ))}
            </div>
            
            <div className="payment-methods">
              <div className="payment-icon">
                <FaCcVisa title="Visa" />
              </div>
              <div className="payment-icon">
                <FaCcMastercard title="Mastercard" />
              </div>
              <div className="payment-icon">
                <FaCcPaypal title="PayPal" />
              </div>
              <div className="payment-icon">
                <FaCcApplePay title="Apple Pay" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
