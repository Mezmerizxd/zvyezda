import { createSlice } from '@reduxjs/toolkit';

export const GlobalState: Zvyezda.Client.Reducers.GlobalState = {};

export const GlobalSlice = createSlice({
  name: 'global',
  initialState: GlobalState,
  reducers: {},
});

export const {} = GlobalSlice.actions;

export default GlobalSlice.reducer;
