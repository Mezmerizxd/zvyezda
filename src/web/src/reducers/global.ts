import { createSlice } from '@reduxjs/toolkit';

export const GlobalState: Zvyezda.Client.Reducers.GlobalState = {
  session: {
    connected: false,
    token: null,
    id: null,
    username: null,
    email: null,
    avatar: null,
    role: null,
  },
  home: {
    page: 0,
  },
  dashboard: {
    sidebar: localStorage.getItem('sidebar') === 'true',
    context: Number(localStorage.getItem('context')) || 0,
    serverVersion: null,
    clientVersion: null,
    xboxHacking: {
      refresh: false,
    },
    users: {
      refresh: false,
    },
  },
  dialogs: {
    deleteUser: {
      show: false,
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
    setDashboardUsersRefresh: (state, action) => {
      state.dashboard.users.refresh = action.payload;
    },
    setDialogDeleteUser: (state, action) => {
      state.dialogs.deleteUser = {
        ...state.dialogs.deleteUser,
        ...action.payload,
      };
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
  setDashboardUsersRefresh,
  setDialogDeleteUser,
} = GlobalSlice.actions;

export default GlobalSlice.reducer;
