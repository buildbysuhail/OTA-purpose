// import { customJsonParse } from "../utilities/jsonConverter";
// import { getStorageString } from "../utilities/storage-utils";
// import { ApplicationSettingsInitialState } from "./slices/app/application-settings-types";
// import { initialState } from "./slices/user-rights/reducer";
// import { initialUserSessionData } from "./slices/user-session/reducer";

// export const preloadAllStorageData = async () => {
//   try {
//     // Load all storage data in parallel using Promise.all
//     const [userSessionRaw, userRightsRaw, appSettingsRaw] = await Promise.all([
//       getStorageString("up"), // Your existing async storage function
//       getStorageString("userRights"), // Assuming different key for rights
//       getStorageString("as")
//     ]);

//     // Process the loaded data
//     const userSessionData = userSessionRaw != undefined && userSessionRaw != null && userSessionRaw != "" 
//       ? customJsonParse(atob(userSessionRaw)) 
//       : initialUserSessionData;

//     const userRightsData = userRightsRaw != undefined && userRightsRaw != null && userRightsRaw != "" 
//       ? customJsonParse(atob(userRightsRaw)) 
//       : initialState;

//     const appSettingsData = appSettingsRaw != undefined && appSettingsRaw != null && appSettingsRaw != "" 
//       ? customJsonParse(atob(appSettingsRaw)) 
//       : ApplicationSettingsInitialState;

//     return {
//       userSession: userSessionData,
//       userRights: userRightsData,
//       appSettings: appSettingsData
//     };
//   } catch (error) {
//     console.error('Error preloading storage data:', error);
//     // Return defaults if loading fails
//     return {
//       userSession: initialUserSessionData,
//       userRights: initialState,
//       appSettings: ApplicationSettingsInitialState
//     };
//   }
// };
