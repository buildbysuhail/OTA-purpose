
import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../urls";
import { getDetailAction } from "../app-thunks";

let api = new APIClient();
 export interface ActionState<T> {
  loading: boolean,
  error: any,
  data: T
   
 }
 export const getTemplateData = createAsyncThunk(
   'templates/getTemplateData',
   async ({ templateId }: { templateId: string }, { rejectWithValue }) => {
     const response = await getDetailAction({apiUrl: Urls.templates, id: templateId})
     return response;
   });
   export const getTemplatees = createAsyncThunk(
     'templates/getTemplates',
     async ({ templateGroup }: { templateGroup: string }, { rejectWithValue }) => {
       const response = await getDetailAction({apiUrl: Urls.templates, id: templateGroup})
       return response;
     });
     export const getTemplates = createAsyncThunk<any, any>('login/loginUser', async (params) => {
  
      const response = await api.getAsync(Urls.templates,params);
      
      return response;
    });
   export const getCRMTemplateData = createAsyncThunk(
     'templates/getCRMTemplateData',
     async ({ templateId }: { templateId: string }, { rejectWithValue }) => {
       const response = await getDetailAction({apiUrl: Urls.crm_templates, id: templateId})
       return response;
     });