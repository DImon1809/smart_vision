import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import paramsSlice from "./features/paramsSlice";

export const store = configureStore({
  reducer: {
    userData: userSlice,
    paramsData: paramsSlice,
  },
});
