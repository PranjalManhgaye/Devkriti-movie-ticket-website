const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  posterUrl: { type: String },
  trailerUrl: { type: String },
  genre: { type: String },
  language: { type: String },
  duration: { type: Number }, // in minutes
  year: { type: Number },
  format: { type: String }, // e.g., 2D, 3D, IMAX
  rating: { type: String }, // e.g., PG, R, etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);
