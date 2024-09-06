import { APIClient } from "../../helpers/api-client";
import Urls from "../../redux/urls";

const api = new APIClient();
const workspaceApis = {

  getAvailableSessionsForDxGrid: async (loadOptions: any) => {
    try {
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

};

export default workspaceApis;
