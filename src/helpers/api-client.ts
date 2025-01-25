import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import config from "../config";
import Cookies from "js-cookie";

import * as jwt_decode from "jwt-decode";
import ErrorManager from "../utilities/ErrorManager";
import Urls from "../redux/urls";
const { api } = config;

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
  const _token = (token??localStorage.getItem("token"))??"";
  const __token = (token??localStorage.getItem("_token"))??"";
  if(__token)  axios.defaults.headers.common["Authorization"] = "Bearer " + __token;
  if (_token) axios.defaults.headers.common["Authorization"] = "Bearer " + _token;

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
  getAsync = async (url: string, queryString: string = "", config:any = undefined, token?: string): Promise<any> => {
    try {
      setAuthorization(token);
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
  getNativeAsync = async (url: string, queryString: string = "", config:any = undefined): Promise<any> => {
    try {
      setAuthorization();
      const fullUrl = queryString !== "" ? `${url}?${queryString}` : url;
      const response = config != undefined ? await axios.get(fullUrl,config) : await axios.get(fullUrl);
      if (response?.status != undefined && response?.status != null) {
        return response;
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

  /**
   * Posts the given data to the URL
   */
  post = (url: string, data: any, headers?: any): Promise<any> => {
    setAuthorization();
    return headers ? axios.post(url, data, { headers: headers }) : axios.post(url, data);
  };

  postAsync = async (url: string, data: any, params?: any, config:any = undefined): Promise<any> => {
    setAuthorization();

    const response = params ? await axios.post(`${url}?${params}`, data,config) : await axios.post(`${url}`, data,config);

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
