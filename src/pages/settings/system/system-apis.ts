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

  // addCounterInfo: async (data: any) => {
  //   try {
  //     const responseData = await api.post(Urls.Counter, data);
  //     return responseData;
  //   } catch (error) {
  //     console.error("Failed to get available agents for DX Grid:", error);
  //     return '';
  //   }
  // },

  
  addDayColsInfo: async (data: any) => {
    try {
      const responseData = await api.post(Urls.DayClose,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },

  postUserActionReport: async (data: any) => {
    try {
      const responseData = await api.post(Urls.userActionReport,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  postCurrencyExchange: async (data: any) => {
    try {
      const responseData = await api.post(Urls.user_rights,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },

  postRemainder: async (data: any) => {
    try {
      const responseData = await api.post(Urls.Remainder,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },

  postAuthorizationSettings: async (data: any) => {
    try {
      const responseData = await api.post(Urls.authorization_settings,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },

  postRestDB: async (data: any) => {
    try {
      const responseData = await api.post(Urls.reset_data_base,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  postBarcodePrint: async (data: any) => {
    try {
      const responseData = await api.post(Urls.barcodePrintGrid,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
  postVoucherPrint: async (data: any) => {
    try {
      const responseData = await api.post(Urls.barcodePrintTransaction,data);
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for DX Grid:", error);
      return '';
    }
  },
};

export default SystemSettingsApi;
