import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
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
import { t } from "i18next";
import { RootState } from "../../../redux/store";
import { Countries } from "../../../redux/slices/user-session/reducer";

interface Inventory {
  defaultSalesAcc: number;
  defaultSalesReturnAcc: number;
  defaultPurchaseAcc: number;
  defaultWareHouse: number;
  defaultPurchaseReturnAcc: number;
  defaultBillDiscGivenLdg: number;
  defaultBillDiscRecvdLdg: number;
  defaultCouponSalesAccount: number;
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
  updatePurhasePriceUpdateOnPurchaseBT: boolean;
  showCashSalesSeperateMenu: boolean;
  showNonStockItemsinSales: boolean;
  defaultBTOAccount: number;
  defaultBTIAccount: number;
  serviceWarrantyInvAccounts: boolean;
  serviceWarrantyInvLedgerID: number;
  serviceNonWarrantyInvAccounts: boolean;
  serviceNONWarrantyInvLedgerID: number;
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
  printInvAfterSave: boolean;
  needPOApprovalForPrintout: boolean;
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
  mobileNumberMandotryInSales: boolean;
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
    defaultCouponSalesAccount: 0,
    defaultRoundOffAccount: 0,
    defaultAdditionalAmountAccount: 0,
    defaultBrand: 0,
    showNegStockWarning: "",
    defaultWareHouse: 0,
    maintainWarehouse: false,
    priceCode: "",
    defaultBarcodeLabel: "",
    ifLessSalesRate: "",
    setLastSalesRateAsProctSaleRate: false,
    setLastPurchaseRateAsProctRate: false,
    setAvgPurchaseCostWithStdPurRate: false,
    updatePurhasePriceUpdateOnPurchaseBT: false,
    showCashSalesSeperateMenu: false,
    showNonStockItemsinSales: false,
    defaultBTOAccount: 0,
    defaultBTIAccount: 0,
    serviceWarrantyInvAccounts: false,
    serviceWarrantyInvLedgerID: 0,
    serviceNonWarrantyInvAccounts: false,
    serviceNONWarrantyInvLedgerID: 0,
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
    printInvAfterSave: false,
    needPOApprovalForPrintout: false,
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
    mobileNumberMandotryInSales: false,
  };

  const dispatch = useAppDispatch();
  const [formState, setFormState] = useState<Inventory>(initialState);
  const [formStatePrev, setFormStatePrev] = useState<Partial<Inventory>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const userSession = useAppSelector((state: RootState) => state.UserSession);

  useEffect(() => {
    loadSettings();
  }, []);
  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(
        `${Urls.application_settings}inventory`
      );

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

    setFormState((prevSettings: any) => ({
      ...prevSettings,
      [settingName]: value ?? "",
    }));
  };
  const handleSubmit = async () => {
    setIsSaving(true);
    try {

      const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
        const currentValue = formState[key as keyof Inventory];
        const prevValue = formStatePrev[key as keyof Inventory];

        if (currentValue !== prevValue) {

          acc.push({
            settingsName: key,
            settingsValue: (currentValue??"").toString(),
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="h-screen max-h-dvh flex flex-col overflow-hidden">
      <form className="space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ">
        <div className="erp-settings-form p-6 mb-16">
          <div className="flex flex-col justify-start items-stretch">
            <div className="flex flex-col gap-3 border rounded-lg p-4 mb-3 xxl:mb-6">
              <div
                className="grid grid-cols-1 
                  sm:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 justify-items-stretch gap-6"
              >
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
                  label={t("default_sales_account")}
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
                  label={t("default_sales_return_account")}
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
                  label={t("default_purchase_account")}
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
                  label={t("default_purchase_return_account")}
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
                  label={t("bill_discount_given_ledger")}
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
                  label={t("bill_discount_received_ledger")}
                />

                <ERPDataCombobox
                  id="defaultCouponSalesAccount"
                  value={formState.defaultCouponSalesAccount}
                  data={formState}
                  field={{
                    id: "defaultCouponSalesAccount",
                    required: false,
                    getListUrl: Urls.data_acc_ledgers,
                    params: `ledgerID=0&ledgerType=${LedgerType.All}`,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) =>
                    handleFieldChange(
                      "defaultCouponSalesAccount",
                      data.defaultCouponSalesAccount
                    )
                  }
                  label={t("coupon_card_account")}
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
                  label={t("default_round_off_account")}
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
                  label={t("default_additional_amount_account")}
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
                    handleFieldChange(
                      "defaultBTOAccount",
                      data.defaultBTOAccount
                    )
                  }
                  label={t("default_BTO_account")}
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
                    handleFieldChange(
                      "defaultBTIAccount",
                      data.defaultBTIAccount
                    )
                  }
                  label={t("default_BTI_account")}
                />
                <ERPDataCombobox
                  id="defaultSalesReturnPayableAcc"
                  disabled
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
                  label={t("default_sales_return_payable_acc")}
                />
              </div>
              <div className="flex justify-start gap-6 ">
                <div className="flex gap-1">
                  <ERPCheckbox
                    id="serviceWarrantyInvAccounts"
                    checked={formState.serviceWarrantyInvAccounts}
                    data={formState}
                    label={t("service_warranty_inv_accounts")}
                    onChangeData={(data: any) =>
                      handleFieldChange(
                        "serviceWarrantyInvAccounts",
                        data.serviceWarrantyInvAccounts
                      )
                    }
                  />
                  <ERPDataCombobox
                    id="serviceWarrantyInvLedgerID"
                    value={formState.serviceWarrantyInvLedgerID}
                    disabled={formState.serviceWarrantyInvAccounts !== true}
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
                    label={t("service_warranty_inv_accounts_info")}
                    noLabel={true}
                  />
                </div>
                <div className="flex gap-1 ">
                  <ERPCheckbox
                    id="serviceNonWarrantyInvAccounts"
                    checked={formState.serviceNonWarrantyInvAccounts}
                    data={formState}
                    // noLabel={true}
                    label={t("service_non_warranty_inv_accounts")}
                    onChangeData={(data: any) =>
                      handleFieldChange(
                        "serviceNonWarrantyInvAccounts",
                        data.serviceNonWarrantyInvAccounts
                      )
                    }
                  />
                  <ERPDataCombobox
                    id="serviceNONWarrantyInvLedgerID"
                    disabled={
                      formState.serviceNonWarrantyInvAccounts !== true
                    }
                    value={formState.serviceNONWarrantyInvLedgerID}
                    data={formState}
                    field={{
                      id: "serviceNONWarrantyInvLedgerID",
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
                    label={t("service_non_warranty_inv_accounts_info")}
                    noLabel={true}
                  />
                </div>
              </div>
            </div>

            <div
              className="grid grid-cols-1 border rounded-lg
            sm:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-6 mb-3 xxl:mb-6 p-4"
            >
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
                label={t("default_brand")}
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
                  handleFieldChange(
                    "showNegStockWarning",
                    data.showNegStockWarning
                  )
                }
                label={t("negative_stock")}
              />
              <ERPCheckbox
                id="maintainWarehouse"
                checked={formState.maintainWarehouse}
                data={formState}
                label={t("maintain_warehouse")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "maintainWarehouse",
                    data.maintainWarehouse
                  )
                }
              />
              <ERPDataCombobox
                id="defaultWareHouse"
                disabled={formState.maintainWarehouse !== true}
                value={formState.defaultWareHouse}
                field={{
                  id: "defaultWareHouse",
                  getListUrl: Urls.data_warehouse,
                  valueKey: "id",
                  labelKey: "name",
                }}
                data={formState}
                onChangeData={(data: any) =>
                  handleFieldChange("defaultWareHouse", data.defaultWareHouse)
                }
                label=" "
              />
              <ERPInput
                id="priceCode"
                value={formState.priceCode}
                data={formState}
                label={t("price_code")}
                placeholder={t("enter_the_price_code")}
                type="Password"
                onChangeData={(data: any) =>
                  handleFieldChange("priceCode", data.priceCode)
                }
              />
              <ERPDataCombobox
                id="defaultBarcodeLabel"
                value={formState.defaultBarcodeLabel}
                data={formState}
                field={{
                  id: "defaultBarcodeLabel",
                  required: false,
                  valueKey: "id",
                  labelKey: "label",
                }} 
                options={[
                  { value: "Default.lba", label: "Default.lba" }
                ]}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "defaultBarcodeLabel",
                    data.defaultBarcodeLabel
                  )
                }
                label={t("barcode_label")}
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
                options={[
                  { value: "Warn", label: "Warn" },
                  { value: "Block", label: "Block" },                  
                  { value: "Ignore", label: "Ignore" }
                ]}
                onChangeData={(data: any) =>
                  handleFieldChange("ifLessSalesRate", data.ifLessSalesRate)
                }
                label={t("if_less_sales_rate")}
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
                label={t("default_service_spare_warehouse")}
              />
              <ERPInput
                id="redeeemValuesSeperatedByComma"
                value={formState.redeeemValuesSeperatedByComma}
                data={formState}
                label={t("redeem_points_(separated_by_comma)")}
                placeholder={t("enter_redeem_points")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "redeeemValuesSeperatedByComma",
                    data.redeeemValuesSeperatedByComma
                  )
                }
              />
              <ERPInput
                id="keepUserActionInDays"
                value={formState.keepUserActionInDays}
                data={formState}
                label={t("keep_user_actions_(in_days)")}
                placeholder={t("enter_number_of_days")}
                type="number"
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "keepUserActionInDays",
                    parseInt(data.keepUserActionInDays, 10)
                  )
                }
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
                  handleFieldChange(
                    "blockBillDiscount",
                    data.blockBillDiscount
                  )
                }
                label={t("block_bill_discount")}
              />

              <ERPInput
                id="discontAuthorizationIfDiscountAbove"
                value={formState.discontAuthorizationIfDiscountAbove}
                data={formState}
                label={t("discount_authorization_if_discount_above")}
                placeholder={t("enter_discount_threshold")}
                type="number"
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "discontAuthorizationIfDiscountAbove",
                    parseFloat(data.discontAuthorizationIfDiscountAbove)
                  )
                }
              />
            </div>

            <div className="grid grid-cols-1 border rounded-lg  sm:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-3 gap-6 mb-3 xxl:mb-6 p-4 !mb-[4rem]"  >
              <ERPCheckbox
                id="setAuthorizationinSales"
                checked={formState.setAuthorizationinSales}
                data={formState}
                label={t("set_authorization_in_sales")}
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
                label={t("carry_forward_purchase")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "carryForwardPurchaseOrderQtyToPurchase",
                    data.carryForwardPurchaseOrderQtyToPurchase
                  )
                }
              />
              {userSession.countryId != Countries.India &&
                <ERPCheckbox
                  id="enableSalesInvoiceDraftOption"
                  checked={formState.enableSalesInvoiceDraftOption}
                  data={formState}
                  label={t("enable_sales_invoice_draft_option")}
                  onChangeData={(data: any) =>
                    handleFieldChange(
                      "enableSalesInvoiceDraftOption",
                      data.enableSalesInvoiceDraftOption
                    )
                  }
                />
              }
              <ERPCheckbox
                id="useCostForStockTransferToBranch"
                checked={formState.useCostForStockTransferToBranch}
                data={formState}
                label={t("use_cost_for_stock_transfer_to_branch")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "useCostForStockTransferToBranch",
                    data.useCostForStockTransferToBranch
                  )
                }
              />
              <ERPCheckbox
                id="setProductCostasPurchasePrice"
                checked={formState.setProductCostasPurchasePrice}
                data={formState}
                label={t("set_product_cost_as_purchase_price")}
                onChangeData={(data: any) => {
                  handleFieldChange(
                    "setProductCostasPurchasePrice",
                    data.setProductCostasPurchasePrice
                  );
                }}
              />

              <ERPCheckbox
                id="showAccountReceivableInPurchase"
                checked={formState.showAccountReceivableInPurchase}
                data={formState}
                label={t("show_account_receivable_in_purchase")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "showAccountReceivableInPurchase",
                    data.showAccountReceivableInPurchase
                  )
                }
              />

              <ERPCheckbox
                id="setProductCostWithVATAmount"
                checked={formState.setProductCostWithVATAmount}
                data={formState}
                label={t("set_product_cost_with_TAX_amount")}
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
                label={t("show_printer_selection")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "showPrinterSelection",
                    data.showPrinterSelection
                  )
                }
              />

              {/* <ERPCheckbox
                id="setLastSalesRateAsProctSaleRate"
                checked={formState.setLastSalesRateAsProctSaleRate}
                data={formState}
                label={t("set_last_sales_rate_as_product_sales_rate")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "setLastSalesRateAsProctSaleRate",
                    data.setLastSalesRateAsProctSaleRate
                  )
                }
              /> */}
              <ERPCheckbox
                id="blockNonStockSerialSelling"
                checked={formState.blockNonStockSerialSelling}
                data={formState}
                label={t("block_non_stock_serial_selling")}
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
                label={t("BTO_using_MSP")}
                onChangeData={(data: any) =>
                  handleFieldChange("bTOUsingMSP", data.bTOUsingMSP)
                }
              />

              <ERPCheckbox
                id="setLastPurchaseRateAsProctRate"
                checked={formState.setLastPurchaseRateAsProctRate}
                data={formState}
                label={t("set_last_purchase")}
                onChangeData={(data: any) => {
                  // Update the first checkbox
                  const newValue = data.setLastPurchaseRateAsProctRate;

                  // If user unchecks `setLastPurchaseRateAsProctRate` and both are true, uncheck the other one
                  if (!newValue && formState.setProductCostasPurchasePrice) {
                    handleFieldChange("setProductCostasPurchasePrice", false);
                  }

                  handleFieldChange(
                    "setLastPurchaseRateAsProctRate",
                    newValue
                  );
                }}
              />
              <ERPCheckbox
                id="showProductDuplicationMessage"
                checked={formState.showProductDuplicationMessage}
                data={formState}
                label={t("show_product_duplication_message")}
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
                label={t("is_reference_number")}
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
                label={t("set_avg_purchase")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "setAvgPurchaseCostWithStdPurRate",
                    data.setAvgPurchaseCostWithStdPurRate
                  )
                }
              />
              {userSession.countryId != Countries.India &&
                <ERPCheckbox
                  id="blockHoldItems"
                  checked={formState.blockHoldItems}
                  data={formState}
                  label={t("block_hold_items")}
                  onChangeData={(data: any) =>
                    handleFieldChange("blockHoldItems", data.blockHoldItems)
                  }
                />
              }
              <ERPCheckbox
                id="showTransitModeStockTransferAlert"
                checked={formState.showTransitModeStockTransferAlert}
                data={formState}
                label={t("show_transit_mode")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "showTransitModeStockTransferAlert",
                    data.showTransitModeStockTransferAlert
                  )
                }
              />

              <ERPCheckbox
                id="updatePurhasePriceUpdateOnPurchaseBT"
                checked={formState.updatePurhasePriceUpdateOnPurchaseBT}
                data={formState}
                label={t("update_purchase_price")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "updatePurhasePriceUpdateOnPurchaseBT",
                    data.updatePurhasePriceUpdateOnPurchaseBT
                  )
                }
              />
              <ERPCheckbox
                id="printInvAfterSave"
                checked={formState.printInvAfterSave}
                data={formState}
                label={t("print_after_save")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "printInvAfterSave",
                    data.printInvAfterSave
                  )
                }
              />
              <ERPCheckbox
                id="showAccountPayableInSales"
                checked={formState.showAccountPayableInSales}
                data={formState}
                label={t("show_account_payable_in_sales")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "showAccountPayableInSales",
                    data.showAccountPayableInSales
                  )
                }
              />
              {userSession.countryId != Countries.India &&
                <ERPCheckbox
                  id="showCashSalesSeperateMenu"
                  checked={formState.showCashSalesSeperateMenu}
                  data={formState}
                  label={t("show_cash_sales_separate_menu")}
                  onChangeData={(data: any) =>
                    handleFieldChange(
                      "showCashSalesSeperateMenu",
                      data.showCashSalesSeperateMenu
                    )
                  }
                />
              }
              <ERPCheckbox
                id="needPOApprovalForPrintout"
                checked={formState.needPOApprovalForPrintout}
                data={formState}
                label={t("need_PO_approval_for_printout")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "needPOApprovalForPrintout",
                    data.needPOApprovalForPrintout
                  )
                }
              />
              <ERPCheckbox
                id="holdSalesMan"
                checked={formState.holdSalesMan}
                data={formState}
                label={t("hold_sales_man")}
                onChangeData={(data: any) =>
                  handleFieldChange("holdSalesMan", data.holdSalesMan)
                }
              />

              <ERPCheckbox
                id="showNonStockItemsinSales"
                checked={formState.showNonStockItemsinSales}
                data={formState}
                label={t("show_non_stock_items_in_sales")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "showNonStockItemsinSales",
                    data.showNonStockItemsinSales
                  )
                }
              />
              {userSession.countryId == Countries.India &&
                <ERPCheckbox
                  id="enableAddStockAdjustment"
                  checked={formState.enableAddStockAdjustment}
                  data={formState}
                  label={t("enable_add_stock_adjustment")}
                  onChangeData={(data: any) =>
                    handleFieldChange(
                      "enableAddStockAdjustment",
                      data.enableAddStockAdjustment
                    )
                  }
                />
              }
              <ERPCheckbox
                id="mobileNumberMandotryInSales"
                checked={formState.mobileNumberMandotryInSales}
                data={formState}
                label={t("mobile_number_mandatory_in_sales")}
                onChangeData={(data: any) =>
                  handleFieldChange(
                    "mobileNumberMandotryInSales",
                    data.mobileNumberMandotryInSales
                  )
                }
              />
            </div>
          </div>
          {/* <div className="flex justify-end">
          <ERPButton
            title={t("save_settings")}
            variant="primary"
            type="submit"
            disabled={isSaving}
            loading={isSaving}
          />
        </div> */}
        </div>
      </form>
      <div className="flex justify-end items-center py-1 px-8 fixed bottom-0 right-0 bg-[#fafafa] w-full shadow-[0_0.2rem_0.4rem_rgba(0,0,0,0.5)]">
        <ERPButton
          title={t("save_settings")}
          variant="primary"
          type="button"
          onClick={handleSubmit}
          loading={isSaving}
          disabled={isSaving}
        />
      </div>
    </div>

  );
};

export default InventorySettingsForm;
