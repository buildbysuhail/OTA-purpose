import { 
  configureStore, 
  createAsyncThunk, 
  createSlice, 
  combineReducers, 
  PayloadAction,
  AsyncThunk,
  Slice,
  SliceCaseReducers,
  Draft
} from "@reduxjs/toolkit";

import LoginReducer from "../redux/slices/auth/login/reducer";
import AccountReducer from "../redux/slices/auth/register/reducer";
import ForgetPasswordReducer from "../redux/slices/auth/forgetpwd/reducer";
import UserRightsReducer from "../redux/slices/auth/UserRights/reducer";
import AppStateReducer from "../redux/slices/app/reducer";
import UserSessionReducer from "../redux/slices/user-session/reducer";
import PopupDataReducer from "../redux/slices/popup-reducer";

import { APIClient } from "../helpers/api-client";
import { reducerNameFromUrl } from "./actions/AppActions";
import Urls from "./urls";

// Define a generic type for API response data
type ApiResponse<T> = {
  data: T;
  loading: boolean;
  error: string | null;
};

// Type for our API endpoints
type ApiEndpoint<T> = {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
};

const apiClient = new APIClient
// List of API endpoints (example)
const API_ENDPOINTS = [
  { name: 'fetchUsers', url: Urls.data_countries, method: 'GET' as const },
  { name: 'fetchPosts', url: '/api/posts', method: 'GET' as const },
  // Add more endpoints as needed
] as const;

// Function to create a slice and thunk for an endpoint
function createApiSlice<T>(endpoint: ApiEndpoint<T>) {
  let name = reducerNameFromUrl(endpoint.url,endpoint.method);
  debugger;
  const thunk = createAsyncThunk<T, void, { rejectValue: string }>(
    `${name}`,
    async (_, { rejectWithValue }) => {
      try {
        const response = apiClient.get(endpoint.url);
        return response;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || 'An error occurred');
      }
    }
  );

  const slice = createSlice({
    name: name,
    initialState: {
      data: null,
      loading: false,
      error: null,
    } as ApiResponse<T>,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action: PayloadAction<T>) => {
          debugger;
          state.loading = false;
          state.data = action.payload as Draft<T>;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'An error occurred';
        });
    },
  });

  return { slice, thunk };
}

class DynamicReduxManager {
  private slices: Record<string, Slice>;
  private thunks: Record<string, AsyncThunk<any, void, { rejectValue: string }>>;
  public store: ReturnType<typeof configureStore>;

  constructor(endpoints: typeof API_ENDPOINTS) {
    this.slices = {};
    this.thunks = {};
    // Create slices and thunks for each endpoint
    endpoints.forEach(endpoint => {
      
let name = reducerNameFromUrl(endpoint.url, endpoint.method);
      const { slice, thunk } = createApiSlice(endpoint);
      this.slices[name] = slice;
      this.thunks[name] = thunk;
    });

    // Create the root reducer
    const rootReducer = this.createRootReducer();

    // Create the store
    this.store = configureStore({
      reducer: rootReducer,
    });
  }

  private createRootReducer() {
    const reducerMap = Object.entries(this.slices).reduce((acc, [name, slice]) => {
      acc[name] = slice.reducer;
      return acc;
    }, {} as Record<string, any>);
    const red =  {
      Login: LoginReducer,
      Account: AccountReducer,
      ForgetPassword: ForgetPasswordReducer,
      UserRights: UserRightsReducer,
      AppState: AppStateReducer,
      UserSession: UserSessionReducer,
      PopupData: PopupDataReducer,
    
      ...reducerMap,
    };
    return combineReducers(red);
  }

  getThunk(name: string) {
    debugger;
    return this.thunks[name];
  }

  // addEndpoint<T>(endpoint: ApiEndpoint<T>) {
  //   const { slice, thunk } = createApiSlice(endpoint);
  //   this.slices[endpoint.name] = slice;
  //   this.thunks[endpoint.name] = thunk;

  //   // Update the root reducer
  //   const newRootReducer = this.createRootReducer();
  //   this.store.replaceReducer(newRootReducer);
  // }

  // removeEndpoint(name: string) {
  //   delete this.slices[name];
  //   delete this.thunks[name];

  //   // Update the root reducer
  //   const newRootReducer = this.createRootReducer();
  //   this.store.replaceReducer(newRootReducer);
  // }
}

// Create an instance of the manager
export const reduxManager = new DynamicReduxManager(API_ENDPOINTS);

// Export the store
// export const store = reduxManager.store;

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;