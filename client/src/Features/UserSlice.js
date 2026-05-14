import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: JSON.parse(localStorage.getItem("fittrack_user") || "{}"),
  profile: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
};

// Thunks

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData) => {
    try {
      const response = await axios.post("http://localhost:3001/registerUser", {
        name:     userData.name,
        email:    userData.email,
        password: userData.password,
        age:      userData.age,
        weight:   userData.weight,
        height:   userData.height,
        goal:     userData.goal,
      });
      console.log(response);
      return response.data.user;
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.error || "Registration failed";
      alert(errorMessage);
      throw new Error(errorMessage);
    }
  }
);

export const login = createAsyncThunk("users/login", async (userData) => {
  try {
    const response = await axios.post("http://localhost:3001/login", {
      email:    userData.email,
      password: userData.password,
    });
    console.log(response);
    return response.data.user;
  } catch (error) {
    const errorMessage = "Invalid credentials";
    alert(errorMessage);
    throw new Error(errorMessage);
  }
});

export const logout = createAsyncThunk("users/logout", async () => {
  try {
    await axios.post("http://localhost:3001/logout");
  } catch (error) {}
});

export const getProfile = createAsyncThunk("users/getProfile", async (userId) => {
  try {
    const response = await axios.get(`http://localhost:3001/getProfile/${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const updateProfile = createAsyncThunk(
  "users/updateProfile",
  async ({ userId, profileData }) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/updateProfile/${userId}`,
        profileData
      );
      console.log(response);
      return response.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Update failed";
      alert(errorMessage);
      throw new Error(errorMessage);
    }
  }
);

export const uploadProfilePic = createAsyncThunk(
  "users/uploadProfilePic",
  async ({ userId, file }) => {
    try {
      const formData = new FormData();
      formData.append("profilePic", file);
      const response = await axios.post(
        `http://localhost:3001/uploadProfilePic/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.user;
    } catch (error) {
      console.log(error);
    }
  }
);

// slice

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending,   (state) => { state.isLoading = true; })
      .addCase(registerUser.fulfilled, (state) => { state.isLoading = false; })
      .addCase(registerUser.rejected,  (state) => { state.isLoading = false; state.isError = true; })

      .addCase(login.pending,   (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.user      = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
        localStorage.setItem("fittrack_user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected,  (state) => { state.isLoading = false; state.isError = true; })

      .addCase(logout.pending,   (state) => { state.isLoading = true; })
      .addCase(logout.fulfilled, (state) => {
        state.user      = {};
        state.profile   = {};
        state.isLoading = false;
        state.isSuccess = false;
        localStorage.removeItem("fittrack_user");
      })
      .addCase(logout.rejected,  (state) => { state.isLoading = false; state.isError = true; })

      .addCase(getProfile.pending,   (state) => { state.isLoading = true; })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profile   = action.payload;
        state.isLoading = false;
      })
      .addCase(getProfile.rejected,  (state) => { state.isLoading = false; state.isError = true; })

      .addCase(updateProfile.pending,   (state) => { state.isLoading = true; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user      = { ...state.user, ...action.payload };
        state.isLoading = false;
        state.isSuccess = true;
        localStorage.setItem("fittrack_user", JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected,  (state) => { state.isLoading = false; state.isError = true; })
      
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("fittrack_user", JSON.stringify(state.user));
      });
  },
});

export default userSlice.reducer;
