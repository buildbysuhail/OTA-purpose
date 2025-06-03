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


interface HeaderDesignerProps {

}

const AccStandardTransaction = ({}: HeaderDesignerProps) => {
  const { t } = useTranslation('system')
  const [searchParams] = useSearchParams();
  const [currentTab, setTab] = useState<"org_detail" | "cust_detail" | "document_detail" | "">("org_detail");
  const templateGroup = searchParams?.get("template_group");
  const location = useLocation();
  const { templateKind } = location.state || {};
  const templateData = useSelector((state: any) => state?.Template) as TemplateReducerState;
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

          <div className="text-sm">{t("document_title")}</div>

         
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


