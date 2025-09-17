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
import { getStorageString, setStorageString } from "../utilities/storage-utils";

//  const formState = useAppSelector((state: RootState) => state.AccTransaction);
// default
axios.defaults.baseURL = Urls.baseUrl;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.defaults.headers.post["X-Custom-Header"] = new Date().toISOString();

// content type
const getToken = async()=>{
  return await getStorageString("token")
}
const token = await getToken()

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
const setAuthorization = async(token?: string) => {
  const _token = token ??await getStorageString("token") ?? "";
  const __token = token ??await getStorageString("_token") ?? "";
  if (__token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + __token;
  } else if (_token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + _token;
  }

  axios.defaults.headers.common["X-Software-Date"] = new Date().toDateString();
  axios.defaults.headers.common["X-Client-Date"] = new Date().toISOString();
};

// In-flight requests cache: key => Promise
const inFlightRequests = new Map<string, Promise<any>>();


class APIClient {
  /**
   * Fetches data from the given URL
   */
clearInFlightRequests = () => {
  inFlightRequests.clear();
};
  get = async(url: string, queryString: string = ""): Promise<any> => {
    await setAuthorization();
    let response: Promise<any>;
    response =
      queryString !== ""
        ? axios.get(`${url}?${queryString}`)
        : axios.get(`${url}`);
    return response;
  };
  getWithCacheAsync = async (
    url: string,
    queryString: string = "",
    ignoreCach: boolean = false,
    config?: AxiosRequestConfig,
    token?: string
  ): Promise<any> => {
    try {
      
      await setAuthorization(token);
      // Construct a stable cache key (you could change the delimiter if needed)
      const cacheKey = `${url}`;
      
      // Check if a request is already in-flight
      if (inFlightRequests.has(cacheKey) && !ignoreCach) {
        return inFlightRequests.get(cacheKey);
      }
      
      const fullUrl = queryString !== "" ? `${url}?${queryString}` : url;
      // Start the axios GET request and store its Promise
      let resData: any;
       const response = config != undefined ? await axios.get(fullUrl,config) : await axios.get(fullUrl);
      if (response?.status != undefined && response?.status != null) {
        resData = response?.data;
      }
      else {
        resData = response
      }      
      inFlightRequests.set(cacheKey, resData);      
      await setStorageString(btoa(url), JSON.stringify(resData))
      return resData
    
    } catch (error) {
      console.error("Unexpected error in getAsync:", error);
      return undefined;
    }
  };

  getAsync = async (url: string, queryString: string = "", config:any = undefined, token?: string): Promise<any> => {
    try {
     await setAuthorization(token);
      const fullUrl = queryString !== "" ? `${url}?${queryString}` : url;
      const response = config != undefined ? await axios.get(fullUrl,config) : await axios.get(fullUrl);
      if (response?.status != undefined && response?.status != null) {
        return response?.data;
      }
      else {
        return response
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios specific errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      } else {
        // Handle non-Axios errors
        console.error('Unexpected error:', error);
      }
      return undefined; // Re-throw the error for the caller to handle if needed
    }
  };
  

  getNativeAsync = async (
    url: string,
    queryString: string = "",
    config: any = undefined
  ): Promise<any> => {
    try {
    await  setAuthorization();
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
  post = async(url: string, data: any, headers?: any, onUploadProgress?: any): Promise<any> => {
    debugger;
    await setAuthorization();
    return headers
      ? (onUploadProgress 
          ? axios.post(url, data, { headers: headers, onUploadProgress: onUploadProgress })
          : axios.post(url, data, { headers: headers })
        )
      : onUploadProgress ? axios.post(url, data, {onUploadProgress: onUploadProgress }) :axios.post(url, data);
  };

  postAsync = async (
    url: string,
    data: any,
    params?: any,
    config: any = undefined
  ): Promise<any> => {
   await  setAuthorization();

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
  patch = async(url: string, data: any): Promise<AxiosResponse> => {
    await setAuthorization();
    return axios.patch(url, data);
  };

  putAsync = async (
    url: string,
    data: any,
    token?: string
  ): Promise<AxiosResponse> => {
   await setAuthorization(token);
    return await axios.put(url, data);
  };
  put = async(url: string, data: any, token?: string): Promise<AxiosResponse> => {
   await setAuthorization(token);
    return axios.put(url, data);
  };

  /**
   * Deletes data
   */
  delete = async(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
   await setAuthorization();
    return axios.delete(url, { ...config });
  };
}

export { APIClient, setAuthorization };
