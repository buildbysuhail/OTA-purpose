import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";

const api = new APIClient();
const UserManagementApis = {
//user grid
  getSessions: async (loadOptions: any) => {
    try {
      
      const responseData = await api.get(Urls. getUserSubscriped, loadOptions);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return {};
    }
  },
  addUserSessions: async (data: any) => {
    try {
      const responseData = await api.post(Urls.postUserSubscriped,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  getUserSessionsByName: async (loadOptions: any) => {
    try {
      
      const responseData = await api.get(Urls. getUserSubscripeByName+name);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return {};
    }
  },

  editUserSessions: async (data: any) => {
    try {
      const responseData = await api.patch(Urls.patchUserSubscriped, data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },

  //user type grid
  getUserTypeSessions: async (loadOptions: any) => {
    try {
      
      const responseData = await api.get(Urls.getUserTypes, loadOptions);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return {};
    }
  },

    addUserTypeInfo: async (data: any) => {
    try {
      const responseData = await api.post(Urls.postUserTypes, data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },

//   getUserBasicInfo: async () => {
//     try {
//       const responseData = await api.getAsync(Urls.getUserBasicInfo);
//       return responseData;
//     } catch (error) {
//       console.error("Failed to get available agents for DX Grid:", error);
//       return '';
//     }
//   },

//   },
//   verifyEmail_profile: async (data: any) => {
//     try {
//       const responseData = await api.post(Urls.verifyEmail_profile, data);
//       return responseData;
//     } catch (error) {
//       console.error("Failed to get available agents for DX Grid:", error);
//       return '';
//     }
//   },
//   changeEmailRequest_profile: async (data: any) => {
//     try {
//       const responseData = await api.post(Urls.changeEmailRequest_profile, data);
//       return responseData;
//     } catch (error) {
//       console.error("Failed to get available agents for DX Grid:", error);
//       return '';
//     }
//   },

};

export default UserManagementApis;
