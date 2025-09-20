import {
  TransactionBase,
  transactionRoutes,
} from "../components/common/content/transaction-routes";
import config from "../config";
import { APIClient } from "../helpers/api-client";
import { getStorageString } from "../utilities/storage-utils";
import Urls from "./urls";

export const domain = config.api.APP_API_URL;
export const signupUrl = import.meta.env.VITE_SIGNUP;
export const companyName = import.meta.env.VITE_COMPANY_NAME;

export const cdnUrl = import.meta.env.VITE_CDN_URL;
export const projectName = import.meta.env.VITE_PROJECT_NAME;
const CachedUrls = {
  AccLedgers: [
    btoa(Urls.data_acc_ledgers),
    ...transactionRoutes.map((x: any) =>
      btoa(
        `/${
          x.transactionBase == TransactionBase.Accounts
            ? "Accounts"
            : "Inventory"
        }/${x.transactionType}/Data/AccLedgers/`
      )
    ),
  ],
  CostCentres: [btoa(Urls.data_costcentres)],
  Employees: [btoa(Urls.data_costcentres),
     ...transactionRoutes.map((x: any) =>
      btoa(
        `/${
          x.transactionBase == TransactionBase.Accounts
            ? "Accounts"
            : "Inventory"
        }/${x.transactionType}/Data/Employee/`
      )
    ),
  ],
} as const;
export default CachedUrls;
export function existsInCache(url: string): boolean {
  const encoded = url.startsWith("/") ? btoa(url) : url;
  return Object.values(CachedUrls).some((group) => group.includes(encoded));
}
export function getCacheKey(url: string): keyof typeof CachedUrls | null {
  const encoded = url.startsWith("/") ? btoa(url) : url;
  // if it looks like a raw URL, encode it; if already Base64, keep it

  for (const [groupName, urls] of Object.entries(CachedUrls)) {
    if (urls.includes(encoded)) {
      return groupName as keyof typeof CachedUrls;
    }
  }
  return null;
}

export function getCacheStoreKey(url: string): string | null {
  const encoded = url.startsWith("/") ? btoa(url) : url;
  const key = getCacheKey(encoded);
  if (key) {
    return btoa(key);
  }
  return null;
}
type CachedKeys = keyof typeof CachedUrls;

export const getApLocalDataByUrl = async (url: string) => {
  const encoded = url.startsWith("/") ? btoa(url) : url;
  const key = getCacheKey(encoded);
  if (key) {
    const data = await getApLocalData(key);
    if (data) {
      return data;
    }
    const api = new APIClient();
    return await api.getWithCacheAsync(url);
  }
  return null;
};
export const getApLocalData = async (groupKey: keyof typeof CachedUrls) => {
  const encoded = groupKey.startsWith("/") ? btoa(groupKey) : groupKey;
  const df = await getStorageString(encoded);
  if (df == null || df == undefined || df == "undefined") {
    return null;
  }
  return JSON.parse(df);
};
