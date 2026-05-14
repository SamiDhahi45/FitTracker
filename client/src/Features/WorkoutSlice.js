import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  workouts:  [],
  stats:     {},
  isLoading: false,
  isSuccess: false,
  isError:   false,
};

// thunks

export const getWorkouts = createAsyncThunk(
  "workouts/getWorkouts",
  async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getWorkouts/${userId}`);
      return response.data.workouts;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getWorkoutStats = createAsyncThunk(
  "workouts/getWorkoutStats",
  async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getWorkoutStats/${userId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const addWorkout = createAsyncThunk(
  "workouts/addWorkout",
  async (workoutData) => {
    try {
      const response = await axios.post("${process.env.REACT_APP_API_URL}/addWorkout", workoutData);
      console.log(response);
      return response.data.workout;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to add workout";
      alert(errorMessage);
      throw new Error(errorMessage);
    }
  }
);

export const updateWorkout = createAsyncThunk(
  "workouts/updateWorkout",
  async ({ workoutId, workoutData }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/updateWorkout/${workoutId}`,
        workoutData
      );
      console.log(response);
      return response.data.workout;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to update workout";
      alert(errorMessage);
      throw new Error(errorMessage);
    }
  }
);

export const deleteWorkout = createAsyncThunk(
  "workouts/deleteWorkout",
  async (workoutId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/deleteWorkout/${workoutId}`);
      return workoutId; // return id to remove from state
    } catch (error) {
      console.log(error);
    }
  }
);

// slice

export const workoutSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getWorkouts.pending,   (state) => { state.isLoading = true; })
      .addCase(getWorkouts.fulfilled, (state, action) => {
        state.workouts  = action.payload || [];
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getWorkouts.rejected,  (state) => { state.isLoading = false; state.isError = true; })

      .addCase(getWorkoutStats.fulfilled, (state, action) => {
        state.stats = action.payload || {};
      })

      .addCase(addWorkout.pending,   (state) => { state.isLoading = true; })
      .addCase(addWorkout.fulfilled, (state, action) => {
        state.workouts  = [action.payload, ...state.workouts];
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(addWorkout.rejected,  (state) => { state.isLoading = false; state.isError = true; })

      .addCase(updateWorkout.pending,   (state) => { state.isLoading = true; })
      .addCase(updateWorkout.fulfilled, (state, action) => {
        state.workouts  = state.workouts.map((w) =>
          w._id === action.payload._id ? action.payload : w
        );
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateWorkout.rejected,  (state) => { state.isLoading = false; state.isError = true; })

      .addCase(deleteWorkout.fulfilled, (state, action) => {
        state.workouts = state.workouts.filter((w) => w._id !== action.payload);
      });
  },
});

export default workoutSlice.reducer;
