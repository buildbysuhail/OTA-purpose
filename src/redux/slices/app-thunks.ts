import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APIClient } from '../../helpers/api-client';

const api = new APIClient();

interface ActionPayload {
  apiUrl: string;
  data?: any;
  action?: () => void;
}

interface ApiState {
  data: Record<string, any>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

const initialState: ApiState = {
  data: {},
  loading: {},
  error: {},
};

export const getAction = createAsyncThunk(
  'app/get',
  async ({ apiUrl, params = "" }: { apiUrl: string; params?: string }, { rejectWithValue }) => {
    try {
      const url = params ? `${apiUrl}?${params}` : apiUrl;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDetailAction = createAsyncThunk(
  'app/getDetail',
  async ({ apiUrl, id }: { apiUrl: string; id: string }, { rejectWithValue }) => {
    try {
      const url = `${apiUrl}${id}/`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const postAction = createAsyncThunk(
  'app/post',
  async ({ apiUrl, data, params = "" }: { apiUrl: string; data: any; params?: string }, { rejectWithValue }) => {
    try {
      const url = params ? `${apiUrl}?${params}` : apiUrl;
      const response = await api.post(url, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const patchAction = createAsyncThunk(
  'app/patch',
  async ({ apiUrl, params, id, lastPath }: { apiUrl: string; params?: any; id: string; lastPath?: string }, { rejectWithValue }) => {
    try {
      const url = `${apiUrl}${id}/${lastPath || ''}`;
      const response = await api.patch(url, params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const putAction = createAsyncThunk(
  'app/put',
  async ({ apiUrl, data, id }: { apiUrl: string; data: any; id?: string }, { rejectWithValue }) => {
    try {
      const url = id ? `${apiUrl}${id}/` : apiUrl;
      const response = await api.put(url, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAction = createAsyncThunk(
  'app/delete',
  async ({ apiUrl, id, params = "" }: { apiUrl: string; id: string; params?: string }, { rejectWithValue }) => {
    try {
      let url = `${apiUrl}${id}/`;
      url = params ? `${url}?${params}` : url;
      const response = await api.delete(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);


const executeCustomAction = createAsyncThunk(
  'api/executeCustomAction',
  async (action: () => void) => {
    action();
  }
);