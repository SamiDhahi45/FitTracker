import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  exercises: [],
  isLoading: false,
  isSuccess: false,
  isError:   false,
};

// Thunks

export const getExercises = createAsyncThunk(
  "exercises/getExercises",
  async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getExercises/${userId}`);
      return response.data.exercises;
    } catch (error) {
      console.log(error);
    }
  }
);

export const addExercise = createAsyncThunk(
  "exercises/addExercise",
  async (exerciseData) => {
    try {
      const response = await axios.post("${process.env.REACT_APP_API_URL}/addExercise", exerciseData);
      console.log(response);
      return response.data.exercise;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to add exercise";
      alert(errorMessage);
      throw new Error(errorMessage);
    }
  }
);

export const updateExercise = createAsyncThunk(
  "exercises/updateExercise",
  async ({ exerciseId, exerciseData }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/updateExercise/${exerciseId}`,
        exerciseData
      );
      console.log(response);
      return response.data.exercise;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to update exercise";
      alert(errorMessage);
      throw new Error(errorMessage);
    }
  }
);

export const deleteExercise = createAsyncThunk(
  "exercises/deleteExercise",
  async (exerciseId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/deleteExercise/${exerciseId}`);
      return exerciseId;
    } catch (error) {
      console.log(error);
    }
  }
);

// Slice

export const exerciseSlice = createSlice({
  name: "exercises",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getExercises.pending,   (state) => { state.isLoading = true; })
      .addCase(getExercises.fulfilled, (state, action) => {
        state.exercises = action.payload || [];
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getExercises.rejected,  (state) => { state.isLoading = false; state.isError = true; })

      .addCase(addExercise.pending,   (state) => { state.isLoading = true; })
      .addCase(addExercise.fulfilled, (state, action) => {
        state.exercises = [...state.exercises, action.payload];
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(addExercise.rejected,  (state) => { state.isLoading = false; state.isError = true; })

      .addCase(updateExercise.pending,   (state) => { state.isLoading = true; })
      .addCase(updateExercise.fulfilled, (state, action) => {
        state.exercises = state.exercises.map((e) =>
          e._id === action.payload._id ? action.payload : e
        );
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateExercise.rejected,  (state) => { state.isLoading = false; state.isError = true; })

      .addCase(deleteExercise.fulfilled, (state, action) => {
        state.exercises = state.exercises.filter((e) => e._id !== action.payload);
      });
  },
});

export default exerciseSlice.reducer;
