
import {
  ThunkAction,
  Action,
  Middleware,
} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { reduxManager } from "./dynamic-store-manager-pro";
const middlewares: Middleware[] = [thunk];

// Get the store from the manager
const store =  reduxManager.store;

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

