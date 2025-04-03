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
import ERPAlert from "../../components/ERPComponents/erp-sweet-alert";
import { RootState } from "../../redux/store";
import { onCloseWithUnsavedChange } from "../../redux/slices/popup-reducer";
import { FormField } from "../form-types";
import { getFieldPropsAdvGlob, getFieldPropsGlobal, handleFieldChangeGlobal } from "../form-utils";
import { useTranslation } from "react-i18next";

export interface UseFormManagerOptions { 
  url?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  onError?: (error: any) => void;
  key?: string;
  keyField?: string;
  method?: ActionType;
  loadDataRequired?: boolean;
  useApiClient?: boolean;
  initialData?: any;
}



export function useFormManager<T>({
  url = "",
  onSuccess,
  onClose,
  onError,
  key,
  keyField = "id",
  method,
  loadDataRequired = true,
  useApiClient = false,
  initialData,
}: UseFormManagerOptions) {
  const location = useLocation();
  const appDispatch = useAppDispatch();
  const {t} = useTranslation();
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
  
  // if(localFormState == undefined || localFormState == null || localFormState?.data == undefined || localFormState?.data ==null )
  
  const [localFormState, setLocalFormState] = useState<ApiResponse<any>>(initialData);
  const [prevLocalFormState, setPrevLocalFormState] = useState<ApiResponse<any>>(initialData);
  const reduxFormState = useAppSelector<ApiResponse<any>>(
    (state: any) => state?.[rName]
  );

  const withUnsavedChange = useAppSelector((state: RootState) => state.PopupData.onCloseWithUnsavedChange);
  useEffect(() => {
    
    if (withUnsavedChange.succeeded) {
      appDispatch(onCloseWithUnsavedChange({warn: false, succeeded: false, canceled: false}));
      onClose?.();
      }
  }, [withUnsavedChange.succeeded]);
;
  useEffect(() => {
    
    if (localFormState == undefined || localFormState == null || localFormState?.data == undefined || localFormState?.data == null) {
      
      const df = {
        data: initialData?.data || {},
        validations: initialData?.validations || {},
        loading: false,
        error: null,
      }
      setLocalFormState(df);
      setPrevLocalFormState(df);
    }
  }, [initialData]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    
    if (useApiClient || isEdit) {
      loadFormData();
    }
  }, [useApiClient, isEdit]);

  const loadFormData = useCallback(async () => {
    // setIsLoading(true);

    if (useApiClient) {
      try {
        let response;
        if (isEdit || (method != undefined && method == ActionType.POST && loadDataRequired)) {
          let par = key != undefined && key != null && key != "" ? `${url}${key}` : `${url}`
          response = await apiClient.getAsync(par);
        } else {
          response = initialData.data || {};
        }
        setLocalFormState({
          data: response,
          validations: {},
          loading: false,
          error: null,
        });
        setPrevLocalFormState({
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
        setPrevLocalFormState({
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
        setPrevLocalFormState({
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
        setPrevLocalFormState({
          data: {},
          validations: {},
          loading: false,
          error: null,
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
          response = await apiClient.put(`${url}`, (useApiClient ? localFormState : reduxFormState)?.data);
        } else {
          response = await apiClient.post(url, (useApiClient ? localFormState : reduxFormState)?.data);
        }
        handleResponse(
          response,
          () => {
            onSuccess?.();
            handleClear();
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
          action({ data: (useApiClient ? localFormState : reduxFormState)?.data }) as any
        ).unwrap();
        handleResponse(
          response,
          () => {
            onSuccess?.();
            handleClear();
          },
          () => {
            reduxManager.setState(rName, {
              data: { ...(useApiClient ? localFormState : reduxFormState)?.data },
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
    (useApiClient ? localFormState : reduxFormState)?.data,
    rName,
    appDispatch,
    isEdit,
    key,
    onSuccess,
    onError,
    useApiClient,
    url,
  ]);

  // Utility function to set nested value by path
  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop() as string;
    const deepClone = { ...obj }; // Create a shallow clone of the object

    let nestedObj = deepClone;

    keys.forEach((key) => {
      nestedObj[key] = nestedObj[key] ? { ...nestedObj[key] } : {};
      nestedObj = nestedObj[key];
    });

    nestedObj[lastKey] = value;

    return deepClone;
  };

  // const handleFieldChange = useCallback(
  //   (fieldId: string, value: any) => {
      

  //     // Update the nested field
      
  //     const newData = setNestedValue((useApiClient ? localFormState : reduxFormState)?.data, fieldId, value);

  //     if (useApiClient) {
  //       setLocalFormState((prevState: any) => ({
  //         ...prevState,
  //         data: newData,
  //         validations: { ...prevState?.validations },
  //       }));
  //     } else {
  //       reduxManager.setState(rName, {
  //         data: newData,
  //         validations: { ...(useApiClient ? localFormState : reduxFormState)?.validations },
  //         loading: false,
  //         error: null,
  //       });
  //     }
  //   },
  //   [(useApiClient ? localFormState : reduxFormState)?.data, rName, useApiClient]
  // );

  const handleFieldChange = useCallback(
    (fields: { [fieldId: string]: any } | string, value?: any) => {  
      
      // Update the nested fields for all provided fieldIds
      const updatedData = handleFieldChangeGlobal({fields: fields, value: value, formState: (useApiClient ? localFormState : reduxFormState)?.data})
      if (useApiClient) {
        setLocalFormState((prevState: any) => ({
          ...prevState,
          data: updatedData,
          validations: { ...prevState?.validations },
        }));
      } else {
        reduxManager.setState(rName, {
          data: updatedData,
          validations: { ...(useApiClient ? localFormState : reduxFormState)?.validations },
          loading: false,
          error: null,
        });
      }
    },
    [(useApiClient ? localFormState : reduxFormState)?.data, rName, useApiClient]
  );


  const handleClear = useCallback(() => {
    
    if (useApiClient) {
      const sds = isEdit || (method != undefined && method == ActionType.POST && loadDataRequired) ? {...initialData?.data,[keyField]: key}: {...initialData.data};
      setLocalFormState((prevState: any) => ({
        ...prevState,
        data: {...sds},
        validations: {},
      }));
    } else {
      reduxManager.setState(rName, {
        data: initialData,
        validations: {},
        loading: false,
        error: null,
      });
    }
  }, [(useApiClient ? localFormState : reduxFormState)?.data, rName, useApiClient]);

  const handleClose = useCallback(() => {
    const currentState = useApiClient ? localFormState : reduxFormState;
    if (JSON.stringify(currentState?.data) !== JSON.stringify(prevLocalFormState?.data)) {
      appDispatch(onCloseWithUnsavedChange({warn: true, succeeded: false, canceled: false}));
      
    } else {
      onClose?.();
    }
  }, [onClose, useApiClient, localFormState, reduxFormState, prevLocalFormState]);


  const getFieldProps = useCallback(
    (fieldId: string, type?: string): FormField => {
      
      return getFieldPropsGlobal(fieldId,(useApiClient ? localFormState : reduxFormState),type);
    },
    [(useApiClient ? localFormState : reduxFormState)?.data]
  );
  const getFieldPropsAdv = useCallback(
    (
      fieldId: string,
      options?: { onChangeData?: (data: any) => void; label?: string }
    ): FormField => {
      
      const formState = useApiClient ? localFormState : reduxFormState;
  
      return getFieldPropsAdvGlob(
        fieldId,
        formState,
        handleFieldChange,
        t,
        options
      );
    },
    [handleFieldChange, localFormState, reduxFormState, t, useApiClient]
  );

    return {
      isEdit,
      formState: useApiClient ? localFormState : reduxFormState,
      handleSubmit,
      handleFieldChange,
      handleClear,
      handleClose,
      getFieldProps,
      isLoading,
      t,
      getFieldPropsAdv,
    };

}