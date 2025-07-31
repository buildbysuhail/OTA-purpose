import { useEffect, useState } from "react";
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
import { ERPScrollArea } from "../../../../../../components/ERPComponents/erp-scrollbar";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../../../redux/store";


interface HeaderDesignerProps {

}

const AccStandardTransaction = ({}: HeaderDesignerProps) => {
  const { t } = useTranslation('system')
  const [searchParams] = useSearchParams();
  const [currentTab, setTab] = useState<"org_detail" | "cust_detail" | "document_detail" | "">("org_detail");
  const templateGroup = searchParams?.get("template_group");
  const location = useLocation();
  const { templateKind } = location.state || {};
  const templateData = useSelector((state: RootState) => state?.Template)
  const headerState = templateData?.activeTemplate?.headerState;
  const [maxHeight, setMaxHeight] = useState<number>(500);
  const dispatch = useDispatch();
    const handleChange = (headerState:HeaderState) => {
            dispatch(setTemplateHeaderState(headerState));
 
    }
        useEffect(() => {
            let wh = window.innerHeight;
            setMaxHeight(wh);
        }, []);
  return (
  
     <ERPScrollArea
       className={`overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${maxHeight - 100}px] flex-col gap-1`}>
          <div className="transition-all  flex flex-col gap-4  p-4 ">

         
     <div className="text-sm">{t("transaction_details")}</div>
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
        </div>
      </ERPScrollArea>
    
  );
};

export default AccStandardTransaction;


