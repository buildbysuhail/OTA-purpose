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

// content type
const token = Cookies.get("token");
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
const setAuthorization = () => {
  const token = Cookies.get("token");
if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;
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
  getAsync = async (url: string, queryString: string = ""): Promise<any> => {
    setAuthorization();
    let response: any;
    response =
      queryString !== ""
        ? axios.get(`${url}?${queryString}`)
        : await axios.get(`${url}`);
    if (response != undefined && response != null) {
      return response;
    }
    else
    {
      return response
    }
  };

  /**
   * Posts the given data to the URL
   */
  post = (url: string, data: any): Promise<any> => {
    setAuthorization();
    console.log("create ", data);

    return axios.post(url, data);
  };

  /**
   * Updates data
   */
  patch = (url: string, data: any): Promise<AxiosResponse> => {
    setAuthorization();
    return axios.patch(url, data);
  };

  put = (url: string, data: any): Promise<AxiosResponse> => {
    setAuthorization();
    return axios.put(url, data);
  };

  /**
   * Deletes data
   */
  delete = (
    url: string ,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
    setAuthorization();
    return axios.delete(url, { ...config });
  };
}

export { APIClient, setAuthorization };
