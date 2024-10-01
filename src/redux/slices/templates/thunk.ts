
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
export const getTemplates = createAsyncThunk(
  'templates/getTemplates',
  async ({ templateId }: { templateId: string }, { rejectWithValue }) => {
    const response = await getDetailAction({apiUrl: Urls.templates, id: templateId})
    return response;
  });