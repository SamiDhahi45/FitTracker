import { configureStore } from "@reduxjs/toolkit";
import usersReducer    from "../Features/UserSlice";
import workoutsReducer from "../Features/WorkoutSlice";
import exercisesReducer from "../Features/ExerciseSlice";

export const store = configureStore({
  reducer: {
    users:     usersReducer,
    workouts:  workoutsReducer,
    exercises: exercisesReducer,
  },
});
