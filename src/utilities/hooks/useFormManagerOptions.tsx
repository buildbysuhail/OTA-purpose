import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ResponseModel,
  ResponseModelWithValidation,
} from "../../base/response-model";
import { reducerNameFromUrl } from "../../redux/actions/AppActions";
import {
  ApiResponse,
  reduxManager,
} from "../../redux/dynamic-store-manager-pro";
import { ActionType } from "../../redux/types";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import { handleResponse } from "../HandleResponse";
import { getAction, getDetailAction } from "../../redux/slices/app-thunks";
import { APIClient } from "../../helpers/api-client";

interface UseFormManagerOptions {
  url: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  key?: string;
  method?: ActionType;
  useApiClient?: boolean;
  initialData?: any;
}

interface FormField {
  id: string;
  value: any;
  data: any;
  validation?: string;
  checked?: any;
}

export function useFormManager<T>({
  url,
  onSuccess,
  onError,
  key,
  method,
  useApiClient = false,
  initialData,
}: UseFormManagerOptions) {
  const location = useLocation();
  const appDispatch = useAppDispatch();
  const apiClient = new APIClient();

  const queryParams = new URLSearchParams(location.search);
  key =
    (key == undefined || key == null || key == "0" || key == ""
      ? queryParams.get("key")
      : key) ?? "";
  const isEdit = Boolean(key && key !== "0" && key !== "");

  const rName = reducerNameFromUrl(
    url,
    method ? method : isEdit ? ActionType.PUT : ActionType.POST
  );

  const [localFormState, setLocalFormState] = useState<ApiResponse<any>>({
    data: initialData?.data || {},
    validations: initialData?.validations || {},
    loading: false,
    error: null,
  });

  const reduxFormState = useAppSelector<ApiResponse<any>>(
    (state: any) => state?.[rName]
  );
  const formState = useApiClient ? localFormState : reduxFormState;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (useApiClient || isEdit) {
      loadFormData();
    }
  }, [useApiClient, isEdit]);

  const loadFormData = useCallback(async () => {
    // setIsLoading(true);
    debugger;
    if (useApiClient) {
      try {
        let response;
        if (isEdit) {
          response = await apiClient.getAsync(`${url}${key}`);
        } else {
          response = initialData || {};
        }
        setLocalFormState({
          data: response,
          validations: {},
          loading: false,
          error: null,
        });
      } catch (error: any) {
        setLocalFormState({
          data: initialData || {},
          validations: {},
          loading: false,
          error: null,
        });
        onError?.(error);
      }
    } else if (isEdit) {
      try {
        const response: any = await appDispatch(
          getDetailAction({ apiUrl: url, id: key }) as any
        ).unwrap();
        reduxManager.setState(rName, {
          data: response,
          validations: {},
          loading: false,
          error: null,
        });
      } catch (error: any) {
        reduxManager.setState(rName, {
          data: {},
          validations: {},
          loading: false,
          error: error,
        });
        onError?.(error);
      }
    }
    setIsLoading(false);
  }, [
    useApiClient,
    url,
    key,
    appDispatch,
    rName,
    isEdit,
    initialData,
    onError,
  ]);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    if (useApiClient) {
      try {
        let response;
        if (isEdit) {
          response = await apiClient.put(`${url}`, formState?.data);
        } else {
          response = await apiClient.post(url, formState?.data);
        }debugger;
        handleResponse(
          response,
          () => {
            onSuccess?.();
          },
          () => {
            setLocalFormState((prevState) => ({
              ...prevState,
              data: {
                ...prevState?.data,
              },
              validations: { ...response.validations },
              error: null,
              loading: false,
            }));
            onError?.(response);
          }
        );
      } catch (error) {
        onError?.(error);
      }
    } else {
      const action = reduxManager.getTypedThunk(rName);
      try {
        const response: ResponseModelWithValidation<T, any> = await appDispatch(
          action({ data: formState.data }) as any
        ).unwrap();
        handleResponse(
          response,
          () => {
            onSuccess?.();
          },
          () => {
            reduxManager.setState(rName, {
              data: { ...formState.data },
              validations: { ...response.validations },
              error: null,
              loading: false,
            });
            onError?.(response);
          }
        );
      } catch (error) {
        onError?.(error);
      }
    }
    setIsLoading(false);
  }, [
    formState?.data,
    rName,
    appDispatch,
    isEdit,
    key,
    onSuccess,
    onError,
    useApiClient,
    url,
  ]);

  const handleFieldChange = useCallback(
    (fieldId: string, value: any) => {
      const newData = {
        ...formState?.data,
        [fieldId]: value[fieldId],
      };

      if (useApiClient) {
        setLocalFormState((prevState) => ({
          ...prevState,
          data: newData,
          validations: { ...prevState?.validations },
        }));
      } else {
        reduxManager.setState(rName, {
          data: newData,
          validations: { ...formState?.validations },
          loading: false,
          error: null,
        });
      }
    },
    [formState?.data, rName, useApiClient]
  );

  const getFieldProps = useCallback(
    (fieldId: string): FormField => {
      return {
        id: fieldId,
        data: formState?.data,
        value: formState?.data?.[fieldId] || "",
        validation: formState?.validations?.[fieldId],
        checked: formState?.data?.[fieldId] || false,
      };
    },
    [formState?.data]
  );

  return {
    isEdit,
    formState,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
  };
}