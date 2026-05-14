const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:     { type: String,  required: true },
  email:    { type: String,  required: true, unique: true, lowercase: true },
  password: { type: String,  required: true },
  age:      { type: Number,  min: 1, max: 120 },
  weight:   { type: Number,  min: 1 },   // kg
  height:   { type: Number,  min: 1 },   // cm
  goal: {
    type: String,
    enum: ['lose_weight', 'build_muscle', 'maintain'],
    default: 'maintain'
  },
  isActive:  { type: Boolean, default: true },
  createdAt: { type: Date,    default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
