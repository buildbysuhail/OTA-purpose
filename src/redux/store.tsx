
import {
  ThunkAction,
  Action,
  Middleware,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './slices/root-reducer';
import thunk from "redux-thunk";
import { reducerManager } from "./dynamic-store-manager";
const middlewares: Middleware[] = [thunk];

// Get the store from the manager
const store = reducerManager.getStore();

export default store;

// Export the reducer manager for use in other parts of your application
// export { reducerManager };

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

