// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
const paymentRoutes = require('./routes/payments');
const citiesRoutes = require('./routes/cities');
const theatersRoutes = require('./routes/theaters');
const showtimesRoutes = require('./routes/showtimes');
const agentChatRoutes = require('./routes/agentChat');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/theaters', theatersRoutes);
app.use('/api/showtimes', showtimesRoutes);
app.use('/api', agentChatRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));