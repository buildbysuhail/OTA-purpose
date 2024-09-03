import {
  combineReducers,
  Reducer,
  AnyAction,
  ThunkAction,
  Action,
  Middleware,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import thunk from "redux-thunk";
import rootReducer from "./slices/rootReducer";

type ReducerMap = {
  [key: string]: Reducer<any, AnyAction>;
};

class DynamicReducerManager {
  private reducers: ReducerMap;

  private middlewares: Middleware[] = [thunk];
  private store = configureStore({
    reducer: {},
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // serializableCheck: false,
        // immutableCheck: { warnAfter: 128 },
      }).concat(this.middlewares),
  });;

  constructor(initialReducers: ReducerMap) {
    this.reducers = { ...initialReducers };
    this.store.replaceReducer(combineReducers(this.reducers));
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

export const reducerManager = new DynamicReducerManager(rootReducer);

