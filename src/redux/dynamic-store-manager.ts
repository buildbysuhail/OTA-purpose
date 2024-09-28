import {
  ThunkAction,
  Action,
  Middleware,
  combineReducers,
  Reducer,
  AnyAction,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './slices/root-reducer';
import thunk from "redux-thunk";

type ReducerMap = {
  [key: string]: Reducer<any, AnyAction>;
};

class DynamicReducerManager {
  private reducers: ReducerMap;
  private store;

  constructor(initialReducers: ReducerMap) {
    this.reducers = { ...initialReducers };
    this.store = configureStore({
      reducer: combineReducers(this.reducers),
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          // serializableCheck: false,
          // immutableCheck: { warnAfter: 128 },
        }).concat(thunk),
    });
  }

  getStore() {
    return this.store;
  }

  add(name: string, reducer: Reducer<any, AnyAction>) {
    if (!this.reducers[name]) {
      this.reducers[name] = reducer;
      this.store.replaceReducer(combineReducers(this.reducers));
    }
  }

  remove(name: string) {
    if (this.reducers[name]) {
      delete this.reducers[name];
      this.store.replaceReducer(combineReducers(this.reducers));
    }
  }
}

// Initialize the DynamicReducerManager with the root reducer
export const reducerManager = new DynamicReducerManager({ root: rootReducer });
