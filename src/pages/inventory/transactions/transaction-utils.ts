import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { customJsonParse, modelToBase64Unicode, safeBase64Decode } from "../../../utilities/jsonConverter";
import { setStorageString } from "../../../utilities/storage-utils";
import { initialUserConfig } from "./transaction-type-data";
import { UserConfig } from "./transaction-types";


export const fetchUserConfig = async (userId: number , transactionType :string ) => {
    try {
      const api = new APIClient()
       const key = btoa(`${userId}-${transactionType}_LocalSettings`) ;
      const savedPreferences = await api.getAsync(
        `${Urls.inv_transaction_base}${transactionType}/GetLocalSettings`
      );
      if (
        savedPreferences != "undefined" &&
        savedPreferences != undefined &&
        savedPreferences != null &&
        savedPreferences != `""` &&
        savedPreferences != ""
      ) {
        await setStorageString(key,savedPreferences );
        // Decode the base64 back to JSON string
        
        const _userConfig = safeBase64Decode(savedPreferences ?? "");
        const userConfig: UserConfig = customJsonParse(_userConfig ?? "{}");

        return userConfig;
      }
      const _bs64 = modelToBase64Unicode(initialUserConfig);   
      await setStorageString(key, _bs64);
      return initialUserConfig;
    } catch (error) {
      console.error("Error fetching user config:", error);
    }
  };
  