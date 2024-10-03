import { useCallback, useEffect, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import {
  toggleBranchPopup,
  toggleCompanyProfilePopup,
} from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import AdministrationSettingsApis from "./administration-settings-apis";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import Urls from "../../../redux/urls";

const BranchManage = () => {
  const dispatch = useDispatch();
  const onClose = useCallback(async () => {
    dispatch(toggleBranchPopup({ isOpen: false }));
  }, []);

  const initialData = {
    data: {
      id: 0,
      companyID: 0,
      dateFrom: "",
      dateTo: "",
      branchCode: "",
      branchName: "",
      address1: "",
      address2: "",
      city: "",
      district: "",
      bState: "",
      country: "",
      cId: 0,
      pinCode: "",
      phone: "",
      mobile: "",
      fax: "",
      email: "",
      tin: "",
      registrationNumber: "",
      branchManager: "",
      remarks: "",
      userName: "",
      password: "",
      useMainBranchInventory: false,
    },
    validations: {
      id: "",
      companyID: "",
      dateFrom: "",
      dateTo: "",
      branchCode: "",
      branchName: "",
      address1: "",
      address2: "",
      city: "",
      district: "",
      bState: "",
      country: "",
      pinCode: "",
      phone: "",
      mobile: "",
      fax: "",
      email: "",
      tin: "",
      registrationNumber: "",
      branchManager: "",
      remarks: "",
      userName: "",
      password: "",
      useMainBranchInventory: "",
    },
  };
  const [postData, setPostData] = useState(initialData);
  const [postDataLoading, setPostDataLoading] = useState<boolean>(false);

  const addBranch = useCallback(async () => {
    setPostDataLoading(true);

    const response: ResponseModelWithValidation<any, any> =
      await AdministrationSettingsApis.addCompanyProfileInfo(postData?.data);

    setPostDataLoading(false);

    handleResponse(
      response,
      () => {
        dispatch(toggleBranchPopup({ isOpen: false }));
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
      <div className="w-full pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ERPInput
            id="id"
            label="Id"
            placeholder="Enter Id"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.id}
            value={postData?.data?.id}
          />

          <ERPDataCombobox
            id=" companyID"
            field={{
              id: " companyID",
              required: true,
              getListUrl: Urls.data_company_id,
              valueKey: "companyID",
              labelKey: "companyID",
            }}
            onChange={(data: any) => {
              
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  companyID: data.id,
                },
              }));
            }}
            validation={postData?.validations?.companyID}
            data={postData?.data}
            defaultData={postData?.data.companyID}
            value={postData?.data?.companyID}
            label=" companyID"
          />

          <ERPDateInput
            id="dateFrom"
            field={{ type: "date", id: "dateFrom", required: true }}
            label={"dateFrom"}
            data={postData?.data}
            handleChange={(id: any, value: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  [id]: value,
                },
              }));
            }}
            validation={postData.validations.dateFrom}
          />
          <ERPDateInput
            id="dateTo"
            field={{ type: "date", id: "dateTo", required: true }}
            label={"dateTo"}
            data={postData?.data}
            handleChange={(id: any, value: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  [id]: value,
                },
              }));
            }}
            validation={postData.validations.dateTo}
          />
          {/* Branch Information */}
          <ERPInput
            id="branchCode"
            label="Branch Code"
            placeholder="Branch Code"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.branchCode}
            value={postData?.data?.branchCode}
          />
          <ERPInput
            id="branchName"
            label="Branch Name"
            placeholder="Branch Name"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.branchName}
            value={postData?.data?.branchName}
          />

          {/* Address Information */}
          <ERPInput
            id="address1"
            label="Address Line 1"
            placeholder="Address Line 1"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.address1}
            value={postData?.data?.address1}
          />
          <ERPInput
            id="address2"
            label="Address Line 2"
            placeholder="Address Line 2"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.address2}
            value={postData?.data?.address2}
          />
          <ERPInput
            id="city"
            label="City"
            placeholder="City"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.city}
            value={postData?.data?.city}
          />
          <ERPInput
            id="district"
            label="District"
            placeholder="District"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.district}
            value={postData?.data?.district}
          />
          <ERPInput
            id="bState"
            label="State"
            placeholder="State"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.bState}
            value={postData?.data?.bState}
          />
          {/* Country */}
          <ERPDataCombobox
            id="cId"
            field={{
              id: "cId",
              required: true,
              getListUrl: Urls.data_countries,
              valueKey: "id",
              labelKey: "name",
            }}
            onChange={(data: any) => {
              
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data, // Ensure to preserve existing properties in data
                  country: data.label,
                  cId: data.value, // Update or add the val property
                },
              }));
            }}
            validation={postData?.validations?.country}
            data={postData?.data}
            defaultData={postData?.data.cId}
            value={postData?.data?.cId || 0}
            label="Country"
          />
          <ERPInput
            id="pinCode"
            label="pinCode"
            placeholder="pinCode"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.pinCode}
            value={postData?.data?.pinCode}
          />
          {/* Contact Information */}
          <ERPInput
            id="phone"
            label="Phone"
            placeholder="Phone"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.phone}
            value={postData?.data?.phone}
          />
          <ERPInput
            id="mobile"
            label="Mobile"
            placeholder="Mobile"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.mobile}
            value={postData?.data?.mobile}
          />
          <ERPInput
            id="fax"
            label="Fax"
            placeholder="Fax"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.fax}
            value={postData?.data?.fax}
          />

          <ERPInput
            id="email"
            label="email"
            placeholder="email"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.email}
            value={postData?.data?.email}
          />

          <ERPInput
            id="tin"
            label="tin"
            placeholder="tin"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.tin}
            value={postData?.data?.tin}
          />

          <ERPInput
            id="registrationNumber"
            label="registrationNumber"
            placeholder="registrationNumber"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.registrationNumber}
            value={postData?.data?.registrationNumber}
          />

          <ERPInput
            id="branchManager"
            label="branchManager"
            placeholder="branchManager"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.branchManager}
            value={postData?.data?.branchManager}
          />

          <ERPInput
            id="userName"
            label="userName"
            placeholder="userName"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.userName}
            value={postData?.data?.userName}
          />

          <ERPInput
            id="password"
            label="password"
            placeholder="password"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.password}
            value={postData?.data?.password}
          />

          <ERPInput
            id="remarks"
            label="Remarks"
            placeholder="Remarks"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.remarks}
            value={postData?.data?.remarks}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isDelete"
              className="ti-form-checkbox"
              id="isDelete"
              checked={postData?.data.useMainBranchInventory}
              onChange={(e) => {
                setPostData((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    useMainBranchInventory: e.target.checked,
                  },
                }));
              }}
            />
            <label
              htmlFor="switcher-dark-theme"
              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
            >
              useMainBranchInventory
            </label>
          </div>
        </div>
        {/* Buttons */}
        <div className="w-full p-2 flex justify-center md:justify-end space-x-4">
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
            onClick={addBranch}
            loading={postDataLoading}
            title={"Submit"}
          ></ERPButton>
        </div>
      </div>
    </>
  );
};

export default BranchManage;
