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
  const [asd, setAsd] = useState<string>('')
  const handleFieldChange = useCallback((field: string, value: any) => {
    // Implementation for field change
    console.log(field, value)
  }, [])

  return (
    <div className="p-4 space-y-6 border rounded-lg">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-6">
          <ERPInput

            useMUI
            id="voucherNo"
            label="Voucher Prefix"
            disabled={true}
            // value={formData.voucherNo}
            //data={formData}
            onChangeData={(value) => handleFieldChange('voucherNo', value)}
          />
          <ERPInput

            useMUI
            variant="outlined"
            customSize="sm"
            id="voucherNo"
            label="Voucher No."
            value={asd}
            //data={formData}
            onChange={(e) => setAsd(e.target.value)}
          />
          <ERPDateInput
            id="date"
            label="Date"
            // value={formData.date}
            //data={formData}
            onChangeData={(value) => handleFieldChange('date', value)}
          />
          <ERPInput
            id="refNo"
            label="Ref No."
            customSize="lg"
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

          <div className="w-1/4">
            <div className="flex justify-between items-center">
              <label htmlFor="cashAccount" className="text-xs font-medium">Cash Account</label>
              <span className="text-xs text-gray-500">Bal:</span>
            </div>
            <ERPDataCombobox
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
          <div className="flex justify-between items-center ">
            <label htmlFor="cashAccount" className="text-xs font-medium">Cash Account</label>
            <span className="text-xs text-gray-500">Bal:</span>
          </div>
          <ERPDataCombobox
            id="ledger"
            field={{
              id: "ledger",
              required: true,
              getListUrl: Urls.data_acc_ledgers,
              valueKey: "id",
              labelKey: "name",
            }}
            label=" "
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

      <div className="flex justify-between items-center">
        <div className="text-sm">Amount In Words: Zero only</div>
        <div className="font-bold">TOTAL: 0.00</div>
      </div>

      <div className="grid grid-cols-3 gap-6">
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
        <ERPInput
          useMUI
          variant="outlined"
          customSize="sm"
          id="voucherNo"
          label="Voucher No."
          value={asd}
          //data={formData}
          onChange={(e) => setAsd(e.target.value)}
        />
        <ERPInput
          useMUI
          variant="outlined"
          customSize="md"
          id="voucherNo"
          label="Voucher No."
          value={asd}
          //data={formData}
          onChange={(e) => setAsd(e.target.value)}
        />
        <ERPInput
          useMUI
          variant="outlined"
          customSize="lg"
          id="voucherNo"
          label="Voucher No."
          value={asd}
          //data={formData}
          onChange={(e) => setAsd(e.target.value)}
        />
        <ERPInput
          useMUI
          variant="standard"
          customSize="sm"
          id="voucherNo"
          label="Voucher No."
          value={asd}
          //data={formData}
          onChange={(e) => setAsd(e.target.value)}
        />
        <ERPInput
          useMUI
          variant="standard"
          customSize="md"
          id="voucherNo"
          label="Voucher No."
          value={asd}
          //data={formData}
          onChange={(e) => setAsd(e.target.value)}
        />
        <ERPInput
          useMUI
          variant="standard"
          customSize="lg"
          id="voucherNo"
          label="Voucher No."
          value={asd}
          //data={formData}
          onChange={(e) => setAsd(e.target.value)}
        />
        <ERPInput
          useMUI
          variant="filled"
          customSize="sm"
          id="voucherNo"
          label="Voucher No."
          value={asd}
          //data={formData}
          onChange={(e) => setAsd(e.target.value)}
        />
        <ERPInput
          useMUI
          variant="filled"
          customSize="md"
          id="voucherNo"
          label="Voucher No."
          value={asd}
          //data={formData}
          onChange={(e) => setAsd(e.target.value)}
        />
        <ERPInput
          useMUI
          variant="filled"
          customSize="lg"
          id="voucherNo"
          label="Voucher No."
          value={asd}
          //data={formData}
          onChange={(e) => setAsd(e.target.value)}
        />
      </div>
    </div>
  )
}