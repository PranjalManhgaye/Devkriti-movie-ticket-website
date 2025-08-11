const express = require('express');
const router = express.Router();
const Showtime = require('../models/Showtime');

// Get showtimes by movie, theater, and date
router.get('/', async (req, res) => {
  try {
    const { movie, theater, date } = req.query;
    const filter = {};
    if (movie) filter.movie = movie;
    if (theater) filter.theater = theater;
    if (date) filter.date = date;
    const showtimes = await Showtime.find(filter).populate('movie').populate('theater');
    res.json(showtimes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get seat availability for a showtime
router.get('/seats', async (req, res) => {
  try {
    const { showtime } = req.query;
    if (!showtime) return res.status(400).json({ message: 'Showtime ID required' });
    const st = await Showtime.findById(showtime);
    if (!st) return res.status(404).json({ message: 'Showtime not found' });
    res.json({ availableSeats: st.availableSeats, bookedSeats: st.bookedSeats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new showtime
router.post('/', async (req, res) => {
  try {
    const { movie, theater, date, time, availableSeats } = req.body;
    const showtime = new Showtime({ movie, theater, date, time, availableSeats, bookedSeats: [] });
    await showtime.save();
    res.status(201).json(showtime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Book seats for a showtime (update available/booked)
router.post('/book', async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;
    const st = await Showtime.findById(showtimeId);
    if (!st) return res.status(404).json({ message: 'Showtime not found' });
    // Check if seats are available
    const unavailable = seats.filter(seat => !st.availableSeats.includes(seat));
    if (unavailable.length > 0) {
      return res.status(400).json({ message: 'Some seats are already booked', unavailable });
    }
    // Move seats from available to booked
    st.availableSeats = st.availableSeats.filter(seat => !seats.includes(seat));
    st.bookedSeats.push(...seats);
    await st.save();
    res.json({ success: true, showtime: st });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 