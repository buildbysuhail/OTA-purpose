import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIClient } from '../../../helpers/api-client';
import Urls from '../../urls';
import { AppState } from './types';
const api = new APIClient();
// Async thunk to upload the app state
export const uploadAppState = createAsyncThunk('app/uploadAppState', async (state: AppState) => {
  const sendData = { content: { ...state } };
  const response = await api.post(Urls.updateUserAppSetting, sendData);
  return response.data;
});
export const getAppState = createAsyncThunk('app/getAppState', async () => {
  const response = await api.get(Urls.getUserThemes);
  return response.data;
});
export const getApplicationSettings = createAsyncThunk('api/getApplicationSettings', async () => {
  const response = await api.get(Urls.application_setting);
  
  debugger;
  return response;
});