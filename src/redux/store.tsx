
import {ThunkAction, Action } from '@reduxjs/toolkit';
import { reducerManager } from './dynamic-store-manager';

const store = reducerManager.getStore();
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

