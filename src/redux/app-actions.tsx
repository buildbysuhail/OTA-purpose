// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { APIClient } from '../helpers/api-client';
// import { ApiState } from './types';

// const api = new APIClient();

// interface ActionPayload {
//   apiUrl: string;
//   data?: any; // Data is optional and type `any`, adjust as necessary
//   action?: () => void
// }

// export const postAction = createAsyncThunk(
//   'api/postAction',
//   async ({ apiUrl, data }: ActionPayload) => {
//     const response = await api.post(apiUrl, data);
//     return response;
//   }
// );

// export const getAction = createAsyncThunk(
//   'api/getAction',
//   async ({ apiUrl }: ActionPayload) => {
//     const response = await api.get(apiUrl);
//     return response.data;
//   }
// );

// export const putAction = createAsyncThunk(
//   'api/putAction',
//   async ({ apiUrl, data }: ActionPayload) => {
//     const response = await api.put(apiUrl, data);
//     return response.data;
//   }
// );

// export const deleteAction = createAsyncThunk(
//   'api/deleteAction',
//   async ({ apiUrl }: ActionPayload) => {
//     const response = await api.delete(apiUrl);
//     return response.data;
//   }
// );


// const initialState: ApiState = {
//   loading: false,
//   error: null,
//   data: null,
// };

// export const appActionSlice = createSlice({
//   name: 'appAction',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Handle postAction
//       .addCase(postAction.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(postAction.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(postAction.rejected, (state, action) => {
//         state.loading = false;
//         state.error = 'An error occurred while posting data';
//       })

//       // Handle getAction
//       .addCase(getAction.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getAction.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(getAction.rejected, (state, action) => {
//         state.loading = false;
//         state.error = 'An error occurred while fetching data';
//       })

//       // Handle putAction
//       .addCase(putAction.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(putAction.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(putAction.rejected, (state, action) => {
//         state.loading = false;
//         state.error = 'An error occurred while updating data';
//       })

//       // Handle deleteAction
//       .addCase(deleteAction.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteAction.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(deleteAction.rejected, (state, action) => {
//         state.loading = false;
//         state.error = 'An error occurred while deleting data';
//       });
//   },
// });
