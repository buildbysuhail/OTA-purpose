import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";
import { toggleParties } from "../../../../redux/slices/popup-reducer";
import { initialPartiesData, PartiesData } from "./parties-manage-type";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { TFunction } from "i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";

interface Tab1ContentProps {
  getFieldProps: (fieldName: string) => any;
  handleFieldChange: (fieldName: string, value: any) => void;
  t: TFunction;
}

const Tab1Content: React.FC<Tab1ContentProps> = ({ getFieldProps, handleFieldChange, t }) => (
  <>
    <div className="border p-4 rounded-lg">
      <div className="grid grid-cols-3 gap-3">
        <ERPInput
          {...getFieldProps("partyCode")}
          label={t("code")}
          placeholder={t("code")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("partyCode", data)
          }
        />
        <ERPInput
          {...getFieldProps("partyName")}
          label={t("name")}
          placeholder={t("name")}
          required={true}
          onChangeData={(data: any) =>
            handleFieldChange("partyName", data)
          }
        />
        <ERPInput
          {...getFieldProps("displayName")}
          label={t("display_name")}
          placeholder={t("display_name")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("displayName", data)
          }
        />
        <ERPInput
          {...getFieldProps("arabicName")}
          label={t("arabic_name")}
          placeholder={t("arabic_name")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("arabicName", data)
          }
        />
        <ERPDataCombobox
          {...getFieldProps("ledgerID")}
          field={{
            id: "ledgerID",
            required: true,
            getListUrl: Urls.data_acc_ledgers,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("ledgerID", data);
          }}
          label={t("ledger_name")}
        />
        <ERPDataCombobox
          {...getFieldProps("partyCategoryID")}
          field={{
            id: "partyCategoryID",
            required: true,
            getListUrl: Urls.data_party_categories,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("partyCategoryID", data);
          }}
          label={t("party_category")}
        />
        <ERPDataCombobox
          {...getFieldProps("accGroupID")}
          field={{
            id: "accGroupID",
            required: true,
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("accGroupID", data);
          }}
          label={t("referred_by")}
        />
        <ERPInput
          {...getFieldProps("address1")}
          label={t("address")}
          placeholder={t("address")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("address1", data)
          }
        />
        <ERPInput
          {...getFieldProps("mobilePhone")}
          label={t("mobile_phone")}
          placeholder={t("mobile_phone")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("mobilePhone", data)
          }
        />
        <ERPDataCombobox
          {...getFieldProps("salesRouteID")}
          field={{
            id: "salesRouteID",
            required: true,
            getListUrl: Urls.data_salesRoute,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("salesRouteID", data);
          }}
          label={t("sales_route")}
        />
        <ERPInput
          {...getFieldProps("taxNumber")}
          label={t("tax_number")}
          placeholder={t("tax_number")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("taxNumber", data)
          }
        />
        <ERPInput
          {...getFieldProps("cstNumber")}
          label={t("cr_no")}
          placeholder={t("cr_no")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("cstNumber", data)
          }
        />
        <ERPInput
          {...getFieldProps("creditDays")}
          label={t("credit_days")}
          placeholder={t("credit_days")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("creditDays", data)
          }
        />
        <ERPInput
          {...getFieldProps("creditAmount")}
          label={t("credit_amount")}
          placeholder={t("credit_amount")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("creditAmount", data)
          }
        />
        <ERPInput
          {...getFieldProps("opBalance")}
          label={t("op_balance")}
          placeholder={t("op_balance")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("opBalance", data)
          }
        />
        <ERPInput
          {...getFieldProps("address4")}
          label={t("ifsc")}
          placeholder={t("ifsc")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("address4", data)
          }
        />
        <ERPInput
          {...getFieldProps("panNo")}
          label={t("pan_no")}
          placeholder={t("pan_no")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("panNo", data)
          }
        />
        <ERPInput
          {...getFieldProps("aadharNo")}
          label={t("aadhar_no")}
          placeholder={t("aadhar_no")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("aadharNo", data)
          }
        />
        <ERPDataCombobox
          {...getFieldProps("registrationType")}
          field={{
            id: "registrationType",
            required: true,
            getListUrl: Urls.data_salesRoute,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("registrationType", data !== null && data !== undefined ? data.toString() : data);
          }}
          label={t("registration_type")}
        />
      </div>
    </div>
    <div className="border p-4 rounded-lg mt-5">
      <div className="grid grid-cols-3 gap-6">
        <ERPCheckbox
          {...getFieldProps("billwiseBillApplicable")}
          label={t("bill_wise_applicable")}
          onChangeData={(data: any) => handleFieldChange("billwiseBillApplicable", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isActive")}
          label={t("is_Active")}
          onChangeData={(data: any) => handleFieldChange("isActive", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isCommon")}
          label={t("is_common")}
          onChangeData={(data: any) => handleFieldChange("isCommon", data)}
        />
      </div>
      <div className="mt-5">
        <ERPButton
          type="reset"
          title={t("print_label")}
          variant="secondary"
        />
      </div>
    </div>
    <div className="border p-4 rounded-lg mt-5">
      <h6>Bank Details 1</h6>
      <div className="grid grid-cols-3 gap-6 mt-3">
        <ERPInput
          {...getFieldProps("bankAcNumber1")}
          label={t("account_number")}
          placeholder={t("account_number")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("bankAcNumber1", data)
          }
        />
        <ERPInput
          {...getFieldProps("bankAcName1")}
          label={t("account_name")}
          placeholder={t("account_name")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("bankAcName1", data)
          }
        />
        <ERPInput
          {...getFieldProps("bankDetails1")}
          label={t("remarks")}
          placeholder={t("remarks")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("bankDetails1", data)
          }
        />
      </div>
    </div>
    <div className="border p-4 rounded-lg mt-5">
      <h6>Bank Details 2</h6>
      <div className="grid grid-cols-3 gap-6 mt-3">
        <ERPInput
          {...getFieldProps("bankAcNumber2")}
          label={t("account_number")}
          placeholder={t("account_number")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("bankAcNumber2", data)
          }
        />
        <ERPInput
          {...getFieldProps("bankAcName2")}
          label={t("account_name")}
          placeholder={t("account_name")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("bankAcName2", data)
          }
        />
        <ERPInput
          {...getFieldProps("bankDetails2")}
          label={t("remarks")}
          placeholder={t("remarks")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("bankDetails2", data)
          }
        />
      </div>
    </div>
    <div className="border p-4 rounded-lg mt-5">
      <h6>More Info</h6>
      <div className="grid grid-cols-3 gap-6 mt-3">
        <ERPInput
          {...getFieldProps("postalCode")}
          label={t("postal_code")}
          placeholder={t("postal_code")}
          required={false}
          onChangeData={(data: any) =>
            handleFieldChange("postalCode", data)
          }
        />
      </div>
    </div>
  </>
);

interface Tab2ContentProps {
  getFieldProps: (fieldName: string) => any;
  handleFieldChange: (fieldName: string, value: any) => void;
  t: TFunction;
}

const Tab2Content: React.FC<Tab2ContentProps> = ({ getFieldProps, handleFieldChange, t }) => (
  <>
    <div className="border p-4 rounded-lg">
      <div className="grid grid-cols-3 gap-6">
        <ERPInput
          {...getFieldProps("address2")}
          label={t("address_2_city_district")}
          placeholder={t("address_2_city_district")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("address2", data)}
        />
        <ERPInput
          {...getFieldProps("address4")}
          label={t("address_4_building_no")}
          placeholder={t("address_4_building_no")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("address4", data)}
        />
        <ERPInput
          {...getFieldProps("officePhone")}
          label={t("office_phone")}
          placeholder={t("office_phone")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("officePhone", data)}
        />
        <ERPInput
          {...getFieldProps("workPhone")}
          label={t("work_phone")}
          placeholder={t("work_phone")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("workPhone", data)}
        />
        <ERPInput
          {...getFieldProps("contactPhone")}
          label={t("contact_phone")}
          placeholder={t("contact_phone")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("contactPhone", data)}
        />
        <ERPInput
          {...getFieldProps("email")}
          label={t("email")}
          placeholder={t("email")}
          type="email"
          required={false}
          onChangeData={(data: any) => handleFieldChange("email", data)}
        />
        <ERPInput
          {...getFieldProps("webURL")}
          label={t("website")}
          placeholder={t("website")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("webURL", data)}
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mt-5">
      <div className="border p-4 flex flex-col gap-4 rounded-lg ">
        <ERPDateInput
          {...getFieldProps("startDate")}
          label={t("start_date")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("startDate", data)}
        />
        <ERPDateInput
          {...getFieldProps("expiryDate")}
          label={t("exp_date")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("expiryDate", data)}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="fileInput" className="text-sm text-gray-700">
            {t("document_1")}
          </label>
          <input
            type="file"
            id="document1"
            name="document1"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleFieldChange("document1", files[0]);
              }
            }}
            className="border rounded-lg p-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="fileInput" className="text-sm text-gray-700">
            {t("document_2")}
          </label>
          <input
            type="file"
            id="document2"
            name="document2"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleFieldChange("document2", files[0]);
              }
            }}
            className="border rounded-lg p-2"
          />
        </div>
      </div>
      <div className="border p-4 flex flex-col gap-4 rounded-lg">
        <ERPCheckbox
          {...getFieldProps("isTCSApplicable")}
          label={t("is_tcs_applicable")}
          onChangeData={(data: any) => handleFieldChange("isTCSApplicable", data)}
        />
        <ERPDataCombobox
          {...getFieldProps("tcsCategoryID")}
          field={{
            id: "tcsCategoryID",
            required: false,
            getListUrl: Urls.account_party_category,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => handleFieldChange("tcsCategoryID", data)}
          label={t("tcs_category")}
        />
        <ERPDataCombobox
          {...getFieldProps("stateName")}
          field={{
            id: "stateName",
            required: false,
            getListUrl: Urls.data_pricectegory,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("stateName", data !== null && data !== undefined ? data.toString() : "");
          }}
          label={t("state_name")}
        />
        <ERPInput
          {...getFieldProps("stateCode")}
          label={t("state_code")}
          placeholder={t("state_code")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("stateCode", data)}
        />
        <ERPCheckbox
          {...getFieldProps("stopCredit")}
          label={t("stop_credit")}
          onChangeData={(data: any) => handleFieldChange("stopCredit", data)}
        />
      </div>
    </div>
    <div className="border p-4 rounded-lg mt-5">
      <h6>Payment Day</h6>
      <div className="grid grid-cols-3 gap-6 mt-3">
        <ERPCheckbox
          {...getFieldProps("sunday")}
          label={t("sunday")}
          onChangeData={(data: any) => handleFieldChange("sunday", data)}
        />
        <ERPCheckbox
          {...getFieldProps("monday")}
          label={t("monday")}
          onChangeData={(data: any) => handleFieldChange("monday", data)}
        />
        <ERPCheckbox
          {...getFieldProps("tuesday")}
          label={t("tuesday")}
          onChangeData={(data: any) => handleFieldChange("tuesday", data)}
        />
        <ERPCheckbox
          {...getFieldProps("wednesday")}
          label={t("wednesday")}
          onChangeData={(data: any) => handleFieldChange("wednesday", data)}
        />
        <ERPCheckbox
          {...getFieldProps("thursday")}
          label={t("thursday")}
          onChangeData={(data: any) => handleFieldChange("thursday", data)}
        />
        <ERPCheckbox
          {...getFieldProps("friday")}
          label={t("friday")}
          onChangeData={(data: any) => handleFieldChange("friday", data)}
        />
        <ERPCheckbox
          {...getFieldProps("saturday")}
          label={t("saturday")}
          onChangeData={(data: any) => handleFieldChange("saturday", data)}
        />
      </div>
    </div>
    <div className="border p-4 rounded-lg mt-5">
      <div className="grid grid-cols-3 gap-6">
        <ERPDataCombobox
          {...getFieldProps("priceCategoryID")}
          field={{
            id: "priceCategoryID",
            required: false,
            getListUrl: Urls.data_pricectegory,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => handleFieldChange("priceCategoryID", data)}
          label={t("price_category")}
        />
        <ERPDataCombobox
          {...getFieldProps("formTypeID")}
          field={{
            id: "formTypeID",
            required: false,
            getListUrl: Urls.data_form_type,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => handleFieldChange("formTypeID", data)}
          label={t("form_type")}
        />
        <ERPInput
          {...getFieldProps("visitSequenceNo")}
          label={t("visit_seq_no")}
          placeholder={t("visit_seq_no")}
          type="number"
          required={false}
          onChangeData={(data: any) => handleFieldChange("visitSequenceNo", data)}
        />
        <ERPInput
          {...getFieldProps("legalName")}
          label={t("legal_name")}
          placeholder={t("legal_name")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("legalName", data)}
        />
        <ERPInput
          {...getFieldProps("tradeName")}
          label={t("trade_name")}
          placeholder={t("trade_name")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("tradeName", data)}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="fileInput" className="text-[12px] text-gray-700">
            {t("upload_photo")}
          </label>
          <input
            type="file"
            id="partyPhoto"
            name="partyPhoto"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleFieldChange("partyPhoto", files[0]);
              }
            }}
            className="border rounded-lg p-2"
          />
        </div>
      </div>
    </div>
  </>
);

interface Tab3ContentProps {
  getFieldProps: (fieldName: string) => any;
  handleFieldChange: (fieldName: string, value: any) => void;
  t: TFunction;
}

const Tab3Content: React.FC<Tab3ContentProps> = ({ getFieldProps, handleFieldChange, t }) => (
  <div className="border p-4 rounded-lg">
    <div className="grid grid-cols-2 gap-6">
      <ERPInput
        {...getFieldProps("projectName")}
        label={t("project_name")}
        placeholder={t("project_name")}
        required={false}
        onChangeData={(data: any) =>
          handleFieldChange("projectName", data)
        }
      />
      <ERPInput
        {...getFieldProps("address1")}
        label={t("address1")}
        placeholder={t("address1")}
        required={false}
        onChangeData={(data: any) =>
          handleFieldChange("address1", data)
        }
      />
      <ERPInput
        {...getFieldProps("address2")}
        label={t("address2")}
        placeholder={t("address2")}
        required={false}
        onChangeData={(data: any) =>
          handleFieldChange("address2", data)
        }
      />
      <ERPInput
        {...getFieldProps("address3")}
        label={t("address3")}
        placeholder={t("address3")}
        required={false}
        onChangeData={(data: any) =>
          handleFieldChange("address3", data)
        }
      />
    </div>
  </div>
);

export const PartiesManage: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState(1);
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleClear,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading
  } = useFormManager<PartiesData>({
    url: Urls.parties,
    onSuccess: useCallback(() => dispatch(toggleParties({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.parties.key,
    useApiClient: true,
    initialData: initialPartiesData,
  });

  const onClose = useCallback(() => {
    dispatch(toggleParties({ isOpen: false, key: null }));
  }, [dispatch]);

  const { t } = useTranslation();

  const handleFileChange = (e: { target: { files: any[]; }; }) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
    }
  };

  const tabs = [
    { number: 1, name: "Main" },
    { number: 2, name: "Details" },
    { number: 3, name: "Projects / Job" }
  ];
  

  return (
    <div className="w-full">
      <div className="flex align-center justify-center mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.number}
            className={`px-4 py-2 mr-2 ${activeTab === tab.number
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
              } rounded-md text-[14px] font-bold`}
            onClick={() => setActiveTab(tab.number)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {activeTab === 1 && <Tab1Content getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} t={t} />}
        {activeTab === 2 && <Tab2Content getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} t={t} />}
        {activeTab === 3 && <Tab3Content getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} t={t} />}
      </div>
      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

export default PartiesManage;