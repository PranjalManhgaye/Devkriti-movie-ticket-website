import React, { useState, useEffect } from "react";
import { 
  FaTicketAlt, FaCalendar, FaClock, FaChair, FaCreditCard, FaSpinner, 
  FaUser, FaEnvelope, FaCrown, FaHistory, FaFilm, FaStar, FaMapMarkerAlt 
} from "react-icons/fa";
import paymentService from "../services/paymentService";
import "./Profile.css";

function Profile() {
  const email = localStorage.getItem('email') || '';
  const role = localStorage.getItem('role') || '';
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching booking history...');
      const bookingHistory = await paymentService.getBookingHistory();
      console.log('Booking history received:', bookingHistory);
      setBookings(bookingHistory);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaStar className="status-icon" />;
      case 'pending':
        return <FaClock className="status-icon" />;
      case 'failed':
        return <FaCreditCard className="status-icon" />;
      default:
        return <FaTicketAlt className="status-icon" />;
    }
  };

  return (
    <div className="profile-container">
      {/* Enhanced Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser className="avatar-icon" />
        </div>
        <div className="profile-info-section">
          <h1 className="profile-title">
            <FaUser className="title-icon" />
            Your Profile
          </h1>
          <div className="profile-details">
            <div className="detail-card">
              <FaEnvelope className="detail-card-icon" />
              <div className="detail-card-content">
                <span className="detail-label">Email</span>
                <span className="detail-value">{email}</span>
              </div>
            </div>
            <div className="detail-card">
              {role === 'admin' ? (
                <>
                  <FaCrown className="detail-card-icon admin-icon" />
                  <div className="detail-card-content">
                    <span className="detail-label">Role</span>
                    <span className="detail-value admin-badge">Admin</span>
                  </div>
                </>
              ) : (
                <>
                  <FaUser className="detail-card-icon" />
                  <div className="detail-card-content">
                    <span className="detail-label">Role</span>
                    <span className="detail-value">User</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Booking History Section */}
      <div className="booking-history-section">
        <div className="section-header">
          <FaHistory className="section-icon" />
          <h2>Booking History</h2>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <FaSpinner className="spinner" />
            </div>
            <p className="loading-text">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings-container">
            <div className="no-bookings-icon-wrapper">
              <FaFilm className="no-bookings-icon" />
            </div>
            <h3 className="no-bookings-title">No bookings found</h3>
            <p className="no-bookings-subtitle">Start by booking your first movie ticket!</p>
            <div className="no-bookings-cta">
              <FaTicketAlt className="cta-icon" />
              <span>Book Now</span>
            </div>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="movie-info">
                    <FaFilm className="movie-icon" />
                    <h3 className="movie-title">{booking.movieTitle}</h3>
                  </div>
                  <div className="status-container">
                    {getStatusIcon(booking.paymentStatus)}
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.paymentStatus) }}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>
                
                <div className="booking-details">
                  <div className="detail-item">
                    <FaTicketAlt className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Booking ID</span>
                      <span className="detail-value">{booking.bookingId}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FaCalendar className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{formatDate(booking.date)}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FaClock className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Showtime</span>
                      <span className="detail-value">{booking.showtime}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FaChair className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Seats</span>
                      <span className="detail-value">
                        {booking.seats.map(seat => {
                          const [row, col] = seat.split('-');
                          return `${String.fromCharCode(65 + parseInt(row))}${parseInt(col) + 1}`;
                        }).join(', ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FaCreditCard className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Amount</span>
                      <span className="detail-value amount">₹{booking.totalAmount}</span>
                    </div>
                  </div>
                  
                  {booking.razorpayOrderId && (
                    <div className="detail-item">
                      <FaCreditCard className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Order ID</span>
                        <span className="detail-value order-id">{booking.razorpayOrderId}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
