import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";

const api = new APIClient();
const SystemSettingsApi = {

    getSystemCounters: async (loadOptions: any) => {
    try {
      
      const responseData = await api.get(Urls.getSystemCounters, loadOptions);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return {};
    }
  },



};

export default SystemSettingsApi;
