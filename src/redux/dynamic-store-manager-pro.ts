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
import { ActionType } from "./types";
import { ApiEndpoint } from "../configs/types";
import { DATA_ENDPOINTS } from "../configs/data-config";

// Define a generic type for API response data
type ApiResponse<T> = {
  data: T;
  loading: boolean;
  error: string | null;
};



const apiClient = new APIClient
type ThunkPayload = {
  params?: string;
  data?: any;
  id?: string | number;
};
// Function to create a slice and thunk for an endpoint
function createApiSlice(endpoint: ApiEndpoint) {
  let name = reducerNameFromUrl(endpoint.url,endpoint.method);
  debugger;
  const thunk = createAsyncThunk<any, ThunkPayload, { rejectValue: string }>(
    `${name}`,
    async (payload: ThunkPayload, { rejectWithValue }) => {
      try {
        let response;
        const { params, data, id } = payload;
        let url = endpoint.url;
        
        // If there's an ID, append it to the URL
        if (id !== undefined) {
          url = `${url}/${id}`;
        }

        switch (endpoint.method) {
          case 'GET':
            response = params != undefined && params != null ? await apiClient.get(url, params) : await apiClient.get(url);
            break;
          case 'POST':
            response = await apiClient.post(url, data);
            break;
          case 'PATCH':
            response = await apiClient.patch(url, { params });
            break;
          case 'PUT':
            response = await apiClient.put(url, data);
            break;
          case 'DELETE':
            response = await apiClient.delete(url);
            break;
          default:
            throw new Error(`Unsupported method: ${endpoint.method}`);
        }
        return response;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || 'An error occurred');
      }
    }
  );
  const slice = createSlice({
    name: name,
    initialState: {
      data: endpoint.initialData,
      loading: false,
      error: null,
    } as ApiResponse<any>,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action: PayloadAction<any>) => {
          debugger;
          state.loading = false;
          state.data = action.payload as Draft<any>;
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
  private thunks: Record<string, AsyncThunk<any, ThunkPayload, { rejectValue: string }>>;
  public store;

  constructor(endpoints: ApiEndpoint[]) {
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
      reducer: combineReducers(rootReducer),
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
    return red;
  }

  getThunk(name: string) {
    debugger;
    return this.thunks[name];
  }
  getTypedThunk<ReturnType = any>(name: string): AsyncThunk<ReturnType, ThunkPayload, { rejectValue: string }> {
    const thunk = this.thunks[name];
    if (!thunk) {
      throw new Error(`Thunk "${name}" not found`);
    }
    return thunk as AsyncThunk<ReturnType, ThunkPayload, { rejectValue: string }>;
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
export const reduxManager = new DynamicReduxManager(DATA_ENDPOINTS);

// Export the store
// export const store = reduxManager.store;

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;