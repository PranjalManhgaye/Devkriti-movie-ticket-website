import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChair, FaTicketAlt, FaArrowLeft, FaCheck, FaTimes, FaCreditCard, FaSpinner, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import paymentService from '../services/paymentService';
import './Booking.css';
import { CityContext } from '../context/CityContext';

const seatLayout = {
  rows: 12,
  cols: 14,
  aisles: [3, 10],
  gaps: [{ row: 5, count: 1 }],
  types: {
    premium: {
      rows: [0, 1, 2],
      price: 18.99,
    },
    standard: {
      rows: [3, 4, 5, 6, 7, 8, 9, 10, 11],
      price: 12.99,
    },
  },
};

const generateOccupiedSeats = () => {
  const occupied = [];
  const totalSeats = seatLayout.rows * seatLayout.cols;
  const occupiedCount = Math.floor(totalSeats * 0.2);

  for (let i = 0; i < occupiedCount; i++) {
    const row = Math.floor(Math.random() * seatLayout.rows);
    const col = Math.floor(Math.random() * seatLayout.cols);
    const seatId = `${row}-${col}`;

    if (!occupied.includes(seatId) && !seatLayout.aisles.includes(col)) {
      occupied.push(seatId);
    }
  }

  return occupied;
};

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats] = useState(generateOccupiedSeats());
  const [showtime, setShowtime] = useState('');
  const [date, setDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    showCvv: false
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const { selectedCity } = useContext(CityContext);

  // Set default showtime and date when component mounts
  useEffect(() => {
    // Set default showtime to next available show
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000); // Next hour
    const options = { hour: '2-digit', minute: '2-digit' };
    setShowtime(nextHour.toLocaleTimeString([], options));
    
    // Set default date to today
    setDate(now.toISOString().split('T')[0]);
  }, []);

  if (!movie) {
    return (
      <div className="booking-container" style={{ textAlign: 'center' }}>
        <h2>No movie selected</h2>
        <button 
          onClick={() => navigate('/movies')} 
          className="btn"
          style={{ marginTop: '1rem' }}
        >
          <FaArrowLeft style={{ marginRight: '0.5rem' }} />
          Back to Movies
        </button>
      </div>
    );
  }

  const toggleSeat = (row, col) => {
    const seatId = `${row}-${col}`;
    
    // Don't allow selecting occupied seats
    if (isSeatOccupied(seatId)) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const isSeatOccupied = (seatId) => {
    return occupiedSeats.includes(seatId);
  };

  const isSeatSelected = (seatId) => {
    return selectedSeats.includes(seatId);
  };

    const getSeatTypeAndPrice = (row) => {
    if (seatLayout.types.premium.rows.includes(row)) {
      return { type: 'premium', price: seatLayout.types.premium.price };
    }
    return { type: 'standard', price: seatLayout.types.standard.price };
  };

  const getSeatStatus = (row, col) => {
    const seatId = `${row}-${col}`;
    if (isSeatOccupied(seatId)) return 'occupied';
    if (isSeatSelected(seatId)) return 'selected';
    return 'available';
  };

    const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const [row] = seatId.split('-').map(Number);
      const { price } = getSeatTypeAndPrice(row);
      return total + price;
    }, 0).toFixed(2);
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to book.');
      return;
    }

    // Show payment modal instead of direct processing
    setShowPaymentModal(true);
  };

  const handlePaymentFormChange = (field, value) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const validatePaymentForm = () => {
    const { cardNumber, cardHolder, expiryMonth, expiryYear, cvv } = paymentForm;
    
    if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      return 'Please enter a valid 16-digit card number';
    }
    
    if (!cardHolder.trim()) {
      return 'Please enter card holder name';
    }
    
    if (!expiryMonth || !expiryYear) {
      return 'Please enter expiry date';
    }
    
    if (!cvv.match(/^\d{3,4}$/)) {
      return 'Please enter a valid CVV';
    }
    
    return null;
  };

  const processPayment = async () => {
    const validationError = validatePaymentForm();
    if (validationError) {
      setPaymentError(validationError);
      return;
    }

    setPaymentProcessing(true);
    setPaymentError('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const bookingDetails = {
        movie,
        seats: selectedSeats,
        showtime,
        date,
        total: parseFloat(calculateTotal()),
        bookingId: `BK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        bookingDate: new Date().toISOString()
      };

      // Simulate successful payment
      const paymentResult = {
        success: true,
        paymentId: `pay_${Math.random().toString(36).substr(2, 12)}`,
        orderId: `order_${Math.random().toString(36).substr(2, 12)}`,
        transactionId: `txn_${Math.random().toString(36).substr(2, 12)}`
      };

      const confirmationData = { 
        ...bookingDetails, 
        paymentId: paymentResult.paymentId,
        orderId: paymentResult.orderId,
        transactionId: paymentResult.transactionId,
        paymentStatus: 'completed',
        isTestPayment: true
      };
      
      console.log('Payment successful:', confirmationData);
      
      // Close modal and navigate to confirmation
      setShowPaymentModal(false);
      navigate('/confirmation', { 
        state: confirmationData
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('Payment failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const renderSeats = () => {
    const seatRows = [];
    for (let row = 0; row < seatLayout.rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < seatLayout.cols; col++) {
        if (seatLayout.aisles.includes(col)) {
          rowSeats.push(<div key={`aisle-${row}-${col}`} className="aisle"></div>);
        } else {
          const seatId = `${row}-${col}`;
          const status = getSeatStatus(row, col);
          const { type } = getSeatTypeAndPrice(row);

          rowSeats.push(
            <div
              key={seatId}
              className={`seat ${status} ${type}`}
              onClick={() => toggleSeat(row, col)}
            >
              {status === 'selected' && <FaCheck />}
              {status === 'occupied' && <FaTimes />}
              {status === 'available' && <FaChair />}
            </div>
          );
        }
      }
      seatRows.push(<div key={row} className="seat-row">{rowSeats}</div>);
      
      const gap = seatLayout.gaps.find(g => g.row === row);
      if (gap) {
        seatRows.push(<div key={`gap-${row}`} className="gap" style={{ height: `${gap.count * 2}rem` }}></div>);
      }
    }
    return <div className="seat-grid">{seatRows}</div>;
  };

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1>Book Your Seats</h1>
        <h2 className="movie-title">{movie.name}</h2>
        
        <div className="showtime-selector">
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input 
              type="date" 
              id="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="showtime">Showtime:</label>
            <select 
              id="showtime" 
              value={showtime}
              onChange={(e) => setShowtime(e.target.value)}
            >
              <option value="14:00">2:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="22:30">10:30 PM</option>
            </select>
          </div>
        </div>
      </div>
      
      {renderSeats()}
      
      <div className="booking-summary">
        <div className="legend-container">
          <div className="legend-item">
            <div className="legend-icon standard"></div>
            <span>Standard (${seatLayout.types.standard.price})</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon premium"></div>
            <span>Premium (${seatLayout.types.premium.price})</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon occupied"></div>
            <span>Occupied</span>
          </div>
        </div>
        
        <div className="booking-details">
          <h3>Booking Summary</h3>
          
          <div className="detail-row">
            <span className="detail-label">Movie:</span>
            <span className="detail-value">{movie.name}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Date & Time:</span>
            <span className="detail-value">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              {' '}at {showtime}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Seats:</span>
            <span className="detail-value">
              {selectedSeats.length > 0 
                ? selectedSeats.map(seat => {
                    const [row, col] = seat.split('-');
                    return `${String.fromCharCode(65 + parseInt(row))}${parseInt(col) + 1}`;
                  }).join(', ')
                : 'None selected'}
            </span>
          </div>
          

          
          <div className="total">
            <span>Total:</span>
            <span>${calculateTotal()}</span>
          </div>
          
          {paymentError && (
            <div className="payment-error">
              {paymentError}
            </div>
          )}
          
          <button 
            className="confirm-btn"
            onClick={confirmBooking}
            disabled={selectedSeats.length === 0 || isProcessing}
          >
            {isProcessing ? (
              <>
                <FaSpinner className="spinner" />
                Processing Test Payment...
              </>
            ) : (
              <>
                <FaCreditCard />
                Test Payment & Confirm Booking
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Razorpay Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <div className="payment-logo">
                <FaCreditCard className="payment-logo-icon" />
                <span>Razorpay</span>
              </div>
              <button 
                className="close-modal-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="payment-modal-content">
              <div className="payment-summary">
                <h3>Payment Summary</h3>
                <div className="payment-details">
                  <div className="payment-item">
                    <span>Movie:</span>
                    <span>{movie.name}</span>
                  </div>
                  <div className="payment-item">
                    <span>Seats:</span>
                    <span>{selectedSeats.length} selected</span>
                  </div>
                  <div className="payment-item">
                    <span>Date:</span>
                    <span>{date}</span>
                  </div>
                  <div className="payment-item">
                    <span>Showtime:</span>
                    <span>{showtime}</span>
                  </div>
                  <div className="payment-item total">
                    <span>Total Amount:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="payment-form">
                <h3>Card Details</h3>
                
                <div className="form-group">
                  <label>Card Number</label>
                  <div className="card-input">
                    <FaCreditCard className="card-icon" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={(e) => handlePaymentFormChange('cardNumber', formatCardNumber(e.target.value))}
                      maxLength="19"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Card Holder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={paymentForm.cardHolder}
                    onChange={(e) => handlePaymentFormChange('cardHolder', e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <div className="expiry-inputs">
                      <select
                        value={paymentForm.expiryMonth}
                        onChange={(e) => handlePaymentFormChange('expiryMonth', e.target.value)}
                      >
                        <option value="">MM</option>
                        {Array.from({length: 12}, (_, i) => (
                          <option key={i+1} value={String(i+1).padStart(2, '0')}>
                            {String(i+1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                      <select
                        value={paymentForm.expiryYear}
                        onChange={(e) => handlePaymentFormChange('expiryYear', e.target.value)}
                      >
                        <option value="">YYYY</option>
                        {Array.from({length: 10}, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <div className="cvv-input">
                      <input
                        type={paymentForm.showCvv ? "text" : "password"}
                        placeholder="123"
                        value={paymentForm.cvv}
                        onChange={(e) => handlePaymentFormChange('cvv', e.target.value.replace(/\D/g, ''))}
                        maxLength="4"
                      />
                      <button
                        type="button"
                        className="toggle-cvv-btn"
                        onClick={() => handlePaymentFormChange('showCvv', !paymentForm.showCvv)}
                      >
                        {paymentForm.showCvv ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>

                {paymentError && (
                  <div className="payment-error">
                    {paymentError}
                  </div>
                )}

                <div className="payment-security">
                  <FaLock className="security-icon" />
                  <span>Your payment is secured by Razorpay</span>
                </div>

                <button
                  className="pay-button"
                  onClick={processPayment}
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? (
                    <>
                      <FaSpinner className="spinner" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <FaCreditCard />
                      Pay ₹{calculateTotal()}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
