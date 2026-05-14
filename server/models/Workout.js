const mongoose = require('mongoose');

const SetSchema = new mongoose.Schema({
  reps:      { type: Number, required: true, min: 1 },
  weight:    { type: Number, required: true, min: 0 }, // kg
  completed: { type: Boolean, default: false }
});

const WorkoutExerciseSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  sets:     [SetSchema],
  notes:    { type: String }
});

const WorkoutSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  date:        { type: Date, default: Date.now },
  exercises:   [WorkoutExerciseSchema],
  totalVolume: { type: Number, default: 0 }, // auto-calculated (kg × reps × sets)
  duration:    { type: Number, min: 0 },     // minutes
  isCompleted: { type: Boolean, default: false },
  notes:       { type: String }
});

module.exports = mongoose.model('Workout', WorkoutSchema);
