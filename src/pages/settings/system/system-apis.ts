import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";

const api = new APIClient();
const SystemSettingsApi = {

  addFinancialYearInfo: async (data: any) => {
    try {
      const responseData = await api.post(Urls.FinancialYear,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },

  addCounterInfo: async (data: any) => {
    try {
      const responseData = await api.post(Urls.postSystemCounters, data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },

};

export default SystemSettingsApi;
