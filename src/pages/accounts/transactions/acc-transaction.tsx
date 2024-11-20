'use client'

import { Card, CardHeader, CardContent } from "@mui/material"
import { useCallback, useState } from "react"
import ERPDateInput from "../../../components/ERPComponents/erp-date-input"
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons"
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox"
import ERPInput from "../../../components/ERPComponents/erp-input"
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox"
import ERPButton from "../../../components/ERPComponents/erp-button"
import Urls from "../../../redux/urls"
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid"
import { useParams } from 'react-router-dom';
import { AccTransaction, AccTransactionInitialData } from "./acc-transaction-types"
import { FormField } from "../../../utilities/form-types"
import { getFieldPropsGlobal, handleFieldChangeGlobal } from "../../../utilities/form-utils"
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions"
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch"




export default function Component() {
  const { type } = useParams();
  const [transaction, seTransaction] = useState<AccTransaction>(AccTransactionInitialData);
  const [gridName, setGridName] = useState<string>(`grd_acc_transaction_${type}`)
  const dispatch = useAppDispatch();
  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    handleClear,
    handleClose,
    getFieldProps,
    isLoading,
    formState,
    getFieldPropsAdv,
    t
  } = useFormManager<AccTransaction>({
    url: Urls.account_ledger,
    onSuccess: useCallback(() => { }, [dispatch]),
    onClose: useCallback(() => { }, [dispatch]),
    keyField: "accTransactionMasterID",
    useApiClient: true,
    initialData: AccTransactionInitialData
  });
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
  const [data] = useState([
    {
      siNo: 1,
      ledgerId: 'LD001',
      ledgerCode: 'LC001',
      ledger: 'Cash Account',
      amount: 5000.00,
      drCr: 'Dr',
      chequeNo: 'CHQ001',
      chequeDate: '2024-01-19',
      narration: 'Payment for supplies',
      billwiseDetails: 'BILL001',
      accTransaction: 'TR001',
      discount: 0,
      x: '',
      costCentreId: 'CC001',
      checkStatus: 'Cleared',
      amountFC: 5000.00,
      nameOnCheque: 'John Doe',
      bankName: 'ABC Bank',
      debit: 5000.00,
      credit: 0,
      projectId: 'PRJ001',
      projects: 'Main Project'
    },
    {
      siNo: 2,
      ledgerId: 'LD001',
      ledgerCode: 'LC001',
      ledger: 'Cash Account',
      amount: 5000.00,
      drCr: 'Dr',
      chequeNo: 'CHQ001',
      chequeDate: '2024-01-19',
      narration: 'Payment for supplies',
      billwiseDetails: 'BILL001',
      accTransaction: 'TR001',
      discount: 0,
      x: '',
      costCentreId: 'CC001',
      checkStatus: 'Cleared',
      amountFC: 5000.00,
      nameOnCheque: 'John Doe',
      bankName: 'ABC Bank',
      debit: 5000.00,
      credit: 0,
      projectId: 'PRJ001',
      projects: 'Main Project'
    },
    // Add more sample data here
  ])
  return (
    <>
      <div className="p-4 space-y-6 border rounded-lg">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-6">
            <ERPInput
              {...getFieldPropsAdv("master.voucherPrefix")}
            />
            <ERPInput
              {...getFieldPropsAdv("voucherNumber")}
            />
            <ERPDateInput
              {...getFieldPropsAdv("transactionDate")}
            />
            <ERPInput
              {...getFieldPropsAdv("referenceNumber")}
            />
            <ERPDateInput
              {...getFieldPropsAdv("referenceDate")}
            />

            <div className="w-1/4">
              <div className="flex justify-between items-center">
                <label htmlFor="cashAccount" className="text-xs font-medium">Cash Account</label>
                <span className="text-xs text-gray-500">Bal:</span>
              </div>
              <ERPDataCombobox
              {...getFieldPropsAdv("referenceDate")}
                id="cashAccount"
                label=" "
                // value={formData.cashAccount}
                data={[
                  { id: '1', name: 'CASH A/C (MADEENA VAN)' },
                  { id: '2', name: 'CASH A/C (MAIN)' }
                ]}
                field={{
                  id: 'cashAccount',
                  valueKey: 'id',
                  labelKey: 'name',
                  required: true,
                  getListUrl: '/api/cash-accounts'
                }}
                onChangeData={(value) => handleFieldChange('cashAccount', value)}
              />
            </div>
            <ERPDataCombobox
              {...getFieldPropsAdv("employeeId")}
              field={{
                id: 'employeeId',
                valueKey: 'id',
                labelKey: 'name',
                getListUrl: Urls.data_employees
              }}
            />
          </div>
          <div className="flex align-center gap-6">
            <div className="w-1/4">
              <ERPInput
                prefix="abc"
                id="remarks"
                label="Remarks"
                // value={formData.remarks}
                // //data={formData}
                onChangeData={(value) => handleFieldChange('remarks', value)}
              />
            </div>
            <div className="w-1/4">
              <ERPInput
                id="notes"
                label="Notes"
                value=""
                //data={formData}
                onChangeData={(value) => { }}
              />
            </div>
          </div>
        </div>


        <div className="flex align-center gap-6">
          <ERPInput
            id="ledgerCode"
            label="Ledger Code"
            value=""
            //data={formData}
            onChangeData={(value) => { }}
          />
          <div className="w-3/4">
            <ERPDataCombobox
              id="ledger"
              field={{
                id: "ledger",
                required: true,
                getListUrl: Urls.data_acc_ledgers,
                valueKey: "id",
                labelKey: "name",
              }}
              label=" Ledger"
              onChangeData={(data: any) => handleFieldChange("ledger", data.ledger)}
            />
          </div>
          <ERPInput
            id="amount"
            label="Amount"
            value=""
            //data={formData}
            onChangeData={(value) => { }}
          />
          <div className="w-3/4">
            <ERPInput
              id="narration"
              label="Narration"
              value=""
              //data={formData}
              onChangeData={(value) => { }}
            />
          </div>
          <ERPButton
            title="Add"
            variant="primary"
            // disabled={isSaving}
            // loading={isSaving}
            type="button"
          // onClick={handleSubmit}
          />
        </div>
        <div className="flex align-center  gap-6">
          <div className="flex items-center justify-center">
            <ERPCheckbox
              onChangeData={(data: any) => handleFieldChange('isCommon', data.isCommon)} id={""} />
            <ERPInput
              id="discount"
              label="Discount"
              value=""
              //data={formData}
              onChangeData={(value) => { }}
            />
          </div>
          <ERPDataCombobox
            id="costCentre"
            field={{
              id: "costCentre",
              required: true,
              getListUrl: Urls.data_costcentres,
              valueKey: "id",
              labelKey: "name",
            }}
            label="Cost Centre"
            onChangeData={(data: any) => handleFieldChange("costCentre", data.costCentre)}
          />
          <ERPDataCombobox
            id="project"
            label="Project"
            data={[
              { id: '22001', name: '22001 MOHAN' }
            ]}
            field={{
              id: 'project',
              valueKey: 'id',
              labelKey: 'name',
              required: true,
              getListUrl: '/api/employees'
            }}
            onChangeData={(value) => handleFieldChange('project', value)}
          />
          <div className="flex items-center justify-center">
            <ERPButton
              title="Bill Wise"
              variant="primary"
              // disabled={isSaving}
              // loading={isSaving}
              type="button"
            // onClick={handleSubmit}
            />
          </div>
        </div>

      </div>
      <ErpDevGrid
        columns={columns}
        allowFiltering={false}
        dataUrl={Urls.acc_reports_ledger}
        hideGridAddButton={true}
        hideDefaultExportButton={true}
        hideDefaultSearchPanel={true}
        hideGridHeader={true}
        enablefilter={false}
        data={data}
        gridId={gridName}
      ></ErpDevGrid>
    </>
  )
}