const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  date: { type: String, required: true }, // e.g., '2025-07-01'
  time: { type: String, required: true }, // e.g., '19:30'
  availableSeats: [{ type: String }], // e.g., ['A1', 'A2', ...]
  bookedSeats: [{ type: String }], // e.g., ['B1', 'B2', ...]
});

module.exports = mongoose.model('Showtime', showtimeSchema); 