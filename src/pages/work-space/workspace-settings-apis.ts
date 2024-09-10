import { APIClient } from "../../helpers/api-client";
import Urls from "../../redux/urls";

const api = new APIClient();
const WorkspaceSettingsApis = {

  getMembers: async (loadOptions: any) => {
    try {
      
      const responseData = await api.get(Urls.get_members, loadOptions);
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
      const responseData = await api.getAsync(Urls.getPhone_workspace);
      
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  getEmail: async () => {
    try {
      const responseData = await api.getAsync(Urls.getEmail_workspace);
      
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  getUserBasicInfo: async () => {
    try {
      const responseData = await api.getAsync(Urls.getBasicInfo_workspace);
      
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  updateUserBasicInfo: async (data: any) => {
    try {
      const responseData = await api.post(Urls.changeBasicInfo_workspace, data);
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
      const responseData = await api.post(Urls.updateCompanyEmail_workspace, data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },

};

export default WorkspaceSettingsApis;
