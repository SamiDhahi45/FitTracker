import mongoose from "mongoose";

const SetSchema = mongoose.Schema({
  reps: {
    type: Number,
    required: true,
    min: 1,
  },
  weight: {
    type: Number,
    required: true,
    min: 0, // kg
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const WorkoutExerciseSchema = mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exercises",
    required: true,
  },
  sets: [SetSchema],
  notes: {
    type: String,
  },
});

const WorkoutSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userInfos",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  exercises: [WorkoutExerciseSchema],
  totalVolume: {
    type: Number,
    default: 0, // auto-calculated: weight × reps summed across all sets
  },
  duration: {
    type: Number,
    min: 0, // minutes
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
});

const WorkoutModel = mongoose.model("workouts", WorkoutSchema);
export default WorkoutModel;
