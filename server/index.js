import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import UserModel    from "./Models/UserModel.js";
import ExerciseModel from "./Models/ExerciseModel.js";
import WorkoutModel  from "./Models/WorkoutModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());

// ─── Database Connection ──────────────────────────────────────────────────────
const connectString =
  "mongodb+srv://admin:12345@fitcluster.kicccdk.mongodb.net/fitDatabase?appName=fitCluster";

mongoose.connect(connectString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => console.log("MongoDB connected"));

// ════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ════════════════════════════════════════════════════════════

// POST /registerUser
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password, age, weight, height, goal } = req.body;

    // Validation
    if (!name || !email || !password)
      return res.status(400).json({ error: "Name, email, and password are required." });
    if (password.length < 4)
      return res.status(400).json({ error: "Password must be at least 4 characters." });
    if (!/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ error: "Invalid email format." });

    const existing = await UserModel.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already registered." });

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedpassword, age, weight, height, goal });
    await user.save();

    res.status(201).json({ user, msg: "User registered successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

// POST /login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found." });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ error: "Authentication failed." });

    res.status(200).json({ user, message: "Success." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /logout
app.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully." });
});

// ════════════════════════════════════════════════════════════
//  PROFILE ROUTES
// ════════════════════════════════════════════════════════════

// GET /getProfile/:userId
app.get("/getProfile/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });

    // Business Logic: calculate BMI
    let bmi = null;
    let bmiCategory = null;
    if (user.weight && user.height) {
      const heightM = user.height / 100;
      bmi = parseFloat((user.weight / (heightM * heightM)).toFixed(1));
      if      (bmi < 18.5) bmiCategory = "Underweight";
      else if (bmi < 25)   bmiCategory = "Normal weight";
      else if (bmi < 30)   bmiCategory = "Overweight";
      else                 bmiCategory = "Obese";
    }

    res.status(200).json({ ...user.toObject(), bmi, bmiCategory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /updateProfile/:userId
app.put("/updateProfile/:userId", async (req, res) => {
  try {
    const { name, age, weight, height, goal } = req.body;

    // Validation
    if (age    !== undefined && (age < 1 || age > 120))
      return res.status(400).json({ error: "Age must be between 1 and 120." });
    if (weight !== undefined && weight <= 0)
      return res.status(400).json({ error: "Weight must be positive." });
    if (height !== undefined && height <= 0)
      return res.status(400).json({ error: "Height must be positive." });

    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { name, age, weight, height, goal },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(200).json({ user, msg: "Profile updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════
//  EXERCISE ROUTES
// ════════════════════════════════════════════════════════════

// GET /getExercises/:userId  — returns global + user's custom
app.get("/getExercises/:userId", async (req, res) => {
  try {
    const exercises = await ExerciseModel.find({
      $or: [{ isCustom: false }, { createdBy: req.params.userId }],
    });
    res.status(200).json({ exercises, msg: "Exercises retrieved." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /addExercise
app.post("/addExercise", async (req, res) => {
  try {
    const { name, category, muscleGroup, equipment, difficulty, description, userId } = req.body;

    // Validation
    if (!name || !name.trim())
      return res.status(400).json({ error: "Exercise name is required." });
    if (!category)
      return res.status(400).json({ error: "Category is required." });
    if (!muscleGroup || !muscleGroup.trim())
      return res.status(400).json({ error: "Muscle group is required." });

    const exercise = new ExerciseModel({
      name, category, muscleGroup, equipment, difficulty, description,
      isCustom: true,
      createdBy: userId,
    });
    await exercise.save();
    res.status(201).json({ exercise, msg: "Exercise added." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /updateExercise/:exerciseId
app.put("/updateExercise/:exerciseId", async (req, res) => {
  try {
    const { name, category, muscleGroup, equipment, difficulty, description } = req.body;
    const exercise = await ExerciseModel.findByIdAndUpdate(
      req.params.exerciseId,
      { name, category, muscleGroup, equipment, difficulty, description },
      { new: true }
    );
    if (!exercise) return res.status(404).json({ error: "Exercise not found." });
    res.status(200).json({ exercise, msg: "Exercise updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /deleteExercise/:exerciseId
app.delete("/deleteExercise/:exerciseId", async (req, res) => {
  try {
    const exercise = await ExerciseModel.findByIdAndDelete(req.params.exerciseId);
    if (!exercise) return res.status(404).json({ error: "Exercise not found." });
    res.status(200).json({ msg: "Exercise deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════
//  WORKOUT ROUTES
// ════════════════════════════════════════════════════════════

// Business Logic: calculate total volume (weight × reps, summed)
const calculateVolume = (exercises) =>
  exercises.reduce(
    (total, ex) => total + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0),
    0
  );

// Business Logic: validate sets
const validateSets = (exercises) => {
  for (const ex of exercises) {
    if (!ex.exercise)           return "Each exercise must have a valid ID.";
    if (!ex.sets || ex.sets.length === 0) return "Each exercise must have at least one set.";
    for (const set of ex.sets) {
      if (!set.reps || set.reps <= 0)          return "Reps must be greater than 0.";
      if (set.weight === undefined || set.weight < 0) return "Weight cannot be negative.";
    }
  }
  return null;
};

// GET /getWorkouts/:userId
app.get("/getWorkouts/:userId", async (req, res) => {
  try {
    const workouts = await WorkoutModel.find({ userId: req.params.userId })
      .populate("exercises.exercise", "name category muscleGroup")
      .sort({ date: -1 });
    res.status(200).json({ workouts, msg: "Workouts retrieved." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /getWorkoutStats/:userId  — streak, total volume, etc.
app.get("/getWorkoutStats/:userId", async (req, res) => {
  try {
    const workouts = await WorkoutModel.find({ userId: req.params.userId });

    const totalWorkouts  = workouts.length;
    const totalVolume    = workouts.reduce((s, w) => s + w.totalVolume, 0);
    const totalDuration  = workouts.reduce((s, w) => s + (w.duration || 0), 0);
    const completedCount = workouts.filter((w) => w.isCompleted).length;

    // Streak calculation
    const uniqueDates = [...new Set(workouts.map((w) => new Date(w.date).toDateString()))]
      .sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    for (let i = 0; i < uniqueDates.length; i++) {
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      if (uniqueDates[i] === expected.toDateString()) streak++;
      else break;
    }

    res.status(200).json({ totalWorkouts, totalVolume, totalDuration, completedCount, streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /addWorkout
app.post("/addWorkout", async (req, res) => {
  try {
    const { userId, title, exercises, duration, notes } = req.body;

    if (!title || !title.trim())
      return res.status(400).json({ error: "Workout title is required." });
    if (!exercises || exercises.length === 0)
      return res.status(400).json({ error: "At least one exercise is required." });

    const setError = validateSets(exercises);
    if (setError) return res.status(400).json({ error: setError });

    if (duration !== undefined && duration < 0)
      return res.status(400).json({ error: "Duration cannot be negative." });

    const totalVolume = calculateVolume(exercises);

    const workout = new WorkoutModel({ userId, title, exercises, duration, notes, totalVolume });
    await workout.save();
    res.status(201).json({ workout, msg: "Workout added." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /updateWorkout/:workoutId
app.put("/updateWorkout/:workoutId", async (req, res) => {
  try {
    const { title, exercises, duration, notes, isCompleted } = req.body;

    if (exercises) {
      const setError = validateSets(exercises);
      if (setError) return res.status(400).json({ error: setError });
    }

    const totalVolume = exercises ? calculateVolume(exercises) : undefined;

    const workout = await WorkoutModel.findByIdAndUpdate(
      req.params.workoutId,
      { title, exercises, duration, notes, isCompleted, ...(totalVolume !== undefined && { totalVolume }) },
      { new: true }
    );
    if (!workout) return res.status(404).json({ error: "Workout not found." });
    res.status(200).json({ workout, msg: "Workout updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /deleteWorkout/:workoutId
app.delete("/deleteWorkout/:workoutId", async (req, res) => {
  try {
    const workout = await WorkoutModel.findByIdAndDelete(req.params.workoutId);
    if (!workout) return res.status(404).json({ error: "Workout not found." });
    res.status(200).json({ msg: "Workout deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /getNearbyGyms?lat=&lng=
app.get("/getNearbyGyms", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng)
      return res.status(400).json({ error: "lat and lng required." });

    // Overpass API — finds gyms within 2km, no API key needed
    const query = `
      [out:json];
      node["leisure"="fitness_centre"](around:2000,${lat},${lng});
      out body;
    `;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" } }
    );

    const results = response.data.elements;

    if (!results || results.length === 0) {
      return res.status(200).json({ gyms: [], msg: "No gyms found nearby." });
    }

    // Return only the nearest 1
    const nearest = results.slice(0, 1).map((place) => ({
      id:      place.id,
      name:    place.tags?.name || "Unnamed Gym",
      address: place.tags?.["addr:street"]
               ? `${place.tags["addr:street"]} ${place.tags["addr:housenumber"] || ""}`.trim()
               : "Address not available",
      rating:  null,
      isOpen:  null,
      location: {
        lat: place.lat,
        lng: place.lon,
      },
    }));

    res.status(200).json({ gyms: nearest, msg: "Nearest gym retrieved." });
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
/*
app.get("/getNearbyGyms", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng)
      return res.status(400).json({ error: "lat and lng query params are required." });

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    const gyms = [
      { id: "g1", name: "FitLife Gym",     address: "123 Main St",  rating: 4.5, isOpen: true,  location: { lat: parsedLat + 0.010, lng: parsedLng + 0.010 } },
      { id: "g2", name: "PowerHouse Gym",  address: "456 Elm Ave",  rating: 4.2, isOpen: false, location: { lat: parsedLat - 0.010, lng: parsedLng + 0.015 } },
      { id: "g3", name: "Gold's Gym",      address: "789 Oak Blvd", rating: 4.7, isOpen: true,  location: { lat: parsedLat + 0.018, lng: parsedLng - 0.008 } },
      { id: "g4", name: "Anytime Fitness", address: "321 Pine Rd",  rating: 4.0, isOpen: true,  location: { lat: parsedLat - 0.015, lng: parsedLng - 0.012 } },
      { id: "g5", name: "CrossFit Studio", address: "654 Maple Dr", rating: 4.8, isOpen: false, location: { lat: parsedLat + 0.005, lng: parsedLng - 0.020 } },
    ];

    res.status(200).json({ gyms, msg: "Nearby gyms retrieved." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/
// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// POST /uploadProfilePic/:userId
app.post("/uploadProfilePic/:userId", upload.single("profilePic"), async (req, res) => {
  try {
    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { profilePic: imageUrl },
      { new: true }
    ).select("-password");
    res.status(200).json({ user, msg: "Profile picture updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
