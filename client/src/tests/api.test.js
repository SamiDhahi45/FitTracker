import { configureStore } from "@reduxjs/toolkit";
import workoutsReducer, { addWorkout, deleteWorkout } from "../Features/WorkoutSlice";
import exercisesReducer, { addExercise, deleteExercise } from "../Features/ExerciseSlice";

describe("Redux Slices", () => {
  test("workout store initializes with empty array", () => {
    const store = configureStore({ reducer: { workouts: workoutsReducer } });
    const state = store.getState();
    expect(state.workouts.workouts).toEqual([]);
  });

  test("exercise store initializes with empty array", () => {
    const store = configureStore({ reducer: { exercises: exercisesReducer } });
    const state = store.getState();
    expect(state.exercises.exercises).toEqual([]);
  });

  test("workout store has correct initial isLoading value", () => {
    const store = configureStore({ reducer: { workouts: workoutsReducer } });
    expect(store.getState().workouts.isLoading).toBe(false);
  });

  test("exercise store has correct initial isLoading value", () => {
    const store = configureStore({ reducer: { exercises: exercisesReducer } });
    expect(store.getState().exercises.isLoading).toBe(false);
  });
});