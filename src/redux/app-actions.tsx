import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { TemplateState } from "../pages/InvoiceDesigner/Designer/interfaces";
import { camelize, capitalizeFirstLetter } from '../utilities/Utils';

// Helper functions
const reducerNameFromUrl = (url: string, method: string, isDetail = false) => {
  const match = /[^a-zA-Z ]/g;
  const lastPath = /\/([^/]*)$/;
  let name = `${method.toLowerCase()}${url}`.replace(lastPath, "")?.replaceAll(match, " ");
  name = capitalizeFirstLetter(camelize(name));
  if (isDetail) {
    name = name + "Detail";
  }
  return name;
};

const actionTypeFromUrl = (url: string, method: string, isDetail = false) => {
  const match = /[^a-zA-Z ]/g;
  const lastPath = /\/([^/]*)$/;
  let ActionType = `${method}${url}`.replace(lastPath, "")?.replaceAll(match, "_").toUpperCase();
  if (isDetail) {
    ActionType = ActionType + "_DETAIL";
  }
  return ActionType;
};

// Thunks
export const getAction = createAsyncThunk(
  'app/get',
  async ({ apiUrl, params = "" }: { apiUrl: string; params?: string }, { rejectWithValue }) => {
    try {
      const url = params ? `${apiUrl}?${params}` : apiUrl;
      const response = await axios.get(url);
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
      const response = await axios.get(url);
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
      const response = await axios.post(url, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const patchAction = createAsyncThunk(
  'app/patch',
  async ({ apiUrl, data, id, lastPath }: { apiUrl: string; data: any; id: string; lastPath?: string }, { rejectWithValue }) => {
    try {
      const url = `${apiUrl}${id}/${lastPath || ''}`;
      const response = await axios.patch(url, data);
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
      const response = await axios.put(url, data);
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
      const response = await axios.delete(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Regular action (not a thunk)
export const setActiveTemplate = createAction<{ template: TemplateState; data?: any }>('app/setActiveTemplate');

// You can export these if needed elsewhere
export { reducerNameFromUrl, actionTypeFromUrl };