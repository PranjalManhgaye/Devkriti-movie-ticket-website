const express = require('express');
const router = express.Router();
const Theater = require('../models/Theater');

// Get theaters by city
router.get('/', async (req, res) => {
  try {
    const cityId = req.query.city;
    const theaters = await Theater.find(cityId ? { city: cityId } : {}).populate('city');
    res.json(theaters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new theater
router.post('/', async (req, res) => {
  try {
    const { name, city, address } = req.body;
    const theater = new Theater({ name, city, address });
    await theater.save();
    res.status(201).json(theater);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 