import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIClient } from '../../../helpers/api-client';
import Urls from '../../urls';
const api = new APIClient();

export const countries = createAsyncThunk('app/countries', async () => {
  const response = await api.get(Urls.country);
  return response.data;
});