import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { accTableState, ItemTableState, TemplateState } from "./interfaces";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPTab from "../../../components/ERPComponents/erp-tab";
import VoucherType from "../../../enums/voucher-types";

interface ItemTableDesignerProps {
 accTableState?: accTableState;
  onChange?: (state: accTableState) => void;
  template?: TemplateState;
}



const LabelsEditor = ({ accTableState, onChange }: ItemTableDesignerProps) => {
  const [searchParams] = useSearchParams();

  const templateGroup = searchParams?.get("template_group")! as VoucherType | string

  return (
    <>
      
        <ERPCheckbox
          id="showLineItemNumber"
          label="Line Item Number"
          checked={ accTableState
    ?.showLineItemNumber}
          onChange={(e) => onChange?.({  ...accTableState
    , showLineItemNumber: e.target.checked })}
        />
   

      { accTableState
  ?.showLineItemNumber && (
        <div className=" flex gap-2">
          <ERPInput
            id="lineItemNumberWidth"
            label="Width"
            className="w-20"
            value={ accTableState
  ?.lineItemNumberWidth}
            onChange={(e) => onChange?.({  ...accTableState
  , lineItemNumberWidth: e.target?.value })}
          />
          <ERPInput
            id="lineItemNumberLabel"
            label="Line Item Number"
            value={ accTableState
   ?.lineItemNumberLabel}
            onChange={(e) => onChange?.({  ...accTableState
   , lineItemNumberLabel: e.target?.value })}
          />
        </div>
      )}

     
        <ERPCheckbox
          id="showInvoiceNumber"
          label={"Invoice Number"}
          checked={ accTableState?.showInvoiceNumber}
          onChange={(e) => onChange?.({  ...accTableState, showInvoiceNumber: e.target.checked })}
        />
      { accTableState   ?.showInvoiceNumber && (
        <div className=" flex gap-2">
          <ERPInput
            id="InvoiceNumberWidth"
            label="Width"
            className="w-20"
            value={ accTableState?.InvoiceNumberWidth}

            onChange={(e) => onChange?.({  ...accTableState, InvoiceNumberWidth: e.target?.value })}

          />
          <ERPInput
            id="InvoiceNumberLabel"
            label="Invoice Number"
            placeholder="Invoice Number"
            value={ accTableState?.InvoiceNumberLabel}
            onChange={(e) => onChange?.({  ...accTableState, InvoiceNumberLabel: e.target?.value })}
          />
        </div>
      )}

        <ERPCheckbox
          id="showInvoiceDate"
          label={"Invoice Date"}
          checked={ accTableState?.showInvoiceDate}
          onChange={(e) => onChange?.({  ...accTableState, showInvoiceDate: e.target.checked })}
        />

      { accTableState   ?.showInvoiceDate && (
        <div className=" flex gap-2">
          <ERPInput
            id="InvoiceDateWidth"
            label="Width"
            className="w-20"
            value={ accTableState?.InvoiceDateWidth}

            onChange={(e) => onChange?.({  ...accTableState, InvoiceDateWidth: e.target?.value })}

          />
          <ERPInput
            id="InvoiceDateLabel"
            label="Invoice Date"
            placeholder="Invoice Date"
            value={ accTableState?.InvoiceDateLabel}
            onChange={(e) => onChange?.({  ...accTableState, InvoiceDateLabel: e.target?.value })}
          />
        </div>
      )}

       <ERPCheckbox
          id="showInvoiceAmount"
          label={"Invoice Amount"}
          checked={ accTableState?.showInvoiceAmount}
          onChange={(e) => onChange?.({  ...accTableState, showInvoiceAmount: e.target.checked })}
        />
        
      { accTableState   ?.showInvoiceAmount && (
        <div className=" flex gap-2">
          <ERPInput
            id="InvoiceAmountWidth"
            label="Width"
            className="w-20"
            value={ accTableState?.InvoiceAmountWidth}

            onChange={(e) => onChange?.({  ...accTableState, InvoiceAmountWidth: e.target?.value })}

          />
          <ERPInput
            id="InvoiceAmountLabel"
            label="Invoice Amount"
            placeholder="Invoice Amount"
            value={ accTableState?.InvoiceAmountLabel}
            onChange={(e) => onChange?.({  ...accTableState, InvoiceAmountLabel: e.target?.value })}
          />
        </div>
      )}
        <ERPCheckbox
          id="showWithholdingTax"
          label={"Withholding Tax"}
          checked={ accTableState?.showWithholdingTax}
          onChange={(e) => onChange?.({  ...accTableState, showWithholdingTax: e.target.checked })}
        />
        
      { accTableState   ?.showWithholdingTax && (
        <div className=" flex gap-2">
          <ERPInput
            id="WithholdingTaxWidth"
            label="Width"
            className="w-20"
            value={ accTableState?.WithholdingTaxWidth}

            onChange={(e) => onChange?.({  ...accTableState, WithholdingTaxWidth: e.target?.value })}

          />
          <ERPInput
            id="WithholdingTaxLabel"
            label="Withholding Tax"
            placeholder="Withholding Tax"
            value={ accTableState?.WithholdingTaxLabel}
            onChange={(e) => onChange?.({  ...accTableState, WithholdingTaxLabel: e.target?.value })}
          />
        </div>
      )}
        <ERPCheckbox
          id="showPaymentAmount"
          label={"Payment Amount"}
          checked={ accTableState?.showPaymentAmount}
          onChange={(e) => onChange?.({  ...accTableState, showPaymentAmount: e.target.checked })}
        />
        
      { accTableState   ?.showPaymentAmount && (
        <div className=" flex gap-2">
          <ERPInput
            id="PaymentAmountWidth"
            label="Width"
            className="w-20"
            value={ accTableState?.PaymentAmountWidth}

            onChange={(e) => onChange?.({  ...accTableState, PaymentAmountWidth: e.target?.value })}

          />
          <ERPInput
            id="PaymentAmountLabel"
            label="Payment Amount"
            placeholder="Payment Amount"
            value={ accTableState?.PaymentAmountLabel}
            onChange={(e) => onChange?.({  ...accTableState, PaymentAmountLabel: e.target?.value })}
          />
        </div>
      )}
        <ERPCheckbox
          id="showTCSAmount"
          label={"TCS Amount"}
          checked={ accTableState?.showTCSAmount}
          onChange={(e) => onChange?.({  ...accTableState, showTCSAmount: e.target.checked })}
        />
        
      { accTableState   ?.showTCSAmount && (
        <>
          <div className=" flex gap-2">
          <ERPInput
            id="TCSAmountWidth"
            label="Width"
            className="w-20"
            value={ accTableState?.TCSAmountWidth}

            onChange={(e) => onChange?.({  ...accTableState, TCSAmountWidth: e.target?.value })}

          />
          <ERPInput
            id="TCSAmountLabel"
            label="TCS Amount"
            placeholder="TCS Amount"
            value={ accTableState?.TCSAmountLabel}
            onChange={(e) => onChange?.({  ...accTableState, TCSAmountLabel: e.target?.value })}
          />
       
        </div>
          <ERPCheckbox
          id="showTCSSection"
          label={"TCS Section"}
          checked={ accTableState?.showTCSSection}
          onChange={(e) => onChange?.({  ...accTableState, showTCSSection: e.target.checked })}
        />
        </>
      
      )}



    </>
  );
};

const LayoutEditor = ({ accTableState, onChange }: ItemTableDesignerProps) => {
    const [searchParams] = useSearchParams();
    const templateGroup = searchParams?.get("template_group");
  
    return (
      <div className="flex flex-col gap-4">
        <ERPCheckbox
          id="showTableBorder"
          label="Table Border"
          onChange={(e) => onChange?.({ ...accTableState, showTableBorder: e.target.checked })}
          checked={accTableState?.showTableBorder}
        />
        {accTableState?.showTableBorder && (
          <ERPInput
            id="tableBorderColor"
            label="Border Color"
            type="color"
            value={accTableState?.tableBorderColor}
            onChange={(e) => onChange?.({ ...accTableState, tableBorderColor: e.target?.value })}
          />
        )}
        <h1>Table Header</h1>
  
        <ERPStepInput
          value={accTableState?.headerFontSize}
          onChange={(headerFontSize) => onChange?.({ ...accTableState, headerFontSize })}
          label="Size (8-28)"
          id="headerFontSize"
          placeholder=" "
          defaultValue={10}
          min={8}
          max={28}
          step={1}
        />
  
        <ERPCheckbox
          id="showTableHeaderBg"
          label="Background"
          onChange={(e) => {
            onChange?.({ ...accTableState, showTableHeaderBg: e.target.checked });
          }}
          checked={accTableState?.showTableHeaderBg}
        />
        {accTableState?.showTableHeaderBg && (
          <ERPInput
            id="tableHeaderBgColor"
            label="Background Color"
            type="color"
            value={accTableState?.tableHeaderBgColor}
            onChange={(e) => {
              onChange?.({ ...accTableState, tableHeaderBgColor: e.target?.value });
            }}
          />
        )}
  
        <ERPInput
          id="headerFontColor"
          label="Font Color"
          type="color"
          value={accTableState?.headerFontColor}
          onChange={(e) => {
            onChange?.({ ...accTableState, headerFontColor: e.target?.value });
          }}
        />
  
        <h1>Item Row</h1>
        <ERPStepInput
          value={accTableState?.itemRowFontSize}
          onChange={(itemRowFontSize) => onChange?.({ ...accTableState, itemRowFontSize })}
          label="Size (8-28)"
          id="itemRowFontSize"
          placeholder=" "
          defaultValue={10}
          min={8}
          max={28}
          step={1}
        />
       <ERPInput
        id="itemRowFontColor"
        label="Font Color"
        type="color"
        value={accTableState?.itemRowFontColor}
        onChange={(e) => {
         onChange?.({ ...accTableState, itemRowFontColor: e.target?.value });
        }}
        />
        <ERPCheckbox
          id="showRowBg"
          label="Background"
          onChange={(e) => {
            onChange?.({ ...accTableState, showRowBg: e.target.checked });
          }}
          checked={accTableState?.showRowBg}
        />
        {accTableState?.showRowBg && (
            <ERPInput
            id="itemRowBgColor"
            label="Background Color"
            type="color"
            value={accTableState?.itemRowBgColor}
            onChange={(e) => {
            onChange?.({ ...accTableState, itemRowBgColor: e.target?.value });
            }}
        />
        )}
      </div>
    );
 };
  

const AccTableDesigner = ({ accTableState, onChange }: ItemTableDesignerProps) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-auto">
      <div>
        <ERPTab tabs={["Labels", "Layout"]} activeTab={activeTab} onClickTabAt={(index) => setActiveTab(index)} />
      </div>
      {activeTab === 0 && <LabelsEditor accTableState={accTableState} onChange={onChange} />}
      {activeTab === 1 && <LayoutEditor accTableState={accTableState} onChange={onChange} />}
    </div>
  );
};

export default AccTableDesigner;
