import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../redux/urls";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
import { LedgerType } from "../../../../enums/ledger-types";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import ERPDisableEnable from "../../../../components/ERPComponents/erp-disable-inable";
import { isNullOrUndefinedOrEmpty } from "../../../../utilities/Utils";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { useApplicationGstSettings } from "../../../../utilities/hooks/use-application-gst-settings";
import EWBTaxPro from "../ewb-taxpro";
import EInvoiceTaxPro from "../e-invoice-taxpro";
import { useTranslation } from "react-i18next";

interface ApplicationSettingsProps {
  settings: any; // Replace `any` with the actual type if known
  handleFieldChange: <T extends keyof ApplicationSettingsType>(
    type: T,
    settingName: keyof ApplicationSettingsType[T],
    value: any
  ) => void;
  filterComponent: (keys: string[], fText: string) => boolean;
  filterText: string;
  userSession: any; // Replace `any` with the actual type if known
  isCompactView: boolean;
  gridClass: string;
  sectionsRef: any;
  subItemsRef: MutableRefObject<Record<string, HTMLElement | null>>
  subItemsCatRef: any;
  blinkSection: string | null;
  handleGeneralHeaderClick: any;
  key: string;
}

const InventoryGSTSettingsFilterableComponents: React.FC<ApplicationSettingsProps> = ({
  settings,
  handleFieldChange,
  filterComponent,
  filterText,
  userSession,
  isCompactView,
  gridClass,
  sectionsRef,
  subItemsRef,
  subItemsCatRef,
  blinkSection,
  handleGeneralHeaderClick,
  key,
}) => {
  const { t } = useTranslation("applicationSettings")
  const { handleShowComponent, PopupComponent, setShowEWBPopup, showEWBPopup, setShowEInvoicePopup, showEInvoicePopup } = useApplicationGstSettings();

  const items = [

    {
      condition: filterComponent([t("default_purchase")], filterText),
      element: (
        <label>{t("default_purchase")}</label>
      ),
    },
    {
      condition: filterComponent([t("normal")], filterText),
      element: (
        <>
          <ERPCheckbox
            id="purchaseNormalType"
            checked={
              settings?.gSTTaxesSettings?.purchaseNormalType
            }
            data={settings?.gSTTaxesSettings}
            label={t("normal")}
            onChangeData={(data: any) =>
              handleFieldChange(
                "gSTTaxesSettings",
                "purchaseNormalType",
                data.purchaseNormalType
              )
            }
          />
        </>
      ),
    },
    {
      condition: filterComponent([t("inter_state")], filterText),
      element: (
        <ERPCheckbox
          id="purchaseInterstateType"
          checked={
            settings?.gSTTaxesSettings?.purchaseInterstateType
          }
          data={settings?.gSTTaxesSettings}
          label={t("inter_state")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "gSTTaxesSettings",
              "purchaseInterstateType",
              data.purchaseInterstateType
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("form_6(2)")], filterText),
      element: (
        <ERPCheckbox
          id="purchaseForm62"
          checked={settings?.gSTTaxesSettings?.purchaseForm62}
          data={settings?.gSTTaxesSettings}
          label={t("form_6(2)")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "gSTTaxesSettings",
              "purchaseForm62",
              data.purchaseForm62
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("input_cst_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="inputCSTAccount"
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.inputCSTAccount
                )
              }
              data={settings?.gSTTaxesSettings}
              label={t("input_cst_account")}
              field={{
                id: "inputCSTAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "inputCSTAccount",
                  data.inputCSTAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("output_cst_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="outputCSTAccount"
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.outputCSTAccount
                )
              }
              data={settings?.gSTTaxesSettings}
              label={t("output_cst_account")}
              field={{
                id: "outputCSTAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "outputCSTAccount",
                  data.outputCSTAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("input_cess_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="inputCessAccount"
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.inputCessAccount
                )
              }
              data={settings?.gSTTaxesSettings}
              label={t("input_cess_account")}
              field={{
                id: "inputCessAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "inputCessAccount",
                  data.inputCessAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("output_cess_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="outputCessAccount"
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.outputCessAccount
                )
              }
              data={settings?.gSTTaxesSettings}
              label={t("output_cess_account")}
              field={{
                id: "outputCessAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "outputCessAccount",
                  data.outputCessAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("input_add_cess_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="inputAddCessAccount"
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.inputAddCessAccount
                )
              }
              data={settings?.gSTTaxesSettings}
              label={t("input_add_cess_account")}
              field={{
                id: "inputAddCessAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "inputAddCessAccount",
                  data.inputAddCessAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("output_add_cess_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="outputAddCessAccount"
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.outputAddCessAccount
                )
              }
              data={settings?.gSTTaxesSettings}
              label={t("output_add_cess_account")}
              field={{
                id: "outputAddCessAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "outputAddCessAccount",
                  data.outputAddCessAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("expenses_tax_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="expensesTaxAccount"
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.expensesTaxAccount
                )
              }
              data={settings?.gSTTaxesSettings}
              label={t("expenses_tax_account")}
              field={{
                id: "expensesTaxAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "expensesTaxAccount",
                  data.expensesTaxAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("income_tax_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="incomeTaxAccount"
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.incomeTaxAccount
                )
              }
              data={settings?.gSTTaxesSettings}
              label={t("income_tax_account")}
              field={{
                id: "incomeTaxAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "incomeTaxAccount",
                  data.incomeTaxAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("input_SGST_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="inputSGSTAccount"
              data={settings?.gSTTaxesSettings}
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.inputSGSTAccount
                )
              }
              label={t("input_SGST_account")}
              field={{
                id: "inputSGSTAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "inputSGSTAccount",
                  data.inputSGSTAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("output_SGST_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="outputSGSTAccount"
              data={settings?.gSTTaxesSettings}
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.outputSGSTAccount
                )
              }
              label={t("output_SGST_account")}
              field={{
                id: "outputSGSTAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "outputSGSTAccount",
                  data.outputSGSTAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("input_CGST_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="inputCGSTAccount"
              data={settings?.gSTTaxesSettings}
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.inputCGSTAccount
                )
              }
              label={t("input_CGST_account")}
              field={{
                id: "inputCGSTAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "inputCGSTAccount",
                  data.inputCGSTAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("output_CGST_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="outputCGSTAccount"
              data={settings?.gSTTaxesSettings}
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.outputCGSTAccount
                )
              }
              label={t("output_CGST_account")}
              field={{
                id: "outputCGSTAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "outputCGSTAccount",
                  data.outputCGSTAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("input_IGST_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="inputIGSTAccount"
              data={settings?.gSTTaxesSettings}
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.inputIGSTAccount
                )
              }
              label={t("input_IGST_account")}
              field={{
                id: "inputIGSTAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "inputIGSTAccount",
                  data.inputIGSTAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("output_IGST_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="outputIGSTAccount"
              data={settings?.gSTTaxesSettings}
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.outputIGSTAccount
                )
              }
              label={t("output_IGST_account")}
              field={{
                id: "outputIGSTAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "outputIGSTAccount",
                  data.outputIGSTAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("TCS_paid_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="outputTCSPaidAccount"
              data={settings?.gSTTaxesSettings}
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.outputTCSPaidAccount
                )
              }
              label={t("TCS_paid_account")}
              field={{
                id: "outputTCSPaidAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "outputTCSPaidAccount",
                  data.outputTCSPaidAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("TCS_payable_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="outputTCSPayableAccount"
              data={settings?.gSTTaxesSettings}
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.outputTCSPayableAccount
                )
              }
              label={t("TCS_payable_account")}
              field={{
                id: "outputTCSPayableAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "outputTCSPayableAccount",
                  data.outputTCSPayableAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("input_calamity_cess_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="inputCalamityCessAccount"
              data={settings?.gSTTaxesSettings}
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.inputCalamityCessAccount
                )
              }
              label={t("input_calamity_cess_account")}
              field={{
                id: "inputCalamityCessAccount",
                getListUrl: Urls.data_InputCalamity,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "inputCalamityCessAccount",
                  data.inputCalamityCessAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("output_calamity_cess_account")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPDataCombobox
              id="outputSalesCalamityCessAccount"
              data={settings?.gSTTaxesSettings}
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.outputSalesCalamityCessAccount
                )
              }
              label={t("output_calamity_cess_account")}
              field={{
                id: "outputSalesCalamityCessAccount",
                getListUrl: Urls.data_duties_taxes,
                valueKey: "id",
                labelKey: "name",
              }}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "outputSalesCalamityCessAccount",
                  data.outputSalesCalamityCessAccount
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("consider_sales_price_as_calamity_included")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted: boolean) => (
            <ERPCheckbox
              id="considerSalesPriceasCalamityIncluded"
              checked={
                settings?.gSTTaxesSettings?.considerSalesPriceasCalamityIncluded
              }
              data={settings?.gSTTaxesSettings}
              disabled={
                !hasPermitted &&
                !isNullOrUndefinedOrEmpty(
                  settings?.gSTTaxesSettings?.considerSalesPriceasCalamityIncluded
                )
              }
              label={t("consider_sales_price_as_calamity_included")}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "gSTTaxesSettings",
                  "considerSalesPriceasCalamityIncluded",
                  data.considerSalesPriceasCalamityIncluded
                )
              }
            />
          )}
        </ERPDisableEnable>
      )
    },
    {
      condition: filterComponent([t("enable_karnataka_tax_report_format")], filterText),
      element: (
        <ERPCheckbox
          id="enableKarnatakaTaxReportFormat"
          checked={
            settings?.gSTTaxesSettings?.enableKarnatakaTaxReportFormat
          }
          data={settings?.gSTTaxesSettings}
          label={t("enable_karnataka_tax_report_format")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "gSTTaxesSettings",
              "enableKarnatakaTaxReportFormat",
              data.enableKarnatakaTaxReportFormat
            )
          }
        />
      )
    },
    {
      condition: filterComponent([t("show_prev._forms")], filterText),
      element: (
        <ERPCheckbox
          id="showPrevForms"
          checked={
            settings?.gSTTaxesSettings?.showPrevForms
          }
          data={settings?.gSTTaxesSettings}
          label={t("show_prev._forms")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "gSTTaxesSettings",
              "showPrevForms",
              data.showPrevForms
            )
          }
        />
      )
    },
    {
      condition: filterComponent([t("enable_ewb")], filterText),
      element: (
        <div className="flex items-center gap-4">
          <ERPCheckbox
            id="enableEWB"
            checked={settings?.gSTTaxesSettings?.enableEWB}
            data={settings?.gSTTaxesSettings}
            label={t("enable_ewb")}
            onChangeData={(data: any) =>
              handleFieldChange(
                "gSTTaxesSettings",
                "enableEWB",
                data.enableEWB
              )
            }
          />
          <ERPButton
            title={t("ewb_taxPro")}
            onClick={() => handleShowComponent("ewb")}
            disabled={!settings?.gSTTaxesSettings?.enableEWB}
          />
          <PopupComponent
            isOpen={showEWBPopup}
            onClose={() => setShowEWBPopup(false)}>
            <EWBTaxPro />
          </PopupComponent>
        </div>
      ),
    },
    {
      condition: filterComponent([t("enable_e-invoice")], filterText),
      element: (
        <div className="flex items-center gap-4">
          <ERPCheckbox
            id="enableEInvoiceIndia"
            checked={
              settings?.gSTTaxesSettings?.enableEInvoiceIndia
            }
            data={settings?.gSTTaxesSettings}
            label={t("enable_e-invoice")}
            onChangeData={(data: any) =>
              handleFieldChange(
                "gSTTaxesSettings",
                "enableEInvoiceIndia",
                data.enableEInvoiceIndia
              )
            }
          />
          <ERPButton
            title={t("EInvoiceTaxPro")}
            onClick={() => handleShowComponent("eInvoice")}
            disabled={
              !settings?.gSTTaxesSettings?.enableEInvoiceIndia
            }
          />
          <PopupComponent
            isOpen={showEInvoicePopup}
            onClose={() => setShowEInvoicePopup(false)}>
            <EInvoiceTaxPro />
          </PopupComponent>
        </div>
      ),
    },
    {
      condition: filterComponent([t("invoice_provider_type")], filterText),
      element: (
        <ERPDataCombobox
          field={{
            id: "einvoiceProvider",
            valueKey: "value",
            labelKey: "label",
          }}
          id="einvoiceProvider"
          label={t("e-invoice_provider_type")}
          data={settings?.gSTTaxesSettings}
          onChangeData={(data) => {
            handleFieldChange(
              "gSTTaxesSettings",
              "einvoiceProvider",
              data.einvoiceProvider
            );
          }}
          options={[
            { value: "Clear Tax", label: "Clear Tax" },
            { value: "Tax Pro", label: "Tax Pro" },
          ]}
        />
      ),
    },
    {
      condition: filterComponent([t("clear_tax_token")], filterText),
      element: (
        <ERPInput
          id="eInvoiceAuthToken"
          value={settings?.gSTTaxesSettings?.eInvoiceAuthToken}
          data={settings?.gSTTaxesSettings}
          label={t("clear_tax_token")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "gSTTaxesSettings",
              "eInvoiceAuthToken",
              data.eInvoiceAuthToken
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("clear_tax_id")], filterText),
      element: (
        <ERPInput
          id="eInvoiceOwnerID"
          value={settings?.gSTTaxesSettings?.eInvoiceOwnerID}
          data={settings?.gSTTaxesSettings}
          label={t("clear_tax_id")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "gSTTaxesSettings",
              "eInvoiceOwnerID",
              data.eInvoiceOwnerID
            )
          }
        />
      ),
    },
  ];
  const [hasMatchedItems, setHasMatchedItems] = useState<boolean>(true);
  useEffect(() => {
    const hasMatchingItems = items.some((component) => component.condition);
    setHasMatchedItems(hasMatchingItems);
  }, [filterText])

  return (
    <>
      {items.filter((component) => component.condition == true).length > 0 && (
        <div>
          <div key={key} ref={(el) => (subItemsRef.current["inventoryGSTSettings"] = el)}>
            <h1
              className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "inventoryGSTSettings"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}>
              {t("gst_settings")}
            </h1>
            <div key="inventoryGSTSettings" className="space-y-4">
              <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                <div
                  className={`grid ${isCompactView
                    ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                    : `${gridClass ||
                    "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                    } gap-4 items-center justify-center`
                    }`}>
                  {items?.map(
                    (component: any, index: number) =>
                      component.condition && (
                        <div key={index}>{component.element}</div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default InventoryGSTSettingsFilterableComponents;