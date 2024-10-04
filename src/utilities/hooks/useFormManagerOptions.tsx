import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ResponseModel, ResponseModelWithValidation } from "../../base/response-model";
import { reducerNameFromUrl } from "../../redux/actions/AppActions";
import { ApiResponse, reduxManager } from "../../redux/dynamic-store-manager-pro";
import { ActionType } from "../../redux/types";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import { handleResponse } from "../HandleResponse";
import { getAction, getDetailAction } from "../../redux/slices/app-thunks";
import { APIClient } from "../../helpers/api-client";
import { AnnotationType } from "devextreme/common/charts";

interface UseFormManagerOptions {
  url: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  key?: string;
  method?: ActionType;
  useApiClient?: boolean; // New option to use APIClient
}

interface FormField {
  id: string;
  value: any;
  data: any;
  validation?: string;
  checked?: any;
}

export function useFormManager<T>({ url, onSuccess, onError, key, method, useApiClient = false }: UseFormManagerOptions) {
  const location = useLocation();
  const appDispatch = useAppDispatch();
  const apiClient = new APIClient(); // Create an instance of APIClient

  const queryParams = new URLSearchParams(location.search);
  key = (key == undefined || key == null || key == "0" || key == "" ? queryParams.get('key') : key) ?? "";
  const isEdit = Boolean(key && key !== "0" && key !== "");

  const rName = reducerNameFromUrl(url, method ? method : isEdit ? ActionType.PUT : ActionType.POST);
  const formState = useApiClient
    ? useAppSelector(() => ({ data: { data: {}, validations: {} }, loading: false, error: null }))
    : useAppSelector<ApiResponse<any>>((state: any) => state?.[rName]);

  useEffect(() => {
    if (isEdit) {
      loadFormData();
    }
  }, [isEdit]);

  const loadFormData = useCallback(async () => {
    if (useApiClient) {
      try {
        const response = await apiClient.getAsync(`${url}/${key}`);
        setFormState({
          data: {
            data: response,
            validations: {}
          },
          loading: false,
          error: null
        });
      } catch (error: any) {
        setFormState({
          data: { data: {}, validations: {} },
          loading: false,
          error: error
        });
      }
    } else {
      const response: any = await appDispatch(getDetailAction({ apiUrl: url, id: key }) as any).unwrap();
      reduxManager.setState(rName, {
        data: {
          data: response,
          validations: {}
        },
        loading: false,
        error: null
      });
    }
  }, [useApiClient, url, key, appDispatch, rName]);

  const handleSubmit = useCallback(async () => {
    if (useApiClient) {
      try {
        let response;
        if (isEdit) {
          response = await apiClient.put(`${url}/${key}`, formState.data.data);
        } else {
          response = await apiClient.post(url, formState.data.data);
        }
        handleResponse(response,
          () => { onSuccess?.(); },
          () => {
            setFormState({
              data: {
                ...formState.data,
                validations: response.validations
              }
            });
            onError?.(response);
          });
      } catch (error) {
        onError?.(error);
      }
    } else {
      const action = reduxManager.getTypedThunk(rName);
      try {
        const response: ResponseModelWithValidation<T, any> = await appDispatch(
          action({ data: formState.data.data }) as any
        ).unwrap();
        handleResponse(response,
          () => { onSuccess?.(); },
          () => {
            reduxManager.setState(rName, {
              data: {
                ...formState.data,
                validations: response.validations
              }
            });
            onError?.(response);
          });
      } catch (error) {
        onError?.(error);
      }
    }
  }, [formState.data, rName, appDispatch, isEdit, key, onSuccess, onError, useApiClient, url]);

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    if (useApiClient) {
      setFormState({
        data: {
          data: {
            ...formState.data.data,
            [fieldId]: value[fieldId]
          },
          validations: { ...formState.data.validations }
        },
        loading: false,
        error: null
      });
    } else {
      reduxManager.setState(rName, {
        data: {
          data: {
            ...formState.data.data,
            [fieldId]: value[fieldId]
          },
          validations: { ...formState.data.validations }
        },
        loading: false,
        error: null
      });
    }
  }, [formState.data, rName, useApiClient]);

  const getFieldProps = useCallback((fieldId: string): FormField => {
    return {
      id: fieldId,
      data: formState.data.data,
      value: formState.data.data?.[fieldId] || '',
      validation: formState.data.validations?.[fieldId],
      checked: formState.data.data?.[fieldId] || false
    };
  }, [formState.data]);

  const setFormState = useCallback((newState: Partial<ApiResponse<any>>) => {
    if (useApiClient) {
      // Update local state when using APIClient
      formState.data = { ...formState.data, ...newState.data };
      formState.loading = newState.loading ?? formState.loading;
      formState.error = newState.error ?? formState.error;
    } else {
      // Update Redux state
      reduxManager.setState(rName, newState);
    }
  }, [useApiClient, rName, formState]);

  return {
    isEdit,
    formState,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading: formState?.loading
  };
}