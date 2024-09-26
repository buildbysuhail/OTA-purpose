import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIClient } from '../../../helpers/api-client';
import Urls from '../../urls';
const api = new APIClient();

export const countries = createAsyncThunk('app/countries', async () => {
  const response = await api.get(Urls.country);  
  return response;
});
export const industries = createAsyncThunk('app/industries', async () => {
  const response = await api.get(Urls.industry);  
  return response;
});
export const currencies = createAsyncThunk('app/currencies', async () => {
  const response = await api.get(Urls.currency);  
  return response;
});

export const usertypecompo = createAsyncThunk('app/usertypecompo', async () => {
  const response = await api.get(Urls.getUserTypeCompo);  
  return response;
});

export const employeecompo = createAsyncThunk('app/employeecompo', async () => {
  const response = await api.get(Urls.getEmployeeCompo);  
  return response;
});

export const ledgercompo = createAsyncThunk('app/ledgercompo', async () => {
  const response = await api.get(Urls.Ledger);  
  console.log(response.data);
  return response;
});