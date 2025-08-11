const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Create Razorpay order
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'INR', bookingDetails } = req.body;
    
    if (!amount || !bookingDetails) {
      return res.status(400).json({ message: 'Amount and booking details are required' });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: `booking_${Date.now()}`,
      notes: {
        bookingId: bookingDetails.bookingId,
        userId: req.user.userId
      }
    };

    const order = await razorpay.orders.create(options);

    // Save booking to database with pending status
    const booking = new Booking({
      userId: req.user.userId,
      movieId: bookingDetails.movieId || 'temp', // You might need to adjust this
      movieTitle: bookingDetails.movie.name,
      seats: bookingDetails.seats,
      showtime: bookingDetails.showtime,
      date: bookingDetails.date,
      totalAmount: amount,
      bookingId: bookingDetails.bookingId,
      razorpayOrderId: order.id,
      paymentStatus: 'pending'
    });

    await booking.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: bookingDetails.bookingId
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
});

// Create test order (simulates payment without Razorpay)
router.post('/create-test-order', authenticateToken, async (req, res) => {
  try {
    console.log('Test order request received:', req.body);
    
    const { amount, bookingDetails } = req.body;
    
    if (!amount || !bookingDetails) {
      console.log('Missing required fields:', { amount, bookingDetails });
      return res.status(400).json({ message: 'Amount and booking details are required' });
    }

    // Generate test order ID
    const testOrderId = `test_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const testPaymentId = `test_pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Try to save to database, but don't fail if it doesn't work
    try {
      const booking = new Booking({
        userId: req.user.userId, // Use the actual user's ID
        movieId: bookingDetails.movieId ? new mongoose.Types.ObjectId(bookingDetails.movieId) : new mongoose.Types.ObjectId(),
        movieTitle: bookingDetails.movie.name,
        seats: bookingDetails.seats,
        showtime: bookingDetails.showtime,
        date: bookingDetails.date,
        totalAmount: amount,
        bookingId: bookingDetails.bookingId,
        razorpayOrderId: testOrderId,
        razorpayPaymentId: testPaymentId,
        paymentStatus: 'completed'
      });

      await booking.save();
      console.log('Test booking saved successfully to database');
    } catch (dbError) {
      console.log('Database save failed, but continuing with test payment:', dbError.message);
    }

    res.json({
      success: true,
      orderId: testOrderId,
      paymentId: testPaymentId,
      amount: amount * 100,
      currency: 'INR',
      bookingId: bookingDetails.bookingId,
      message: 'Test payment successful!'
    });

  } catch (error) {
    console.error('Error creating test order:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error creating test order',
      error: error.message,
      stack: error.stack
    });
  }
});

// Verify payment signature
router.post('/verify-payment', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update booking with payment details
    const booking = await Booking.findOne({ 
      razorpayOrderId: razorpay_order_id,
      userId: req.user.userId 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.razorpayPaymentId = razorpay_payment_id;
    booking.paymentStatus = 'completed';
    await booking.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      bookingId: booking.bookingId,
      paymentId: razorpay_payment_id
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

// Get user's booking history
router.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .sort({ bookingDate: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching booking history' });
  }
});

// Get specific booking details
router.get('/bookings/:bookingId', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      bookingId: req.params.bookingId,
      userId: req.user.userId 
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking details' });
  }
});

// Simple test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Payment server is working!' });
});

module.exports = router; 