import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import UserManagementApis from "./User-Management-api";
import {
  toggleUserPopup,
  toggleUserTypePopup,
} from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useCallback, useState } from "react";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../redux/urls";

type PrimitiveFormField = string | number | boolean | Date | null | undefined;
type ArrayFormField = PrimitiveFormField[];
type ObjectFormField = { [key: string]: FormField };
type FormField = PrimitiveFormField | ArrayFormField | ObjectFormField;

interface FormDataStructure {
  [key: string]: FormField;
}

interface Validations {
  [key: string]: string;
}

interface FormState {
  data: FormDataStructure;
  validations: Validations;
}

interface DynamicFormProps {
  initialData: FormState;
  onSubmit: (data: FormDataStructure) => void;
  onCancel: () => void;
}

export const UserManage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const onClose = useCallback(async () => {
    dispatch(toggleUserPopup(false));
  }, []);
  const initialData = {
    data: {
      userName: "",
      counterID: 0,
      Password: "",
      confromPassword: "",
      userTypeCode: "",
      employeeID: 0,
      maxDecimalPerAllowed: 0,
      email: "",
      phoneNumber: "",
      displayName: "",
    },
    validations: {
      userName: "",
      counterID: "",
      Password: "",
      confromPassword: "",
      userTypeCode: "",
      employeeID: "",
      maxDecimalPerAllowed: "",
      email: "",
      phoneNumber: "",
      displayName: "",
    },
  };
  const [postData, setPostData] = useState<FormState>(initialData);
  const [postDataLoading, setPostDataLoading] = useState<boolean>(false);

  const queryParams = new URLSearchParams(location.search);

  //key : used for route parm for edit or view
  const [key, setKey] = useState<any>(queryParams.get("key"));

  const handleSubmit = useCallback(async () => {
   setPostDataLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await UserManagementApis.addUserTypeInfo(postData?.data);
   setPostDataLoading(false);
    handleResponse(
      response,
      () => {
        dispatch(toggleUserPopup(false));
      },
      () => {
        setPostData((prevData: any) => ({
          ...prevData,
          validations: response.validations,
        }));
      }
    );
  }, [postData?.data]);

  const handleChange = useCallback((id: string, value: FormField) => {
    try {
      setPostData((prevData) => {
        const newData = { ...prevData.data };

        if (id.includes(".")) {
          const [fieldParent, fieldChild] = id.split(".");
          if (
            typeof newData[fieldParent] === "object" &&
            newData[fieldParent] !== null &&
            !Array.isArray(newData[fieldParent])
          ) {
            (newData[fieldParent] as { [key: string]: FormField })[fieldChild] =
              value;
          }
        } else {
          newData[id] = value;
        }

        return {
          ...prevData,
          data: newData,
        };
      });
    } catch (error) {
      console.log(`DynamicForm, Error: `, error);
    }
  }, []);
  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <ERPInput
          id="userName"
          label="User Name"
          placeholder="User Name"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
           setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.userName}
          validation={postData?.validations?.userName}
        />
        <ERPDataCombobox
          id="counterID"
          field={{
            id: "counterID",
            required: true,
            getListUrl: Urls.data_countries,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
           setPostData((prev: any) => ({
              ...prev,
              data: {
                ...data,
                counterID: data.counterID,
              },
            }));
          }}
          validation={postData.validations.counterID}
          data={postData?.data}
          defaultData={postData?.data}
          value={
            postData != undefined &&
            postData?.data != undefined &&
            postData?.data?.counterID != undefined
              ? postData?.data?.counterID
              : 0
          }
          label="counterID"
        />
        <ERPInput
          id="Password"
          label="Password"
          placeholder="Password"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
           setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.Password}
          validation={postData?.validations?.Password}
        />

        <ERPInput
          id="confromPassword"
          label="confromPassword"
          placeholder="confromPassword"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
           setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.confromPassword}
          validation={postData?.validations?.confromPassword}
        />

        <ERPDataCombobox
          id="userTypeCode"
          field={{
            id: "userTypeCode",
            required: true,
            getListUrl: Urls.data_user_types,
            valueKey: "userTypeCode",
            labelKey: "userTypeName",
          }}
          onChangeData={(data: any) => {
            // Update only the userTypeCode field
           setPostData((prevData: any) => ({
              ...prevData,
              data: {
                ...prevData.data,

                userTypeCode: data.value,
              },
            }));
          }}
          // validation={postData.validations.userTypeCode}
          data={postData?.data}
          defaultData={postData?.data}
          value={postData?.data?.userTypeCode || ""}
          label="userTypeCode"
        />

        <ERPDataCombobox
          id="employeeID"
          field={{
            id: "employeeID",
            required: true,
            getListUrl: Urls.data_employees,
            valueKey: "employeeID",
            labelKey: "employeeName",
          }}
          onChangeData={(data: any) => {
           setPostData((prev: any) => ({
              ...prev,
              data: data,
            }));
          }}
          // validation={postData.validations.employeeID}
          data={postData?.data}
          defaultData={postData?.data}
          value={
            postData != undefined &&
            postData?.data != undefined &&
            postData?.data?.employeeID != undefined
              ? postData?.data?.employeeID
              : 0
          }
          label="employeeID"
        />

        <ERPInput
          id="maxDecimalPerAllowed"
          label="maxDecimalPerAllowed"
          placeholder="maxDecimalPerAllowed"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
           setPostData((prevData: any) => ({
              ...prevData,
              data: {
                ...data,
                maxDecimalPerAllowed: Number(data.maxDecimalPerAllowed),
              },
            }));
          }}
          value={postData?.data?.maxDecimalPerAllowed}
          validation={postData?.validations?.maxDecimalPerAllowed}
        />

        <ERPInput
          id="email"
          label="email"
          placeholder="email"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
           setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.email}
          validation={postData?.validations?.email}
        />

        <ERPInput
          id="phoneNumber"
          label="phoneNumber"
          placeholder="phoneNumber"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
           setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.phoneNumber}
          validation={postData?.validations?.phoneNumber}
        />

        <ERPInput
          id="displayName"
          label="displayName"
          placeholder="displayName"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
           setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.displayName}
          validation={postData?.validations?.displayName}
        />
      </div>

      <div className="w-full p-2 flex justify-end">
        <ERPButton
          type="reset"
          title="Cancel"
          variant="secondary"
          onClick={onClose}
          // disabled={emailLoading}
        ></ERPButton>
        <ERPButton
          type="button"
          disabled={postDataLoading}
          variant="primary"
          onClick={handleSubmit}
          loading={postDataLoading}
          title={key != undefined && key != null ? "Update" : "Submit"}
        ></ERPButton>
      </div>
    </div>
  );
};


