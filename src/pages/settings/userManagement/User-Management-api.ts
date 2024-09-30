import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";

const api = new APIClient();
const UserManagementApis = {
//user grid
  getSessions: async (loadOptions: any) => {
    try {
      
      const responseData = await api.get(Urls.UserSubscription, loadOptions);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return {};
    }
  },
  addUserSessions: async (data: any) => {
    try {
      const responseData = await api.post(Urls.UserSubscription,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
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



};

export default UserManagementApis;
