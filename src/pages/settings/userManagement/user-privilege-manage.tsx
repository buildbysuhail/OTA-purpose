import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import {
  toggleDeleteInactiveTransactionPopup,
  toggleUserTypePrivilegePopup,
} from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { initialDataCounter } from "../system/counters-manage-type";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import SystemSettingsApi from "../system/system-apis";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../helpers/api-client";
import UserTypeTree from "./user-rights-tree";

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
const initialUserTypePrivilegeManageData = {
  data: {
    userType: "",
    selectAll: false,
    showAll: false,
    showAllAdd: false,
    showAllPrint: false,
    showAllEdit: false,
    showAllExport: false,
    showAllDelete: false,
    userRightType: false,
    userType2: "",
  },
  validations: {
    userType: "",
    selectAll: "",
    showAll: "",
    showAllAdd: "",
    showAllPrint: "",
    showAllEdit: "",
    showAllExport: "",
    showAllDelete: "",
    userRightType: "",
    userType2: "",
  },
};
const api = new APIClient();
const UserTypePrivilegeManage: React.FC = React.memo(() => {
  const [postData, setPostData] = useState<any>(
    initialUserTypePrivilegeManageData
  );
  const [postDataLoading, setPostUserTypeLoading] = useState<boolean>(false);
  const [userRightTypes, setUserRightTypes] = useState<any>();

  const dispatch = useDispatch();
  
  useEffect(() => {
    if (postData.data.userType) {
      loadUserType();
    }
  }, [postData.data.userType]);

  const loadUserType = async () => {
    const res: any[] = await api.getAsync( `${Urls.user_rights}${postData.data.userType}`);
    debugger
    setUserRightTypes(res);
  };
  const handleSubmit = useCallback(async () => {
    setPostUserTypeLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await SystemSettingsApi.postCurrencyExchange(postData?.data); //change this  demo api call
    setPostUserTypeLoading(false);
    handleResponse(
      response,
      () => {
        dispatch(toggleUserTypePrivilegePopup({ isOpen: false }));
      },
      () => {
        setPostData((prevData: any) => ({
          ...prevData,
          validations: response.validations,
        }));
      }
    );
  }, [postData?.data]);

  const onClose = useCallback(() => {
    dispatch(toggleUserTypePrivilegePopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full flex justify-start ">
      <div className="basis-[45%] bg-slate-50 border-r  border-slate-400 "><UserTypeTree/></div>

      <div className="w-full flex flex-col px-24 py-10 ">
        {/* User Type Combobox */}
        <ERPDataCombobox
          id="userType"
          field={{
            id: "userType",
            required: true,
            getListUrl: Urls.data_user_types, // Adjust URL as needed
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("user_type")}
          onChangeData={(data: any) => {
            setPostData((prev: any) => ({
              ...prev,
              data: data,
            }));
          }}
          validation={postData.validations.userType}
          data={postData?.data}
          defaultData={postData?.data}
          value={
            postData != undefined &&
            postData?.data != undefined &&
            postData?.data?.userType != undefined
              ? postData?.data?.userType
              : 0
          }
        />

        {/* Checkbox options */}
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-3 py-4 mb-5">
          <ERPCheckbox
            id="selectAll"
            label={t("select_all")}
            data={postData.data}
            checked={postData.data.selectAll}
            onChangeData={(data) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data, // Spread previous data properties
                  selectAll: !prev.data.selectAll, // Toggle the selectAll checkbox state
                },
              }));
            }}
            validation={postData.validations.selectAll}
          />
          <ERPCheckbox
            id="showAll"
            label={t("show_all")}
            data={postData.data}
            checked={postData.data.showAll}
            onChangeData={(data) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  showAll: !prev.data.showAll,
                },
              }));
            }}
            validation={postData.validations.showAll}
          />

          <ERPCheckbox
            id="showAllAdd"
            label={t("select_all_add")}
            data={postData.data}
            checked={postData.data.showAllAdd}
            onChangeData={(data) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  showAllAdd: !prev.data.showAllAdd,
                },
              }));
            }}
            validation={postData.validations.showAllAdd}
          />

          <ERPCheckbox
            id="showAllPrint"
            label={t("select_all_print")}
            data={postData.data}
            checked={postData.data.showAllPrint}
            onChangeData={(data) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  showAllPrint: !prev.data.showAllPrint,
                },
              }));
            }}
            validation={postData.validations.showAllPrint}
          />

          <ERPCheckbox
            id="showAllEdit"
            label={t("select_all_edit")}
            data={postData.data}
            checked={postData.data.showAllEdit}
            onChangeData={(data) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  showAllEdit: !prev.data.showAllEdit,
                },
              }));
            }}
            validation={postData.validations.showAllEdit}
          />

          <ERPCheckbox
            id="showAllExport"
            label={t("select_all_export")}
            data={postData.data}
            checked={postData.data.showAllExport}
            onChangeData={(data) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  showAllExport: !prev.data.showAllExport,
                },
              }));
            }}
            validation={postData.validations.showAllExport}
          />

          <ERPCheckbox
            id="showAllDelete"
            label={t("select_all_delete")}
            data={postData.data}
            checked={postData.data.showAllDelete}
            onChangeData={(data) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  showAllDelete: !prev.data.showAllDelete,
                },
              }));
            }}
            validation={postData.validations.showAllDelete}
          />
        </div>

        {/* Inherit Rights From UserType Section */}
        <div className="flex flex-col gap-3 border border-gray-400 border-dotted rounded-md p-8">
          <ERPCheckbox
            id="showAllDelete"
            label={t("inherit_rights_from_usertype")}
            data={postData.data}
            checked={postData.data.userRightType}
            onChangeData={(data) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  userRightType: !prev.data.userRightType,
                },
              }));
            }}
            validation={postData.validations.userRightType}
          />

          <ERPDataCombobox
            id="userType2"
            field={{
              id: "userType2",
              required: true,
              getListUrl: Urls.data_user_types, // Adjust URL as needed
              valueKey: "id",
              labelKey: "name",
            }}
            label={t("user_type")}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData.validations.userType2}
            data={postData?.data}
            defaultData={postData?.data}
            value={
              postData != undefined &&
              postData?.data != undefined &&
              postData?.data?.userType2 != undefined
                ? postData?.data?.userType2
                : 0
            }
          />
          <ERPButton
            title={t("load_rights")}
            variant="primary"
            disabled={true}
            // disabled={postDataLoading}
            // loading={postDataLoading}
            // onClick={handleSubmit}
          />
        </div>

        {/* Form Buttons */}
        <div className="flex justify-center mt-6">
          <ERPButton
            title={t("save")}
            variant="primary"
            disabled={postDataLoading}
            loading={postDataLoading}
            onClick={handleSubmit}
          />
          <ERPButton
            title={t("close")}
            variant="secondary"
            disabled={postDataLoading}
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
});

export default UserTypePrivilegeManage;
