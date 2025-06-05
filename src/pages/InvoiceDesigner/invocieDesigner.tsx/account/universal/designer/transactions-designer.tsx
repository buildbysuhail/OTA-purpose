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

const AccUniversalTransaction = ({}: HeaderDesignerProps) => {
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
  return (
    <div className="flex h-full overflow-auto flex-col gap-1 bg-[#F9F9FB]">

      <div
        className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
        onClick={() => setTab(currentTab === "document_detail" ? "" : "document_detail")}
      >
        Document Details<ChevronDownIcon className={`h-5  ${currentTab === "document_detail" ? "" : "-rotate-90"} transition-all`} />
      </div>
      {/* */}

      {currentTab === "document_detail" &&
        <div className="flex flex-col gap-3 bg-white p-4">

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

        
        
{/*    
            <ERPCheckbox
              id="showAmountInWords"
                label="show Amount In Words"
                checked={headerState?.accountTransactionInfo?.showAmountInWords}
                onChange={(e) => handleChange({ ...headerState, accountTransactionInfo: { ...headerState?.accountTransactionInfo, showAmountInWords: e.target.checked } })}
            /> */}
          

        
         
      
     

        </div>}


    </div>
  );
};

export default AccUniversalTransaction;


