import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChair, FaTicketAlt, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import './Booking.css';

const ROWS = 10;
const COLS = 8;
const SEAT_PRICE = 12.99;

// Generate some random occupied seats for demo
const generateOccupiedSeats = () => {
  const occupied = [];
  const totalSeats = ROWS * COLS;
  const occupiedCount = Math.floor(totalSeats * 0.2); // 20% of seats are occupied
  
  for (let i = 0; i < occupiedCount; i++) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    const seatId = `${row}-${col}`;
    
    if (!occupied.includes(seatId)) {
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

  const getSeatStatus = (row, col) => {
    const seatId = `${row}-${col}`;
    if (isSeatOccupied(seatId)) return 'occupied';
    if (isSeatSelected(seatId)) return 'selected';
    return 'available';
  };

  const calculateTotal = () => {
    return (selectedSeats.length * SEAT_PRICE).toFixed(2);
  };

  const confirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to book.');
      return;
    }
    
    const bookingDetails = {
      movie,
      seats: selectedSeats,
      showtime,
      date,
      total: calculateTotal(),
      bookingId: `BK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      bookingDate: new Date().toISOString()
    };
    
    // Save booking to localStorage for booking history
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(bookingDetails);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    navigate('/confirmation', { state: bookingDetails });
  };

  const renderSeats = () => {
    return (
      <div className="seat-layout">
        <div className="screen">SCREEN</div>
        
        {[...Array(ROWS)].map((_, row) => (
          <div key={`row-${row}`} className="seat-row">
            <span className="seat-label">{String.fromCharCode(65 + row)}</span>
            {[...Array(COLS)].map((_, col) => {
              const status = getSeatStatus(row, col);
              return (
                <div
                  key={`${row}-${col}`}
                  className={`seat ${status}`}
                  onClick={() => toggleSeat(row, col)}
                >
                  {status === 'selected' && <FaCheck />}
                  {status === 'occupied' && <FaTimes />}
                  {status === 'available' && <FaChair />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
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
            <div className="legend-icon available"><FaChair /></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon selected"><FaCheck /></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon occupied"><FaTimes /></div>
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
          
          <div className="detail-row">
            <span className="detail-label">Price per seat:</span>
            <span className="detail-value">${SEAT_PRICE.toFixed(2)}</span>
          </div>
          
          <div className="total">
            <span>Total:</span>
            <span>${calculateTotal()}</span>
          </div>
          
          <button 
            className="confirm-btn"
            onClick={confirmBooking}
            disabled={selectedSeats.length === 0}
          >
            <FaTicketAlt />
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
