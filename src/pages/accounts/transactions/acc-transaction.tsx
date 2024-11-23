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




const AccTransactionForm: React.FC<AccTransactionProps> = ({
  voucherType,
  voucherPrefix,
  formType,
  formCode,
  title,
  drCr,
}) => {
  const { type } = useParams();
  const { t } = useTranslation();
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
    if (formType == "") {
      dispatch(accFormStateHandleFieldChange({ fields: "title", value: title }));
    }
    else {
      dispatch(accFormStateHandleFieldChange({ fields: "title", value: title + "[" + formType + "]" }));
    }
  }, [formType, title]);
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
    <>
      <h3>{`${type}`}</h3>
      <div>
        <div className="flex items-center justify-between gap-6">
          <ERPInput
            id="master_voucherPrefix"
            label={t("voucher_prefix")} // Using `t()` for localization
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
            label={t("voucher_number")} // Using `t()` for localization
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
            label={t("transaction_date")} // Using `t()` for localization
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
            label={t("reference_number")} // Using `t()` for localization
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
            id="referenceDate"
            label={t("reference_date")} // Using `t()` for localization
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
            <div className="flex justify-between items-center">
              <label htmlFor="cashAccount" className="text-xs font-medium">Cash Account</label>
              <span className="text-xs text-gray-500">Bal:</span>
            </div>

            <ERPDataCombobox
              id="masterAccount"
              label={(formState.voucherType == "CR" || formState.voucherType == "CP") ? t("cash_account") :
                (formState.voucherType == "PV" || formState.voucherType == "SV") ? t("purchase_account") :
                  (formState.voucherType == "BR" || formState.voucherType == "CQR" || formState.voucherType == "BP" || formState.voucherType == "CQP") ? t("bank_account") :
                    (formState.voucherType == "CN" || formState.voucherType == "DN") ? t("party_account") :
                      (formState.voucherType == "JV" || formState.voucherType == "MJV") ? t("master_account") :
                        t("default_account")} // Using `t()` for localization
              value={formState.masterAccountID} // Assuming this is the state variable
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
            id="employeeId"
            label={(formState.voucherType == "CR" || formState.voucherType == "BR" || formState.voucherType == "CQR") ? t("collected_by") :
              (formState.voucherType == "CP" || formState.voucherType == "BP" || formState.voucherType == "CQP") ? t("paid_by") :
                (formState.voucherType == "PV" || formState.voucherType == "SV") ? t("done_by") :
                  t("employee")} // Using `t()` for localization
            value={formState.masterAccountID} // Assuming this is the state variable
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
      </div>
      <div className="flex align-center gap-6">
        <div className="w-1/4">
          <ERPInput
            id="remarks"
            label={t("remarks")} // Using `t()` for localization
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
          <div className="w-1/4">
            <ERPInput
              id="remarks"
              label={t("notes")} // Using `t()` for localization
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
          </div>
          <div className="w-1/4">
          </div>
        </div>


        <div className="flex align-center gap-6">
          <ERPInput
            id="ledgerCode"
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

          <div className="w-3/4">
            <ERPDataCombobox
              id="ledgerId"
              label={t("ledger")}
              data={formState.row}
              onSelectItem={(e) =>
               {
                debugger;
                dispatch(
                  accFormStateRowHandleFieldChange({
                    fields: { ledgerId: e.value, ledgerName: e.label },
                  })
                )
               }
              }
              field={{
                valueKey: 'id',
                labelKey: 'name',
                required: true,
                getListUrl: Urls.data_acc_ledgers,
              }}
            />
          </div>

          <ERPInput
            id="amount"
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
            label={t("drCr")}
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
              valueKey: 'id',
              labelKey: 'name',
              required: true,
            }}
            options={[
              { value: "debit", label: "Debit" },
              { value: "credit", label: "Credit" },
            ]}
          />

          <div className="w-3/4">
            <ERPInput
              id="narration"
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

          {formState.row.ledgerId}
          {formState.row.ledgerName}
          {hasValue(formState.row.ledgerId).toString()}
          {formState.rowProcessing.toString()}
          <ERPButton
            title="Add"
            variant="primary"
            // disabled={formState.rowProcessing || !hasValue(formState.row.ledgerId)}
            loading={formState.rowProcessing}
            type="button"
            onClick={() => dispatch(accFormStateTransactionDetailsRowAdd(formState.row))}
          />
        </div>
        <div className="flex align-center justify-self-end gap-6">


          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-blue-600 font-bold">Group Name:</span>
              <ERPDataCombobox
                id="currencyID"
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
                label={t("Ex. Rate")}
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
              <div className="flex items-center justify-center">

                <ERPCheckbox
                  id="hasDiscount"
                  label=""
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
                  label="Discount"
                  value=""
                  //data={formData}
                  onChangeData={(e) => { }}
                />
              </div>
              <ERPInput
                id="discount"
                label=""
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
              <ERPInput
                id="chequeNumber"
                label="Cheque No"
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
                label=""
                value={new Date(formState.bankDate)}
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

            <div className="flex items-center gap-4">
              <ERPInput
                id="nameOnCheque"
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
              <ERPDataCombobox
                id="project"
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
                  // Billwise action handler
                }}
              />
              <ERPButton
                title="save"
                variant="primary"
                onClick={() => {
                  // Billwise action handler
                }}
              />
            </div>

            <div className="text-red-600 font-bold text-sm">
              Amount in Words: Zero Only
            </div>
          </div>
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
        ></ErpDevGrid>
      </div >
    </>
  )
}
export default AccTransactionForm