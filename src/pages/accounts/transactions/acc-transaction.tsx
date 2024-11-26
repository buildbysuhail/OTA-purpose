import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from "@mui/material"
import { useCallback } from "react"
import ERPDateInput from "../../../components/ERPComponents/erp-date-input"
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons"
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox"
import ERPInput from "../../../components/ERPComponents/erp-input"
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox"
import ERPButton from "../../../components/ERPComponents/erp-button"
import Urls from "../../../redux/urls"
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid"
import { useParams } from 'react-router-dom'
import { AccTransactionData, AccTransactionFormState, AccTransactionProps } from "./acc-transaction-types"
import { FormField } from "../../../utilities/form-types"
import { getFieldPropsGlobal, handleFieldChangeGlobal } from "../../../utilities/form-utils"
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions"
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch"
import { useTranslation } from "react-i18next"
import { RootState } from "../../../redux/store"
import { accFormStateHandleFieldChange, accFormStateRowHandleFieldChange, accFormStateTransactionDetailsRowAdd, accFormStateTransactionMasterHandleFieldChange } from "./reducer"
import { hasValue, isNullOrUndefinedOrEmpty } from "../../../utilities/Utils"
import { useDispatch } from "react-redux"
import ERPModal from "../../../components/ERPComponents/erp-modal"
import BillwiswPopup from "./billwise-popup"
import { Field } from "@headlessui/react"
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert"

interface FormElementState {
  visible: boolean;
  disabled: boolean;
  label: string;
}
const initialFormElements = {
  foreignCurrency: { visible: true, disabled: false, label: 'Foreign Currency' },
  voucherPrefix: { visible: true, disabled: false, label: 'Prefix' },
  voucherNumber: { visible: true, disabled: false, label: 'Voucher Number' },
  transactionDate: { visible: true, disabled: false, label: 'Transaction Date' },
  referenceNumber: { visible: true, disabled: false, label: 'Reference Number' },
  referenceDate: { visible: true, disabled: false, label: 'Reference Date' },
  masterAccount: { visible: true, disabled: false, label: 'Default Account' },
  jvDrCr: { visible: false, disabled: false, label: 'Dr/Cr' },
  employee: { visible: true, disabled: false, label: 'Employee' },
  remarks: { visible: true, disabled: false, label: 'Remarks' },
  commonNarration: { visible: true, disabled: false, label: 'Notes' },
  ledgerCode: { visible: true, disabled: false, label: 'Ledger Code' },
  ledgerId: { visible: true, disabled: false, label: 'Ledger' },
  amount: { visible: true, disabled: false, label: 'Amount' },
  drCr: { visible: false, disabled: false, label: 'Amount' },
  narration: { visible: true, disabled: false, label: 'Narration' },
  currencyID: { visible: true, disabled: false, label: 'Currency' },
  exchangeRate: { visible: true, disabled: false, label: 'Exchange Rate' },
  hasDiscount: { visible: true, disabled: false, label: 'Has Discount' },
  discount: { visible: true, disabled: false, label: 'Discount' },
  chequeNumber: { visible: true, disabled: false, label: 'Cheque Number' },
  bankDate: { visible: false, disabled: false, label: 'Bank Date' },
  nameOnCheque: { visible: true, disabled: false, label: 'Name on Cheque' },
  bankName: { visible: true, disabled: false, label: 'Bank Name' },
  projectId: { visible: false, disabled: false, label: 'Project' },
  costCentreId: { visible: false, disabled: false, label: 'Cost Centre' },
  lblGroupName: { visible: true, disabled: false, label: 'Group Name' },
  printOnSave: { visible: true, disabled: false, label: 'Print on Save' },
  printPreview: { visible: true, disabled: false, label: 'Print Preview' },
  printCheque: { visible: true, disabled: false, label: 'Print Cheque' },
  keepNarration: { visible: false, disabled: false, label: 'Keep Narration' },
  btnBillWise: { visible: true, disabled: false, label: 'Bill Wise' },
  btnAdd: { visible: true, disabled: false, label: 'Add' },
  btnEdit: { visible: true, disabled: false, label: 'Edit' },
  btnRef: { visible: true, disabled: false, label: '...' },
  btnSave: { visible: true, disabled: false, label: 'Save' },
  btnPrintCheque: { visible: true, disabled: false, label: 'Print Cheque' },
  btnAttachment: { visible: true, disabled: false, label: 'Attachments' },
};

type FormElementsState = {
  [key in keyof typeof initialFormElements]: FormElementState
}

const AccTransactionForm: React.FC<AccTransactionProps> = ({
  voucherType,
  voucherPrefix,
  formType,
  formCode,
  title,
  drCr,
  voucherNo
}) => {
  const { type } = useParams();
  const { t } = useTranslation();
  const [gridName, setGridName] = useState<string>(`grd_acc_transaction_${type}`)
  const dispatch = useDispatch();
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const [gridHeight, setGridHeight] = useState(200);

  const [formElements, setFormElements] = useState<FormElementsState>(initialFormElements);

  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightWindows = wh - 800;
    setGridHeight(gridHeightWindows);
  }, [window.innerHeight])

  useEffect(() => {
    dispatch(accFormStateTransactionMasterHandleFieldChange({ fields: { formType: formType } }));
    if (formType == undefined || formType.trim() == "") {

    }
    else {
      dispatch(accFormStateHandleFieldChange({ fields: { title: title + "[" + formType + "]" } }));
    }
  }, [formType, title]);

  useEffect(() => {
    dispatch(accFormStateHandleFieldChange({ fields: { isInvoker: voucherNo && voucherNo > 0 } }));
  }, []);

  useEffect(() => {
    dispatch(accFormStateHandleFieldChange({ fields: { formCode: formCode } }));
  }, [formCode]);

  useEffect(() => {
    dispatch(accFormStateTransactionMasterHandleFieldChange({ fields: { voucherPrefix: voucherPrefix } }));
  }, [voucherPrefix]);

  useEffect(() => {
    dispatch(accFormStateTransactionMasterHandleFieldChange({ fields: { drCr: drCr } }));
  }, [drCr]);

  useEffect(() => {
    dispatch(accFormStateRowHandleFieldChange(
      {
        fields:
          { costCentreId: userSession.presetCostCenterId > 0 ? userSession.presetCostCenterId : 0 }
      }));
  }, []);

  useEffect(() => {
    if (!voucherType) return;
    const updateFormElementsBasedOnVoucherType = (newFormElements: any) => {

      switch (voucherType) {
        case "CR":
        case "CP":
          newFormElements.masterAccount.label = "Cash Account";
          newFormElements.employee.label = voucherType === "CR" ? "Collected By" : "Paid By";
          newFormElements.discount.visible = true;
          newFormElements.costCentreId.visible = true;
          newFormElements.chequeNumber.visible = false;
          newFormElements.bankDate.visible = false;
          break;

        case "PV":
        case "SV":
          newFormElements.masterAccount.label = voucherType === "PV" ? "Purchase Account" : "Sales Account";
          newFormElements.employee.label = "Done By";
          newFormElements.discount.visible = true;
          break;

        case "BR":
        case "CQR":
        case "BP":
        case "CQP":
          newFormElements.masterAccount.label = "Bank Account";
          newFormElements.employee.label = (voucherType === "BR" || voucherType === "CQR") ? "Collected By" : "Paid By";
          newFormElements.discount.visible = true;
          newFormElements.chequeNumber.visible = true;
          newFormElements.bankDate.visible = true;
          break;

        case "CN":
        case "DN":
          newFormElements.masterAccount.label = "Party Account";
          newFormElements.employee.label = voucherType === "CN" ? "Collected By" : "Paid By";
          break;

        case "JV":
        case "MJV":
          newFormElements.masterAccount.label = "Master Account";
          newFormElements.employee.label = "Done By";
          newFormElements.drCr.visible = true;
          newFormElements.keepNarration.visible = true
          break;

        case "OB":
          newFormElements.masterAccount.label = "Master Account";
          newFormElements.employee.label = "Employee";
          newFormElements.masterAccount.visible = false;
          newFormElements.drCr.visible = true;
          break;
      }

      return newFormElements;
    };
    const initializeFormElements = () => {
      const newFormElements = { ...formElements };
      newFormElements.foreignCurrency.visible = applicationSettings.accountsSettings.maintainMultiCurrencyTransactions;
      newFormElements.lblGroupName.label = "";


      let _newFormElements = updateFormElementsBasedOnVoucherType(newFormElements);
      setFormElements(_newFormElements);
    };


  }, [voucherType]);

  const columns = [
    {
      dataField: 'siNo',
      caption: 'SI No',
      width: 60,
      cellRender: (cellElement: any) => (
        <div>{cellElement.value}</div>
      ),
    },
    {
      dataField: 'ledgerId',
      caption: 'Ledger ID',
      width: 100,
    },
    {
      dataField: 'ledgerCode',
      caption: 'Ledger Code',
      width: 100,
    },
    {
      dataField: 'ledger',
      caption: 'Ledger',
    },
    {
      dataField: 'amount',
      caption: 'Amount',
      customizeText: (cellInfo: any) => `${parseFloat(cellInfo.value).toFixed(2)}`,
      width: 200,
    },
    {
      dataField: 'drCr',
      caption: 'Dr/Cr',
      width: 100,
    },
    {
      dataField: 'chequeNo',
      caption: 'Cheque No',
      visible: false
    },
    {
      dataField: 'chequeDate',
      caption: 'Cheque Date',
      visible: false
    },
    {
      dataField: 'narration',
      caption: 'Narration',
      visible: false
    },
    {
      dataField: 'billwiseDetails',
      caption: 'Billwise Details',
      visible: false
    },
    {
      dataField: 'accTransaction',
      caption: 'Acc Transaction',
      visible: false
    },
    {
      dataField: 'discount',
      caption: 'Discount',
      visible: false,
      customizeText: (cellInfo: any) => `${parseFloat(cellInfo.value).toFixed(2)}`,
    },
    {
      dataField: 'costCentreId',
      caption: 'Cost Centre ID',
      visible: false
    },
    {
      dataField: 'checkStatus',
      caption: 'Check Status',
      visible: false
    },
    {
      dataField: 'amountFC',
      caption: 'Amount FC',
      customizeText: (cellInfo: any) => `${parseFloat(cellInfo.value).toFixed(2)}`,
      visible: false
    },
    {
      dataField: 'nameOnCheque',
      caption: 'Name on Cheque',
      visible: false
    },
    {
      dataField: 'bankName',
      caption: 'Bank Name',
      visible: false
    },
    {
      dataField: 'debit',
      caption: 'Debit',
      customizeText: (cellInfo: any) => `${parseFloat(cellInfo.value).toFixed(2)}`,
      visible: false
    },
    {
      dataField: 'credit',
      caption: 'Credit',
      customizeText: (cellInfo: any) => `${parseFloat(cellInfo.value).toFixed(2)}`,
      visible: false
    },
    {
      dataField: 'projectId',
      caption: 'Project ID',
      visible: false
    },
    {
      dataField: 'projects',
      caption: 'Projects',
      visible: false
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {formElements.foreignCurrency.visible && (
            <ERPCheckbox
              id="foreignCurrency"
              label={formElements.foreignCurrency.label}
              checked={formState.foreignCurrency}
              onChange={(e) =>
                dispatch(accFormStateHandleFieldChange({
                  fields: { foreignCurrency: e.target.checked },
                }))
              }
              disabled={formElements.foreignCurrency.disabled}
            />
          )}
        </div>
        <h2 className="text-xl font-bold text-center text-blue-600">{type}</h2>
        <div className="w-[100px]"></div>
      </div>

      <div className="flex flex-wrap gap-4">
        {formElements.voucherPrefix.visible && (
          <ERPInput
            id="master_voucherPrefix"
            className="max-w-[120px] min-w-[80px]"
            label={formElements.voucherPrefix.label}
            value={formState.transaction.master.voucherPrefix}
            onChange={(e) =>
              dispatch(accFormStateTransactionMasterHandleFieldChange({
                fields: { voucherPrefix: e.target.value },
              }))
            }
            disabled={formElements.voucherPrefix.disabled}
          />
        )}

        {formElements.voucherNumber.visible && (
          <ERPInput
            id="voucherNumber"
            className="max-w-[120px] min-w-[100px]"
            label={formElements.voucherNumber.label}
            value={formState.transaction.master.voucherNumber}
            onChange={(e) =>
              dispatch(accFormStateTransactionMasterHandleFieldChange({
                fields: { voucherNumber: e.target.value },
              }))
            }
            disabled={formElements.voucherNumber.disabled}
          />
        )}

        {formElements.transactionDate.visible && (
          <ERPDateInput
            id="transactionDate"
            className="w-[130px]"
            label={formElements.transactionDate.label}
            value={new Date(formState.transaction.master.transactionDate)}
            onChange={(e) =>
              dispatch(accFormStateTransactionMasterHandleFieldChange({
                fields: { transactionDate: e.target.value },
              }))
            }
            disabled={formElements.transactionDate.disabled}
          />
        )}

        {formElements.referenceNumber.visible && (
          <ERPInput
            id="referenceNumber"
            className="w-[100px]"
            label={formElements.referenceNumber.label}
            value={formState.transaction.master.referenceNumber}
            onChange={(e) =>
              dispatch(accFormStateTransactionMasterHandleFieldChange({
                fields: { referenceNumber: e.target.value },
              }))
            }
            disabled={formElements.referenceNumber.disabled}
          />
        )}

        {formElements.referenceDate.visible && (
          <ERPDateInput
            className="min-w-[130px] max-w-[160px]"
            id="referenceDate"
            label={formElements.referenceDate.label}
            value={new Date(formState.transaction.master.referenceDate)}
            onChange={(e) =>
              dispatch(accFormStateTransactionMasterHandleFieldChange({
                fields: { referenceDate: e.target.value },
              }))
            }
            disabled={formElements.referenceDate.disabled}
          />
        )}

        {formElements.masterAccount.visible && (
          <div className="w-1/4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Bal: {formState.masterBalance || "0.00"}</span>
            </div>

            <ERPDataCombobox
              id="masterAccount"
              className="min-w-[200px]"
              label={formElements.masterAccount.label}
              value={formState.masterAccountID}
              onChange={(e) =>
                dispatch(accFormStateHandleFieldChange({
                  fields: { masterAccountID: e.target.value },
                }))
              }
              field={{
                valueKey: 'id',
                labelKey: 'name',
                required: true,
                getListUrl: Urls.data_acc_ledgers
              }}
              disabled={formElements.masterAccount.disabled}
            />
          </div>
        )}

        {formElements.drCr.visible && (
          <ERPDataCombobox
            id="drCr"
            className="w-[70px]"
            label={formElements.drCr.label}
            value={formState.transaction.master.drCr}
            onChange={(e) =>
              dispatch(accFormStateTransactionMasterHandleFieldChange({
                fields: { drCr: e.target.value },
              }))
            }
            field={{
              valueKey: 'value',
              labelKey: 'label',
            }}
            options={[
              { value: "debit", label: "Dr" },
              { value: "credit", label: "Cr" },
            ]}
            disabled={formElements.drCr.disabled}
          />
        )}

        {formElements.employee.visible && (
          <ERPDataCombobox
            id="employeeId"
            className="min-w-[200px]"
            label={formElements.employee.label}
            value={formState.masterAccountID}
            onChange={(e) =>
              dispatch(accFormStateTransactionMasterHandleFieldChange({
                fields: { employeeId: e.target.value },
              }))
            }
            field={{
              valueKey: 'id',
              labelKey: 'name',
              required: true,
              getListUrl: Urls.data_employees
            }}
            disabled={formElements.employee.disabled}
          />
        )}

        {formElements.remarks.visible && (
          <ERPInput
            id="remarks"
            className="w-full"
            label={formElements.remarks.label}
            value={formState.transaction.master.remarks}
            onChange={(e) =>
              dispatch(accFormStateTransactionMasterHandleFieldChange({
                fields: { remarks: e.target.value },
              }))
            }
            disabled={formElements.remarks.disabled}
          />
        )}

        {formElements.commonNarration.visible && (
          <ERPInput
            id="notes"
            className="w-full"
            label={formElements.commonNarration.label}
            value={formState.transaction.master.commonNarration}
            onChange={(e) =>
              dispatch(accFormStateTransactionMasterHandleFieldChange({
                fields: { commonNarration: e.target.value },
              }))
            }
            disabled={formElements.commonNarration.disabled}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {formElements.ledgerCode.visible && (
          <ERPInput
            id="ledgerCode"
            className="min-w-[100px]"
            label={formElements.ledgerCode.label}
            value={formState.row.ledgerCode}
            onChange={(e) =>
              dispatch(accFormStateRowHandleFieldChange({
                fields: { ledgerCode: e.target.value },
              }))
            }
            disabled={formElements.ledgerCode.disabled}
          />
        )}

        {formElements.ledgerId.visible && (
          <ERPDataCombobox
            id="ledgerId"
            className="min-w-[250px] max-w-[250px]"
            label={formElements.ledgerId.label}
            data={formState.row}
            onSelectItem={(e) => {
              dispatch(accFormStateRowHandleFieldChange({
                fields: { ledgerId: e.value, ledgerName: e.label },
              }))
            }}
            field={{
              valueKey: 'id',
              labelKey: 'name',
              required: true,
              getListUrl: Urls.data_acc_ledgers,
            }}
            disabled={formElements.ledgerId.disabled}
          />
        )}

        {formElements.amount.visible && (
          <ERPInput
            id="amount"
            className="min-w-[150px]"
            label={formElements.amount.label}
            type="number"
            value={formState.row.amount}
            onChange={(e) =>
              dispatch(accFormStateRowHandleFieldChange({
                fields: { amount: e.target.value },
              }))
            }
            disabled={formElements.amount.disabled}
          />
        )}

        {formElements.drCr.visible && (
          <ERPDataCombobox
            id="drCr"
            className="min-w-[70px] max-w-[70px]"
            label={formElements.drCr.label}
            value={formState.row.drCr}
            onChange={(e) =>
              dispatch(accFormStateRowHandleFieldChange({
                fields: { drCr: e.target.value },
              }))
            }
            field={{
              valueKey: 'value',
              labelKey: 'label',
            }}
            options={[
              { value: "debit", label: "Dr" },
              { value: "credit", label: "Cr" },
            ]}
            disabled={formElements.drCr.disabled}
          />
        )}

        {formElements.narration.visible && (
          <div className="w-3/4">
            <ERPInput
              id="narration"
              className="min-w-[200px] max-w-[250px]"
              label={formElements.narration.label}
              value={formState.row.narration}
              onChange={(e) =>
                dispatch(accFormStateRowHandleFieldChange({
                  fields: { narration: e.target.value },
                }))
              }
              disabled={formElements.narration.disabled}
            />
          </div>
        )}

        <ERPButton
          title="Add"
          variant="primary"
          className="h-fit"
          loading={formState.rowProcessing}
          type="button"
          onClick={() => dispatch(accFormStateTransactionDetailsRowAdd(formState.row))}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <span className="text-blue-600 font-bold self-center">Group Name:</span>
        {formElements.currencyID.visible && (
          <ERPDataCombobox
            id="currencyID"
            className="min-w-[150px] max-w-[200px]"
            label={formElements.currencyID.label}
            field={{
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_currencies,
            }}
            onChangeData={(e) =>
              dispatch(accFormStateRowHandleFieldChange({
                fields: { currencyId: e.value, currencyName: e.label },
              }))
            }
            disabled={formElements.currencyID.disabled}
          />
        )}
        {formElements.exchangeRate.visible && (
          <ERPInput
            id="exchangeRate"
            className="min-w-[200px] max-w-[250px]"
            label={formElements.exchangeRate.label}
            type="number"
            value={formState.row.exchangeRate}
            onChange={(e) =>
              dispatch(accFormStateRowHandleFieldChange({
                fields: { exchangeRate: e.target.value },
              }))
            }
            disabled={formElements.exchangeRate.disabled}
          />
        )}
        <div className="flex items-center">
          {formElements.hasDiscount.visible && (
            <ERPCheckbox
              id="hasDiscount"
              className="pt-[10px] pr-[10px]"
              label={formElements.hasDiscount.label}
              checked={formState.row.hasDiscount}
              onChange={(e) =>
                dispatch(accFormStateRowHandleFieldChange({
                  fields: { hasDiscount: e.target.checked },
                }))
              }
              disabled={formElements.hasDiscount.disabled}
            />
          )}
          {formElements.discount.visible && (
            <ERPInput
              id="discount"
              className="min-w-[100px] max-w-[250px]"
              label={formElements.discount.label}
              value={formState.row.discount}
              onChange={(e) =>
                dispatch(accFormStateRowHandleFieldChange({
                  fields: { discount: e.target.value },
                }))
              }
              disabled={formElements.discount.disabled}
            />
          )}
        </div>
        {formElements.chequeNumber.visible && (
          <ERPInput
            id="chequeNumber"
            className="min-w-[100px] max-w-[120px]"
            label={formElements.chequeNumber.label}
            value={formState.row.chequeNumber}
            onChange={(e) =>
              dispatch(accFormStateRowHandleFieldChange({
                fields: { chequeNumber: e.target.value },
              }))
            }
            disabled={formElements.chequeNumber.disabled}
          />
        )}
        {formElements.bankDate.visible && (
          <ERPDateInput
            id="bankDate"
            className="min-w-[100px] max-w-[120px]"
            label={formElements.bankDate.label}
            value={new Date(formState.row.bankDate)}
            onChange={(e) =>
              dispatch(accFormStateRowHandleFieldChange({
                fields: { bankDate: e.target.value },
              }))
            }
            disabled={formElements.bankDate.disabled}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {(voucherType == "BP" || voucherType == "CQP") && (
          <>
            {formElements.nameOnCheque.visible && (
              <ERPInput
                id="nameOnCheque"
                className="min-w-[140px] max-w-[200px]"
                label={formElements.nameOnCheque.label}
                value={formState.row.nameOnCheque}
                onChange={(e) =>
                  dispatch(accFormStateRowHandleFieldChange({
                    fields: { nameOnCheque: e.target.value },
                  }))
                }
                disabled={formElements.nameOnCheque.disabled}
              />
            )}
            {formElements.bankName.visible && (
              <ERPDataCombobox
                id="bankName"
                className="min-w-[180px] max-w-[200px]"
                label={formElements.bankName.label}
                value={formState.row.bankName}
                field={{
                  valueKey: "id",
                  labelKey: "name",
                  getListUrl: Urls.data_BankAccounts,
                }}
                onChange={(e) =>
                  dispatch(accFormStateRowHandleFieldChange({
                    fields: { bankName: e.target.value },
                  }))
                }
                disabled={formElements.bankName.disabled}
              />
            )}
          </>
        )}
        {formElements.projectId.visible && (
          <ERPDataCombobox
            id="project"
            className="min-w-[180px]"
            label={formElements.projectId.label}
            field={{
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_projects,
            }}
            onChange={(e) =>
              dispatch(accFormStateRowHandleFieldChange({
                fields: { projectId: e.target.value },
              }))
            }
            disabled={formElements.projectId.disabled}
          />
        )}
        {formElements.costCentreId.visible && (
          <ERPDataCombobox
            id="costCentre"
            className="min-w-[180px]"
            label={formElements.costCentreId.label}
            field={{
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_costcentres,
            }}
            disabled={userSession.presetCostCenterId > 0 || formElements.costCentreId.disabled}
            onChange={(e) =>
              dispatch(accFormStateRowHandleFieldChange({
                fields: { costCentreId: e.target.value },
              }))
            }
          />
        )}
        <ERPButton
          title="Billwise"
          variant="secondary"
          onClick={() => {
            dispatch(accFormStateHandleFieldChange({ fields: { showbillwise: true } }))
          }}
        />
        <ERPButton
          title="save"
          variant="primary"
          onClick={() => dispatch(accFormStateHandleFieldChange({ fields: { showSaveDialog: true } }))}
        />
      </div>
      <div className="flex items-center gap-4 border-t pt-4">
        {formElements.printOnSave.visible && (
          <ERPCheckbox
            id="printOnSave"
            label={formElements.printOnSave.label}
            checked={formState.printOnSave}
            onChange={(e) =>
              dispatch(accFormStateHandleFieldChange({
                fields: { printOnSave: e.target.checked },
              }))
            }
            disabled={formElements.printOnSave.disabled}
          />
        )}
        {formElements.printPreview.visible && (
          <ERPCheckbox
            id="printPreview"
            label={formElements.printPreview.label}
            checked={formState.printPreview}
            onChange={(e) =>
              dispatch(accFormStateHandleFieldChange({
                fields: { printPreview: e.target.checked },
              }))
            }
            disabled={formElements.printPreview.disabled}
          />
        )}
        {(voucherType == "BP" || voucherType == "CQP") && formElements.printCheque.visible && (
          <ERPCheckbox
            id="printCheque"
            label={formElements.printCheque.label}
            checked={formState.printCheque}
            onChange={(e) =>
              dispatch(accFormStateHandleFieldChange({
                fields: { printCheque: e.target.checked },
              }))
            }
            disabled={formElements.printCheque.disabled}
          />
        )}
        {formElements.keepNarration.visible && (
          <ERPCheckbox
            id="keepNarration"
            label={formElements.keepNarration.label}
            checked={formState.keepNarration}
            onChange={(e) =>
              dispatch(accFormStateHandleFieldChange({
                fields: { keepNarration: e.target.checked },
              }))
            }
            disabled={formElements.keepNarration.disabled}
          />
        )}
        {(voucherType == "BP" || voucherType == "CQP") && (
          <ERPButton
            title="Print Cheque"
            variant="secondary"
            onClick={() => {/* Handle print cheque */ }}
          />
        )}
        <button
          className="text-blue-600 hover:underline"
          onClick={() => {/* Handle attachments */ }}
        >
          Attachments
        </button>
      </div>
      <div className="text-red-600 font-bold text-sm">
        Amount in Words: {formState.amountInWords}
      </div>
      <ErpDevGrid
        columns={columns}
        height={gridHeight}
        allowFiltering={false}
        dataUrl={Urls.acc_reports_ledger}
        hideGridAddButton={true}
        hideDefaultExportButton={true}
        hideDefaultSearchPanel={true}
        hideGridHeader={true}
        enablefilter={false}
        data={formState.transaction.details}
        gridId={gridName}
      />
      {
        formState.showSaveDialog && (
          <ERPAlert
            showAnimation='animate__fadeIn'
            hideAnimation='animate__fadeOut'
            title="In Progress......"
            icon="warning"
            position="center"
            confirmButtonText="Ok"
            cancelButtonText="Cancel"
            onConfirm={() => {
              dispatch(accFormStateHandleFieldChange({ fields: { showSaveDialog: false } }));
            }}
            onCancel={() => dispatch(accFormStateHandleFieldChange({ fields: { showSaveDialog: false } }))}
          />
        )
      }
    </div >
  )
}

export default AccTransactionForm