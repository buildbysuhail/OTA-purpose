import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../helpers/api-client";
import {
  ApplicationBranchSettings,
  ApplicationBranchSettingsInitialState,
} from "./application-settings-types";
import ERPDisableEnable from "../../../components/ERPComponents/erp-disable-inable";
import { t } from "i18next";

const BranchSettingsForm: React.FC = () => {
  const [formState, setFormState] = useState<ApplicationBranchSettings>(
    ApplicationBranchSettingsInitialState
  );
  const [formStatePrev, setFormStatePrev] = useState<
    Partial<ApplicationBranchSettings>
  >({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = new APIClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(`${Urls.application_settings}branch`);

      console.log(formState);
      setFormStatePrev(response);
      setFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (
    field: keyof typeof ApplicationBranchSettingsInitialState,
    value: any
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
        const currentValue =
          formState?.[key as keyof ApplicationBranchSettings];
        const prevValue = formStatePrev[key as keyof ApplicationBranchSettings];

        if (currentValue !== prevValue) {

          acc.push({
            settingsName: key,
            settingsValue: currentValue.toString(),
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);
      console.log(modifiedSettings);

      const response = (await api.put(Urls.application_settings, {
        type: "branch",
        updateList: modifiedSettings,
      })) as any;
      handleResponse(response);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={loadSettings}>Retry</button>
      </div>
    );
  }

  const handleSuccess = () => {
    alert("Input is now enabled!");
  };

  return (
    <div className="h-screen max-h-dvh flex flex-col  overflow-hidden">
      <form className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mb-[4rem]">
        <div className="space-y-6 p-6">
          <div className="border rounded-lg p-4">
            <div className="grid  sm:grid-cols-2 lg:grid-cols-2 xxl:grid-cols-4 gap-6">
              <ERPDisableEnable targetCount={15} onSuccess={handleSuccess}>
                {(hasPermitted) => (
                  <ERPDataCombobox
                    id="countryName"
                    value={formState.countryName}
                    disabled={hasPermitted}
                    field={{
                      id: "countryName",
                      getListUrl: Urls.data_countries,
                      valueKey: "id",
                      labelKey: "name",
                    }}
                    data={formState}
                    label={t("select_country")}
                    onChangeData={(data) =>
                      handleFieldChange("countryName", data.countryName)
                    }
                  />
                )}
              </ERPDisableEnable>

              {/* <ERPDataCombobox
                id="maintainMultilanguage__"
                value={formState.maintainMultilanguage__}
                field={{
                  id: "maintainMultilanguage__",
                  getListUrl: Urls.data_languages,
                  valueKey: "id",
                  labelKey: "name",
                }}
                data={formState}
                label={t("regional_language")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "maintainMultilanguage__",
                    data.maintainMultilanguage__
                  )
                }
              /> */}
              <ERPInput
                id="maximum_Allowed_LineItem_Amount"
                value={formState.maximum_Allowed_LineItem_Amount}
                data={formState}
                type="number"
                label={t("maximum_allowed_line_item_amount")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "maximum_Allowed_LineItem_Amount",
                    data.maximum_Allowed_LineItem_Amount
                  )
                }
              />
              <ERPCheckbox
                id="maintainTax"
                label={t("maintain_tax")}
                data={formState}
                checked={formState?.maintainTax}
                onChangeData={(data) =>
                  handleFieldChange("maintainTax", data.maintainTax)
                }
              />

              <ERPCheckbox
                data={formState}
                id="showFinancialYearSelector"
                label={t("show_financial_year_selector_on_startup")}
                checked={formState?.showFinancialYearSelector}
                onChangeData={(data) =>
                  handleFieldChange(
                    "showFinancialYearSelector",
                    data.showFinancialYearSelector
                  )
                }
              />
              <ERPCheckbox
                id="autoPostingTransaction"
                label={t("maintain_auto_posting_transaction")}
                data={formState}
                checked={formState?.autoPostingTransaction}
                onChangeData={(data) =>
                  handleFieldChange(
                    "autoPostingTransaction",
                    data.autoPostingTransaction
                  )
                }
              />
              <ERPCheckbox
                id="allowEditPostedTransactions"
                label={t("allow_edit_posted_transactions")}
                data={formState}
                checked={formState?.allowEditPostedTransactions}
                onChangeData={(data) =>
                  handleFieldChange(
                    "allowEditPostedTransactions",
                    data.allowEditPostedTransactions
                  )
                }
              />

              <ERPDisableEnable targetCount={5} onSuccess={handleSuccess}>
                {(hasPermitted) => (
                  <ERPCheckbox
                    id="maintainMasterEntry"
                    label={t("maintain_inventory_master_entry")}
                    disabled={hasPermitted}
                    data={formState}
                    checked={formState?.maintainMasterEntry}
                    onChangeData={(data) =>
                      handleFieldChange(
                        "maintainMasterEntry",
                        data.maintainMasterEntry
                      )
                    }
                  />
                )}
              </ERPDisableEnable>

              <ERPCheckbox
                id="maintainInventoryTransactionsEntry"
                label={t("maintain_inventory_transactions_entry")}
                data={formState}
                checked={formState?.maintainInventoryTransactionsEntry}
                onChangeData={(data) =>
                  handleFieldChange(
                    "maintainInventoryTransactionsEntry",
                    data.maintainInventoryTransactionsEntry
                  )
                }
              />

              <ERPDisableEnable targetCount={5} onSuccess={handleSuccess}>
                {(hasPermitted) => (
                  <ERPCheckbox
                    id="useBranchWiseSalesPrice"
                    disabled={hasPermitted}
                    label={t("use_branch_wise_sales_price")}
                    data={formState}
                    checked={formState?.useBranchWiseSalesPrice}
                    onChangeData={(data) =>
                      handleFieldChange(
                        "useBranchWiseSalesPrice",
                        data.useBranchWiseSalesPrice
                      )
                    }
                  />
                )}
              </ERPDisableEnable>

              <ERPCheckbox
                id="useTemplateSelectionForPrinting"
                data={formState}
                label={t("use_template_selection_for_printing")}
                checked={formState?.useTemplateSelectionForPrinting}
                onChangeData={(data) =>
                  handleFieldChange(
                    "useTemplateSelectionForPrinting",
                    data.useTemplateSelectionForPrinting
                  )
                }
              />
              <ERPCheckbox
                id="applyVATOnPurchaseToBTO"
                label={t("apply_TAX_on_purchase_converted_to_BTO")}
                data={formState}
                checked={formState?.applyVATOnPurchaseToBTO}
                onChangeData={(data) =>
                  handleFieldChange(
                    "applyVATOnPurchaseToBTO",
                    data.applyVATOnPurchaseToBTO
                  )
                }
              />
              <ERPCheckbox
                id="maintainCounterWisePrefixForTransaction"
                label={t("maintain_counter_wise_prefix_for_transaction")}
                data={formState}
                checked={formState?.maintainCounterWisePrefixForTransaction}
                onChangeData={(data) =>
                  handleFieldChange(
                    "maintainCounterWisePrefixForTransaction",
                    data.maintainCounterWisePrefixForTransaction
                  )
                }
              />
            </div>
          </div>

          {Number(formState?.countryName) === 1 && (
            <div className="rounded-lg border p-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-6">
                <ERPCheckbox
                  id="maintainKSA_EInvoice"
                  label={t("maintain_KSA_eInvoice")}
                  disabled={formState?.maintainTax === false}
                  data={formState}
                  checked={formState?.maintainKSA_EInvoice}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "maintainKSA_EInvoice",
                      data.maintainKSA_EInvoice
                    )
                  }
                />

                <ERPCheckbox
                  id="enableTaxOnBillDiscount"
                  label={t("enable_tax_on_bill_discount")}
                  data={formState}
                  checked={formState?.enableTaxOnBillDiscount}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "enableTaxOnBillDiscount",
                      data.enableTaxOnBillDiscount
                    )
                  }
                />

                <ERPCheckbox
                  id="apply_KSA_EInvoice_Validation_Rules"
                  label={t("apply_KSA_eInvoice_validation_rules")}
                  checked={formState?.apply_KSA_EInvoice_Validation_Rules}
                  data={formState}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "apply_KSA_EInvoice_Validation_Rules",
                      data.apply_KSA_EInvoice_Validation_Rules
                    )
                  }
                />
                <ERPCheckbox
                  id="createCreditNoteAutomaticallyOnSalesEdit"
                  label={t("create_credit_note_automatically_on_sales_edit")}
                  data={formState}
                  checked={formState?.createCreditNoteAutomaticallyOnSalesEdit}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "createCreditNoteAutomaticallyOnSalesEdit",
                      data.createCreditNoteAutomaticallyOnSalesEdit
                    )
                  }
                />
                <ERPDisableEnable targetCount={5} onSuccess={handleSuccess}>
                  {(hasPermitted) => (
                    <ERPInput
                      id="kSA_EInvoice_Sync_SystemCode"
                      disabled={hasPermitted}
                      value={formState.kSA_EInvoice_Sync_SystemCode}
                      data={formState}
                      label={t("e-Invoice_sync_systemCode")}
                      onChangeData={(data) =>
                        handleFieldChange(
                          "kSA_EInvoice_Sync_SystemCode",
                          data.kSA_EInvoice_Sync_SystemCode
                        )
                      }
                    />
                  )}
                </ERPDisableEnable>
              </div>
            </div>
          )}
          <div className="rounded-lg border p-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-6">
              <div>
                <ERPCheckbox
                  id="maintainSynchronization"
                  checked={formState?.maintainSynchronization}
                  data={formState}
                  label={t("maintain_synchronization")}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "maintainSynchronization",
                      data.maintainSynchronization
                    )
                  }
                />

                <ERPDataCombobox
                  id="maintainSynchronizationdata"
                  disabled={formState?.maintainSynchronization === false}
                  label=" "
                  value={formState.maintainSynchronizationdata}
                  field={{
                    id: "maintainSynchronizationdata",
                    valueKey: "value",
                    labelKey: "label",
                  }}
                  data={formState}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "maintainSynchronizationdata",
                      data.maintainSynchronizationdata
                    )
                  }
                  options={[
                    { value: 0, label: "Manual Sync" },
                    { value: 1, label: "Auto Sync" },
                    { value: 2, label: "Auto Sync and Upload Only" },
                    { value: 3, label: "Manual Sync and Upload Only" },
                    { value: 4, label: "Upload And Download" },
                  ]}
                />
              </div>

              <ERPInput
                id="syncIntervals"
                value={formState.syncIntervals}
                data={formState}
                label={t("intervals_(minutes)")}
                disabled={
                  Number(formState?.maintainSynchronizationdata) !== 1 &&
                  Number(formState?.maintainSynchronizationdata) !== 2
                }
                type="number"
                onChangeData={(data) =>
                  handleFieldChange("syncIntervals", data.syncIntervals)
                }
              />
              <ERPCheckbox
                id="refreshStockAfterSync"
                checked={formState.refreshStockAfterSync}
                data={formState}
                label={t("refresh_stock_after_sync")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "refreshStockAfterSync",
                    data.refreshStockAfterSync
                  )
                }
              />
              <ERPCheckbox
                id="refreshServerStockAfterSync"
                checked={formState.refreshServerStockAfterSync}
                data={formState}
                label={t("refresh_server_stock_after_sync")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "refreshServerStockAfterSync",
                    data.refreshServerStockAfterSync
                  )
                }
              />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-6 mt-3">
              <ERPCheckbox
                id="showBTINotification"
                checked={formState.showBTINotification}
                data={formState}
                label={t("show_BTI_notification")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "showBTINotification",
                    data.showBTINotification
                  )
                }
              />

              <ERPDataCombobox
                id="reportMode"
                value={formState.reportMode}
                field={{
                  id: "reportMode",
                  valueKey: "value",
                  labelKey: "label",
                }}
                data={formState}
                label={t("report_mode")}
                onChangeData={(data) =>
                  handleFieldChange("reportMode", data.reportMode)
                }
                options={[
                  { value: "classic", label: "classic" },
                  { value: "Standard", label: "Standard" },
                ]}
              />

              <ERPDataCombobox
                id="invoicePrintingStyle"
                value={formState.invoicePrintingStyle}
                field={{
                  id: "invoicePrintingStyle",
                  // required: true,
                  valueKey: "value",
                  labelKey: "label",
                }}
                data={formState}
                label={t("printing_style")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "invoicePrintingStyle",
                    data.invoicePrintingStyle
                  )
                }
                options={[
                  { value: 0, label: "Default" },
                  { value: 1, label: "Standard" },
                ]}
              />
              <ERPDataCombobox
                id="fileAttachmentMethod"
                value={formState.fileAttachmentMethod}
                field={{
                  id: "fileAttachmentMethod",
                  // required: true,

                  valueKey: "value",
                  labelKey: "label",
                }}
                data={formState}
                label={t("file_attachment_method")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "fileAttachmentMethod",
                    data.fileAttachmentMethod
                  )
                }
                options={[
                  { value: 0, label: "No" },
                  { value: 1, label: "File System" },
                  { value: 2, label: "Cloud" },
                ]}
              />
              <ERPInput
                id="fileAttachmentFolder"
                value={formState.fileAttachmentFolder}
                data={formState}
                label={t("shared_folder")}
                onChangeData={(data) =>
                  handleFieldChange(
                    "fileAttachmentFolder",
                    data.fileAttachmentFolder
                  )
                }
              />
            </div>
          </div>
        </div>
      </form>
      <div className="flex justify-end items-center py-1 px-8 fixed bottom-0 right-0 bg-[#fafafa] w-full shadow-[0_0.2rem_0.4rem_rgba(0,0,0,0.5)]">
        <ERPButton
          title={t("save_settings")}
          variant="primary"
          type="button"
          loading={isSaving}
          disabled={isSaving}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default BranchSettingsForm;
