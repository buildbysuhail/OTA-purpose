import { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { HeaderState, TemplateState } from "../interfaces";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPSlider from "../../../../components/ERPComponents/erp-slider";
import ERPStepInput from "../../../../components/ERPComponents/erp-step-input";
import { RootState } from "../../../../redux/store";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import VoucherType from "../../../../enums/voucher-types";
import { accTransaction } from "../../constants/TemplateCategories";


interface HeaderDesignerProps {
  onChange: (state: HeaderState) => void;
  template?: TemplateState;
  templateKind?: string;
}

const AccountTransactionDetailsDesigner = ({ template, onChange,templateKind}: HeaderDesignerProps) => {
  const [searchParams] = useSearchParams();
  const [currentTab, setTab] = useState<"org_detail" | "cust_detail" | "document_detail" | "">("org_detail");
  const templateGroup = searchParams?.get("template_group");

  const headerState = template?.headerState;

  const isCustomer = typeof templateGroup === 'string' && !["PARP","RARP"].includes(templateGroup);
  return (
    <div className="flex h-full overflow-auto flex-col gap-1 bg-[#F9F9FB]">

      {templateKind !== "standard"  &&
        <div
          className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
          onClick={() => setTab(currentTab === "cust_detail" ? "" : "cust_detail")}
        >
          {isCustomer ? "Customer Details" : "Vendor Details"}
          <ChevronDownIcon className={`h-5  ${currentTab === "cust_detail" ? "" : "-rotate-90"} transition-all`} />
        </div>
      }

      {currentTab === "cust_detail" && <div className="flex flex-col gap-3 bg-white p-4">

        <div className="text-sm">{isCustomer ? "Customer" : "Vendor"} name</div>
      {!isCustomer && (
        <>
         <ERPCheckbox
              id="showVender"
              label={ "Show Vendor"}
              checked={headerState?.showVender}
              onChange={(e) => onChange({ ...headerState, showVender: e.target.checked })}
            />

          {headerState?.showVender &&(
            <>
              <ERPInput
              type="color"
              id="bg_color"
              placeholder=""
              label="Font Color"
              value={headerState?.venderNameFontColor}
              onChange={(e) => onChange?.({ ...headerState, venderNameFontColor: e.target?.value })}
            />
    
            <ERPStepInput
              min={8}
              step={1}
              max={28}
              placeholder=" "
              id="font_size"
              label="Font Size (pts)"
              value={headerState?.venderNameFontSize ?? 12}
              onChange={(font_size) => onChange?.({ ...headerState, venderNameFontSize: font_size })}
            />
            </>
          
          )}
          
   

        </>
      )}
       {isCustomer && (
        <>
         <ERPCheckbox
              id="showReceivedFrom"
              label={ "Received From"}
              checked={headerState?.showReceivedFrom}
              onChange={(e) => onChange({ ...headerState, showReceivedFrom: e.target.checked })}
            />

          {headerState?.showReceivedFrom &&(
            <ERPInput
            noLabel
            id="receivedFromLabel"
            value={headerState?.receivedFromLabel}
            onChange={(e) => onChange({ ...headerState, receivedFromLabel: e.target?.value })}
            />
          )}
          
        <ERPInput
          type="color"
          id="bg_color"
          placeholder=""
          label="Font Color"
          value={headerState?.customerNameFontColor}
          onChange={(e) => onChange?.({ ...headerState, customerNameFontColor: e.target?.value })}
        />

        <ERPStepInput
          min={8}
          step={1}
          max={28}
          placeholder=" "
          id="font_size"
          label="Font Size (pts)"
          value={headerState?.customerNameFontSize ?? 12}
          onChange={(font_size) => onChange?.({ ...headerState, customerNameFontSize: font_size })}
        />

          <ERPCheckbox
            id="hasBillTo"
            label="Bill To"
            checked={headerState?.hasBillTo}
            onChange={(e) => onChange({ ...headerState, hasBillTo: e.target.checked })}
          />

          <ERPInput
            noLabel
            id="billTo"
            label="Bill To"
            value={headerState?.billTo ?? "Bill To"}
            onChange={(e) => onChange({ ...headerState, billTo: e.target?.value })}
          />
        
        
          <ERPCheckbox
            id="hasShipTo"
            label="Ship To"
            checked={headerState?.hasShipTo}
            onChange={(e) => onChange({ ...headerState, hasShipTo: e.target.checked })}
          />

          <ERPInput
            noLabel
            id="ship_to"
            label="Ship To"
            value={headerState?.shipTo ?? "Ship To"}
            onChange={(e) => onChange({ ...headerState, shipTo: e.target?.value })}
          />
        </>
       )}
          
      </div>
      }

    

      <div
        className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
        onClick={() => setTab(currentTab === "document_detail" ? "" : "document_detail")}
      >
        Document Details<ChevronDownIcon className={`h-5  ${currentTab === "document_detail" ? "" : "-rotate-90"} transition-all`} />
      </div>
      {/* */}

      {currentTab === "document_detail" &&
        <div className="flex flex-col gap-3 bg-white p-4">

          <div className="text-sm">Document Title</div>

         
            <div className="flex flex-col gap-2">
              <ERPCheckbox
                checked={headerState?.showDocTitle}
                id="showDocTitle" label="Document Title"
                onChange={(e) => onChange({ ...headerState, showDocTitle: e.target.checked })}
              />
              {headerState?.showDocTitle && (
                <div className="flex items-center gap-2">
           
              <ERPCheckbox
                checked={headerState?.docTitleUnderline}
                id="docTitleUnderline" label="Title Underline"
                onChange={(e) => onChange({ ...headerState, docTitleUnderline: e.target.checked })}
              />
                  <ERPInput
                  className="w-full"
                  id="docTitle"
                  noLabel
                  value={headerState?.docTitle}
                  onChange={(e) => onChange({ ...headerState, docTitle: e.target?.value })}
                />  
                </div>
              
              )}
            </div>
         

          <ERPInput
            value={headerState?.docTitleFontColor}
            onChange={(e) => onChange?.({ ...headerState, docTitleFontColor: e.target?.value })}
            label="Font Color"
            id="bg_color"
            type="color"
            placeholder=""
            customSize="md"
          />
          <div className="flex items-center space-x-3">
            <div className="basis-2/3 ">
              <ERPSlider
                 id="docTitleFontSize"
                label={"Font Size (pts)"}
                className="bg-slate-300"
                value={headerState?.docTitleFontSize??10}
                onChange={(e) =>
                  onChange?.({ ...headerState, docTitleFontSize: parseInt(e.target.value, 10) })
                }
                min={5}
                max={28}
                step={1}
              />
            </div>
            <div className="basis-1/3 translate-y-3">
              <ERPInput
                 id="docTitleFontSize"
                type="number"
                noLabel
                value={headerState?.docTitleFontSize??10}
                data={headerState}
                onChange={(e) => {
                  const value = e.target.value;
                  const docTitleFontSize = value === "" ? 0 : parseInt(value, 10);
                  onChange?.({
                    ...headerState,
                      docTitleFontSize
                  });
                }}
            
               min={5}
               max={28}
               step={1}
              />
            </div>
          </div>
          {/* <ERPStepInput
            value={headerState?.docTitleFontSize ?? 16}
            onChange={(font_size) => onChange?.({ ...headerState, docTitleFontSize: font_size })}
            label="Font Size (pts)"
            id="font_size"
            placeholder=" "
            min={8}
            max={28}
            step={1}
          /> */}


          {/*  */}
       {["PARP","RARP","Cheque"].includes(templateGroup as string)&&(
        <>
         <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="showVoucherNumber"
                label="Voucher Number"
                checked={headerState?.adviceTransInfo?.showVoucherNumber}
                onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, showVoucherNumber: e.target.checked } })}
              />

              {headerState?.adviceTransInfo?.showVoucherNumber && (
                <ERPInput
                  noLabel
                  id="voucherNumber"
                  value={headerState?.adviceTransInfo?.voucherNumber}
                  onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, voucherNumber: e.target?.value } })}
                />
              )}
          </div>

          <div className="flex items-center gap-2">
              <ERPCheckbox
              id="showPrefix"
                label="show prefix"
                checked={headerState?.adviceTransInfo?.showPrefix}
                onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, showPrefix: e.target.checked } })}
              />

              <ERPCheckbox
              id="showFormType"
                label="show formType"
                checked={headerState?.adviceTransInfo?.showFormType}
                onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, showFormType: e.target.checked } })}
              />
          </div>

          <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="showPaymentMode"
                label="Payment Mode"
                checked={headerState?.adviceTransInfo?.showPaymentMode}
                onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, showPaymentMode: e.target.checked } })}
              />

              {headerState?.adviceTransInfo?.showPaymentMode && (
                <ERPInput
                  noLabel
                  id="paymentMode"
                  value={headerState?.adviceTransInfo?.paymentMode}
                  onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, paymentMode: e.target?.value } })}
                />
              )}
            </div>
         

            <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="showDateField"
                label="Date Field"
                checked={headerState?.adviceTransInfo?.showDateField}
                onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, showDateField: e.target.checked } })}
              />

              {headerState?.adviceTransInfo?.showDateField && (
                <ERPInput
                  noLabel
                  id="dateField"
                  value={headerState?.adviceTransInfo?.dateField}
                  onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, dateField: e.target?.value } })}
                />
              )}
            </div>
         

            <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="showReferenceField"
                label="Reference Field"
                checked={headerState?.adviceTransInfo?.showReferenceField}
                onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, showReferenceField: e.target.checked } })}
              />

              {headerState?.adviceTransInfo?.showReferenceField && (
                <ERPInput
                  noLabel
                  id="referenceField"
                  value={headerState?.adviceTransInfo?.referenceField}
                  onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, referenceField: e.target?.value } })}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="showPaymentAmount"
                label="Payment Amount"
                checked={headerState?.adviceTransInfo?.showPaymentAmount}
                onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, showPaymentAmount: e.target.checked } })}
              />

              {headerState?.adviceTransInfo?.showPaymentAmount && (
                <ERPInput
                  noLabel
                  id="paymentAmount"
                  value={headerState?.adviceTransInfo?.paymentAmount}
                  onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, paymentAmount: e.target?.value } })}
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="showBank"
                label="Bank"
                checked={headerState?.adviceTransInfo?.showBank}
                onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, showBank: e.target.checked } })}
              />

              {headerState?.adviceTransInfo?.showBank && (
                <ERPInput
                  noLabel
                  id="bank"
                  value={headerState?.adviceTransInfo?.bank}
                  onChange={(e) => onChange({ ...headerState, adviceTransInfo: { ...headerState?.adviceTransInfo, bank: e.target?.value } })}
                />
              )}
            </div>
        </>
       )}
         
     {accTransaction.includes(templateGroup as VoucherType) &&
     <>
       <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="showPaymentMode"
                label="Payment Mode"
                checked={headerState?.accountTransactionInfo?.showPaymentMode}
                onChange={(e) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, showPaymentMode: e.target.checked } })}
              />

              {headerState?.accountTransactionInfo?.showPaymentMode && (
                <ERPInput
                  noLabel
                  id="paymentMode"
                  value={headerState?.accountTransactionInfo?.paymentMode}
                  onChange={(e) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, paymentMode: e.target?.value } })}
                />
              )}
            </div>
         

            <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="showDateField"
                label="Date Field"
                checked={headerState?.accountTransactionInfo?.showDateField}
                onChange={(e) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, showDateField: e.target.checked } })}
              />

              {headerState?.accountTransactionInfo?.showDateField && (
                <ERPInput
                  noLabel
                  id="dateField"
                  value={headerState?.accountTransactionInfo?.dateField}
                  onChange={(e) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, dateField: e.target?.value } })}
                />
              )}
            </div>
         
         {templateKind !== "standard" && (
           <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="showReferenceField"
                label="Reference Field"
                checked={headerState?.accountTransactionInfo?.showReferenceField}
                onChange={(e) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, showReferenceField: e.target.checked } })}
              />

              {headerState?.accountTransactionInfo?.showReferenceField && (
                <ERPInput
                  noLabel
                  id="referenceField"
                  value={headerState?.accountTransactionInfo?.referenceField}
                  onChange={(e) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, referenceField: e.target?.value } })}
                />
              )}
            </div>
         )   
        }
      
        <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="headerStateNumberField"
                label="Number Field"
                checked={headerState?.showNumberField}
                onChange={(e) => onChange({ ...headerState, showNumberField: e.target.checked })}
              />
              {headerState?.showNumberField && (
                <ERPInput
                  noLabel
                  id="numberField"
                  value={headerState?.numberField}
                  onChange={(e) => onChange({ ...headerState, numberField: e.target?.value })}
                />
              )}
        </div>

        
        
          {/* */}
            <ERPCheckbox
              id="showAmountInWords"
                label="show Amount In Words"
                checked={headerState?.accountTransactionInfo?.showAmountInWords}
                onChange={(e) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, showAmountInWords: e.target.checked } })}
            />
          {/* */}

         {/* Amount Recived */}
         {templateKind !== "standard" &&(
          <>
          <ERPInput
            label="Amount Received"
            id="amtReceivedLabel"
            value={headerState?.accountTransactionInfo?.amtReceivedLabel}
            onChange={(e) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, amtReceivedLabel: e.target?.value } })}
          />

          {/* <div className="flex justify-start gap-4 ">
             <label htmlFor="currencySymbolPosition" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70  font-semibold">
              Currency Symbol Position
              </label>
              <div className="flex flex-col gap-1">
              <ERPRadio
                id="currencySymbolBefore"
                name="currencySymbolPosition"
                checked={headerState?.accountTransactionInfo?.currencySymbolPosition === "before"}
                onChange={(e) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, currencySymbolPosition: "before"} })}
                label="Before"
              />
              <ERPRadio
                id="currencySymbolAfter"
                name="currencySymbolPosition"
                checked={headerState?.accountTransactionInfo?.currencySymbolPosition === "after"}
                  onChange={(e) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, currencySymbolPosition: "after" } })}
                label="After"
              />
             </div>
          </div> */}
          <label htmlFor="amtReceived" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70  font-semibold">
          Amount Received
          </label>
          <ERPInput
            value={headerState?.accountTransactionInfo?.amtReceivedFontColor}
            onChange={(e) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, amtReceivedFontColor: e.target?.value } })}
            label="Font Color"
            id="amtFont_color"
            type="color"
            placeholder=""
          />
            <ERPInput
            value={headerState?.accountTransactionInfo?.amtReceivedBgColor}
            onChange={(e) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, amtReceivedBgColor: e.target?.value } })}
            label="Background Color"
            id="amtBg_color"
            type="color"
            placeholder=""
          />
          <ERPStepInput
            value={headerState?.accountTransactionInfo?.amtReceivedFontSize ?? 16}
            onChange={(font_size) => onChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, amtReceivedFontSize: font_size} })}
            label="Font Size (pts)"
            id="font_size"
            placeholder=" "
            min={8}
            max={28}
            step={1}
          />
         </>
        )}
         
      
     </>
     }

        </div>}


    </div>
  );
};

export default AccountTransactionDetailsDesigner;


