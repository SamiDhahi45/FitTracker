import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserModel     from "./Models/UserModel.js";
import ExerciseModel from "./Models/ExerciseModel.js";
import WorkoutModel  from "./Models/WorkoutModel.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fittrackDb";

const exercises = [
  { name: "Bench Press",    category: "chest",     muscleGroup: "Pectorals",        equipment: "Barbell",    difficulty: "intermediate", description: "Classic chest compound movement", isCustom: false },
  { name: "Squat",          category: "legs",      muscleGroup: "Quadriceps",       equipment: "Barbell",    difficulty: "intermediate", description: "King of all leg exercises",        isCustom: false },
  { name: "Deadlift",       category: "back",      muscleGroup: "Posterior Chain",  equipment: "Barbell",    difficulty: "advanced",     description: "Full-body compound lift",          isCustom: false },
  { name: "Pull-Up",        category: "back",      muscleGroup: "Latissimus Dorsi", equipment: "Bodyweight", difficulty: "intermediate", description: "Upper back width builder",         isCustom: false },
  { name: "Overhead Press", category: "shoulders", muscleGroup: "Deltoids",         equipment: "Barbell",    difficulty: "intermediate", description: "Vertical pressing movement",       isCustom: false },
  { name: "Bicep Curl",     category: "arms",      muscleGroup: "Biceps",           equipment: "Dumbbell",   difficulty: "beginner",     description: "Isolated bicep exercise",          isCustom: false },
  { name: "Tricep Dip",     category: "arms",      muscleGroup: "Triceps",          equipment: "Bodyweight", difficulty: "beginner",     description: "Bodyweight tricep exercise",       isCustom: false },
  { name: "Plank",          category: "core",      muscleGroup: "Abdominals",       equipment: "Bodyweight", difficulty: "beginner",     description: "Core stability exercise",          isCustom: false },
  { name: "Running",        category: "cardio",    muscleGroup: "Full Body",        equipment: "None",       difficulty: "beginner",     description: "Cardiovascular endurance",         isCustom: false },
  { name: "Leg Press",      category: "legs",      muscleGroup: "Quadriceps",       equipment: "Machine",    difficulty: "beginner",     description: "Machine-based leg exercise",       isCustom: false },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  await UserModel.deleteMany({});
  await ExerciseModel.deleteMany({ isCustom: false });
  await WorkoutModel.deleteMany({});

  const savedExercises = await ExerciseModel.insertMany(exercises);
  console.log(`✅ Seeded ${savedExercises.length} exercises`);

  const password = await bcrypt.hash("password123", 10);
  const users = await UserModel.insertMany([
    { name: "Alice Smith",  email: "alice@fittrack.com", password, age: 28, weight: 65, height: 168, goal: "build_muscle", isActive: true },
    { name: "Bob Johnson",  email: "bob@fittrack.com",   password, age: 35, weight: 85, height: 182, goal: "lose_weight",  isActive: true },
    { name: "Carol White",  email: "carol@fittrack.com", password, age: 24, weight: 58, height: 162, goal: "maintain",     isActive: false },
    { name: "David Lee",    email: "david@fittrack.com", password, age: 30, weight: 78, height: 176, goal: "build_muscle", isActive: true },
    { name: "Emma Davis",   email: "emma@fittrack.com",  password, age: 26, weight: 62, height: 165, goal: "lose_weight",  isActive: true },
  ]);
  console.log(`✅ Seeded ${users.length} users`);

  const [bp, sq, dl] = savedExercises;
  await WorkoutModel.insertMany([
    {
      userId: users[0]._id, title: "Push Day A", date: new Date("2024-03-01"),
      exercises: [{ exercise: bp._id, sets: [{ reps: 10, weight: 60, completed: true }, { reps: 8, weight: 65, completed: true }] }],
      totalVolume: 1120, duration: 45, isCompleted: true,
    },
    {
      userId: users[0]._id, title: "Leg Day", date: new Date("2024-03-03"),
      exercises: [{ exercise: sq._id, sets: [{ reps: 12, weight: 80, completed: true }, { reps: 10, weight: 85, completed: true }] }],
      totalVolume: 1810, duration: 60, isCompleted: true,
    },
    {
      userId: users[0]._id, title: "Pull Day", date: new Date("2024-03-05"),
      exercises: [{ exercise: dl._id, sets: [{ reps: 5, weight: 100, completed: true }, { reps: 5, weight: 105, completed: true }] }],
      totalVolume: 1025, duration: 50, isCompleted: false,
    },
  ]);
  console.log(`✅ Seeded 3 workouts for Alice`);

  console.log("\n🎉 Done! Login: alice@fittrack.com / password123");
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
