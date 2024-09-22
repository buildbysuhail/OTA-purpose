import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";


const api = new APIClient();
const AdministrationSettingsApis = {

  getCompayProfileInfo: async () => {
    try {
      const responseData = await api.getAsync(Urls. getCompayProfiles);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  addCompanyProfileInfo: async (data: any) => {
    try {
      const responseData = await api.post(Urls.postCompayProfiles, data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },


};

export default AdministrationSettingsApis;
