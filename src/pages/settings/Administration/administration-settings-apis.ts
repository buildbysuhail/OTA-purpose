import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";


const api = new APIClient();
const AdministrationSettingsApis = {

  getCompanyProfileInfo: async () => {
    try {
      const responseData = await api.getAsync(Urls.CompanyProfiles);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  addCompanyProfileInfo: async (data: any) => {
    try {
      const responseData = await api.post(Urls.CompanyProfiles,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  addBranchInfo: async (data: any) => {
    try {
      const responseData = await api.post(Urls.Branch,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  addBankPosInfo: async (data: any) => {
    try {
      const responseData = await api.post(Urls.BankPosSettings, data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },

  addDeleteInactiveTransaction: async (data: any) => {
    try {
      const responseData = await api.post(Urls.deleteInactiveTransactions,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },

};

export default AdministrationSettingsApis;
