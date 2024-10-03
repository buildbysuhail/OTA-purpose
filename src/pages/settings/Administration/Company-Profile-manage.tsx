import { useCallback, useEffect, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import { toggleCompanyProfilePopup } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import AdministrationSettingsApis from "./administration-settings-apis";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";

const CompanyProfileManage = () => {
  const dispatch = useDispatch();
  const onClose = useCallback(async () => {
    dispatch(toggleCompanyProfilePopup({ isOpen: false }));
  }, []);

  const initialData = {
    data: {
      registeredName: "",
      registeredNameArabic: "",
      taxRegNo: "",
      crNumber: "",
      buildingNo: "",
      streetName: "",
      district: "",
      city: "",
      country: "",
      cId: 0,
      postalCode: "",
      additionalNo: "",
      emailAddress: "",
      telephone: "",
      mobile: "",
      countrySubEntity: "",
    },
    validations: {
      registeredName: "",
      registeredNameArabic: "",
      taxRegNo: "",
      crNumber: "",
      buildingNo: "",
      streetName: "",
      district: "",
      city: "",
      country: "",
      postalCode: "",
      additionalNo: "",
      emailAddress: "",
      telephone: "",
      mobile: "",
      countrySubEntity: "",
    },
  };
  const [postData, setPostData] = useState(initialData);
  const [postDataLoading, setPostDataLoading] = useState<boolean>(false);

  const getBasicInfo = async () => {
    try {
      const res = await AdministrationSettingsApis.getCompanyProfileInfo();
      
      setPostData((prev: any) => ({
        ...prev,
        data: res,
      }));
    } catch (error) {
      console.error("Failed to fetch company profile info:", error);
    }
  };

  const addCompanyProfile = useCallback(async () => {
    setPostDataLoading(true);

    const response: ResponseModelWithValidation<any, any> =
      await AdministrationSettingsApis.addCompanyProfileInfo(postData?.data);

    setPostDataLoading(false);

    handleResponse(
      response,
      () => {
        dispatch(toggleCompanyProfilePopup({ isOpen: false }));
      },
      () => {
        setPostData((prevData: any) => ({
          ...prevData,
          validations: response.validations,
        }));
      }
    );
  }, [postData?.data]);

  useEffect(() => {
    getBasicInfo();
  }, []);

  return (
    <>
      <div className="w-full pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Registered Name */}
          <ERPInput
            id="registeredName"
            label="Registered Name"
            placeholder="Registered Name"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.registeredName}
            value={postData?.data?.registeredName || ""}
          />

          {/* Registered Name (Arabic) */}
          <ERPInput
            id="registeredNameArabic"
            label="Registered Name (Arabic)"
            placeholder="Registered Name (Arabic)"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.registeredNameArabic}
            value={postData?.data?.registeredNameArabic || ""}
          />

          {/* Tax Registration Number (VAT #) */}
          <ERPInput
            id="taxRegNo"
            label="Tax Registration Number (VAT #)"
            placeholder="Tax Registration Number"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.taxRegNo}
            value={postData?.data?.taxRegNo || ""}
          />

          {/* CR Number */}
          <ERPInput
            id="crNumber"
            label="CR Number"
            placeholder="CR Number"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.crNumber}
            value={postData?.data?.crNumber || ""}
          />

          {/* Building Number */}
          <ERPInput
            id="buildingNo"
            label="Building Number"
            placeholder="Building Number"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.buildingNo}
            value={postData?.data?.buildingNo || ""}
          />

          {/* Street */}
          <ERPInput
            id="streetName"
            label="Street"
            placeholder="Street"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.streetName}
            value={postData?.data?.streetName || ""}
          />

          {/* District */}
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
            value={postData?.data?.district || ""}
          />

          {/* City */}
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
            value={postData?.data?.city || ""}
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

          {/* Postal Code */}
          <ERPInput
            id="postalCode"
            label="Postal Code"
            placeholder="Postal Code"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.postalCode}
            value={postData?.data?.postalCode || ""}
          />

          {/* Additional Number */}
          <ERPInput
            id="additionalNo"
            label="Additional Number"
            placeholder="Additional Number"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.additionalNo}
            value={postData?.data?.additionalNo || ""}
          />

          {/* Region/Country Sub Entity */}
          <ERPInput
            id="countrySubEntity"
            label="Region/Country Sub Entity"
            placeholder="Region"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.countrySubEntity}
            value={postData?.data?.countrySubEntity || ""}
          />

          {/* Email */}
          <ERPInput
            id="emailAddress"
            label="Email"
            placeholder="Email"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.emailAddress}
            value={postData?.data?.emailAddress || ""}
          />

          {/* Telephone */}
          <ERPInput
            id="telephone"
            label="Telephone"
            placeholder="Telephone"
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            validation={postData?.validations?.telephone}
            value={postData?.data?.telephone || ""}
          />

          {/* Mobile */}
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
            value={postData?.data?.mobile || ""}
          />
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
            onClick={addCompanyProfile}
            loading={postDataLoading}
            title={"Submit"}
          ></ERPButton>
        </div>
      </div>
    </>
  );
};

export default CompanyProfileManage;
