import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import libraryReducer from '../features/library/librarySlice'

export const store = configureStore({
  reducer: {
    library: libraryReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
