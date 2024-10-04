import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ResponseModel, ResponseModelWithValidation } from "../../base/response-model";
import { reducerNameFromUrl } from "../../redux/actions/AppActions";
import { ApiResponse, reduxManager } from "../../redux/dynamic-store-manager-pro";
import { ActionType } from "../../redux/types";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import { handleResponse } from "../HandleResponse";
import { getAction, getDetailAction } from "../../redux/slices/app-thunks";

interface UseFormManagerOptions {
  url: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  key?: string;
  method?: ActionType;
}

interface FormField {
  id: string;
  value: any;
  data: any;
  validation?: string;
  checked?: any;
}

export function useFormManager<T>({ url, onSuccess, onError, key, method }: UseFormManagerOptions) {
  const location = useLocation();
  const appDispatch = useAppDispatch();

  const queryParams = new URLSearchParams(location.search);
  key = (key == undefined || key == null || key == "0" || key == "" ?  queryParams.get('key'):key)??"";
  const isEdit = Boolean(key && key !== "0"&& key !== "");

  const rName = reducerNameFromUrl(url, method ? method : isEdit ? ActionType.PUT : ActionType.POST);
  const formState = useAppSelector<ApiResponse<any>>((state: any) => state?.[rName]);
  useEffect(() => {
    if(isEdit) {
      loadFormData();
    }
  },[isEdit])
  const loadFormData = useCallback(async () => {
    const response: any = await  appDispatch(getDetailAction({apiUrl:url,id: key}) as any
    ).unwrap();
    debugger;
    reduxManager.setState(rName, {
            data: {
              data:response,
              validations: {}
            },
            loading: false,
            error: null
          });
  },[])
  const handleSubmit = useCallback(async () => {
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
  }, [formState.data, rName, appDispatch, isEdit, key, onSuccess, onError]);

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    debugger;
    reduxManager.setState(rName, {
      data: {
        data: {
          ...formState.data.data,
          [fieldId]: value[fieldId]
        },
        validations: {...formState.data.validations}
      },
      loading: false,
      error: null
      });
  }, [formState.data, rName]);

  const getFieldProps = useCallback((fieldId: string): FormField => {
    
    return {
      id: fieldId,
      data: formState.data.data,
      value: formState.data.data?.[fieldId] || '',
      validation: formState.data.validations?.[fieldId],
      checked: formState.data.data?.[fieldId] || false
    };
  }, [formState.data]);

  return {
    isEdit,
    formState,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading: formState?.loading
  };
}