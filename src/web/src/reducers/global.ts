import { createSlice } from '@reduxjs/toolkit';

export const GlobalState: Zvyezda.Client.Reducers.GlobalState = {
  session: {
    connected: false,
    token: null,
  },
  home: {
    page: 0,
  },
  dashboard: {
    sidebar: true,
    context: 0,
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
    setDashboardSidebar: (state, action) => {
      state.dashboard.sidebar = action.payload;
    },
    setDashboardContext: (state, action) => {
      state.dashboard.context = action.payload;
    },
  },
});

export const { setSession, setHomePage, setDashboardSidebar, setDashboardContext } = GlobalSlice.actions;

export default GlobalSlice.reducer;
