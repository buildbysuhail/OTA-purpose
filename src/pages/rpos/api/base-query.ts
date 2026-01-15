/**
 * RPOS Base Query Configuration
 *
 * RTK Query handles ALL caching in Redux store. DO NOT use getWithCacheAsync here.
 *
 * CACHING FLOW:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  Component calls useGetProductGroupsQuery()                     │
 * │                      ↓                                          │
 * │  RTK Query checks Redux store for cached data                   │
 * │                      ↓                                          │
 * │  ┌─────────────┐              ┌──────────────┐                  │
 * │  │ Cache HIT   │              │ Cache MISS   │                  │
 * │  │ Return data │              │ Call baseQuery│                  │
 * │  │ immediately │              │ → APIClient   │                  │
 * │  └─────────────┘              └──────────────┘                  │
 * │                                      ↓                          │
 * │                              Store in Redux                     │
 * │                              Return to component                │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Cache duration: Controlled by `keepUnusedDataFor` in rpos-api.ts (default 300s)
 */

import { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { APIClient } from "../../../helpers/api-client";

// API Client instance
const apiClient = new APIClient();

// Define query argument types
export interface QueryArgs {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  params?: string;
}

// Define error type
export interface QueryError {
  status: number;
  data: unknown;
  message?: string;
}

/**
 * Custom base query function that integrates with existing APIClient
 *
 * NOTE: RTK Query manages caching - this just makes the HTTP call.
 * Never use getWithCacheAsync here as it would create double-caching.
 */
export const rposBaseQuery: BaseQueryFn<
  QueryArgs,
  unknown,
  QueryError
> = async (args) => {
  const { url, method = "GET", body, params = "" } = args;

  try {
    let result: unknown;

    switch (method) {
      case "GET":
        // RTK Query caches this response in Redux store
        result = await apiClient.getAsync(url, params);
        break;

      case "POST":
        result = await apiClient.postAsync(url, body, params);
        break;

      case "PUT":
        result = await apiClient.putAsync(url, body);
        break;

      case "DELETE":
        result = await apiClient.delete(url);
        break;

      case "PATCH":
        result = await apiClient.patch(url, body);
        break;

      default:
        result = await apiClient.getAsync(url, params);
    }

    return { data: result };
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    return {
      error: {
        status: err?.status || 500,
        data: error,
        message: err?.message || "An error occurred",
      },
    };
  }
};

export default rposBaseQuery;
