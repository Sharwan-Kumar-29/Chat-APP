import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnectSocket } from "../../lib/socket";
import { toast } from "react-toastify";

// ─── THUNK: Check Auth (Get Current User) ─────────────────────
export const getUser = createAsyncThunk("user/me", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/user/me");
    connectSocket(res.data.user._id);
    return res.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Auth failed");
  }
});

export const logout = createAsyncThunk("user/sign-out", async (_, thunkAPI) => {
  try {
    await axiosInstance.get("/user/sign-out");
    disconnectSocket();
    return null;
  } catch (error) {
    toast.error(error.response?.data?.message || "Logout failed");
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

export const login = createAsyncThunk("user/sign-in", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/user/sign-in", data);
    connectSocket(res.data.user._id);
    toast.success("Logged in successfully");
    return res.data.user;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const signup = createAsyncThunk("auth/sign-up", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/user/sign-up", data);
    connectSocket(res.data.user._id);
    toast.success("Account created successfully");
    return res.data.user;
  } catch (error) {
    toast.error(error.response?.data?.message || "Signup failed");
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Signup failed");
  }
});

export const updateProfile = createAsyncThunk("user/update-profile", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.put("/user/update-profile", data, {
      headers: {
        "Content-Type": "multipart/form-data", // ✅ FIXED HERE
      },
    });
    toast.success("Profile updated successfully");
    return res.data.user; // ✅ added `.user` for consistency with login/signup
  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Update failed");
  }
});

// ─── SLICE ─────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    error: null,
  },
  reducers: {
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User
      .addCase(getUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.authUser = null;
        state.isCheckingAuth = false;
        state.error = action.payload || "Failed to fetch user";
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      // Signup
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isSigningUp = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isUpdatingProfile = false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      });
  },
});

export const { setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
