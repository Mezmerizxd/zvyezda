import { createSlice } from '@reduxjs/toolkit';

export const GlobalState: Zvyezda.Client.Reducers.GlobalState = {
  session: {
    connected: false,
    token: null,
  },
  home: {
    page: 0,
  },
};

export const GlobalSlice = createSlice({
  name: 'global',
  initialState: GlobalState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
    setHomePage: (state, action) => {
      state.home.page = action.payload;
    },
  },
});

export const { setSession, setHomePage } = GlobalSlice.actions;

export default GlobalSlice.reducer;
