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
        `/${x.transactionBase == TransactionBase.Accounts
          ? "Accounts"
          : "Inventory"
        }/${x.transactionType}/Data/AccLedgers/`
      )
    ),
    btoa('/Inventory/LocalPurchaseOrder/Data/AccLedgers/')
  ],
  ProductCategory: [btoa('/Inventory/LocalPurchaseOrder/Data/ProductCategory/')],
  ProductGroup: [btoa('/Inventory/LocalPurchaseOrder/Data/ProductGroup/')],
  GroupCategory: [btoa('/Inventory/LocalPurchaseOrder/Data/GroupCategory/')],
  Section: [btoa('/Inventory/LocalPurchaseOrder/Data/Section/')],
  Product: [btoa('/Inventory/LocalPurchaseOrder/Data/Product/')],
  ProductsCode: [btoa('/Inventory/LocalPurchaseOrder/Data/ProductsCode/')],
  CostCentres: [btoa(Urls.data_costcentres)],
  Employees: [btoa(Urls.data_employees),
  ...transactionRoutes.map((x: any) =>
    btoa(
      `/${x.transactionBase == TransactionBase.Accounts
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

export const getApLocalDataByUrl = async (url: string,
  queryString: string = "",) => {
  debugger;
  const encoded = url.startsWith("/") ? btoa(url) : url;
  const key = getCacheKey(encoded);
  if (key) {
    console.log("Called");
    const data = await getApLocalData(key, queryString);

    console.log("Called end");
    if (data) {
      return data;
    }
    const api = new APIClient();
    return await api.getWithCacheAsync(url);
  }
  return null;
};
export const getApLocalData = async (groupKey: keyof typeof CachedUrls,
  queryString: string = "",) => {
  const encoded = btoa(groupKey);
  const df = await getStorageString(encoded);
  if (df == null || df == undefined || df == "undefined") {
    return null;
  }
  const val = JSON.parse(df);
  debugger;
  const filtered = filterData(val, queryString);
  return filtered;
};
/**
 * Generic filter function for any array and query string.
 * Example: filterData(data, "status=active&type=2")
 */
const filterData = async <T extends Record<string, any>>(
  data: T[],
  queryString: string
): Promise<T[]> => {
  if (!Array.isArray(data)) return [];
  const decryptedData = await Promise.all(
    data.map(async (item) => ({
      ...item,
      // Decrypt or transform fields here if needed
      // name: await decryptAES(item.name),
    }))
  );

  if (!queryString) return decryptedData;

  const params = new URLSearchParams(queryString);

  return decryptedData.filter((item) => {
    for (const [key, value] of params.entries()) {
      const normalizedValue = value.trim();
      if (!normalizedValue || ["0", "00"].includes(normalizedValue)) {
        continue; // Skip "empty" params
      }

      const itemValue = item[key];

      // Array field (e.g. ledgerType = [1,2,3])
      if (Array.isArray(itemValue)) {
        const numValue = Number(normalizedValue);
        if (!itemValue.includes(isNaN(numValue) ? normalizedValue : numValue)) {
          return false;
        }
      }
      // Object or primitive field
      else {
        const numValue = Number(normalizedValue);
        const compareValue = isNaN(numValue) ? normalizedValue : numValue;

        if (String(itemValue) !== String(compareValue)) {
          return false;
        }
      }
    }
    return true;
  });
};
