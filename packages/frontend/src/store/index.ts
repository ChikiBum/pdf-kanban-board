import { configureStore } from '@reduxjs/toolkit';
import boardWithoutLibraryReducer from './boardWithoutLibrary.slice';

export const store = configureStore({
  reducer: {
    boardWithoutLibrary: boardWithoutLibraryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
