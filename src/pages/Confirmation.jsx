import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTicketAlt, FaCreditCard, FaCalendar, FaClock, FaChair, FaArrowLeft } from "react-icons/fa";
import "./Confirmation.css";

function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;

  // Debug: Log the booking data
  console.log('Confirmation page - booking data:', booking);
  console.log('Booking movie:', booking?.movie);
  console.log('Booking seats:', booking?.seats);
  console.log('Booking total:', booking?.total);

  const downloadTicket = () => {
    if (!booking) return;

    // Create ticket content
    const ticketContent = `
🎬 MOVIE TICKET 🎬

Booking ID: ${booking.bookingId}
Movie: ${booking.movie.name}
Date: ${new Date(booking.date).toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
Showtime: ${booking.showtime}
Seats: ${booking.seats.map(seat => {
  const [row, col] = seat.split('-');
  return `${String.fromCharCode(65 + parseInt(row))}${parseInt(col) + 1}`;
}).join(', ')}
Total Amount: ₹${booking.total}

${booking.paymentId ? `Payment ID: ${booking.paymentId}` : ''}
${booking.orderId ? `Order ID: ${booking.orderId}` : ''}

🎫 Enjoy your movie! 🎫
Generated on: ${new Date().toLocaleString()}
    `;

    // Create blob and download
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${booking.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!booking) {
    return (
      <div className="confirmation-container">
        <h2>No booking found</h2>
        <button onClick={() => navigate('/movies')} className="btn">
          <FaArrowLeft style={{ marginRight: '0.5rem' }} />
          Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-header">
          <FaCheckCircle className="success-icon" />
          <h1>Booking Confirmed!</h1>
          <p>Your payment was successful and your tickets are confirmed.</p>
        </div>

        <div className="booking-details">
          <h2>Booking Details</h2>
          
          <div className="detail-row">
            <FaTicketAlt className="detail-icon" />
            <div>
              <span className="detail-label">Booking ID:</span>
              <span className="detail-value" style={{ color: booking.bookingId ? '#333' : '#999' }}>
                {booking.bookingId || 'No booking ID available'}
              </span>
            </div>
          </div>

          <div className="detail-row">
            <FaTicketAlt className="detail-icon" />
            <div>
              <span className="detail-label">Movie:</span>
              <span className="detail-value" style={{ color: booking.movie?.name ? '#333' : '#999' }}>
                {booking.movie?.name || 'No movie name available'}
              </span>
            </div>
          </div>

          <div className="detail-row">
            <FaCalendar className="detail-icon" />
            <div>
              <span className="detail-label">Date:</span>
              <span className="detail-value">
                {booking.date ? new Date(booking.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'N/A'}
              </span>
            </div>
          </div>

          <div className="detail-row">
            <FaClock className="detail-icon" />
            <div>
              <span className="detail-label">Showtime:</span>
              <span className="detail-value">{booking.showtime || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-row">
            <FaChair className="detail-icon" />
            <div>
              <span className="detail-label">Seats:</span>
              <span className="detail-value">
                {booking.seats && booking.seats.length > 0 ? 
                  booking.seats.map(seat => {
                    const [row, col] = seat.split('-');
                    return `${String.fromCharCode(65 + parseInt(row))}${parseInt(col) + 1}`;
                  }).join(', ') : 'N/A'
                }
              </span>
            </div>
          </div>

          <div className="detail-row">
            <FaCreditCard className="detail-icon" />
            <div>
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value">₹{booking.total || 'N/A'}</span>
            </div>
          </div>

          {booking.paymentId && (
            <div className="detail-row">
              <FaCreditCard className="detail-icon" />
              <div>
                <span className="detail-label">Payment ID:</span>
                <span className="detail-value">{booking.paymentId}</span>
              </div>
            </div>
          )}

          {booking.orderId && (
            <div className="detail-row">
              <FaCreditCard className="detail-icon" />
              <div>
                <span className="detail-label">Order ID:</span>
                <span className="detail-value">{booking.orderId}</span>
              </div>
            </div>
          )}
        </div>

        {booking.isTestPayment && (
          <div className="test-payment-notice">
            <p>🎉 This was a test payment - no actual charges were made!</p>
          </div>
        )}

        <div className="confirmation-actions">
          <button onClick={downloadTicket} className="btn primary">
            Download Ticket
          </button>
          <button onClick={() => navigate('/profile')} className="btn secondary">
            View My Bookings
          </button>
          <button onClick={() => navigate('/movies')} className="btn secondary">
            Book More Tickets
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
