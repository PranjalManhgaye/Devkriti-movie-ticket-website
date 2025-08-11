const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  movieId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Movie', 
    required: true 
  },
  movieTitle: { 
    type: String, 
    required: true 
  },
  seats: [{ 
    type: String, 
    required: true 
  }],
  showtime: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  bookingId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  razorpayOrderId: { 
    type: String 
  },
  razorpayPaymentId: { 
    type: String 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  bookingDate: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Booking', bookingSchema); 