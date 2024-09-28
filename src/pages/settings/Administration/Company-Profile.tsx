import { Fragment } from "react/jsx-runtime"
import { useCallback, useEffect, useState } from 'react'
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { ResponseModelWithValidation } from "../../../base/response-model";
import AdministrationSettingsApis from "./administration-settings-apis";
import { handleResponse } from "../../../utilities/HandleResponse";
import Urls from "../../../redux/urls";
type Data={
  registeredName:string;
  registeredNameArabic: string;
  taxRegNo: string;
  crNumber: string;
  buildingNo: string;
  streetName: string;
  district: string;
  city: string;
  country: string;
  cId?: number;
  postalCode: string;
  additionalNo: string;
  emailAddress: string;
  telephone: string;
  mobile: string;
  countrySubEntity: string;
}


interface BasicInfo {
  data: Data;
  validations: Data;
}
const CompanyProfile = ()=> {


  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
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
      postalCode: "",
      additionalNo: "",
      emailAddress: "",
      telephone: "",
      mobile: "",
      countrySubEntity: ""
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
      countrySubEntity: ""
    }
  });
  const [basicInfoLoading, setBasicInfoLoading] = useState<boolean>(false);

  const resetBasicInfo = () => {
   
      setBasicInfo({
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
          postalCode: "",
          additionalNo: "",
          emailAddress: "",
          telephone: "",
          mobile: "",
          countrySubEntity: "",
          cId: 0
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
          countrySubEntity: ""
        }
      });
    }

    
    const getBasicInfo = async () => {
      try {
        const res = await AdministrationSettingsApis.getCompanyProfileInfo();    
        console.log("Fetched Data: ", res); // Add this to check the fetched data    
        // Update the basicInfo state with fetched data
        
        setBasicInfo((prev: BasicInfo) => ({
          ...prev,
          data: res
        }));
        console.log("Updated State: ", basicInfo); // Check the updated state
      } catch (error) {
        console.error("Failed to fetch company profile info:", error);
      }
    };
    
    
    
  
    const updateBasicInfo = useCallback(async () => {
  
      setBasicInfoLoading(true);
    
      const response: ResponseModelWithValidation<any, any> = await AdministrationSettingsApis.addCompanyProfileInfo(basicInfo?.data);
      
      setBasicInfoLoading(false);
      
      setBasicInfo((prevData: any) => ({
        ...prevData,
        validations: response.validations
      }));
      // appDispatch(userSession());
      handleResponse(response, () => {});
    }, [ basicInfo?.data]);

    /////////////////////////////////////
    useEffect(() => {
      getBasicInfo();
    }, []);
    

  return (
    <Fragment>
        <div className=" box custom-box">
              <div className="box-header justify-between">
                <div className="box-title">
                  Company Profile
                  <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                   *This  information will be used in E-invoice.

                  </p>
                </div>
                <div></div>
              </div>
              <div className="box-body">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
       {/* Registered Name */}
      <ERPInput
        id="registeredName"
        label="Registered Name"
        placeholder="Registered Name"
        required={true}
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.registeredName}
        value={basicInfo?.data?.registeredName || ""}
      />

      {/* Registered Name (Arabic) */}
      <ERPInput
        id="registeredNameArabic"
        label="Registered Name (Arabic)"
        placeholder="Registered Name (Arabic)"
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.registeredNameArabic}
        value={basicInfo?.data?.registeredNameArabic || ""}
      />

      {/* Tax Registration Number (VAT #) */}
      <ERPInput
        id="taxRegNo"
        label="Tax Registration Number (VAT #)"
        placeholder="Tax Registration Number"
        required={true}
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.taxRegNo}
        value={basicInfo?.data?.taxRegNo || ""}
      />

      {/* CR Number */}
      <ERPInput
        id="crNumber"
        label="CR Number"
        placeholder="CR Number"
        required={true}
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.crNumber}
        value={basicInfo?.data?.crNumber || ""}
      />

      {/* Building Number */}
      <ERPInput
        id="buildingNo"
        label="Building Number"
        placeholder="Building Number"
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.buildingNo}
        value={basicInfo?.data?.buildingNo || ""}
      />

      {/* Street */}
      <ERPInput
        id="streetName"
        label="Street"
        placeholder="Street"
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.streetName}
        value={basicInfo?.data?.streetName || ""}
      />

      {/* District */}
      <ERPInput
        id="district"
        label="District"
        placeholder="District"
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.district}
        value={basicInfo?.data?.district || ""}
      />

      {/* City */}
      <ERPInput
        id="city"
        label="City"
        placeholder="City"
        required={true}
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.city}
        value={basicInfo?.data?.city || ""}
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
          debugger
          setBasicInfo((prev: any) => ({
            ...prev,
            data: {
              ...prev.data, // Ensure to preserve existing properties in data
              country: data.label,  
              cId: data.value,    // Update or add the val property
            },
          }));
        }}
        validation={basicInfo?.validations?.country}
        data={basicInfo?.data}
        defaultData={basicInfo?.data.cId}
        value={basicInfo?.data?.cId || 0}
        label="Country"
      />

      {/* Postal Code */}
      <ERPInput
        id="postalCode"
        label="Postal Code"
        placeholder="Postal Code"
        required={true}
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.postalCode}
        value={basicInfo?.data?.postalCode || ""}
      />

      {/* Additional Number */}
      <ERPInput
        id="additionalNo"
        label="Additional Number"
        placeholder="Additional Number"
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.additionalNo}
        value={basicInfo?.data?.additionalNo || ""}
      />

      {/* Region/Country Sub Entity */}
      <ERPInput
        id="countrySubEntity"
        label="Region/Country Sub Entity"
        placeholder="Region"
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.countrySubEntity}
        value={basicInfo?.data?.countrySubEntity || ""}
      />

      {/* Email */}
      <ERPInput
        id="emailAddress"
        label="Email"
        placeholder="Email"
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.emailAddress}
        value={basicInfo?.data?.emailAddress || ""}
      />

      {/* Telephone */}
      <ERPInput
        id="telephone"
        label="Telephone"
        placeholder="Telephone"
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.telephone}
        value={basicInfo?.data?.telephone || ""}
      />

      {/* Mobile */}
      <ERPInput
        id="mobile"
        label="Mobile"
        placeholder="Mobile"
        data={basicInfo?.data}
        onChangeData={(data: any) => {
          setBasicInfo((prev: any) => ({
            ...prev,
            data: data,
          }));
        }}
        validation={basicInfo?.validations?.mobile}
        value={basicInfo?.data?.mobile || ""}
      />
    </div> 
      {/* Buttons */}
      <div className="w-full p-2 flex justify-center md:justify-end space-x-4">
        <ERPButton
          title="Reset"
          onClick={resetBasicInfo}
          type="reset"
        />
        <ERPButton
          title="Save Changes"
          onClick={updateBasicInfo}
          variant="primary"
          loading={basicInfoLoading}
          disabled={basicInfoLoading}
        />
      </div>
              
  </div>
</div>
      
      
   </Fragment>
  )
}

export default CompanyProfile



