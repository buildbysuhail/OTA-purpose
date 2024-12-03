import {
  configureStore,
  createAsyncThunk,
  createSlice,
  combineReducers,
  PayloadAction,
  AsyncThunk,
  Slice,
  SliceCaseReducers,
  Draft,
} from "@reduxjs/toolkit";

import LoginReducer from "../redux/slices/auth/login/reducer";
import AccountReducer from "../redux/slices/auth/register/reducer";
import ForgetPasswordReducer from "../redux/slices/auth/forgetpwd/reducer";
import UserRightsReducer from "../redux/slices/user-rights/reducer";
import AppStateReducer from "../redux/slices/app/reducer";
import UserSessionReducer from "../redux/slices/user-session/reducer";
import PopupDataReducer from "../redux/slices/popup-reducer";
import TemplateReducer from "../redux/slices/templates/reducer";
import DeviceStateReducer from "../redux/slices/device/reducer";
import ApplicationSettingsReducer from "../redux/slices/app/application-settings-reducer";
import AccTransactionReducer from "../pages/accounts/transactions/reducer";

import { APIClient } from "../helpers/api-client";
import { reducerNameFromUrl } from "./actions/AppActions";
import Urls from "./urls";
import { ActionType } from "./types";
import { ApiEndpoint } from "../configs/types";
import { DATA_ENDPOINTS } from "../configs/data-config";
import { FORM_ENDPOINTS } from "../configs/form-config";
import { POST_ENDPOINTS } from "../configs/post-config";

// Define a generic type for API response data
export type ApiResponse<T> = {
  validations: any;
  data: T;
  loading: boolean;
  error: string | null;
};

const apiClient = new APIClient();
type ThunkPayload = {
  params?: string;
  data?: any;
  id?: string | number;
};
// Function to create a slice and thunk for an endpoint
function createApiSlice(endpoint: ApiEndpoint, method?: ActionType | null, isDetails?: boolean | false) {
  let _method = method != undefined && method != null ? method : endpoint.method;

  let name = reducerNameFromUrl(
    endpoint.url,
    _method ?? ActionType.GET, isDetails
  );
  
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

        switch (_method) {
          case "GET":
            response =
              params != undefined && params != null
                ? await apiClient.get(url, params)
                : await apiClient.get(url);
            break;
          case "POST":
            response = await apiClient.post(url, data);
            break;
          case "PATCH":
            response = await apiClient.patch(url, { params });
            break;
          case "PUT":
            response = await apiClient.put(url, data);
            break;
          case "DELETE":
            response = await apiClient.delete(url);
            break;
          default:
            throw new Error(`Unsupported method: ${_method}`);
        }
        return response;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "An error occurred");
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
    reducers: {
      setState: (state, action: PayloadAction<Partial<ApiResponse<any>>>) => {
        return {
          ...state,
          data: {
            ...state.data,
            ...action.payload.data,
          },
          ...(action.payload.loading !== undefined && { loading: action.payload.loading }),
          ...(action.payload.error !== undefined && { error: action.payload.error }),
        };
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action: PayloadAction<any>) => {
          
          state.loading = false;
          state.data = action.payload as Draft<any>;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "An error occurred";
        });
    },
  });

  return { slice, thunk, name };
}

class DynamicReduxManager {
  private slices: Record<string, Slice>;
  private thunks: Record<
    string,
    AsyncThunk<any, ThunkPayload, { rejectValue: string }>
  >;
  public store;

  constructor(dataEndpoints: ApiEndpoint[], formEndpoints: ApiEndpoint[], postEndPoints: ApiEndpoint[]) {
    this.slices = {};
    this.thunks = {};
    // Create slices and thunks for each endpoint
    dataEndpoints.forEach((endpoint) => {
      let name = reducerNameFromUrl(
        endpoint.url,
        endpoint.method ?? ActionType.GET
      );
      const { slice, thunk } = createApiSlice(endpoint);
      this.slices[name] = slice;
      this.thunks[name] = thunk;
    });
    postEndPoints.forEach((endpoint) => {
      let name = reducerNameFromUrl(
        endpoint.url,
        ActionType.POST
      );
      const { slice, thunk } = createApiSlice(endpoint);
      this.slices[name] = slice;
      this.thunks[name] = thunk;
    });
    formEndpoints.forEach((endpoint) => {
      const { slice: aSlice, thunk: aThunk, name: aName } = createApiSlice(endpoint, ActionType.POST);
      this.slices[aName] = aSlice;
      this.thunks[aName] = aThunk;

      const { slice: eSlice, thunk: eThunk, name: eName } = createApiSlice(endpoint, ActionType.PUT);
      this.slices[eName] = eSlice;
      this.thunks[eName] = eThunk;
    });

    // Create the root reducer
    const rootReducer = this.createRootReducer();

    // Create the store
    this.store = configureStore({
      reducer: combineReducers(rootReducer),
    });
  }

  private createRootReducer() {
    const reducerMap = Object.entries(this.slices).reduce(
      (acc, [name, slice]) => {
        acc[name] = slice.reducer;
        return acc;
      },
      {} as Record<string, any>
    );
    const red = {
      Login: LoginReducer,
      Account: AccountReducer,
      ForgetPassword: ForgetPasswordReducer,
      UserRights: UserRightsReducer,
      AppState: AppStateReducer,
      UserSession: UserSessionReducer,
      PopupData: PopupDataReducer,
      Template: TemplateReducer,
      DeviceInfo: DeviceStateReducer,
      ApplicationSettings: ApplicationSettingsReducer,
      AccTransaction: AccTransactionReducer,

      ...reducerMap,
    };
    return red;
  }

  getThunk(name: string) {
    
    return this.thunks[name];
  }
  getTypedThunk<ReturnType = any>(
    name: string
  ): AsyncThunk<ReturnType, ThunkPayload, { rejectValue: string }> {
    const thunk = this.thunks[name];
    if (!thunk) {
      throw new Error(`Thunk "${name}" not found`);
    }
    return thunk as AsyncThunk<
      ReturnType,
      ThunkPayload,
      { rejectValue: string }
    >;
  }
  setState(name: string, payload: Partial<ApiResponse<any>>) {
    const slice = this.slices[name];
    if (!slice) {
      throw new Error(`Slice "${name}" not found`);
    }
    this.store.dispatch(slice.actions.setState(payload));
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
export const reduxManager = new DynamicReduxManager(DATA_ENDPOINTS, FORM_ENDPOINTS, POST_ENDPOINTS);

// Export the store
// export const store = reduxManager.store;

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
