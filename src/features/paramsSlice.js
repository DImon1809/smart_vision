import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  idTestParams: 101,
  currentParams: {},
};

export const paramsSlice = createSlice({
  name: "paramsData",
  initialState,
  reducers: {
    setCurrentParams: (state, action) => {
      // state.currentParams.push(action.payload)

      state.currentParams = action.payload;
    },

    deleteParam: (state, action) => {
      delete state.currentParams[action.payload];
    },
  },
});

export const { setCurrentParams, deleteParam } = paramsSlice.actions;
export default paramsSlice.reducer;
