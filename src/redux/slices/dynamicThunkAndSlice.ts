// dynamicThunkAndSlice.ts
import { createSlice, createAsyncThunk, PayloadAction, Draft } from '@reduxjs/toolkit';
import axios from 'axios';
import { reducerManager } from '../dynamic-store-manager';
import { APIClient } from '../../helpers/api-client';
import { reducerNameFromUrl } from '../utils';
import { ActionType, ApiState, ApiStateWithValidation } from '../types';




const apiClient = new APIClient();
const sliceRegistry: { [key: string]: any } = {};

const createApiThunk = (type: string, url: string, method: ActionType) =>
    createAsyncThunk(type, async (payload: any, { rejectWithValue }) => {
      try {
        
        let response;
        switch (method) {
          case 'GET':
            response = await apiClient.get(url, payload);
            break;
          case 'POST':
            response = await apiClient.post(url, payload);
            break;
          case 'PATCH':
            response = await apiClient.patch(url, payload);
            break;
          case 'PUT':
            response = await apiClient.put(url, payload);
            break;
          case 'DELETE':
            response = await apiClient.delete(url, payload);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        return response;
      } catch (error) {
        return rejectWithValue(error);
      }
    });
  
export const getThunkAndSliceWithValidation = <T,V>(
  url: string,
  method: ActionType,
  isDetail: boolean = false,
  initialState?: Partial<ApiStateWithValidation<T,V>>, // Allows overriding default initial state,
  updateStateReducer: boolean = false
) => {
  interface UpdateDataByKeyPayload<T> {
    key: keyof T;
    value: T[keyof T];
  }
    
    let name = reducerNameFromUrl(url, method,isDetail);
  if (sliceRegistry[name]) {
    return sliceRegistry[name];
  }
  const apiThunk = createApiThunk(name, url,method);

  const slice = createSlice({
    name,
    initialState: <ApiStateWithValidation<T,V>>{
      data: null,
      loading: false,
      error: null,
      ...initialState, // Merge with default state
    },
    reducers: {
      updateValidation: (state, action: PayloadAction<V>) => {
        state.validations = action.payload as Draft<V>;
      },
      updateData: (state, action: PayloadAction<T>) => {
        state.data = action.payload as Draft<T>;
      },
      updateDataByKey: (state, action: PayloadAction<UpdateDataByKeyPayload<T>>) => {
        if (state.data) {
          (state.data as any)[action.payload.key] = action.payload.value;
        }
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(apiThunk.pending, (state) => {
          
          state.loading = true;
          state.error = null;
        })
        .addCase(apiThunk.fulfilled, (state, action: PayloadAction<T>) => {
          
          state.loading = false;
          state.data = action.payload as Draft<T>;
        })
        .addCase(apiThunk.rejected, (state, action) => {
          
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });

  // Register reducer dynamically
  reducerManager.add(name, slice.reducer);

  // Store in registry
  sliceRegistry[name] = { slice, thunk: apiThunk };

  return sliceRegistry[name];
};

 
export const getThunkAndSlice = <T>(
  url: string,
  method: ActionType,
  isDetail: boolean = false,
  initialState?: Partial<ApiState<T>>, // Allows overriding default initial state,
  updateStateReducer: boolean = false
) => {
    
    let name = reducerNameFromUrl(url, method,isDetail);
  if (sliceRegistry[name]) {
    return sliceRegistry[name];
  }
  const apiThunk = createApiThunk(name, url,method);

  const slice = createSlice({
    name,
    initialState: <ApiState<T>>{
      data: null,
      loading: false,
      error: null,
      ...initialState, // Merge with default state
    },
    
    reducers: {
      updateData: (state, action: PayloadAction<T>) => {
        
        state.data = action.payload as Draft<T>;
      },
      // updateDataByKey: (state, action: PayloadAction<{ key: string; value: any }>) => {
      //   if (state.data) {
      //     state.data[action.payload.key] = action.payload.value;
      //   }
      // },
    },
    extraReducers: (builder) => {
      builder
        .addCase(apiThunk.pending, (state) => {
          
          state.loading = true;
          state.error = null;
        })
        .addCase(apiThunk.fulfilled, (state, action: PayloadAction<T>) => {
          
          state.loading = false;
          state.data = action.payload as Draft<T>;
        })
        .addCase(apiThunk.rejected, (state, action) => {
          
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });

  // Register reducer dynamically
  reducerManager.add(name, slice.reducer);

  // Store in registry
  sliceRegistry[name] = { slice, thunk: apiThunk };

  return sliceRegistry[name];
};
