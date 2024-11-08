'use client'

import { Card, CardHeader, CardContent } from "@mui/material"
import { useCallback } from "react"
import ERPDateInput from "../../../components/ERPComponents/erp-date-input"
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons"
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox"
import ERPInput from "../../../components/ERPComponents/erp-input"
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox"

interface CashPaymentData {
  voucherNo: string
  date: string
  refNo: string
  refDate: string
  cashAccount: string
  paidBy: string
  amount: number
  costCenter: string
  narration: string
  ledgerEntries: Array<{
    code: string
    amount: number
    narration: string
  }>
}

const initialData: CashPaymentData = {
  voucherNo: '',
  date: new Date().toISOString().split('T')[0],
  refNo: '',
  refDate: new Date().toISOString().split('T')[0],
  cashAccount: '',
  paidBy: '',
  amount: 0,
  costCenter: '',
  narration: '',
  ledgerEntries: []
}

export default function Component() {
  const handleFieldChange = useCallback((field: string, value: any) => {
    // Implementation for field change
    console.log(field, value)
  }, [])

  return (
    <div className="grid grid-cols-12 gap-x-6">
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
      <div className="grid grid-cols-8 gap-4">
          <div className="col-span-2 flex space-x-2">
            <ERPInput
              id="voucherNo"
              label="Voucher Prefix / No."
              required={true}
              // value={formData.voucherNo}
              //data={formData}
              onChangeData={(value) => handleFieldChange('voucherNo', value)}
            />
            <ERPInput
            id="voucherNo"
            label="Voucher Prefix / No."
            required={true}
            // value={formData.voucherNo}
            //data={formData}
            onChangeData={(value) => handleFieldChange('voucherNo', value)}
          />
            <ERPDateInput
              id="date"
              label="Date"
              // value={formData.date}
              //data={formData}
              onChangeData={(value) => handleFieldChange('date', value)}
            />
          </div>
          <div className="col-span-2 flex space-x-2">
            <ERPInput
              id="refNo"
              label="Ref No."
              // value={formData.refNo}
              //data={formData}
              onChangeData={(value) => handleFieldChange('refNo', value)}
            />
            <ERPDateInput
              id="refDate"
              label="Ref Date"
              // value={formData.refDate}
              //data={formData}
              onChangeData={(value) => handleFieldChange('refDate', value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ERPDataCombobox
            id="cashAccount"
            label="Cash Account"
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
          <ERPDataCombobox
            id="paidBy"
            label="Paid By"
            // value={formData.paidBy}
            data={[
              { id: '22001', name: '22001 MOHAN' }
            ]}
            field={{
              id: 'paidBy',
              valueKey: 'id',
              labelKey: 'name',
              required: true,
              getListUrl: '/api/employees'
            }}
            onChangeData={(value) => handleFieldChange('paidBy', value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ERPInput
            id="remarks"
            label="Remarks"
            // value={formData.remarks}
            // //data={formData}
            onChangeData={(value) => handleFieldChange('remarks', value)}
          />
          <ERPInput
            id="notes"
            label="Notes"
            value=""
            //data={formData}
            onChangeData={(value) => {}}
          />
        </div>

      

        <div className="flex justify-between items-center">
          <div className="text-sm">Amount In Words: Zero only</div>
          <div className="font-bold">TOTAL: 0.00</div>
        </div>

        <div className="flex items-center space-x-4">
          {/* <ERPCheckbox
            id="printOnSave"
            label="Print on Save"
            value={false}
            data={{}}
            onChangeData={() => {}}
          />
          <ERPCheckbox
            id="printPreview"
            label="Print Preview"
            value={false}
            data={{}}
            onChangeData={() => {}}
          /> */}
        </div>
      </div>
    </div>
  )
}