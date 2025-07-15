import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice"; // ✅ correct import

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer, // ✅ correct reducer
  },
});

export default store;
