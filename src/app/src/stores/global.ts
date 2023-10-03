import { configureStore } from '@reduxjs/toolkit';

import GlobalSlice from '../reducers/global';

export const store = configureStore({
  reducer: {
    global: GlobalSlice,
  },
});
