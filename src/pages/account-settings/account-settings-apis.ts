import { APIClient } from "../../helpers/api-client";
import Urls from "../../redux/urls";

const api = new APIClient();
const AccountSettingsApis = {

  getAvailableSessionsForDxGrid: async (loadOptions: any) => {
    try {
      debugger;
      const responseData = await api.get(Urls.getUserSession, loadOptions);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return {
        data: [],
        totalCount: 0,
        summary: {},
        groupCount: 0,
      };
    }
  },
  getPhone: async () => {
    try {
      const responseData = await api.getAsync(Urls.getPhone_profile);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  getEmail: async () => {
    try {
      const responseData = await api.getAsync(Urls.getEmail_profile);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  getUserBasicInfo: async () => {
    try {
      const responseData = await api.getAsync(Urls.getUserBasicInfo);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  updateUserBasicInfo: async (data: any) => {
    try {
      const responseData = await api.post(Urls.updateUserBasicInfo, data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  verifyEmail_profile: async (data: any) => {
    try {
      const responseData = await api.post(Urls.verifyEmail_profile, data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  changeEmailRequest_profile: async (data: any) => {
    try {
      const responseData = await api.post(Urls.changeEmailRequest_profile, data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },

};

export default AccountSettingsApis;
