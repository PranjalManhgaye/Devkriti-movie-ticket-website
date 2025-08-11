const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  address: { type: String, required: true }
});

module.exports = mongoose.model('Theater', theaterSchema); 