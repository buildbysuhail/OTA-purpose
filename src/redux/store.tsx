
import {
  ThunkAction,
  Action,
  Middleware,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './slices/root-reducer';
import thunk from "redux-thunk";
const middlewares: Middleware[] = [thunk];
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: false,
      // immutableCheck: { warnAfter: 128 },
    }).concat(middlewares),
});;
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

