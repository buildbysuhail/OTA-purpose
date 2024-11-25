'use client'

import { Card, CardHeader, CardContent } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import ERPDateInput from "../../../components/ERPComponents/erp-date-input"
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons"
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox"
import ERPInput from "../../../components/ERPComponents/erp-input"
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox"
import ERPButton from "../../../components/ERPComponents/erp-button"
import Urls from "../../../redux/urls"
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid"
import { useParams } from 'react-router-dom';
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
  const { t } = useTranslation(); // Specify the namespace
  const [gridName, setGridName] = useState<string>(`grd_acc_transaction_${type}`)
  const dispatch = useDispatch();
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const [gridHeight, setGridHeight] = useState(200);

  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightWindows = wh - 800;
    setGridHeight(gridHeightWindows);
  }, [window.innerHeight])



  //#region Set Title
  useEffect(() => {
    dispatch(accFormStateHandleFieldChange({ fields: "formType", value: formType }));
    if (formType == undefined || formType.trim() == "") {

    }
    else {
      dispatch(accFormStateHandleFieldChangeds({ fields: "title", value: title + "[" + formType + "]" }));
    }
  }, [formType, title]);
  useEffect(() => {
    dispatch(accFormStateHandleFieldChange({ fields: "formCode", value: formCode }));
  }, [formCode]);
  useEffect(() => {
    dispatch(accFormStateHandleFieldChange({ fields: "voucherPrefix", value: voucherPrefix }));
  }, [voucherPrefix]);
  useEffect(() => {
    dispatch(accFormStateHandleFieldChange({ fields: "drCr", value: drCr }));
  }, [drCr]);
  useEffect(() => {
    dispatch(accFormStateHandleFieldChange({ fields: "formCode", value: formCode }));
  }, [formCode]);
  useEffect(() => {
    dispatch(accFormStateHandleFieldChange({ fields: "formCode", value: formCode }));
  }, [formCode]);
  useEffect(() => {
    dispatch(accFormStateHandleFieldChange({ fields: "formCode", value: formCode }));
  }, [formCode]);
  //#endregion

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
      // alignment: 'right',
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
      // alignment: 'right',
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
      // alignment: 'right',
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
      // alignment: 'right',
      customizeText: (cellInfo: any) => `${parseFloat(cellInfo.value).toFixed(2)}`,
      visible: false
    },
    {
      dataField: 'credit',
      caption: 'Credit',
      // alignment: 'right',
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
          <ERPCheckbox
            id="foreignCurrency"
            label="Foreign Currency"
            checked={formState.foreignCurrency}
            onChange={(e) =>
              dispatch(
                accFormStateHandleFieldChange({
                  fields: "foreignCurrency",
                  value: e.target.checked,
                })
              )
            }
          />
        </div>
        <h2 className="text-xl font-bold text-center text-blue-600">{type}</h2>
        <div className="w-[100px]"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex flex-wrap gap-4">
        <ERPInput
          id="master_voucherPrefix"
          className="max-w-[120px] min-w-[80px]"
          label={t("prefix")}
          value={formState.transaction.master.voucherPrefix}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: "voucherPrefix",
                value: e.target.value,
              })
            )
          }
        />

        <ERPInput
          id="voucherNumber"
          className="max-w-[120px] min-w-[100px]"
          label={t("voucher_number")}
          value={formState.transaction.master.voucherNumber}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: "voucherNumber",
                value: e.target.value,
              })
            )
          }
        />

        <ERPDateInput
          id="transactionDate"
          className="w-[130px]"
          label={t("transaction_date")}
          value={new Date(formState.transaction.master.transactionDate)}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: "transactionDate",
                value: e.target.value,
              })
            )
          }
        />

        <ERPInput
          id="referenceNumber"
          className="w-[100px]"
          label={t("reference_number")}
          value={formState.transaction.master.referenceNumber}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: "referenceNumber",
                value: e.target.value,
              })
            )
          }
        />

        <ERPDateInput
          className="min-w-[130px] max-w-[160px]"
          id="referenceDate"
          label={t("reference_date")}
          value={new Date(formState.transaction.master.referenceDate)}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: "referenceDate",
                value: e.target.value,
              })
            )
          }
        />

        <div className="w-1/4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Bal: {formState.masterBalance || "0.00"}</span>
          </div>

          <ERPDataCombobox
            id="masterAccount"
            className="min-w-[200px]"
            label={(formState.voucherType == "CR" || formState.voucherType == "CP") ? t("cash_account") :
              (formState.voucherType == "PV" || formState.voucherType == "SV") ? t("purchase_account") :
                (formState.voucherType == "BR" || formState.voucherType == "CQR" || formState.voucherType == "BP" || formState.voucherType == "CQP") ? t("bank_account") :
                  (formState.voucherType == "CN" || formState.voucherType == "DN") ? t("party_account") :
                    (formState.voucherType == "JV" || formState.voucherType == "MJV") ? t("master_account") :
                      t("default_account")}
            value={formState.masterAccountID}
            onChange={(e) =>
              dispatch(
                accFormStateHandleFieldChange({
                  fields: "masterAccountID",
                  value: e.target.value,
                })
              )
            }
            field={{
              valueKey: 'id',
              labelKey: 'name',
              required: true,
              getListUrl: Urls.data_acc_ledgers
            }}
          />
        </div>

        <ERPDataCombobox
          id="drCr"
          className="w-[70px]"
          label={"drCr"}
          value={formState.transaction.master.drCr}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: "drCr",
                value: e.target.value,
              })
            )
          }
          field={{
            valueKey: 'value',
            labelKey: 'label',
          }}
          options={[
            { value: "debit", label: "Dr" },
            { value: "credit", label: "Cr" },
          ]}
        />

        <ERPDataCombobox
          id="employeeId"
          className="min-w-[200px]"
          label={(formState.voucherType == "CR" || formState.voucherType == "BR" || formState.voucherType == "CQR") ? t("collected_by") :
            (formState.voucherType == "CP" || formState.voucherType == "BP" || formState.voucherType == "CQP") ? t("paid_by") :
              (formState.voucherType == "PV" || formState.voucherType == "SV") ? t("done_by") :
                t("employee")}
          value={formState.masterAccountID}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: "employeeId",
                value: e.target.value,
              })
            )
          }
          field={{
            valueKey: 'id',
            labelKey: 'name',
            required: true,
            getListUrl: Urls.data_employees
          }}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <ERPInput
          id="remarks"
          className="min-w-[250px]"
          label={t("remarks")}
          value={formState.transaction.master.remarks}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: "remarks",
                value: e.target.value,
              })
            )
          }
        />
        <ERPInput
          id="notes"
          className="min-w-[250px]"
          label={t("notes")}
          value={formState.transaction.master.remarks}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: "remarks",
                value: e.target.value,
              })
            )
          }
        />
        <button
          className="absolute right-0 top-0 text-blue-600 text-sm hover:underline"
          onClick={() => dispatch(
            accFormStateHandleFieldChange({
              fields: "isEdit",
              value: true,
            })
          )}
        >
          Edit
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <ERPInput
          id="ledgerCode"
          className="min-w-[100px]"
          label={t("ledger_code")}
          value={formState.row.ledgerCode}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: "ledgerCode",
                value: e.target.value,
              })
            )
          }
        />

        {/* <div className="w-3/4"> */}
        <ERPDataCombobox
          id="ledgerId"
          className="min-w-[250px] max-w-[250px]"
          label={t("ledger")}
          data={formState.row}
          onSelectItem={(e) => {
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: { ledgerId: e.value, ledgerName: e.label },
              })
            )
          }}
          field={{
            valueKey: 'id',
            labelKey: 'name',
            required: true,
            getListUrl: Urls.data_acc_ledgers,
          }}
        />
        {/* </div> */}

        <ERPInput
          id="amount"
          className="min-w-[150px]"
          label={t("amount")}
          type="number"
          value={formState.row.amount}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: "amount",
                value: e.target.value,
              })
            )
          }
        />

        <ERPDataCombobox
          id="drCr"
          className="min-w-[70px] max-w-[70px]"
          label={"drCr"}
          value={formState.row.drCr}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: "drCr",
                value: e.target.value,
              })
            )
          }
          field={{
            valueKey: 'value',
            labelKey: 'label',
          }}
          options={[
            { value: "debit", label: "Dr" },
            { value: "credit", label: "Cr" },
          ]}
        />

        <div className="w-3/4">
          <ERPInput
            id="narration"
            className="min-w-[200px] max-w-[250px]"
            label={t("narration")}
            value={formState.row.narration}
            onChange={(e) =>
              dispatch(
                accFormStateRowHandleFieldChange({
                  fields: "narration",
                  value: e.target.value,
                })
              )
            }
          />
        </div>

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
        <ERPDataCombobox
          id="currencyID"
          className="min-w-[150px] max-w-[200px]"
          label="Currency"
          field={{
            valueKey: "id",
            labelKey: "name",
            getListUrl: Urls.data_currencies,
          }}
          onChangeData={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: { currencyID: e.value, currencyName: e.label },
              })
            )
          }
        />
        <ERPInput
          id="exchangeRate"
          className="min-w-[200px] max-w-[250px]"
          label={t("ex_rate")}
          type="number"
          value={formState.row.exchangeRate}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: "exchangeRate",
                value: e.target.value,
              })
            )
          }
        />
        <div className="flex items-center">
          <ERPCheckbox
            id="hasDiscount"
            className="pt-[10px] pr-[10px]"
            label={"discount"}
            checked={formState.row.hasDiscount}
            onChange={(e) =>
              dispatch(
                accFormStateRowHandleFieldChange({
                  fields: "hasDiscount",
                  value: e.target.checked,
                })
              )
            }
          />
          <ERPInput
            id="discount"
            className="min-w-[100px] max-w-[250px]"
            label=""
            noLabel
            value={formState.row.discount}
            onChange={(e) =>
              dispatch(
                accFormStateRowHandleFieldChange({
                  fields: "discount",
                  value: e.target.value,
                })
              )
            }
          />
        </div>
        <ERPInput
          id="chequeNumber"
          className="min-w-[100px] max-w-[120px]"
          label="cheque_no"
          value={formState.row.chequeNumber}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: "chequeNumber",
                value: e.target.value,
              })
            )
          }
        />
        <ERPDateInput
          id="bankDate"
          className="min-w-[100px] max-w-[120px]"
          label=""
          value={new Date(formState.row.bankDate)}
          onChange={(e) =>
            dispatch(
              accFormStateRowHandleFieldChange({
                fields: "bankDate",
                value: e.target.value,
              })
            )
          }
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {voucherType == "BP" || voucherType == "CQP" &&
          <> <ERPInput
            id="nameOnCheque"
            className="min-w-[140px] max-w-[200px]"
            label="Name On Cheque"
            value={formState.row.nameOnCheque}
            onChange={(e) =>
              dispatch(
                accFormStateRowHandleFieldChange({
                  fields: "nameOnCheque",
                  value: e.target.value,
                })
              )
            }
          />
            <ERPDataCombobox
              id="bankName"
              className="min-w-[180px] max-w-[200px]"
              label="Bank Name"
              value={formState.row.bankName}
              field={{
                valueKey: "id",
                labelKey: "name",
                getListUrl: Urls.data_BankAccounts,
              }}
              onChange={(e) =>
                dispatch(
                  accFormStateTransactionMasterHandleFieldChange({
                    fields: "bankName",
                    value: e.target.value,
                  })
                )
              }
            />
          </>
        }
        <ERPDataCombobox
          id="project"
          className="min-w-[180px]"
          label="Project"
          field={{
            valueKey: "id",
            labelKey: "name",
            getListUrl: Urls.data_projects,
          }}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: "project",
                value: e.target.value,
              })
            )
          }
        />
        <ERPDataCombobox
          id="costCentre"
          className="min-w-[180px]"
          label="Cost Center"
          field={{
            valueKey: "id",
            labelKey: "name",
            getListUrl: Urls.data_costcentres,
          }}
          onChange={(e) =>
            dispatch(
              accFormStateTransactionMasterHandleFieldChange({
                fields: "costCentre",
                value: e.target.value,
              })
            )

          }
        />
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
        <ERPCheckbox
          id="printOnSave"
          label="Print on Save"
          checked={formState.printOnSave}
          onChange={(e) =>
            dispatch(
              accFormStateHandleFieldChange({
                fields: "printOnSave",
                value: e.target.checked,
              })
            )
          }
        />
        <ERPCheckbox
          id="printPreview"
          label="Print Preview"
          checked={formState.printPreview}
          onChange={(e) =>
            dispatch(
              accFormStateHandleFieldChange({
                fields: "printPreview",
                value: e.target.checked,
              })
            )
          }
        />
        {voucherType == "BP" || voucherType == "CQP" &&
          <ERPCheckbox
            id="printCheque"
            label="Print Cheque"
            checked={formState.printCheque}
            onChange={(e) =>
              dispatch(
                accFormStateHandleFieldChange({
                  fields: "printCheque",
                  value: e.target.checked,
                })
              )
            }
          />
        }
        <ERPCheckbox
          id="keepNarration"
          label="Keep Narration"
          checked={formState.keepNarration}
          onChange={(e) =>
            dispatch(
              accFormStateHandleFieldChange({
                fields: "keepNarration",
                value: e.target.checked,
              })
            )
          }
        />
        {voucherType == "BP" || voucherType == "CQP" &&
          <ERPButton
            title="Print Cheque"
            variant="secondary"
            onClick={() => {/* Handle print cheque */ }}
          />
        }
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
      {formState.showSaveDialog &&
        <ERPAlert
          showAnimation='animate__fadeIn'
          hideAnimation='animate__fadeOut'
          title="In Progress......"
          // text="In Progress......"
          icon="warning"
          position="center"
          confirmButtonText="Ok"
          cancelButtonText="Cancel"
          onConfirm={() => {
            dispatch(accFormStateHandleFieldChange({ fields: { showSaveDialog: false } }));
          }}
          onCancel={() => dispatch(accFormStateHandleFieldChange({ fields: { showSaveDialog: false } }))}
        />
      }
    </div>
  )
}
export default AccTransactionForm