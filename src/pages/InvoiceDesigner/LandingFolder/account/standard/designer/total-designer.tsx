import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { ERPScrollArea } from "../../../../../../components/ERPComponents/erp-scrollbar";
import ERPTab from "../../../../../../components/ERPComponents/erp-tab";
import { useDispatch, useSelector } from "react-redux";
import { TemplateReducerState } from "../../../../../../redux/reducers/TemplateReducer";
import { setTemplateTotalState } from "../../../../../../redux/slices/templates/reducer";
import ERPCheckbox from "../../../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../../../components/ERPComponents/erp-input";
import ErpDataCombobox from "../../../../../../components/ERPComponents/erp-data-combobox";
import ERPStepInput from "../../../../../../components/ERPComponents/erp-step-input";
import { TotalState } from "../../../../Designer/interfaces";
interface TotalDesignerProps {
  totalState?: TotalState;
  onChange?: (totalState: TotalState) => void;
}

const LayoutEditor = ({ totalState, onChange }: TotalDesignerProps) => {
  const { t } = useTranslation('system');

  return (
    <div className="p-4 flex flex-col gap-4">
      <h4>{t("total_(subtotal_tax)")}</h4>

      <ERPStepInput
        value={totalState?.totalFontSize??14}
        onChange={(totalFontSize) => onChange?.({ ...totalState, totalFontSize })}
        label={t("size_(8-19)")}
        id="totalFontSize"
        placeholder=" "
        defaultValue={9}
        min={8}
        max={19}
        step={1}
      />

      <ERPInput
        id="totalFontColor"
        label={t("font_color")}
        type="color"
        value={totalState?.totalFontColor}
        onChange={(e) => onChange?.({ ...totalState, totalFontColor: e.target?.value })}
      />

      <ERPCheckbox
        checked={totalState?.showTotalBgColor}
        id="showTotalBgColor"
        label={t("show_background_color")}
        onChange={(e) => onChange?.({ ...totalState, showTotalBgColor: e.target.checked })}
      />

      {
        totalState?.showTotalBgColor && (
          <ERPInput
            id="totalBgColor"
            label={t("background_color")}
            type="color"
            value={totalState?.totalBgColor}
            onChange={(e) => onChange?.({ ...totalState, totalBgColor: e.target?.value })}
          />
        )
      }
    </div>
  );
};

const LabelsEditor = ({ totalState, onChange }: TotalDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const { t } = useTranslation('system')

  return (
    <div className="p-4 flex flex-col gap-4">

        <ERPCheckbox
        
          checked={totalState?.showTotalSection}
          id="showTotalSection"
          label={t("show_total_section")}
          onChange={(e) => onChange?.({ ...totalState, showTotalSection: e.target.checked })}
        />


      {
        totalState?.showTotalSection && (
          <>
          
            <ErpDataCombobox
              defaultValue={"after"}
              handleChange={(id, value) => onChange?.({ ...totalState, currencyPosition: value })}
              id="pos_currency"
              label={t("currency_symbol")}
              options={[
                { label: "Before Amount", value: "before" },
                { label: "After Amount", value: "after" },
              ]}
            />
          </>
        )
      }

        <ERPCheckbox
          checked={totalState?.showAmoutInWords}
          id="showAmoutInWords"
          label={t("show_amount_in_words")}
          onChange={(e) => onChange?.({ ...totalState, showAmoutInWords: e.target.checked })}
        />

    </div>
  );
};



const TotalStdDesigner = ({  }: TotalDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const [activeTab, setActiveTab] = useState(0);
  const [currentTab, setTab] = useState<"total_section" | "taxes" | "">("total_section");
  const { t } = useTranslation("system")
  const templateData = useSelector((state: any) => state?.Template) as TemplateReducerState;
   const dispatch = useDispatch();
  const [maxHeight, setMaxHeight] = useState<number>(500);
  useEffect(() => {
    let wh = window.innerHeight;
    setMaxHeight(wh);
  }, []);
  return (
     <ERPScrollArea className={`overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${maxHeight - 100}px] flex-col gap-1`}>
    <div className="transition-all flex flex-col gap-1 ">
      {/* <div className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4" onClick={() => setTab(currentTab === "total_section" ? "" : "total_section")}>
        <div>{t("total_section")}</div>
        <div><ChevronDownIcon className={`h-5  ${currentTab === "total_section" ? "" : "-rotate-90"} transition-all`} /></div>
      </div> */}

     
        <div className="bg-white">
          <div className="p-4">
            <ERPTab tabs={[t("labels"), t("layout")]} activeTab={activeTab} onClickTabAt={(index) => setActiveTab(index)} />
          </div>
          {activeTab === 0 && <LabelsEditor totalState={templateData?.activeTemplate?.totalState} onChange={(totalState) => dispatch(setTemplateTotalState(totalState))} />}
          {activeTab === 1 && <LayoutEditor totalState={templateData?.activeTemplate?.totalState} onChange={(totalState) => dispatch(setTemplateTotalState(totalState))} />}
        </div>
      
    </div>
     </ERPScrollArea>

  );
};

export default TotalStdDesigner;