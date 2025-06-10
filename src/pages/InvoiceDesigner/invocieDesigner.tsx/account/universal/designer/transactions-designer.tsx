import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { TemplateReducerState } from "../../../../../../redux/reducers/TemplateReducer";
import { ChevronDownIcon } from "lucide-react";
import ERPCheckbox from "../../../../../../components/ERPComponents/erp-checkbox";
import ErpInput from "../../../../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../../../../components/ERPComponents/erp-step-input";
import ERPSlider from "../../../../../../components/ERPComponents/erp-slider";
import { HeaderState, TotalState } from "../../../../Designer/interfaces";
import { setTemplateHeaderState, setTemplateTotalState } from "../../../../../../redux/slices/templates/reducer";
import { useTranslation } from "react-i18next";
import ErpDataCombobox from "../../../../../../components/ERPComponents/erp-data-combobox";


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
  const totalState = templateData?.activeTemplate?.totalState;
 const { t } = useTranslation('system')
    // Dispatch
  const dispatch = useDispatch();
    const handleChange = (headerState:HeaderState) => {
            dispatch(setTemplateHeaderState(headerState));
 
    }

    const handleTotalChange = (totalState: TotalState) => {
    dispatch(setTemplateTotalState(totalState));
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
       <ERPCheckbox
          checked={totalState?.showAmoutInWords}
          id="showAmoutInWords"
          label={t("show_amount_in_words")}
          onChange={(e) => handleTotalChange?.({ ...totalState, showAmoutInWords: e.target.checked })}
        />
      <ERPCheckbox
        
          checked={totalState?.showTotalSection}
          id="showTotalSection"
          label={t("show_total_section")}
          onChange={(e) => handleTotalChange?.({ ...totalState, showTotalSection: e.target.checked })}
        />


      {
        totalState?.showTotalSection && (
        <div className="p-4 flex flex-col gap-4">
      <h4>{t("total_(subtotal_tax)")}</h4>

      <ERPStepInput
        value={totalState?.totalFontSize??14}
        onChange={(totalFontSize) => handleTotalChange?.({ ...totalState, totalFontSize })}
        label={t("size_(8-19)")}
        id="totalFontSize"
        placeholder=" "
        defaultValue={9}
        min={8}
        max={19}
        step={1}
      />

      <ErpInput
        id="totalFontColor"
        label={t("font_color")}
        type="color"
        value={totalState?.totalFontColor}
        onChange={(e) => handleTotalChange?.({ ...totalState, totalFontColor: e.target?.value })}
      />

      <ERPCheckbox
        checked={totalState?.showTotalBgColor}
        id="showTotalBgColor"
        label={t("show_background_color")}
        onChange={(e) => handleTotalChange?.({ ...totalState, showTotalBgColor: e.target.checked })}
      />

      {
        totalState?.showTotalBgColor && (
          <ErpInput
            id="totalBgColor"
            label={t("background_color")}
            type="color"
            value={totalState?.totalBgColor}
            onChange={(e) => handleTotalChange?.({ ...totalState, totalBgColor: e.target?.value })}
          />
        )
      }
    </div>
        )
      }

 


        </div>}


    </div>
  );
};

export default AccUniversalTransaction;


