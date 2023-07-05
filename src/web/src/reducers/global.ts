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
    sidebar: localStorage.getItem('sidebar') === 'true' ? true : false,
    context: Number(localStorage.getItem('context')) || 0,
    serverVersion: null,
    clientVersion: null,
    xboxHacking: {
      refresh: false,
    },
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
    setDashboard: (state, action) => {
      state.dashboard = action.payload;
    },
    setDashboardSidebar: (state, action) => {
      state.dashboard.sidebar = action.payload;
      localStorage.setItem('sidebar', action.payload ? 'true' : 'false');
    },
    setDashboardContext: (state, action) => {
      state.dashboard.context = action.payload;
      localStorage.setItem('context', action.payload);
    },
    setDashboardVersions: (state, action) => {
      state.dashboard.serverVersion = action.payload.server;
      state.dashboard.clientVersion = action.payload.client;
    },
    setDashboardXboxHackingRefresh: (state, action) => {
      state.dashboard.xboxHacking.refresh = action.payload;
    },
  },
});

export const {
  setSession,
  setHomePage,
  setDashboard,
  setDashboardSidebar,
  setDashboardContext,
  setDashboardVersions,
  setDashboardXboxHackingRefresh,
} = GlobalSlice.actions;

export default GlobalSlice.reducer;
