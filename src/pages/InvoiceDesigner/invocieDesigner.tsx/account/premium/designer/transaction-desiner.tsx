import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { TemplateReducerState } from "../../../../../../redux/reducers/TemplateReducer";
import { ChevronDownIcon } from "lucide-react";
import ERPCheckbox from "../../../../../../components/ERPComponents/erp-checkbox";
import ErpInput from "../../../../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../../../../components/ERPComponents/erp-step-input";
import ERPSlider from "../../../../../../components/ERPComponents/erp-slider";
import { HeaderState } from "../../../../Designer/interfaces";
import { setTemplateHeaderState } from "../../../../../../redux/slices/templates/reducer";


interface HeaderDesignerProps {

}

const AccPremiumTransaction = ({}: HeaderDesignerProps) => {
  const [searchParams] = useSearchParams();
  const [currentTab, setTab] = useState<"org_detail" | "cust_detail" | "document_detail" | "">("org_detail");
  const templateGroup = searchParams?.get("template_group");
  const location = useLocation();
  const { templateKind } = location.state || {};
  const templateData = useSelector((state: any) => state?.Template) as TemplateReducerState;
  const headerState = templateData?.activeTemplate?.headerState;
  const dispatch = useDispatch();
    const handleChange = (headerState:HeaderState) => {
            dispatch(setTemplateHeaderState(headerState));
 
    }
     const isCustomer = typeof templateGroup === 'string' && !["PARP","RARP"].includes(templateGroup);
  return (
    <div className="flex h-full overflow-auto flex-col gap-1 bg-[#F9F9FB]">
       <div
          className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
          onClick={() => setTab(currentTab === "cust_detail" ? "" : "cust_detail")}
        >
          {isCustomer ? "Customer Details" : "Vendor Details"}
          <ChevronDownIcon className={`h-5  ${currentTab === "cust_detail" ? "" : "-rotate-90"} transition-all`} />
        </div>
{currentTab === "cust_detail" && <div className="flex flex-col gap-3 bg-white p-4">

        <div className="text-sm">{isCustomer ? "Customer" : "Vendor"} name</div>
      {!isCustomer && (
        <>
         <ERPCheckbox
              id="showVender"
              label={ "Show Vendor"}
              checked={headerState?.showVender}
              onChange={(e) => handleChange({ ...headerState, showVender: e.target.checked })}
            />

          {headerState?.showVender &&(
            <>
              <ErpInput
              type="color"
              id="bg_color"
              placeholder=""
              label="Font Color"
              value={headerState?.venderNameFontColor}
              onChange={(e) => handleChange?.({ ...headerState, venderNameFontColor: e.target?.value })}
            />
      <div className="flex items-center space-x-3">
            <div className="basis-2/3 ">
              <ERPSlider
                 id="venderNameFontSize"
                label={"Font Size (pts)"}
                className="bg-slate-300"
                value={headerState?.venderNameFontSize ?? 12}
                onChange={(e) =>
                  handleChange?.({ ...headerState, venderNameFontSize: parseInt(e.target.value, 10) })
                }
                min={5}
                max={28}
                step={1}
              />
            </div>
            <div className="basis-1/3 translate-y-3">
              <ErpInput
                 id="venderNameFontSize"
                type="number"
                noLabel
                value={headerState?.venderNameFontSize ?? 12}
                data={headerState}
                onChange={(e) => {
                  const value = e.target.value;
                  const venderNameFontSize = value === "" ? 0 : parseInt(value, 10);
                  handleChange?.({
                    ...headerState,
                      venderNameFontSize
                  });
                }}
            
               min={5}
               max={28}
               step={1}
              />
            </div>
          </div>
     
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
              onChange={(e) => handleChange({ ...headerState, showReceivedFrom: e.target.checked })}
            />

          {headerState?.showReceivedFrom &&(
            <ErpInput
            noLabel
            id="receivedFromLabel"
            value={headerState?.receivedFromLabel}
            onChange={(e) => handleChange({ ...headerState, receivedFromLabel: e.target?.value })}
            />
          )}
          
        <ErpInput
          type="color"
          id="bg_color"
          placeholder=""
          label="Font Color"
          value={headerState?.customerNameFontColor}
          onChange={(e) => handleChange?.({ ...headerState, customerNameFontColor: e.target?.value })}
        />
       <div className="flex items-center space-x-3">
            <div className="basis-2/3 ">
              <ERPSlider
                 id="customerNameFontSize"
                label={"Font Size (pts)"}
                className="bg-slate-300"
                value={headerState?.customerNameFontSize ?? 12}
                onChange={(e) =>
                  handleChange?.({ ...headerState, customerNameFontSize: parseInt(e.target.value, 10) })
                }
                min={5}
                max={28}
                step={1}
              />
            </div>
            <div className="basis-1/3 translate-y-3">
              <ErpInput
                 id="customerNameFontSize"
                type="number"
                noLabel
                value={headerState?.customerNameFontSize ?? 12}
                data={headerState}
                onChange={(e) => {
                  const value = e.target.value;
                  const customerNameFontSize = value === "" ? 0 : parseInt(value, 10);
                  handleChange?.({
                    ...headerState,
                      customerNameFontSize
                  });
                }}
            
               min={5}
               max={28}
               step={1}
              />
            </div>
          </div>

          <ERPCheckbox
            id="hasBillTo"
            label="Bill To"
            checked={headerState?.hasBillTo}
            onChange={(e) => handleChange({ ...headerState, hasBillTo: e.target.checked })}
          />

          <ErpInput
            noLabel
            id="billTo"
            label="Bill To"
            value={headerState?.billTo ?? "Bill To"}
            onChange={(e) => handleChange({ ...headerState, billTo: e.target?.value })}
          />
        
        
          <ERPCheckbox
            id="hasShipTo"
            label="Ship To"
            checked={headerState?.hasShipTo}
            onChange={(e) => handleChange({ ...headerState, hasShipTo: e.target.checked })}
          />

          <ErpInput
            noLabel
            id="ship_to"
            label="Ship To"
            value={headerState?.shipTo ?? "Ship To"}
            onChange={(e) => handleChange({ ...headerState, shipTo: e.target?.value })}
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
                onChange={(e) => handleChange({ ...headerState, showDocTitle: e.target.checked })}
              />
              {headerState?.showDocTitle && (
                <div className="flex items-center gap-2">
           
              <ERPCheckbox
                checked={headerState?.docTitleUnderline}
                id="docTitleUnderline" label="Title Underline"
                onChange={(e) => handleChange({ ...headerState, docTitleUnderline: e.target.checked })}
              />
                  <ErpInput
                  className="w-full"
                  id="docTitle"
                  noLabel
                  value={headerState?.docTitle}
                  onChange={(e) => handleChange({ ...headerState, docTitle: e.target?.value })}
                />  
                </div>
              
              )}
            </div>
         

          <ErpInput
            value={headerState?.docTitleFontColor}
            onChange={(e) => handleChange?.({ ...headerState, docTitleFontColor: e.target?.value })}
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
                  handleChange?.({ ...headerState, docTitleFontSize: parseInt(e.target.value, 10) })
                }
                min={5}
                max={28}
                step={1}
              />
            </div>
            <div className="basis-1/3 translate-y-3">
              <ErpInput
                 id="docTitleFontSize"
                type="number"
                noLabel
                value={headerState?.docTitleFontSize??10}
                data={headerState}
                onChange={(e) => {
                  const value = e.target.value;
                  const docTitleFontSize = value === "" ? 0 : parseInt(value, 10);
                  handleChange?.({
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
         
    
         

       <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="showPaymentMode"
                label="Payment Mode"
                checked={headerState?.accountTransactionInfo?.showPaymentMode}
                onChange={(e) => handleChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, showPaymentMode: e.target.checked } })}
              />

              {headerState?.accountTransactionInfo?.showPaymentMode && (
                <ErpInput
                  noLabel
                  id="paymentMode"
                  value={headerState?.accountTransactionInfo?.paymentMode}
                  onChange={(e) => handleChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, paymentMode: e.target?.value } })}
                />
              )}
            </div>
         

            <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="showDateField"
                label="Date Field"
                checked={headerState?.accountTransactionInfo?.showDateField}
                onChange={(e) => handleChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, showDateField: e.target.checked } })}
              />

              {headerState?.accountTransactionInfo?.showDateField && (
                <ErpInput
                  noLabel
                  id="dateField"
                  value={headerState?.accountTransactionInfo?.dateField}
                  onChange={(e) => handleChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, dateField: e.target?.value } })}
                />
              )}
            </div>
         
         <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="showReferenceField"
                label="Reference Field"
                checked={headerState?.accountTransactionInfo?.showReferenceField}
                onChange={(e) => handleChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, showReferenceField: e.target.checked } })}
              />

              {headerState?.accountTransactionInfo?.showReferenceField && (
                <ErpInput
                  noLabel
                  id="referenceField"
                  value={headerState?.accountTransactionInfo?.referenceField}
                  onChange={(e) => handleChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, referenceField: e.target?.value } })}
                />
              )}
            </div>
      
        <div className="flex flex-col gap-2">
              <ERPCheckbox
              id="headerStateNumberField"
                label="Number Field"
                checked={headerState?.showNumberField}
                onChange={(e) => handleChange({ ...headerState, showNumberField: e.target.checked })}
              />
              {headerState?.showNumberField && (
                <ErpInput
                  noLabel
                  id="numberField"
                  value={headerState?.numberField}
                  onChange={(e) => handleChange({ ...headerState, numberField: e.target?.value })}
                />
              )}
        </div>

        
        
        
            {/* <ERPCheckbox
              id="showAmountInWords"
                label="show Amount In Words"
                checked={headerState?.accountTransactionInfo?.showAmountInWords}
                onChange={(e) => handleChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, showAmountInWords: e.target.checked } })}
            /> */}
          

        
         
      
     

        </div>}


    </div>
  );
};

export default AccPremiumTransaction;


