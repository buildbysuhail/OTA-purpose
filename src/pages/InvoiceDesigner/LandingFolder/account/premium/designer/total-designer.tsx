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
import ERPRadio from "../../../../../../components/ERPComponents/erp-radio";
import ERPSlider from "../../../../../../components/ERPComponents/erp-slider";
interface TotalDesignerProps {
  totalState?: TotalState;
  onChange?: (totalState: TotalState) => void;
}

const LayoutEditor = ({ totalState, onChange }: TotalDesignerProps) => {
  const { t } = useTranslation('system');

  return (
    <div className="p-4 flex flex-col gap-4">
      <label htmlFor="amtReceived" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70  font-semibold">
          {t("amount_received")}
      </label>
            <ERPInput
                   label="Amount Received"
                   id="amtReceivedLabel"
                  value={totalState?.amtReceivedLabel}
                  onChange={(e) => onChange?.({ ...totalState, amtReceivedLabel: e.target?.value })}
                 />    
        <div className="flex items-center space-x-3">
            <div className="basis-2/3 ">
              <ERPSlider
                id="amtReceivedFontSize"
                label={t("font_size")}
                className="bg-slate-300"
                value={totalState?.amtReceivedFontSize??12}
                onChange={(e) =>
                  onChange?.({ ...totalState, amtReceivedFontSize: parseInt(e.target.value, 10) })
                }
                min={8}
                max={30}
               step={1}
              />
            </div>
            <div className="basis-1/3 translate-y-3">
              <ERPInput
                id="amtReceivedFontSize"
                type="number"
                noLabel
                value={totalState?.amtReceivedFontSize??12}
                data={totalState}
                onChange={(e) => {
                  const value = e.target.value;
                  const amtReceivedFontSize = value === "" ? 0 : parseInt(value, 10);
                  onChange?.({
                    ...totalState,
                      amtReceivedFontSize
                  });
                }}
                min={8}
                max={30}
               step={1}
              />
            </div>
        </div>
      {/* <ERPStepInput
        value={totalState?.totalFontSize??14}
        onChange={(totalFontSize) => onChange?.({ ...totalState, totalFontSize })}
        label={t("size_(8-19)")}
        id="totalFontSize"
        placeholder=" "
        defaultValue={9}
        min={8}
        max={19}
        step={1}
      /> */}

      <ERPInput
        id="amtReceivedFontColor"
        label={t("font_color")}
        type="color"
        value={totalState?.amtReceivedFontColor}
        onChange={(e) => onChange?.({ ...totalState, amtReceivedFontColor: e.target?.value })}
      />

        <ERPInput
        id="amtReceivedBgColor"
        label={t("background_color")}
        type="color"
        value={totalState?.amtReceivedBgColor}
        onChange={(e) => onChange?.({ ...totalState, amtReceivedBgColor: e.target?.value })}
        />
        <div className="flex items-center space-x-3">
            <div className="basis-2/3 ">
              <ERPSlider
                id="amtWidth"
                label={t("width")}
                className="bg-slate-300"
                value={totalState?.amtWidth}
                onChange={(e) =>
                  onChange?.({ ...totalState, amtWidth: parseInt(e.target.value, 10) })
                }
                min={10}
                max={300}
               step={10}
              />
            </div>
            <div className="basis-1/3 translate-y-3">
              <ERPInput
                id="amtWidth"
                type="number"
                noLabel
                value={totalState?.amtWidth??400}
                data={totalState}
                onChange={(e) => {
                  const value = e.target.value;
                  const amtWidth = value === "" ? 0 : parseInt(value, 10);
                  onChange?.({
                    ...totalState,
                      amtWidth
                  });
                }}
                min={10}
                max={300}
               step={10}
              />
            </div>
        </div>

        <div className="flex items-center space-x-3">
             <div className="basis-2/3 ">
              <ERPSlider
                id="amtHeight"
                label={t("height")}
                className="bg-slate-300"
                value={totalState?.amtHeight}
                onChange={(e) =>
                  onChange?.({ ...totalState, amtHeight: parseInt(e.target.value, 10) })
                }
                min={10}
                max={300}
               step={10}
              />
             </div>
             <div className="basis-1/3 translate-y-3">
              <ERPInput
                id="amtHeight"
                type="number"
                noLabel
                value={totalState?.amtHeight??400}
                data={totalState}
                onChange={(e) => {
                  const value = e.target.value;
                  const amtHeight = value === "" ? 0 : parseInt(value, 10);
                  onChange?.({
                    ...totalState,
                      amtHeight
                  });
                }}
                min={10}
                max={500}
               step={10}
              />
             </div>
        </div>                
      
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
          checked={totalState?.showAmoutInWords}
          id="showAmoutInWords"
          label={t("show_amount_in_words")}
          onChange={(e) => onChange?.({ ...totalState, showAmoutInWords: e.target.checked })}
        />

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

   

    </div>
  );
};

const TotalPremiumDesigner = ({  }: TotalDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const [activeTab, setActiveTab] = useState(0);
 
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

export default TotalPremiumDesigner;