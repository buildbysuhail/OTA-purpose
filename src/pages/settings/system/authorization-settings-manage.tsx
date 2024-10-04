import { handleResponse } from "../../../utilities/HandleResponse";
import {
  toggleAuthorizationSettingsPopup,
  toggleDayClosePopup,
} from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";

import ERPInput from "../../../components/ERPComponents/erp-input";
import SystemSettingsApi from "./system-apis";
import { useCallback, useState } from "react";
import { ResponseModelWithValidation } from "../../../base/response-model";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../redux/urls";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";

const AuthorizationSettings = () => {
  const {t}=useTranslation();
  const dispatch = useDispatch();
  const onClose = useCallback(async () => {
    dispatch(toggleAuthorizationSettingsPopup({ isOpen: false }));
  }, []);

  const initialData = {
    data: {
      employeeID: 2,
      passWord: "",
      confirmedPassword: "",
    },
    validations: {
      employeeID: "",
      passWord: "",
      confirmedPassword: "",
    },
  };
  const [postData, setPostData] = useState(initialData);
  const [postDataLoading, setPostDataLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const columns: DevGridColumn[] = [
    {
      dataField: "Employee",
      caption: t("employee"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
     
    },
  
    // {
    //   dataField: "actions",
    //   caption: "Actions",
    //   allowSearch: false,
    //   allowFiltering: false,
    //   fixed: true,
    //   fixedPosition: "right",
    //   width: 100,
    //   cellRender: (cellElement: any, cellInfo: any) => {
        
    //     return (
    //       <ERPGridActions
    //         view={{ type: "popup", action: () => toggleAuthorizationSettingsPopup({ isOpen: true, key: cellElement?.data?.id }) }}
    //         edit={{ type: "popup", action: () => toggleAuthorizationSettingsPopup({ isOpen: true, key: cellElement?.data?.id }) }}
    //         delete={{
    //           confirmationRequired: true,
    //           confirmationMessage: "Are you sure you want to delete this item?",
    //           // action: () => handleDelete(cellInfo?.data?.id),
    //         }}
    //       />
    //     )
    //   },
    //   }
  ];


  const onSubmit = useCallback(async () => {
    setPostDataLoading(true);
    // Check if password and confirmedPassword match
    if (postData?.data?.passWord !== postData?.data?.confirmedPassword) {
      setPasswordError("Passwords do not match");
      setPostDataLoading(false);
      return;
    }

    const response: ResponseModelWithValidation<any, any> =
      await SystemSettingsApi.postAuthorizationSettings(postData?.data);

    setPostDataLoading(false);

    handleResponse(
      response,
      () => {
        dispatch(toggleAuthorizationSettingsPopup({ isOpen: false }));
      },
      () => {
        setPostData((prevData: any) => ({
          ...prevData,
          validations: response.validations,
        }));
      }
    );
  }, [postData?.data]);

  return (
    <>
      <div className="w-full pt-4 ">
        <div className="grid grid-cols-1  sm:grid-cols-2 gap-3">
          <ERPDataCombobox
            id=" employeeID"
            field={{
              id: " employeeID",
              required: true,
              getListUrl: Urls.data_employees,
              valueKey: "id",
              labelKey: "name",
            }}
            onChange={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.employeeID}
            data={postData?.data}
            defaultData={postData?.data.employeeID}
            value={
              postData != undefined &&
              postData?.data != undefined &&
              postData?.data?.employeeID != undefined
                ? postData?.data?.employeeID
                : 0
            }
            label=" employeeID"
          />

          <ERPInput
            id="passWord"
            label="passWord"
            placeholder="passWord"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prevData: any) => ({
                ...prevData,
                data: data,
              }));
            }}
            value={postData?.data?.passWord}
            validation={postData?.validations?.passWord}
          />

          <ERPInput
            id="confirmedPassword"
            label="confirmedPassword"
            placeholder="confirmedPassword"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prevData: any) => ({
                ...prevData,
                data: data,
              }));
            }}
            value={postData?.data?.confirmedPassword}
            validation={postData?.validations?.confirmedPassword}
          />

          {/* Password mismatch error message */}
          {passwordError && (
            <div className="text-red-500 text-sm">{passwordError}</div>
          )}
          {/* Buttons */}
          <div className="w-full p-2 flex items-end space-x-4">
            <ERPButton
              type="reset"
              title="Cancel"
              variant="secondary"
              onClick={onClose}
            ></ERPButton>
            <ERPButton
              type="button"
              disabled={postDataLoading}
              variant="primary"
              onClick={onSubmit}
              loading={postDataLoading}
              title={"Save"}
            ></ERPButton>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6">
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box custom-box">
              <div className="box-body">
                <div className="grid grid-cols-1 gap-3">
                  <ErpDevGrid
                    columns={columns}
                    gridHeader={t("employee")}
                    dataUrl={Urls.authorization_settings}
                    gridId="grd_auth_settings"
                    popupAction={toggleAuthorizationSettingsPopup}
                    gridAddButtonType="popup"
                   
                  ></ErpDevGrid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthorizationSettings;
