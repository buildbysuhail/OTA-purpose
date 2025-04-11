import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useTranslation } from "react-i18next";
import { toggleParties } from "../../../../redux/slices/popup-reducer";
import { initialPartiesData, initialProjectOrJobData, PartiesData, ProjectOrJob, } from "./parties-manage-type";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import { APIClient } from "../../../../helpers/api-client";
import { RootState } from "../../../../redux/store";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import { convertFileToBase64 } from "../../../../utilities/file-utils";
import ErpCropper from "../../../../components/ERPComponents/erp-cropper";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import { handleResponse } from "../../../../utilities/HandleResponse";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";

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
    const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
    const isIndianCompany = userSession.countryId === Countries.India;
    const [isTCSApplicable, setIsTCSApplicable] = useState(false);
    const [projectOrJob, setProjectOrJob] = useState<ProjectOrJob>(initialProjectOrJobData.data);
    const [image, setImage] = useState<string>("#");

    const {
      isEdit,
      handleClear,
      handleSubmit,
      handleFieldChange,
      getFieldProps,
      handleClose,
      isLoading,
      formState,
    } = useFormManager<PartiesData>({
      url: Urls.parties,
      onClose: useCallback(() => dispatch(toggleParties({ isOpen: false, key: null, reload: false })), [dispatch]),
      onSuccess: useCallback(() => dispatch(toggleParties({ isOpen: false, key: null, reload: true })), [dispatch]),
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
          country: "Saudi Arabia",
          registrationType: "Regular",
          drCr: "Dr",
        },
      },
    });

    const [fileLoading, setFileLoading] = useState(false);
    const { t } = useTranslation("masters");
    const handleFileChange = (e: { target: { files: any[] } }) => {
      const file = e.target.files[0];
      if (file) {
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

    const onImageSuccess = useMemo(() => {
      return (url: string) => {
        setImage(url);
      };
    }, []);

    const handleFileUpload = async (key: any, value: any) => {
      setFileLoading(true);
      const payload = {
        FileData: value,
      };
      try {
        const res = await api.postAsync(Urls.acc_attachment_upload, payload);
        handleFieldChange(key, res.item.fileKey);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setFileLoading(false);
      }
    };

    const handleDownload = async (fileData: number) => {
      ERPToast.show("Download started...", "success");
      try {
        const url = `${Urls.acc_attachmentInfo_download
          }?fileKey=${encodeURIComponent(fileData)}`;
        const res = await api.getNativeAsync(url, undefined, {
          responseType: "blob", // Ensure the response is treated as a binary blob
        });

        if (res && res instanceof Blob) {
          // Create a blob URL from the response data
          const blobUrl = URL.createObjectURL(res);
          // Create a link element
          const link = document.createElement("a");
          link.href = blobUrl;
          // Set the file name
          // If you have a way to get the file name from the server response, use that instead
          const suggestedFileName = "downloaded_file";
          link.setAttribute("download", suggestedFileName);
          // Append to the document, click, and remove
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          // Revoke the blob URL to free up resources
          URL.revokeObjectURL(blobUrl);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error downloading file:", error);
        ERPToast.show("Download failed.", "error");
      } finally {
        setFileLoading(false);
      }
    };
    const projectsColumns: DevGridColumn[] = useMemo(
      () => [
        {
          dataField: "projectId",
          caption: t("Project ID"),
          dataType: "number",
          width: 80,
          allowSorting: true,
          allowFiltering: true,
          isLocked: false,
          showInPdf: true,
        },
        {
          dataField: "projectName",
          caption: t("Project Name"),
          dataType: "string",
          allowSorting: true,
          allowFiltering: true,
          isLocked: false,
          showInPdf: true,
        },
        {
          dataField: "address1",
          caption: t("Address 1"),
          dataType: "string",
          allowSorting: false,
          allowFiltering: true,
          isLocked: false,
          showInPdf: true,
        },
        {
          dataField: "address2",
          caption: t("Address 2"),
          dataType: "string",
          allowSorting: false,
          allowFiltering: true,
          isLocked: false,
          showInPdf: true,
        },
        {
          dataField: "address3",
          caption: t("Address 3"),
          dataType: "string",
          allowSorting: false,
          allowFiltering: true,
          isLocked: false,
          showInPdf: true,
        },
        {
          dataField: "actions",
          caption: t("actions"),
          isLocked: true,
          allowSearch: false,
          allowFiltering: false,
          fixed: true,
          fixedPosition: "right",
          width: 50,
          cellRender: (cellElement: any, cellInfo: any) => {
            debugger;
            return (
              <ERPGridActions
                view={{ visible: false, type: "link" }}
                edit={{ visible: false, type: "link" }}
                delete={
                  {
                    onSuccess: () => { setProjectsLoad(true) },
                    visible: true,
                    confirmationRequired: true,
                    confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
                    url: Urls?.party_projects,
                    key: cellElement?.data?.projectID,
                  }
                }
              />
            );
          },
        },
      ], [t]
    );
    const [projectOnAction, setProjectOnAction] = useState<boolean>(false);
    const [projectsLoad, setProjectsLoad] = useState<boolean>(true);
    const [project, setProject] = useState<{
      projectId: number;
      projectName: string;
      address1: string;
      address2: string;
      address3: string;
    }>({
      projectId: 0,
      projectName: "",
      address1: "",
      address2: "",
      address3: "",
    });
    const loadProject = async (event: any) => {
      try {
        setProject(event.data);
      } catch (error) { }
    };
    const saveProject = async () => {
      try {
        setProjectOnAction(true);
        const response = await api.postAsync(Urls.party_projects, { ...project, partyId: formState.data.partyID });
        setProjectOnAction(false);
        handleResponse(response, () => {
          setProjectsLoad(true);
          clearForm();
        });
      } catch (error) {
        console.error(error);
        alert("Error saving project.");
      }
    };

    // Clear Form
    const clearForm = () => {
      setProject({
        projectId: 0,
        projectName: "",
        address1: "",
        address2: "",
        address3: "",
      });
    };
    return (
      <div className="w-full bordered-tab relative">
        <div className="mt-[1.5rem]">
          <div className="grid xxl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 items-center ps-1 text-left">
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
              {...getFieldProps("creditDays", "int")}
              min={0}
              label={t("credit_days")}
              type="number"
              placeholder={t("credit_days")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("creditDays", parseInt(data.creditDays))
              }
            />

            <ERPInput
              {...getFieldProps("creditAmount", "decimal")}
              min={0}
              label={t("credit_amount")}
              type="number"
              placeholder={t("credit_amount")}
              required={false}
              onChangeData={(data: any) =>
                handleFieldChange("creditAmount", parseFloat(data.creditAmount))
              }
            />

            <div className="flex gap-4">
              <ERPInput
                {...getFieldProps("opBalance", "int")}
                min={0}
                disabled={isEdit}
                label={t("op_balance")}
                type="number"
                placeholder={t("op_balance")}
                required={false}
                onChangeData={(data: any) =>
                  handleFieldChange("opBalance", parseFloat(data.opBalance))
                }
              />

              <div className="">
                <ERPDataCombobox
                  {...getFieldProps("drCr")}
                  field={{
                    id: "drCr",
                    valueKey: "value",
                    labelKey: "label",
                  }}
                  onChangeData={(data: any) =>
                    handleFieldChange("drCr", data.drCr)
                  }
                  label={t("drcr")}
                  enableClearOption={false}
                  options={[
                    { value: "Dr", label: t("Dr") },
                    { value: "Cr", label: t("Cr") },
                  ]}
                />
              </div>
            </div>

            <ERPCheckbox
              {...getFieldProps("billwiseBillApplicable")}
              label={t("bill_wise_applicable")}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "billwiseBillApplicable",
                  data.billwiseBillApplicable
                )
              }
            />

            <ERPCheckbox
              {...getFieldProps("isActive")}
              label={t("is_active")}
              onChangeData={(data: any) =>
                handleFieldChange("isActive", data.isActive)
              }
            />

            <ERPCheckbox
              {...getFieldProps("isCommon")}
              label={t("is_common")}
              onChangeData={(data: any) =>
                handleFieldChange("isCommon", data.isCommon)
              }
            />
          </div>

          <div className="grid xxl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 items-center mt-3">
            {isIndianCompany && (
              <>
                <ERPDataCombobox
                  {...getFieldProps("faxNumber")}
                  field={{
                    id: "faxNumber",
                    required: true,
                    getListUrl: Urls.data_CustSupp,
                    valueKey: "name",
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
                    handleFieldChange(
                      "registrationType",
                      data !== null && data !== undefined
                        ? data.registrationType
                        : "Regular"
                    );
                  }}
                  label={t("registration_type")}
                  options={[
                    { value: "Regular", label: "Regular" },
                    { value: "Regular+RCM", label: "Regular+RCM" },
                    { value: "Composite", label: "Composite" },
                    { value: "Unregistered", label: "Unregistered" },
                    { value: "Unregistered+RCM", label: "Unregistered+RCM" },
                    { value: "Foreign non-Resident Taxpayer", label: "Foreign non-Resident Taxpayer", },
                    { value: "Input Service distributor", label: "Input Service distributor", },
                    { value: "Tax Deductor", label: "Tax Deductor" },
                    { value: "E-commerce Operator", label: "E-commerce Operator", },
                    { value: "Government Departments", label: "Government Departments", },
                    { value: "SEZ supplies with payment", label: "SEZ supplies with payment", },
                    { value: "SEZ supplies without payment", label: "SEZ supplies without payment", },
                    { value: "Deemed Export", label: "Deemed Export" },
                    { value: "Intra-State supplies attracting IGST", label: "Intra-State supplies attracting IGST", },
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

        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab
            label={t("address")}
            value="address"
            className="dark:text-dark-text"
          />

          <Tab
            label={t("bank")}
            value="bank"
            className="dark:text-dark-text"
          />

          <Tab
            label={t("details")}
            value="details"
            className="dark:text-dark-text"
          />

          <Tab
            label={t("more")}
            value="more"
            className="dark:text-dark-text"
          />

          <Tab
            label="Project/Job"
            value="project_job"
          />

          {userSession.countryId != Countries.India &&
            applicationSettings?.branchSettings?.maintainKSA_EInvoice ==
            true && (
              <Tab
                label={t("other")}
                value="other_details"
                className="dark:text-dark-text"
              />
            )}
        </Tabs>

        <div className="pt-4 mb-[71px]">
          {activeTab === "address" && (
            <div className="grid xxl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 items-center">
              <ERPInput
                {...getFieldProps("address2")}
                label={
                  userSession.countryId == Countries.India
                    ? t("address_2_city_district")
                    : t("address_2_city")
                }
                placeholder={
                  userSession.countryId == Countries.India
                    ? t("address_2_city_district")
                    : t("address_2_city")
                }
                required={false}
                onChangeData={(data: any) =>
                  handleFieldChange("address2", data.address2)
                }
              />

              {userSession.countryId != Countries.India && (
                <ERPInput
                  {...getFieldProps("address3")}
                  label={t("address3_district")}
                  placeholder={t("address3_district")}
                  required={false}
                  onChangeData={(data: any) =>
                    handleFieldChange("address3", data.address3)
                  }
                />
              )}

              {userSession.countryId == Countries.India && (
                <ERPInput
                  {...getFieldProps("address3")}
                  label={t("address_4_building_no")}
                  placeholder={t("address_4_building_no")}
                  required={false}
                  onChangeData={(data: any) =>
                    handleFieldChange("address3", data.address3)
                  }
                />
              )}

              {userSession.countryId != Countries.India && (
                <ERPInput
                  {...getFieldProps("address4")}
                  label={t("address_4_building_no")}
                  placeholder={t("address_4_building_no")}
                  required={false}
                  onChangeData={(data: any) =>
                    handleFieldChange("address4", data.address4)
                  }
                />
              )}

              <ERPInput
                {...getFieldProps("officePhone")}
                label={t("office_phone")}
                placeholder={t("office_phone")}
                required={false}
                onChangeData={(data: any) =>
                  handleFieldChange("officePhone", data.officePhone)
                }
              />

              <ERPInput
                {...getFieldProps("workPhone")}
                label={t("work_phone")}
                placeholder={t("work_phone")}
                required={false}
                onChangeData={(data: any) =>
                  handleFieldChange("workPhone", data.workPhone)
                }
              />

              <ERPInput
                {...getFieldProps("contactPhone")}
                label={t("contact_phone")}
                placeholder={t("contact_phone")}
                required={false}
                onChangeData={(data: any) =>
                  handleFieldChange("contactPhone", data.contactPhone)
                }
              />

              <ERPInput
                {...getFieldProps("email")}
                label={t("email")}
                placeholder={t("email")}
                type="email"
                required={false}
                onChangeData={(data: any) =>
                  handleFieldChange("email", data.email)
                }
              />

              <ERPInput
                {...getFieldProps("webURL")}
                label={t("website")}
                placeholder={t("website")}
                required={false}
                onChangeData={(data: any) =>
                  handleFieldChange("webURL", data.webURL)
                }
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
            </div>
          )}

          {activeTab === "bank" && (
            <>
              <div className="flex align-center gap-3">
                <div className="w-1/2 dark:!border-dark-border border rounded-lg p-4">
                  <h6 className=" dark:!border-dark-border border-b pb-2 mb-2 text-sm font-bold">
                    {t("bank_1")}
                  </h6>
                  <div className="flex flex-col gap-3">
                    <ERPInput
                      {...getFieldProps("bankAcNumber1")}
                      label={t("account_number")}
                      placeholder={t("account_number")}
                      required={false}
                      onChangeData={(data: any) =>
                        handleFieldChange("bankAcNumber1", data.bankAcNumber1)
                      }
                    />

                    <ERPInput
                      {...getFieldProps("bankAcName1")}
                      label={t("account_name")}
                      placeholder={t("account_name")}
                      required={false}
                      onChangeData={(data: any) =>
                        handleFieldChange("bankAcName1", data.bankAcName1)
                      }
                    />

                    <ERPInput
                      {...getFieldProps("bankDetails1")}
                      label={t("remarks")}
                      placeholder={t("remarks")}
                      required={false}
                      onChangeData={(data: any) =>
                        handleFieldChange("bankDetails1", data.bankDetails1)
                      }
                    />
                  </div>
                </div>

                <div className="w-1/2 dark:!border-dark-border border rounded-lg p-4">
                  <h6 className="dark:!border-dark-border  border-b pb-2 mb-2 text-sm font-bold">
                    {t("bank_2")}
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
          )}

          {activeTab === "details" && (
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-5">
                <div className="p-4 md:p-5 border rounded-lg dark:border-dark-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="w-full">
                      <ERPDateInput
                        {...getFieldProps("startDate")}
                        label={t("start_date")}
                        required={true}
                        onChangeData={(data) => handleFieldChange("startDate", data.startDate)}
                      />
                    </div>

                    <div className="w-full">
                      <ERPDateInput
                        {...getFieldProps("expiryDate")}
                        label={t("exp_date")}
                        required={true}
                        onChangeData={(data) => handleFieldChange("expiryDate", data.expiryDate)}
                      />
                    </div>

                    <div className="w-full flex flex-col gap-2">
                      <label htmlFor="document1Key" className="text-sm text-gray-700 dark:text-dark-text">  {t("document_1")}</label>

                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          id="document1Key"
                          name="document1Key"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files != undefined && files.length > 0) {
                              convertFileToBase64(files[0]).then((base64) => {
                                handleFileUpload("document1Key", base64);
                              });
                            }
                          }}
                          disabled={fileLoading}
                          className="w-full border rounded-lg p-2 text-sm"
                        />
                        {fileLoading && (
                          <div className="flex items-center">
                            <CircularProgress className="" color="inherit" size={14} />
                          </div>
                        )}
                      </div>

                      {formState?.data?.document1Key && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-700 dark:text-dark-text">
                            {t("uploaded_file")}
                          </span>
                          <a
                            href="#"
                            onClick={() =>
                              handleDownload(formState?.data?.document1Key)
                            }
                            download
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            {t("download")}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="w-full flex flex-col gap-2">
                      <label htmlFor="document2Key" className="text-sm text-gray-700 dark:text-dark-text">  {t("document_2")}</label>
                      <input
                        type="file"
                        id="document2Key"
                        name="document2Key"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files != undefined && files.length > 0) {
                            convertFileToBase64(files[0]).then((base64) => {
                              handleFileUpload("document2Key", base64);
                            });
                          }
                        }}
                        className="w-full border rounded-lg p-2 text-sm"
                      />

                      {formState?.data?.document2Key && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-700 dark:text-dark-text">
                            {t("uploaded_file")}
                          </span>
                          <a href="#" onClick={() => handleDownload(formState?.data?.document2Key)} download className="text-blue-600 hover:text-blue-800 underline text-sm">
                            {t("download")}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isIndianCompany && (
                  <div className="p-4 md:p-5 border rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="w-full">
                        <ERPCheckbox
                          {...getFieldProps("isTCSApplicable")}
                          label={t("is_tcs_applicable")}
                          onChangeData={(data) => {
                            handleFieldChange("isTCSApplicable", data.isTCSApplicable);
                            setIsTCSApplicable(data.isTCSApplicable);
                          }}
                        />
                      </div>

                      <div className="w-full">
                        <ERPDataCombobox
                          {...getFieldProps("tcsCategoryID")}
                          field={{
                            id: "tcsCategoryID",
                            required: false,
                            getListUrl: Urls.account_party_category,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          onChangeData={(data) => handleFieldChange("tcsCategoryID", data.tcsCategoryID)}
                          label={t("tcs_category")}
                          disabled={!isTCSApplicable}
                        />
                      </div>

                      <div className="w-full">
                        <ERPDataCombobox
                          {...getFieldProps("stateCode")}
                          field={{
                            id: "stateCode",
                            required: false,
                            getListUrl: Urls.data_states,
                            valueKey: "id",
                            labelKey: "name",
                          }}
                          onChange={(data) => {
                            handleFieldChange({
                              stateName: data !== null && data !== undefined ? data.label.toString() : "",
                              stateCode: data !== null && data !== undefined ? data.value.toString() : "",
                            });
                          }}
                          label={t("state_name")}
                        />
                      </div>

                      {/* State Code */}
                      <div className="w-full">
                        <ERPInput
                          {...getFieldProps("stateCode")}
                          label={t("state_code")}
                          disabled={true}
                          placeholder={t("state_code")}
                          required={false}
                          onChangeData={(data) => handleFieldChange("stateCode", data.stateCode)}
                        />
                      </div>

                      <div className="w-full">
                        <ERPCheckbox
                          {...getFieldProps("stopCredit")}
                          label={t("stop_credit")}
                          onChangeData={(data) => handleFieldChange("stopCredit", data.stopCredit)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "more" && (
            <>
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
              <div className="border dark:!border-dark-border p-4 rounded-lg mt-5">
                <div className="grid xxl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 items-center">
                  <ERPDataCombobox
                    {...getFieldProps("priceCategoryID")}
                    field={{
                      id: "priceCategoryID",
                      required: false,
                      getListUrl: Urls.data_pricectegory,
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    onChangeData={(data: any) =>
                      handleFieldChange("priceCategoryID", data.priceCategoryID)
                    }
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
                    onChangeData={(data: any) =>
                      handleFieldChange("formTypeID", data.formTypeID)
                    }
                    label={t("form_type")}
                  />

                  <ERPInput
                    {...getFieldProps("visitSequenceNo")}
                    min={0}
                    label={t("visit_seq_no")}
                    placeholder={t("visit_seq_no")}
                    type="number"
                    required={false}
                    onChangeData={(data: any) =>
                      handleFieldChange("visitSequenceNo", data.visitSequenceNo)
                    }
                  />

                  {isIndianCompany && (
                    <>
                      <ERPInput
                        {...getFieldProps("legalName")}
                        label={t("legal_name")}
                        placeholder={t("legal_name")}
                        required={false}
                        onChangeData={(data: any) =>
                          handleFieldChange("legalName", data.legalName)
                        }
                      />

                      <ERPInput
                        {...getFieldProps("tradeName")}
                        label={t("trade_name")}
                        placeholder={t("trade_name")}
                        required={false}
                        onChangeData={(data: any) =>
                          handleFieldChange("tradeName", data.tradeName)
                        }
                      />
                    </>
                  )}

                  <div className="md:mt-2">
                    <ErpCropper
                      apiUrl="/Subscription/Profile/UploadUserImage"
                      onImageSuccess={onImageSuccess}
                      useCircle
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "project_job" && (
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col md:flex-row w-full gap-6 p-4">
                {/* Left aligned div with form inputs */}
                <div className="w-full md:w-1/3 flex flex-col items-start">
                  {/* <h2 className="text-xl font-bold mb-4">Project Information</h2> */}
                  <div className="w-full">
                    <ERPInput
                      id="projectName"
                      label={t("project_name")}
                      placeholder={t("project_name")}
                      required={false}
                      value={project.projectName}
                      data={project}
                      onChangeData={(data: any) =>
                        setProject((prev: any) => {
                          return { ...prev, projectName: data.projectName };
                        })
                      }
                    />

                    <ERPInput
                      id="address1"
                      value={project.address1}
                      data={project}
                      label={t("address1")}
                      placeholder={t("address1")}
                      required={false}
                      onChangeData={(data: any) =>
                        setProject((prev: any) => {
                          return { ...prev, address1: data.address1 };
                        })
                      }
                    />

                    <ERPInput
                      id="address2"
                      value={project.address2}
                      data={project}
                      label={t("address2")}
                      placeholder={t("address2")}
                      required={false}
                      onChangeData={(data: any) =>
                        setProject((prev: any) => {
                          return { ...prev, address2: data.address2 };
                        })
                      }
                    />

                    <div className="pt-2 text-right">
                      <ERPButton
                        type="button"
                        title={t("clear")}
                        variant="secondary"
                        className="mr-2"
                        onClick={() => {
                          clearForm();
                        }}
                        disabled={projectOnAction}
                      />

                      <ERPButton
                        type="button"
                        disabled={projectOnAction}
                        variant="primary"
                        onClick={saveProject}
                        loading={projectOnAction}
                        title={
                          project && project.projectId > 0
                            ? t("update")
                            : t("Save")
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Right aligned div with DevExtreme DataGrid */}
                <div className="w-full md:w-2/3">
                  {/* <h2 className="text-xl font-bold mb-4">Data Grid</h2> */}
                  <div className="w-full border rounded-md shadow">
                    <ErpDevGrid
                      columns={projectsColumns}
                      height={400}
                      onRowClick={loadProject}
                      gridHeader={t("")}
                      dataUrl={`${Urls.party_projects}GetAll/${formState.data.partyID}`}
                      gridId="party_projects"
                      changeReload={(reload: any) => { setProjectsLoad(false) }}
                      reload={projectsLoad}
                      gridAddButtonIcon="ri-add-line"
                      pageSize={40}
                      hideGridAddButton={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "other_details" && (
            <div className="grid grid-cols-4 gap-6">
              <ERPDataCombobox
                {...getFieldProps("idType")}
                field={{
                  id: "idType",
                  valueKey: "label",
                  labelKey: "label",
                }}
                onChangeData={(data) =>
                  handleFieldChange("idType", data.idType)
                }
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
                {...getFieldProps("plotIdentificationNumber")}
                label={t("additional_number")}
                placeholder={t("additional_number")}
                required={false}
                onChangeData={(data) =>
                  handleFieldChange(
                    "plotIdentificationNumber",
                    data.plotIdentificationNumber
                  )
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
                  valueKey: "name",
                  labelKey: "name",
                }}
              />

              <ERPInput
                {...getFieldProps("countrySubEntity")}
                label={t("country_sub_division")}
                placeholder={t("country_sub_division")}
                required={false}
                onChangeData={(data) =>
                  handleFieldChange("countrySubEntity", data.countrySubEntity)
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
