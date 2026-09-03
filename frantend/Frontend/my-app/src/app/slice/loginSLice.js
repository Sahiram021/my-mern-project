import { createSlice } from "@reduxjs/toolkit";
import { getAuthToken } from "../utils/authToken.js";

export const loginSlice = createSlice({
  name: "userData",
  initialState: {
    token: getAuthToken(),
  },
  reducers: {
    getToken: (state, { payload }) => {
      state.token = payload.token;
    },
    LogOut: (state) => {
      state.token = "";
    },
  },
});

export const { getToken, LogOut } = loginSlice.actions;
export default loginSlice.reducer;
