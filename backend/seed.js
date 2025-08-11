const mongoose = require('mongoose');
const City = require('./models/City');
const Theater = require('./models/Theater');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');
require('dotenv').config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // Clear existing data
  await City.deleteMany({});
  await Theater.deleteMany({});
  await Showtime.deleteMany({});

  // Create sample cities and theaters
  const cityData = [
    {
      name: 'Mumbai',
      theaters: [
        { name: 'PVR Phoenix', address: 'Phoenix Mall, Lower Parel' },
        { name: 'INOX Ghatkopar', address: 'R City Mall, Ghatkopar' },
        { name: 'Cinepolis Andheri', address: 'Fun Republic, Andheri West' }
      ]
    },
    {
      name: 'Delhi',
      theaters: [
        { name: 'PVR Select City', address: 'Select Citywalk Mall, Saket' },
        { name: 'Carnival Cinemas', address: 'Rajouri Garden' },
        { name: 'DT Cinemas', address: 'DLF Place, Saket' }
      ]
    },
    {
      name: 'Bangalore',
      theaters: [
        { name: 'PVR Orion Mall', address: 'Orion Mall, Rajajinagar' },
        { name: 'INOX Forum', address: 'Forum Mall, Koramangala' },
        { name: 'Cinepolis Bannerghatta', address: 'Royal Meenakshi Mall' }
      ]
    },
    {
      name: 'Hyderabad',
      theaters: [
        { name: 'PVR Panjagutta', address: 'Central Mall, Panjagutta' },
        { name: 'Asian M Cube', address: 'Kukatpally' },
        { name: 'INOX GVK One', address: 'GVK One Mall, Banjara Hills' }
      ]
    },
    {
      name: 'Chennai',
      theaters: [
        { name: 'SPI Sathyam', address: 'Royapettah' },
        { name: 'Escape Cinemas', address: 'Express Avenue Mall' },
        { name: 'PVR Ampa Skywalk', address: 'Ampa Mall, Aminjikarai' }
      ]
    },
    {
      name: 'Kolkata',
      theaters: [
        { name: 'INOX Quest Mall', address: 'Quest Mall, Park Circus' },
        { name: 'PVR Mani Square', address: 'Mani Square Mall, EM Bypass' },
        { name: 'Carnival Diamond Plaza', address: 'Jessore Road' }
      ]
    },
    {
      name: 'Pune',
      theaters: [
        { name: 'PVR Pavilion Mall', address: 'Pune Central, Shivajinagar' },
        { name: 'Cinepolis Seasons', address: 'Seasons Mall, Magarpatta' },
        { name: 'INOX Bund Garden', address: 'Bund Garden Road' }
      ]
    }
  ];

  const cityDocs = [];
  for (const city of cityData) {
    const cityDoc = await City.create({ name: city.name });
    for (const theater of city.theaters) {
      await Theater.create({ name: theater.name, city: cityDoc._id, address: theater.address });
    }
    cityDocs.push(cityDoc);
  }

  // Use an existing movie or create a dummy one
  let movie = await Movie.findOne();
  if (!movie) {
    movie = await Movie.create({
      title: 'Sample Movie',
      description: 'A test movie',
      posterUrl: '',
      genre: 'Drama',
      language: 'Hindi',
      duration: 120,
      year: 2025
    });
  }

  // Create sample showtimes for each theater
  const allTheaters = await Theater.find();
  for (const theater of allTheaters) {
    await Showtime.create({
      movie: movie._id,
      theater: theater._id,
      date: '2025-07-01',
      time: '19:00',
      availableSeats: ['A1','A2','A3','A4','A5','B1','B2','B3','B4','B5']
    });
  }

  console.log('Seed data inserted!');
  process.exit();
};

seed(); 