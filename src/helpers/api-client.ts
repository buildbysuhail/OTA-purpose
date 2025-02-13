import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import config from "../config";
import Cookies from "js-cookie";

import * as jwt_decode from "jwt-decode";
import ErrorManager from "../utilities/ErrorManager";
import Urls from "../redux/urls";
import { useAppSelector } from "../utilities/hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { setData } from "../redux/slices/data/reducer";
const { api } = config;
import {decryptAES} from '../utilities/Utils'

//  const formState = useAppSelector((state: RootState) => state.AccTransaction);
// default
axios.defaults.baseURL = Urls.baseUrl;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.defaults.headers.post["X-Custom-Header"] = new Date().toISOString();

// content type
const token = localStorage.getItem("token");
if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    let message = ErrorManager.handle(error);
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token?: string) => {
  const _token = token ?? localStorage.getItem("token") ?? "";
  const __token = token ?? localStorage.getItem("_token") ?? "";
  if (__token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + __token;
  } else if (_token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + _token;
  }

  axios.defaults.headers.common["X-Software-Date"] = new Date().toDateString();
  axios.defaults.headers.common["X-Client-Date"] = new Date().toISOString();
};

class APIClient {
  /**
   * Fetches data from the given URL
   */

  get = (url: string, queryString: string = ""): Promise<any> => {
    setAuthorization();
    let response: Promise<any>;
    response =
      queryString !== ""
        ? axios.get(`${url}?${queryString}`)
        : axios.get(`${url}`);
    return response;
  };
 

  filterLedgers = async (ledgers: any[], queryString: string): Promise<any[]> => {
    // Decrypt all names asynchronously
    const decryptedLedgers = await Promise.all(
        ledgers.map(async (x) => ({
            ...x,
            name: await decryptAES(x.name),
        }))
    );

    if (!queryString) return decryptedLedgers;

    const queryParams = new URLSearchParams(queryString);

    // Return all ledgers if ledgerType is "All"
    if (queryParams.get("ledgerType") === "All") {
        return decryptedLedgers;
    }
    else {
      debugger;
    }
    
    return decryptedLedgers.filter((ledger) => {
      
        for (const [key, value] of queryParams.entries()) {
          
            if (key === "ledgerID") {
                if (ledger.id === undefined || String(ledger.id) !== value) {
                    return false;
                }
            } else if (key === "ledgerType") {
                if (ledger.ledgerType === undefined || String(ledger.ledgerType) !== value) {
                    return false;
                }
            }
        }
        return true;
    });
};
  
  getAsync = async (
    url: string,
    queryString: string = "",
    config: any = undefined,
    token?: string,
    force: boolean = false,
    reduxState: any = undefined,
    dispatch: any = undefined
  ): Promise<any> => {
    try {
      console.log(queryString);
      
let _qry = queryString.toString();
      if (url.includes("/Accounts/Data/AccLedgers/") && !force) {
        
        debugger;
        if (reduxState?.ledgers !== undefined && reduxState?.ledgers !== null) {
          return this.filterLedgers(reduxState.ledgers, queryString);
        }
        _qry = "";
      }

      setAuthorization(token);
      const fullUrl = _qry ? `${url}?${_qry}` : url;
      const response = config
        ? await axios.get(fullUrl, config)
        : await axios.get(fullUrl);
      let _res =
        response?.status !== undefined && response?.status !== null
          ? response?.data
          : response;
      if (url.includes("/Accounts/Data/AccLedgers/")) {
        
        dispatch(setData({ key: "ledgers", value: _res }));
        _res = this.filterLedgers(_res, queryString);
      }
      return _res;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error data:", error.response.data);
          console.error("Error status:", error.response.status);
          console.error("Error headers:", error.response.headers);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
      return undefined;
    }
  };
  getNativeAsync = async (
    url: string,
    queryString: string = "",
    config: any = undefined
  ): Promise<any> => {
    try {
      setAuthorization();
      const fullUrl = queryString !== "" ? `${url}?${queryString}` : url;
      const response =
        config != undefined
          ? await axios.get(fullUrl, config)
          : await axios.get(fullUrl);
      if (response?.status != undefined && response?.status != null) {
        return response;
      } else {
        return response;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios specific errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error data:", error.response.data);
          console.error("Error status:", error.response.status);
          console.error("Error headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      } else {
        // Handle non-Axios errors
        console.error("Unexpected error:", error);
      }
      return undefined; // Re-throw the error for the caller to handle if needed
    }
  };

  /**
   * Posts the given data to the URL
   */
  post = (url: string, data: any, headers?: any): Promise<any> => {
    setAuthorization();
    return headers
      ? axios.post(url, data, { headers: headers })
      : axios.post(url, data);
  };

  postAsync = async (
    url: string,
    data: any,
    params?: any,
    config: any = undefined
  ): Promise<any> => {
    setAuthorization();

    const response = params
      ? await axios.post(`${url}?${params}`, data, config)
      : await axios.post(`${url}`, data, config);

    return response;
    // if (response?.status != undefined && response?.status != null) {
    //   return response?.data;
    // }
    // else
    // {
    //   return response
    // }
  };
  /**
   * Updates data
   */
  patch = (url: string, data: any): Promise<AxiosResponse> => {
    setAuthorization();
    return axios.patch(url, data);
  };

  putAsync = async (
    url: string,
    data: any,
    token?: string
  ): Promise<AxiosResponse> => {
    setAuthorization(token);
    return await axios.put(url, data);
  };
  put = (url: string, data: any, token?: string): Promise<AxiosResponse> => {
    setAuthorization(token);
    return axios.put(url, data);
  };

  /**
   * Deletes data
   */
  delete = (
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
    setAuthorization();
    return axios.delete(url, { ...config });
  };
}

export { APIClient, setAuthorization };
