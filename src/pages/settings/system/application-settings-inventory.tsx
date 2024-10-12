import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { getAction, postAction } from "../../../redux/slices/app-thunks";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { LedgerType } from "../../../enums/ledger-types";
import { APIClient } from "../../../helpers/api-client";
import ERPToast from "../../../components/ERPComponents/erp-toast";

interface Inventory {
  defaultSalesAcc: number;
  defaultSalesReturnAcc: number;
  defaultPurchaseAcc: number;
  defaultPurchaseReturnAcc: number;
  defaultBillDiscGivenLdg: number;
  defaultBillDiscRecvdLdg: number;
  couponCardAccount: number;
  defaultRoundOffAccount: number;
  defaultAdditionalAmountAccount: number;
  defaultBrand: number;
  showNegStockWarning: string;
  maintainWarehouse: boolean;
  priceCode: string;
  defaultBarcodeLabel: string;
  ifLessSalesRate: string;
  setLastSalesRateAsProctSaleRate: boolean;
  setLastPurchaseRateAsProctRate: boolean;
  setAvgPurchaseCostWithStdPurRate: boolean;
  updatePurchasePriceOnPurchaseTransfer: boolean;
  showCashSalesSeparateMenu: boolean;
  showNonStockItemsInSales: boolean;
  defaultBTOAccount: number;
  defaultBTIAccount: number;
  serviceWarrantyInvAccounts: boolean;
  serviceWarrantyInvLedgerID: number
  serviceNonWarrantyInvAccounts: boolean;
  serviceNONWarrantyInvLedgerID:number;
  defaultServiceSpareWareHouse: number;
  defaultSalesReturnPayableAcc: number;
  redeeemValuesSeperatedByComma: string;
  keepUserActionInDays: number;
  blockBillDiscount: string;
  discontAuthorizationIfDiscountAbove: number;
  setAuthorizationinSales: boolean;
  enableSalesInvoiceDraftOption: boolean;
  setProductCostasPurchasePrice: boolean;
  setProductCostWithVATAmount: boolean;
  blockNonStockSerialSelling: boolean;
  showProductDuplicationMessage: boolean;
  blockHoldItems: boolean;
  printAfterSave: boolean;
  needPoApprovalForPrintout: boolean;
  enableAddStockAdjustment: boolean;
  carryForwardPurchaseOrderQtyToPurchase: boolean;
  useCostForStockTransferToBranch: boolean;
  showAccountReceivableInPurchase: boolean;
  showPrinterSelection: boolean;
  bTOUsingMSP: boolean;
  isReferenceNumberMandatoryInPurchase: boolean;
  showTransitModeStockTransferAlert: boolean;
  showAccountPayableInSales: boolean;
  holdSalesMan: boolean;
  mobileNumberMandatoryInSales: boolean;
}
const api = new APIClient();
const InventorySettingsForm = () => {
  const initialState: Inventory = {
    defaultSalesAcc: 1,
    defaultSalesReturnAcc: 0,
    defaultPurchaseAcc: 0,
    defaultPurchaseReturnAcc: 0,
    defaultBillDiscGivenLdg: 0,
    defaultBillDiscRecvdLdg: 0,
    couponCardAccount: 0,
    defaultRoundOffAccount: 0,
    defaultAdditionalAmountAccount: 0,
    defaultBrand: 0,
    showNegStockWarning: "",
    maintainWarehouse: false,
    priceCode: "",
    defaultBarcodeLabel: "",
    ifLessSalesRate: "",
    setLastSalesRateAsProctSaleRate: false,
    setLastPurchaseRateAsProctRate: false,
    setAvgPurchaseCostWithStdPurRate: false,
    updatePurchasePriceOnPurchaseTransfer: false,
    showCashSalesSeparateMenu: false,
    showNonStockItemsInSales: false,
    defaultBTOAccount: 0,
    defaultBTIAccount: 0,
    serviceWarrantyInvAccounts: false,
    serviceWarrantyInvLedgerID:0,
    serviceNonWarrantyInvAccounts: false,
    serviceNONWarrantyInvLedgerID:0,
    defaultServiceSpareWareHouse: 0,
    defaultSalesReturnPayableAcc: 0,
    redeeemValuesSeperatedByComma: "",
    keepUserActionInDays: 0,
    blockBillDiscount: "",
    discontAuthorizationIfDiscountAbove: 0,
    setAuthorizationinSales: false,
    enableSalesInvoiceDraftOption: false,
    setProductCostasPurchasePrice: false,
    setProductCostWithVATAmount: false,
    blockNonStockSerialSelling: false,
    showProductDuplicationMessage: false,
    blockHoldItems: false,
    printAfterSave: false,
    needPoApprovalForPrintout: false,
    enableAddStockAdjustment: false,
    carryForwardPurchaseOrderQtyToPurchase: false,
    useCostForStockTransferToBranch: false,
    showAccountReceivableInPurchase: false,
    showPrinterSelection: false,
    bTOUsingMSP: false,
    isReferenceNumberMandatoryInPurchase: false,
    showTransitModeStockTransferAlert: false,
    showAccountPayableInSales: false,
    holdSalesMan: false,
    mobileNumberMandatoryInSales: false,
  };

  const dispatch = useAppDispatch();
  const [formState, setFormState] = useState<Inventory>(initialState);
  const [formStatePrev, setFormStatePrev] = useState<Partial<Inventory>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);
  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(
        `${Urls.application_settings}inventory`
      );
      debugger;
      console.log(formState);
      setFormStatePrev(response);
      setFormState(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleFieldChange = (settingName: any, value: any) => {
    debugger;
    setFormState((prevSettings: any) => ({
      ...prevSettings,
      [settingName]: value ?? "",
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        debugger;
      const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
        const currentValue = formState[key as keyof Inventory];
        const prevValue = formStatePrev[key as keyof Inventory];

        if (currentValue !== prevValue) {
          debugger;
          acc.push({
            settingsName: key,
            settingsValue: currentValue.toString(),
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);
      console.log(modifiedSettings);

      const response = (await api.put(Urls.application_settings, {
        type: "inventory",
        updateList: modifiedSettings,
      })) as any;
      handleResponse(response);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="erp-settings-form">
        <div className="form-row grid grid-cols-4 gap-3 my-3">
          <ERPDataCombobox
            id="defaultSalesAcc"
            value={formState?.defaultSalesAcc}
            data={formState}
            field={{
              id: "defaultSalesAcc",
              // required: true,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange("defaultSalesAcc", data.defaultSalesAcc)
            }
            label="Default Sales Account"
          />
          <ERPDataCombobox
            id="defaultBTOAccount"
            value={formState.defaultBTOAccount}
            data={formState}
            field={{
              id: "defaultBTOAccount",
              // required: true,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange("defaultBTOAccount", data.defaultBTOAccount)
            }
            label="Default BTO Account"
          />

          <ERPDataCombobox
            id="defaultSalesReturnAcc"
            value={formState.defaultSalesReturnAcc}
            data={formState}
            field={{
              id: "defaultSalesReturnAcc",
              // required: true,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "defaultSalesReturnAcc",
                data.defaultSalesReturnAcc
              )
            }
            label="Default Sales Return Account"
          />
          <ERPDataCombobox
            id="defaultBTIAccount"
            value={formState.defaultBTIAccount}
            data={formState}
            field={{
              id: "defaultBTIAccount",
              // required: true,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange("defaultBTIAccount", data.defaultBTIAccount)
            }
            label="Default BTI Account"
          />

          <ERPDataCombobox
            id="defaultPurchaseAcc"
            value={formState.defaultPurchaseAcc}
            data={formState}
            field={{
              id: "defaultPurchaseAcc",
              // required: true,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "defaultPurchaseAcc",
                data.defaultPurchaseAcc
              )
            }
            label="Default Purchase Account"
          />
          <ERPDataCombobox
            id="serviceWarrantyInvLedgerID"
            value={formState.serviceWarrantyInvAccounts}
            data={formState}
            field={{
              id: "serviceWarrantyInvLedgerID",
              required: false,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.All}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "serviceWarrantyInvLedgerID",
                data.serviceWarrantyInvLedgerID
              )
            }
            label="Service Warranty Inv Accounts"
          />

          <ERPDataCombobox
            id="defaultPurchaseReturnAcc"
            value={formState.defaultPurchaseReturnAcc}
            data={formState}
            field={{
              id: "defaultPurchaseReturnAcc",
              // required: true,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "defaultPurchaseReturnAcc",
                data.defaultPurchaseReturnAcc
              )
            }
            label="Default Purchase Return Account"
          />
          <ERPDataCombobox
            id="serviceNONWarrantyInvLedgerID"
            value={formState.serviceNonWarrantyInvAccounts}
            data={formState}
            field={{
              id: "serviceNONWarrantyInvLedgerID",
              required: false,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.Customer}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "serviceNONWarrantyInvLedgerID",
                data.serviceWarrantyInvLedgerID
              )
            }
            label="Service Non Warranty Inv Accounts"
          />

          <ERPDataCombobox
            id="defaultBillDiscGivenLdg"
            value={formState.defaultBillDiscGivenLdg}
            data={formState}
            field={{
              id: "defaultBillDiscGivenLdg",
              // required: true,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.Discount_Given}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "defaultBillDiscGivenLdg",
                data.defaultBillDiscGivenLdg
              )
            }
            label="Bill Discount Given Ledger"
          />
          <ERPDataCombobox
            id="defaultServiceSpareWareHouse"
            value={formState.defaultServiceSpareWareHouse}
            data={formState}
            field={{
              id: "defaultServiceSpareWareHouse",
              required: false,
              getListUrl: Urls.data_warehouse,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "defaultServiceSpareWareHouse",
                data.defaultServiceSpareWareHouse
              )
            }
            label="Default Service Spare Warehouse"
          />

          <ERPDataCombobox
            id="defaultBillDiscRecvdLdg"
            value={formState.defaultBillDiscRecvdLdg}
            data={formState}
            field={{
              id: "defaultBillDiscRecvdLdg",
              // required: true,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.Discount_Received}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "defaultBillDiscRecvdLdg",
                data.defaultBillDiscRecvdLdg
              )
            }
            label="Bill Discount Received Ledger"
          />
          <ERPDataCombobox
            id="defaultSalesReturnPayableAcc"
            value={formState.defaultSalesReturnPayableAcc}
            data={formState}
            field={{
              id: "defaultSalesReturnPayableAcc",
              required: false,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.Customer}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "defaultSalesReturnPayableAcc",
                data.defaultSalesReturnPayableAcc 
              )
            }
            label="Default Sales Return Payable Acc:"
          />
          <ERPDataCombobox
            id="couponCardAccount"
            value={formState.couponCardAccount}
            data={formState}
            field={{
              id: "couponCardAccount",
              required: false,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.All}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange("couponCardAccount", data.couponCardAccount)
            }
            label="Coupon Card Account"
          />
          <ERPInput
            id="redeeemValuesSeperatedByComma"
            value={formState.redeeemValuesSeperatedByComma}
            data={formState}
            label="Redeem Points (Separated by comma)"
            placeholder="Enter redeem points"
            onChangeData={(data: any) =>
              handleFieldChange("redeeemValuesSeperatedByComma", data.redeeemValuesSeperatedByComma)
            }
          />
          <ERPDataCombobox
            id="defaultRoundOffAccount"
            value={formState.defaultRoundOffAccount}
            data={formState}
            field={{
              id: "defaultRoundOffAccount",
              required: false,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.Indirect_Expenses}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "defaultRoundOffAccount",
                data.defaultRoundOffAccount
              )
            }
            label="Default Round off Account"
          />
          <ERPInput
            id="keepUserActionInDays"
            value={formState.keepUserActionInDays}
            data={formState}
            label="Keep User Actions (in Days)"
            placeholder="Enter number of days"
            type="number"
            onChangeData={(data: any) =>
              handleFieldChange(
                "keepUserActionInDays",
                parseInt(data.keepUserActionInDays, 10)
              )
            }
          />
          <ERPDataCombobox
            id="defaultAdditionalAmountAccount"
            value={formState.defaultAdditionalAmountAccount}
            data={formState}
            field={{
              id: "defaultAdditionalAmountAccount",
              required: false,
              getListUrl: Urls.data_acc_ledgers,
              params: `ledgerID=0&ledgerType=${LedgerType.All}`,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange(
                "defaultAdditionalAmountAccount",
                data.defaultAdditionalAmountAccount
              )
            }
            label="Default Additional Amount Account"
          />
          <ERPDataCombobox
            id="blockBillDiscount"
            value={formState.blockBillDiscount}
            field={{
              id: "blockBillDiscount",
              valueKey: "value",
              labelKey: "label",
            }}
            data={formState}
            options={[
              { value: "No", label: "No" },
              { value: "On POS", label: "On POS" },
              { value: "On Standard Sales", label: "On Standard Sales" },
              { value: "On Both", label: "On Both" },
              {
                value: "If Authentication Fails",
                label: "If Authentication Fails",
              },
            ]}
            onChangeData={(data: any) =>
              handleFieldChange("blockBillDiscount", data.blockBillDiscount)
            }
            label="Block Bill Discount"
          />
          <ERPDataCombobox
            id="defaultBrand"
            value={formState.defaultBrand}
            data={formState}
            field={{
              id: "defaultBrand",
              required: false,
              getListUrl: Urls.data_brands,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange("defaultBrand", data.defaultBrand)
            }
            label="Default Brand"
          />
          <ERPInput
            id="discontAuthorizationIfDiscountAbove"
            value={formState.discontAuthorizationIfDiscountAbove}
            data={formState}
            label="Discount Authorization if Discount above"
            placeholder="Enter discount threshold"
            type="number"
            onChangeData={(data: any) =>
              handleFieldChange(
                "discontAuthorizationIfDiscountAbove",
                parseFloat(data.discontAuthorizationIfDiscountAbove)
              )
            }
          />

          <ERPDataCombobox
            id="showNegStockWarning"
            value={formState.showNegStockWarning}
            field={{
              id: "showNegStockWarning",
              valueKey: "value",
              labelKey: "label",
            }}
            data={formState}
            options={[
              { value: "Block", label: "Block" },
              { value: "Warn", label: "Warn" },
              { value: "Ignore", label: "Ignore" },
            ]}
            onChangeData={(data: any) =>
              handleFieldChange("showNegStockWarning", data.showNegStockWarning)
            }
            label="Negative Stock"
          />

          <ERPCheckbox
            id="maintainWarehouse"
            checked={formState.maintainWarehouse}
            data={formState}
            label="Maintain Warehouse"
            onChangeData={(data: any) =>
              handleFieldChange("maintainWarehouse", data.maintainWarehouse)
            }
          />
          <ERPCheckbox
            id="setAuthorizationinSales"
            checked={formState.setAuthorizationinSales}
            data={formState}
            label="Set Authorization in Sales"
            onChangeData={(data: any) =>
              handleFieldChange(
                "setAuthorizationinSales",
                data.setAuthorizationinSales
              )
            }
          />
          <ERPCheckbox
            id="carryForwardPurchaseOrderQtyToPurchase"
            checked={formState.carryForwardPurchaseOrderQtyToPurchase}
            data={formState}
            label="Carry Forward Purchase Order Qty To Purchase"
            onChangeData={(data: any) =>
              handleFieldChange(
                "carryForwardPurchaseOrderQtyToPurchase",
                data.carryForwardPurchaseOrderQtyToPurchase
              )
            }
          />

          <ERPInput
            id="priceCode"
            value={formState.priceCode}
            data={formState}
            label="Price Code"
            placeholder="Enter the Price Code"
            type="Password"
            onChangeData={(data: any) =>
              handleFieldChange("priceCode", parseFloat(data.priceCode))
            }
          />
          <ERPCheckbox
            id="enableSalesInvoiceDraftOption"
            checked={formState.enableSalesInvoiceDraftOption}
            data={formState}
            label="Enable Sales Invoice Draft Option"
            onChangeData={(data: any) =>
              handleFieldChange(
                "enableSalesInvoiceDraftOption",
                data.enableSalesInvoiceDraftOption
              )
            }
          />
          <ERPCheckbox
            id="useCostForStockTransferToBranch"
            checked={formState.useCostForStockTransferToBranch}
            data={formState}
            label="Use Cost For Stock Transfer To Branch"
            onChangeData={(data: any) =>
              handleFieldChange(
                "useCostForStockTransferToBranch",
                data.useCostForStockTransferToBranch
              )
            }
          />

          <ERPDataCombobox
            id="defaultBarcodeLabel"
            value={formState.defaultBarcodeLabel}
            data={formState}
            field={{
              id: "defaultBarcodeLabel",
              required: false,
              getListUrl: Urls.data_countries,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange("defaultBarcodeLabel", data.defaultBarcodeLabel)
            }
            label="Barcode Label"
          />
          <ERPCheckbox
            id="setProductCostasPurchasePrice"
            checked={formState.setProductCostasPurchasePrice}
            data={formState}
            label="Set Product Cost as Declaration Price"
            onChangeData={(data: any) =>
              handleFieldChange(
                "setProductCostasPurchasePrice",
                data.setProductCostasPurchasePrice
              )
            }
          />
          <ERPCheckbox
            id="showAccountReceivableInPurchase"
            checked={formState.showAccountReceivableInPurchase}
            data={formState}
            label="Show Account Receivable In Purchase"
            onChangeData={(data: any) =>
              handleFieldChange(
                "showAccountReceivableInPurchase",
                data.showAccountReceivableInPurchase
              )
            }
          />

          <ERPDataCombobox
            id="ifLessSalesRate"
            value={formState.ifLessSalesRate}
            data={formState}
            field={{
              id: "ifLessSalesRate",
              required: false,
              getListUrl: Urls.data_languages,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) =>
              handleFieldChange("ifLessSalesRate", data.ifLessSalesRate)
            }
            label="If Less Sales Rate"
          />
          <ERPCheckbox
            id="setProductCostWithVATAmount"
            checked={formState.setProductCostWithVATAmount}
            data={formState}
            label="Set Product Cost With TAX Amount"
            onChangeData={(data: any) =>
              handleFieldChange(
                "setProductCostWithVATAmount",
                data.setProductCostWithVATAmount
              )
            }
          />
          <ERPCheckbox
            id="showPrinterSelection"
            checked={formState.showPrinterSelection}
            data={formState}
            label="Show Printer Selection"
            onChangeData={(data: any) =>
              handleFieldChange(
                "showPrinterSelection",
                data.showPrinterSelection
              )
            }
          />

          <ERPCheckbox
            id="setLastSalesRateAsProctSaleRate"
            checked={formState.setLastSalesRateAsProctSaleRate}
            data={formState}
            label="Set Last Sales Rate As Product Sales Rate"
            onChangeData={(data: any) =>
              handleFieldChange(
                "setLastSalesRateAsProctSaleRate",
                data.setLastSalesRateAsProctSaleRate
              )
            }
          />
          <ERPCheckbox
            id="blockNonStockSerialSelling"
            checked={formState.blockNonStockSerialSelling}
            data={formState}
            label="Block Non Stock Serial Selling"
            onChangeData={(data: any) =>
              handleFieldChange(
                "blockNonStockSerialSelling",
                data.blockNonStockSerialSelling
              )
            }
          />
          <ERPCheckbox
            id="bTOUsingMSP"
            checked={formState.bTOUsingMSP}
            data={formState}
            label="BTO Using MSP"
            onChangeData={(data: any) =>
              handleFieldChange("bTOUsingMSP", data.bTOUsingMSP)
            }
          />

          <ERPCheckbox
            id="setLastPurchaseRateAsProctRate"
            checked={formState.setLastPurchaseRateAsProctRate}
            data={formState}
            label="Set Last Purchase Rate As Product Purchase Rate"
            onChangeData={(data: any) =>
              handleFieldChange(
                "setLastPurchaseRateAsProctRate",
                data.setLastPurchaseRateAsProctRate
              )
            }
          />
          <ERPCheckbox
            id="showProductDuplicationMessage"
            checked={formState.showProductDuplicationMessage}
            data={formState}
            label="Show Product Duplication Message"
            onChangeData={(data: any) =>
              handleFieldChange(
                "showProductDuplicationMessage",
                data.showProductDuplicationMessage
              )
            }
          />
          <ERPCheckbox
            id="isReferenceNumberMandatoryInPurchase"
            checked={formState.isReferenceNumberMandatoryInPurchase}
            data={formState}
            label="Is Reference Number Mandatory In Purchase"
            onChangeData={(data: any) =>
              handleFieldChange(
                "isReferenceNumberMandatoryInPurchase",
                data.isReferenceNumberMandatoryInPurchase
              )
            }
          />

          <ERPCheckbox
            id="setAvgPurchaseCostWithStdPurRate"
            checked={formState.setAvgPurchaseCostWithStdPurRate}
            data={formState}
            label="Set Avg. Purchase Cost with Last Purchase Rate"
            onChangeData={(data: any) =>
              handleFieldChange(
                "setAvgPurchaseCostWithStdPurRate",
                data.setAvgPurchaseCostWithStdPurRate
              )
            }
          />
          <ERPCheckbox
            id="blockHoldItems"
            checked={formState.blockHoldItems}
            data={formState}
            label="Block Hold Items"
            onChangeData={(data: any) =>
              handleFieldChange("blockHoldItems", data.blockHoldItems)
            }
          />
          <ERPCheckbox
            id="showTransitModeStockTransferAlert"
            checked={formState.showTransitModeStockTransferAlert}
            data={formState}
            label="Show Transit Mode Stock Transfer Alert"
            onChangeData={(data: any) =>
              handleFieldChange(
                "showTransitModeStockTransferAlert",
                data.showTransitModeStockTransferAlert
              )
            }
          />

          <ERPCheckbox
            id="updatePurchasePriceOnPurchaseTransfer"
            checked={formState.updatePurchasePriceOnPurchaseTransfer}
            data={formState}
            label="Update Purchase Price On Purchase Transfer"
            onChangeData={(data: any) =>
              handleFieldChange(
                "updatePurchasePriceOnPurchaseTransfer",
                data.updatePurchasePriceOnPurchaseTransfer
              )
            }
          />
          <ERPCheckbox
            id="printAfterSave"
            checked={formState.printAfterSave}
            data={formState}
            label="Print After Save"
            onChangeData={(data: any) =>
              handleFieldChange("printAfterSave", data.printAfterSave)
            }
          />
          <ERPCheckbox
            id="showAccountPayableInSales"
            checked={formState.showAccountPayableInSales}
            data={formState}
            label="Show Account Payable In Sales"
            onChangeData={(data: any) =>
              handleFieldChange(
                "showAccountPayableInSales",
                data.showAccountPayableInSales
              )
            }
          />

          <ERPCheckbox
            id="showCashSalesSeparateMenu"
            checked={formState.showCashSalesSeparateMenu}
            data={formState}
            label="Show Cash Sales Separate Menu"
            onChangeData={(data: any) =>
              handleFieldChange(
                "showCashSalesSeparateMenu",
                data.showCashSalesSeparateMenu
              )
            }
          />
          <ERPCheckbox
            id="needPoApprovalForPrintout"
            checked={formState.needPoApprovalForPrintout}
            data={formState}
            label="Need PO Approval For Printout"
            onChangeData={(data: any) =>
              handleFieldChange(
                "needPoApprovalForPrintout",
                data.needPoApprovalForPrintout
              )
            }
          />
          <ERPCheckbox
            id="holdSalesMan"
            checked={formState.holdSalesMan}
            data={formState}
            label="Hold Sales Man"
            onChangeData={(data: any) =>
              handleFieldChange("holdSalesMan", data.holdSalesMan)
            }
          />

          <ERPCheckbox
            id="showNonStockItemsInSales"
            checked={formState.showNonStockItemsInSales}
            data={formState}
            label="Show Non Stock Items in Sales"
            onChangeData={(data: any) =>
              handleFieldChange(
                "showNonStockItemsInSales",
                data.showNonStockItemsInSales
              )
            }
          />
          <ERPCheckbox
            id="enableAddStockAdjustment"
            checked={formState.enableAddStockAdjustment}
            data={formState}
            label="Enable Add Stock Adjustment"
            onChangeData={(data: any) =>
              handleFieldChange(
                "enableAddStockAdjustment",
                data.enableAddStockAdjustment
              )
            }
          />
          <ERPCheckbox
            id="mobileNumberMandatoryInSales"
            checked={formState.mobileNumberMandatoryInSales}
            data={formState}
            label="Mobile Number Mandatory in Sales"
            onChangeData={(data: any) =>
              handleFieldChange(
                "mobileNumberMandatoryInSales",
                data.mobileNumberMandatoryInSales
              )
            }
          />
        </div>
        <div className="flex justify-end">
          <ERPButton title="Save Settings" variant="primary" type="submit" />
        </div>
      </div>
    </form>
  );
};

export default InventorySettingsForm;
