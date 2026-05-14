import mongoose from "mongoose";

const ExerciseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["chest", "back", "legs", "shoulders", "arms", "core", "cardio"],
    required: true,
  },
  muscleGroup: {
    type: String,
    required: true,
  },
  equipment: {
    type: String,
    default: "None",
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  description: {
    type: String,
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userInfos",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ExerciseModel = mongoose.model("exercises", ExerciseSchema);
export default ExerciseModel;
