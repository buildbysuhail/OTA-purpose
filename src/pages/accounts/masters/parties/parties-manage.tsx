import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";
import { toggleParties } from "../../../../redux/slices/popup-reducer";
import { initialPartiesData, initialProjectOrJobData, PartiesData, ProjectOrJob } from "./parties-manage-type";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import { Tab, Tabs } from "@mui/material";
import { APIClient } from "../../../../helpers/api-client";
import { RootState } from "../../../../redux/store";
import { Countries } from "../../../../redux/slices/user-session/reducer";

interface PartiesManageProps {
  type: string; // Define type as a string prop
}
const api = new APIClient();
export const PartiesManage: React.FC<PartiesManageProps> = React.memo(
  ({ type = "Cust" }) => {
    const [activeTab, setActiveTab] = useState("address");
    const rootState = useRootState();
    const dispatch = useDispatch();
    const userSession = useSelector((state: RootState) => state.UserSession);
    const applicationSettings = useSelector(
      (state: RootState) => state.ApplicationSettings
    );
    const isIndianCompany = userSession.countryId === Countries.India;
    const [isTCSApplicable, setIsTCSApplicable] = useState(false);
    const [projectOrJob, setProjectOrJob] = useState<ProjectOrJob>(initialProjectOrJobData.data);
    const {
      isEdit,
      handleClear,
      handleSubmit,
      handleFieldChange,
      getFieldProps,
      handleClose,
      isLoading,
    } = useFormManager<PartiesData>({
      url: Urls.parties,
      onClose: useCallback(
        () => dispatch(toggleParties({ isOpen: false, key: null })),
        [dispatch]
      ),
      onSuccess: useCallback(
        () =>
          dispatch(toggleParties({ isOpen: false, key: null, reload: true })),
        [dispatch]
      ),
      key: rootState.PopupData.parties.key,
      useApiClient: true,
      initialData: {
        ...initialPartiesData,
        data: {
          ...initialPartiesData.data,
          partyType: type,
          accGroupID: type == "Cust" ? 154 : 22,
          partyCategoryID: type == "Cust" ? 1 : 2,
          priceCategoryID: 1,
          registrationType: "Regular",
          drCr: "Dr",
        },
      },
    });

    const { t } = useTranslation("masters");

    const handleFileChange = (e: { target: { files: any[] } }) => {
      const file = e.target.files[0];
      if (file) {
        console.log("File selected:", file.name);
      }
    };
    useEffect(() => {
      const key = rootState.PopupData.parties.key;
      if (Boolean(key && key !== "0" && key !== "") == false) {
        load();
      }
    }, []);
    const load = async () => {
      const res = await api.getAsync(Urls.get_next_party_code);
      handleFieldChange("partyCode", res.toString());
    };
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
      setActiveTab(newValue);
    };

    return (
      <div className="w-full bordered-tab relative pb-16">
        <div className="mt-[1.5rem]">
          <div className="grid grid-cols-5 gap-3">
            <ERPInput

              {...getFieldProps("partyCode")}
              label={t("code")}
              placeholder={t("code")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("partyCode", data.partyCode)
              }
            />
            <ERPInput
              {...getFieldProps("partyName")}
              label={t("name")}
              placeholder={t("name")}
              required={true}
              onChangeData={(data: any) => {
                handleFieldChange({
                  partyName: data.partyName,
                  displayName: data.partyName,
                  ledgerName: data.partyName,
                });
              }}
            />
            <ERPInput
              {...getFieldProps("displayName")}
              label={t("display_name")}
              placeholder={t("display_name")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("displayName", data.displayName)
              }
            />
            <ERPInput
              {...getFieldProps("arabicName")}
              label={t("arabic_name")}
              placeholder={t("arabic_name")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("arabicName", data.arabicName)
              }
            />
            <ERPInput
              {...getFieldProps("ledgerName")}
              label={t("ledger_name")}
              placeholder={t("ledger_name")}
              required={false}
              disabled={true}
              onChangeData={(data: any) =>
                handleFieldChange("ledger_name", data.ledgerName)
              }
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
                handleFieldChange("partyCategoryID", data.partyCategoryID);
              }}
              label={t("party_category")}
            // disabled={true}
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
                handleFieldChange("accGroupID", data.accGroupID);
              }}
              label={t("acc_group")}
              disabled={true}
            />
            <ERPInput
              {...getFieldProps("address1")}
              label={t("address")}
              placeholder={t("address")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("address1", data.address1)
              }
            />
            <ERPInput
              {...getFieldProps("mobilePhone")}
              label={t("mobile_phone")}
              placeholder={t("mobile_phone")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("mobilePhone", data.mobilePhone)
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
                handleFieldChange("salesRouteID", data.salesRouteID);
              }}
              label={t("sales_route")}
            />
            <ERPInput
              {...getFieldProps("taxNumber")}
              label={isIndianCompany ? t("gst_number") : t("tax_number")}
              placeholder={isIndianCompany ? t("gst_number") : t("tax_number")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("taxNumber", data.taxNumber)
              }
            />
            <ERPInput
              {...getFieldProps("cstNumber")}
              label={t("cr_no")}

              placeholder={t("cr_no")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("cstNumber", data.cstNumber)
              }
            />
            <ERPInput
              {...getFieldProps("creditDays")}
              label={t("credit_days")}
              type="number"
              placeholder={t("credit_days")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("creditDays", data.creditDays)
              }
            />
            <ERPInput
              {...getFieldProps("creditAmount")}
              label={t("credit_amount")}
              type="number"
              placeholder={t("credit_amount")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("creditAmount", data.creditAmount)
              }
            />

            <div className="flex  space-x-3">
              <div className="basis-2/3">
                <ERPInput
                  {...getFieldProps("opBalance")}
                  disabled={isEdit}
                  label={t("op_balance")}
                  type="number"
                  placeholder={t("op_balance")}
                  required={false}
                  onChangeData={(data: any) =>
                    handleFieldChange("opBalance", data.opBalance)
                  }
                />
              </div>
              <div className="basis-1/3 translate-y-[17px]">
                <ERPDataCombobox

                  {...getFieldProps("drCr")}
                  field={{
                    id: "drCr",
                    valueKey: "value",
                    labelKey: "label",
                  }}
                  onChangeData={(data: any) => handleFieldChange("drCr", data.drCr)}
                  label=" "
                  enableClearOption={false}
                  options={[
                    { value: 'Dr', label: t('Dr') },
                    { value: 'Cr', label: t('Cr') },
                  ]}
                />
              </div>
            </div>

            <ERPCheckbox
              {...getFieldProps("billwiseBillApplicable")}
              label={t("bill_wise_applicable")}
              onChangeData={(data: any) => handleFieldChange("billwiseBillApplicable", data.billwiseBillApplicable)}
            />
            <ERPCheckbox
              {...getFieldProps("isActive")}
              label={t("is_active")}
              onChangeData={(data: any) => handleFieldChange("isActive", data.isActive)}
            />
            <div className="mt-3">
              <ERPCheckbox
                {...getFieldProps("isCommon")}
                label={t("is_common")}
                onChangeData={(data: any) => handleFieldChange("isCommon", data.isCommon)}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 mt-3">
            {isIndianCompany && (
              <>
                <ERPDataCombobox
                  {...getFieldProps("faxNumber")}
                  field={{
                    id: "faxNumber",
                    required: true,
                    getListUrl: Urls.data_CustSupp,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => {
                    handleFieldChange("faxNumber", data.faxNumber);
                  }}
                  label={t("referred_by")}
                />
                <ERPInput
                  {...getFieldProps("address4")}
                  label={t("ifsc")}
                  placeholder={t("ifsc")}
                  required={false}
                  onChangeData={(data: any) =>
                    handleFieldChange("address4", data.address4)
                  }
                />
                <ERPInput
                  {...getFieldProps("panNo")}
                  label={t("pan_no")}
                  placeholder={t("pan_no")}
                  required={false}
                  onChangeData={(data: any) =>
                    handleFieldChange("panNo", data.panNo)
                  }
                />
                <ERPInput
                  {...getFieldProps("aadharNo")}
                  label={t("aadhar_no")}
                  placeholder={t("aadhar_no")}
                  required={false}
                  onChangeData={(data: any) =>
                    handleFieldChange("aadharNo", data.aadharNo)
                  }
                />
                <ERPDataCombobox
                  {...getFieldProps("registrationType")}
                  field={{
                    id: "registrationType",
                    valueKey: "label",
                    labelKey: "label",
                  }}
                  onChangeData={(data: any) => {
                    handleFieldChange("registrationType", data !== null && data !== undefined ? data.registrationType : "Regular");
                  }}
                  label={t("registration_type")}
                  options={[
                    { value: "Regular", label: "Regular" },
                    { value: "Regular+RCM", label: "Regular+RCM" },
                    { value: "Composite", label: "Composite" },
                    { value: "Unregistered", label: "Unregistered" },
                    { value: "Unregistered+RCM", label: "Unregistered+RCM" },
                    { value: "Foreign non-Resident Taxpayer", label: "Foreign non-Resident Taxpayer" },
                    { value: "Input Service distributor", label: "Input Service distributor" },
                    { value: "Tax Deductor", label: "Tax Deductor" },
                    { value: "E-commerce Operator", label: "E-commerce Operator" },
                    { value: "Government Departments", label: "Government Departments" },
                    { value: "SEZ supplies with payment", label: "SEZ supplies with payment" },
                    { value: "SEZ supplies without payment", label: "SEZ supplies without payment" },
                    { value: "Deemed Export", label: "Deemed Export" },
                    { value: "Intra-State supplies attracting IGST", label: "Intra-State supplies attracting IGST" }
                  ]}
                  defaultValue={{ value: "Regular", label: "Regular" }}
                />
              </>
            )}
          </div>

          <div className="flex align-center justify-end mt-3">
            <ERPButton
              type="reset"
              title={t("print_label")}
              variant="secondary"
            />
          </div>
        </div>

        <Tabs value={activeTab} onChange={handleTabChange} >
          <Tab label="Address" value="address" />
          <Tab label="Bank" value="bank" />
          <Tab label="Details" value="details" />
          <Tab label="More" value="more" />
          <Tab label="Project/Job" value="project_job" />
          {userSession.countryId != Countries.India && applicationSettings.branchSettings.maintainKSA_EInvoice == true &&
            <Tab label="Other" value="other_details" />
          }
        </Tabs>
        <div className="pt-4">
          {activeTab === 'address' &&
            <div className="grid grid-cols-5 gap-6">
              <ERPInput
                {...getFieldProps("address2")}
                label={userSession.countryId == Countries.India ? t("address_2_city_district") : t("address_2_city")}
                placeholder={userSession.countryId == Countries.India ? t("address_2_city_district") : t("address_2_city")}
                required={false}
                onChangeData={(data: any) => handleFieldChange("address2", data.address2)}
              />
              {userSession.countryId != Countries.India &&
                <ERPInput
                  {...getFieldProps("address3")}
                  label={t("address3_district")}
                  placeholder={t("address3_district")}
                  required={false}
                  onChangeData={(data: any) =>
                    handleFieldChange("address3", data.address3)
                  }
                />
              }
              {userSession.countryId == Countries.India &&
                <ERPInput
                  {...getFieldProps("address3")}
                  label={t("address_4_building_no")}
                  placeholder={t("address_4_building_no")}
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("address3", data.address3)}
                />
              }

              {userSession.countryId != Countries.India &&
                <ERPInput
                  {...getFieldProps("address4")}
                  label={t("address_4_building_no")}
                  placeholder={t("address_4_building_no")}
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("address4", data.address4)}
                />
              }
              <ERPInput
                {...getFieldProps("officePhone")}
                label={t("office_phone")}
                placeholder={t("office_phone")}
                required={false}
                onChangeData={(data: any) => handleFieldChange("officePhone", data.officePhone)}
              />
              <ERPInput
                {...getFieldProps("workPhone")}
                label={t("work_phone")}
                placeholder={t("work_phone")}
                required={false}
                onChangeData={(data: any) => handleFieldChange("workPhone", data.workPhone)}
              />
              <ERPInput
                {...getFieldProps("contactPhone")}
                label={t("contact_phone")}
                placeholder={t("contact_phone")}
                required={false}
                onChangeData={(data: any) => handleFieldChange("contactPhone", data.contactPhone)}
              />
              <ERPInput
                {...getFieldProps("email")}
                label={t("email")}
                placeholder={t("email")}
                type="email"
                required={false}
                onChangeData={(data: any) => handleFieldChange("email", data.email)}
              />
              <ERPInput
                {...getFieldProps("webURL")}
                label={t("website")}
                placeholder={t("website")}
                required={false}
                onChangeData={(data: any) => handleFieldChange("webURL", data.webURL)}
              />
              <ERPInput
                {...getFieldProps("postalCode")}
                label={t("postal_code")}
                placeholder={t("postal_code")}
                required={false}
                onChangeData={(data: any) =>
                  handleFieldChange("postalCode", data.postalCode)
                }
              />
            </div>}
          {activeTab === 'bank' && <>
            <div className="flex align-center gap-3">
              <div className="w-1/2 border rounded-lg p-4">
                <h6 className="border-b pb-2 mb-2 text-sm font-bold">Bank 1</h6>
                <div className="flex flex-col gap-3">
                  <ERPInput
                    {...getFieldProps("bankAcNumber1")}
                    label={t("account_number")}
                    placeholder={t("account_number")}
                    required={false}
                    onChangeData={(data: any) => handleFieldChange("bankAcNumber1", data.bankAcNumber1)}
                  />
                  <ERPInput
                    {...getFieldProps("bankAcName1")}
                    label={t("account_name")}
                    placeholder={t("account_name")}
                    required={false}
                    onChangeData={(data: any) => handleFieldChange("bankAcName1", data.bankAcName1)}
                  />
                  <ERPInput
                    {...getFieldProps("bankDetails1")}
                    label={t("remarks")}
                    placeholder={t("remarks")}
                    required={false}
                    onChangeData={(data: any) => handleFieldChange("bankDetails1", data.bankDetails1)}
                  />
                </div>
              </div>

              <div className="w-1/2 border rounded-lg p-4">
                <h6 className="border-b pb-2 mb-2 text-sm font-bold">
                  Bank 2
                </h6>
                <div className="flex flex-col gap-3">
                  <ERPInput
                    {...getFieldProps("bankAcNumber2")}
                    label={t("account_number")}
                    placeholder={t("account_number")}
                    required={false}
                    onChangeData={(data: any) =>
                      handleFieldChange("bankAcNumber2", data.bankAcNumber2)
                    }
                  />
                  <ERPInput
                    {...getFieldProps("bankAcName2")}
                    label={t("account_name")}
                    placeholder={t("account_name")}
                    required={false}
                    onChangeData={(data: any) =>
                      handleFieldChange("bankAcName2", data.bankAcName2)
                    }
                  />
                  <ERPInput
                    {...getFieldProps("bankDetails2")}
                    label={t("remarks")}
                    placeholder={t("remarks")}
                    required={false}
                    onChangeData={(data: any) =>
                      handleFieldChange("bankDetails2", data.bankDetails2)
                    }
                  />
                </div>
              </div>
            </div>
          </>
          }
          {activeTab === "details" && (
            <div className="grid grid-cols-2 gap-6 mt-5">
              <div className="grid grid-cols-2 gap-6 p-5 border rounded-lg">
                <ERPDateInput
                  {...getFieldProps("startDate")}
                  label={t("start_date")}
                  required={true}
                  onChangeData={(data: any) =>
                    handleFieldChange("startDate", data.startDate)
                  }
                />
                <ERPDateInput
                  {...getFieldProps("expiryDate")}
                  label={t("exp_date")}
                  required={true}
                  onChangeData={(data: any) =>
                    handleFieldChange("expiryDate", data.expiryDate)
                  }
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
              {isIndianCompany && (
                <div className="grid grid-cols-2 gap-6 p-5 border rounded-lg">
                  <>
                    <ERPCheckbox
                      {...getFieldProps("isTCSApplicable")}
                      label={t("is_tcs_applicable")}
                      onChangeData={(data: any) => {
                        handleFieldChange(
                          "isTCSApplicable",
                          data.isTCSApplicable
                        );
                        setIsTCSApplicable(data.isTCSApplicable);
                      }}
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
                      onChangeData={(data: any) =>
                        handleFieldChange("tcsCategoryID", data.tcsCategoryID)
                      }
                      label={t("tcs_category")}
                      disabled={!isTCSApplicable}
                    />

                    <ERPDataCombobox
                      {...getFieldProps("stateCode")}
                      field={{
                        id: "stateCode",
                        required: false,
                        getListUrl: Urls.data_states,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      onChange={(data: any) => {
                        debugger;
                        handleFieldChange({ stateName: data !== null && data !== undefined ? data.label.toString() : "", stateCode: data !== null && data !== undefined ? data.value.toString() : "" });
                      }}
                      label={t("state_name")}
                    />
                    <ERPInput
                      {...getFieldProps("stateCode")}
                      label={t("state_code")}
                      disabled={true}
                      placeholder={t("state_code")}
                      required={false}
                      onChangeData={(data: any) => handleFieldChange("stateCode", data.stateCode)}
                    />
                    <ERPCheckbox
                      {...getFieldProps("stopCredit")}
                      label={t("stop_credit")}
                      onChangeData={(data: any) => handleFieldChange("stopCredit", data.stopCredit)}
                    />
                  </>
                </div>
              )}
            </div>)}
          {activeTab === 'more' && <>
            {/* <div className="border p-4 rounded-lg mt-5">
      <h6>Payment Day</h6>
      <div className="grid grid-cols-7 gap-6 mt-3">
        <ERPCheckbox
          {...getFieldProps("sunday")}
          label={t("sunday")}
          onChangeData={(data: any) => handleFieldChange("sunday", data.sunday)}
        />
        <ERPCheckbox
          {...getFieldProps("monday")}
          label={t("monday")}
          onChangeData={(data: any) => handleFieldChange("monday", data.monday)}
        />
        <ERPCheckbox
          {...getFieldProps("tuesday")}
          label={t("tuesday")}
          onChangeData={(data: any) => handleFieldChange("tuesday", data.tuesday)}
        />
        <ERPCheckbox
          {...getFieldProps("wednesday")}
          label={t("wednesday")}
          onChangeData={(data: any) => handleFieldChange("wednesday", data.wednesday)}
        />
        <ERPCheckbox
          {...getFieldProps("thursday")}
          label={t("thursday")}
          onChangeData={(data: any) => handleFieldChange("thursday", data.thursday)}
        />
        <ERPCheckbox
          {...getFieldProps("friday")}
          label={t("friday")}
          onChangeData={(data: any) => handleFieldChange("friday", data.friday)}
        />
        <ERPCheckbox
          {...getFieldProps("saturday")}
          label={t("saturday")}
          onChangeData={(data: any) => handleFieldChange("saturday", data.saturday)}
        />
      </div>
    </div> */}
            <div className="border p-4 rounded-lg mt-5">
              <div className="grid grid-cols-4 gap-6">
                <ERPDataCombobox
                  {...getFieldProps("priceCategoryID")}
                  field={{
                    id: "priceCategoryID",
                    required: false,
                    getListUrl: Urls.data_pricectegory,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => handleFieldChange("priceCategoryID", data.priceCategoryID)}
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
                  onChangeData={(data: any) => handleFieldChange("formTypeID", data.formTypeID.toString())}
                  label={t("form_type")}
                />
                <ERPInput
                  {...getFieldProps("visitSequenceNo")}
                  label={t("visit_seq_no")}
                  placeholder={t("visit_seq_no")}
                  type="number"
                  required={false}
                  onChangeData={(data: any) => handleFieldChange("visitSequenceNo", data.visitSequenceNo)}
                />
                {isIndianCompany && (
                  <>
                    <ERPInput
                      {...getFieldProps("legalName")}
                      label={t("legal_name")}
                      placeholder={t("legal_name")}
                      required={false}
                      onChangeData={(data: any) => handleFieldChange("legalName", data.legalName)}
                    />
                    <ERPInput
                      {...getFieldProps("tradeName")}
                      label={t("trade_name")}
                      placeholder={t("trade_name")}
                      required={false}
                      onChangeData={(data: any) => handleFieldChange("tradeName", data.tradeName)}
                    />
                  </>
                )}
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
            </div></>}
          {activeTab === 'project_job' && <div className="grid grid-cols-4 gap-6">
            <ERPInput
              {...getFieldProps("projectName")}
              label={t("project_name")}
              placeholder={t("project_name")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("projectName", data.projectName)
              }
            />
            <ERPInput
              {...getFieldProps("address1")}
              label={t("address1")}
              placeholder={t("address1")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("address1", data.address1)
              }
            />
            <ERPInput
              {...getFieldProps("address2")}
              label={t("address2")}
              placeholder={t("address2")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("address2", data.address2)
              }
            />

          </div>}
          {activeTab === 'other_details' && (
            <div className="grid grid-cols-4 gap-6">
              <ERPDataCombobox
                {...getFieldProps("idType")}
                field={{
                  id: "idType",
                  valueKey: "label",
                  labelKey: "label",
                }}
                onChangeData={(data) => handleFieldChange("idType", data.idType)}
                label={t("id_type")}
                options={[
                  { value: "TIN", label: "TIN" },
                  { value: "NAT", label: "NAT" },
                  { value: "IQA", label: "IQA" },
                  { value: "CRN", label: "CRN" },
                  { value: "PAS", label: "PAS" },
                  { value: "MOM", label: "MOM" },
                  { value: "MLS", label: "MLS" },
                  { value: "SAG", label: "SAG" },
                  { value: "GCC", label: "GCC" },
                  { value: "OTH", label: "OTH" },
                ]}
              />

              <ERPInput
                {...getFieldProps("buildingNumber")}
                label={t("building_number")}
                placeholder={t("building_number")}
                required={false}
                onChangeData={(data) =>
                  handleFieldChange("buildingNumber", data.buildingNumber)
                }
              />

              <ERPInput
                {...getFieldProps("additionalNumber")}
                label={t("additional_number")}
                placeholder={t("additional_number")}
                required={false}
                onChangeData={(data) =>
                  handleFieldChange("additionalNumber", data.additionalNumber)
                }
              />

              <ERPInput
                {...getFieldProps("citySubDivision")}
                label={t("city_sub_division")}
                placeholder={t("city_sub_division")}
                required={false}
                onChangeData={(data) =>
                  handleFieldChange("citySubDivision", data.citySubDivision)
                }
              />

              <ERPInput
                {...getFieldProps("postalCode")}
                label={t("postal_code")}
                placeholder={t("postal_code")}
                required={false}
                onChangeData={(data) =>
                  handleFieldChange("postalCode", data.postalCode)
                }
              />

              <ERPDataCombobox
                {...getFieldProps("country")}
                onChangeData={(data) =>
                  handleFieldChange("country", data.country)
                }
                label={t("country")}
                field={{
                  id: "country",
                  getListUrl: Urls.data_countries,
                  valueKey: "id",
                  labelKey: "name",
                }}
              />
              <ERPInput
                {...getFieldProps("countrySubDivision")}
                label={t("country_sub_division")}
                placeholder={t("country_sub_division")}
                required={false}
                onChangeData={(data) =>
                  handleFieldChange(
                    "countrySubDivision",
                    data.countrySubDivision
                  )
                }
              />
            </div>
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-1 z-50 rounded-b-lg">
          <div className="max-w-screen-2xl mx-auto">
            <ERPFormButtons
              onClear={handleClear}
              isEdit={isEdit}
              isLoading={isLoading}
              onCancel={handleClose}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default PartiesManage;
