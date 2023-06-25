import { createSlice } from '@reduxjs/toolkit';

export const GlobalState: Zvyezda.Client.Reducers.GlobalState = {
  session: {
    connected: false,
    token: null,
  },
};

export const GlobalSlice = createSlice({
  name: 'global',
  initialState: GlobalState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
  },
});

export const { setSession } = GlobalSlice.actions;

export default GlobalSlice.reducer;
