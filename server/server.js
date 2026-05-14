const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const workoutRoutes  = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');
const locationRoutes = require('./routes/location');
const profileRoutes  = require('./routes/profile');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/workouts',  workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/location',  locationRoutes);
app.use('/api/profile',   profileRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
