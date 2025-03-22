import { useDispatch, useSelector } from "react-redux";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { PropertiesState } from "./interfaces";
import { TemplateImagesTypes } from "../InvoiceDesigner";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { handleSetTemplateBackgroundImage, setTemplatePropertiesState } from "../../../redux/slices/templates/reducer";
import { TemplateReducerState } from "../../../redux/reducers/TemplateReducer";
import VoucherType from "../../../enums/voucher-types";
import { ERPScrollArea } from "../../../components/ERPComponents/erp-scrollbar";
import ERPSlider from "../../../components/ERPComponents/erp-slider";
import { useTranslation } from "react-i18next";

interface PropertiesDesignerProps {
  propertiesState?: PropertiesState;
  templateGroup?: VoucherType | string;
  onChange?: (propertiesState: PropertiesState) => void;
  tempImages: {
    setTemplateImages: Dispatch<SetStateAction<TemplateImagesTypes>>,
    templateImages: TemplateImagesTypes,
  }
}

const pageSizeOptions = [
  { label: "A5", value: "A5" },
  { label: "A4", value: "A4" },
  { label: "Letter", value: "LETTER" },
];

const retailPageSizes = [
  { label: `3 "`, value: "3Inch" },
  { label: `4 "`, value: "4Inch" }
]

const PropertiesDesigner: React.FC<PropertiesDesignerProps> = ({ propertiesState, onChange, templateGroup }) => {

  /* ########################################################################################### */
  const templateData = useSelector((state: any) => state?.Template) as TemplateReducerState;
  const dispatch = useDispatch();
  const { t } = useTranslation('system');
  const inputFile = useRef<HTMLInputElement>(null);
  const [maxHeight, setMaxHeight] = useState<number>(500);

  useEffect(() => {
    let wh = window.innerHeight;
    setMaxHeight(wh);
  }, []);

  const isRetailTemplate = () => {
    return (["3Inch", "4Inch"]?.includes(propertiesState?.pageSize!));
  }
  /* ########################################################################################### */

  return (
    <ERPScrollArea className={`overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${maxHeight - 100}px] flex-col gap-1`}>
      {/* <div
        className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
        onClick={() => setTab(currentTab === "temp_props" ? "" : "temp_props")}
      >
        <div>Template Properties</div>
        <div>
          <ChevronDownIcon className={`h-5  ${currentTab === "temp_props" ? "" : "-rotate-90"} transition-all`} />
        </div>
      </div> */}

      <div className="transition-all  flex flex-col gap-4  p-4 ">
        <div>
          <label htmlFor="template_name" className="font-light text-[#ef4444] text-sm">
            {t("template_name_header")}
          </label>
          <ERPInput
            value={propertiesState?.templateName}
            onChange={(e) => onChange?.({ ...propertiesState, templateName: e.target?.value })}
            label={t("template_name")}
            id="template_name"
            noLabel
          />
        </div>

        <ERPDataCombobox
          defaultValue={propertiesState?.pageSize ?? "A4"}
          value={propertiesState?.pageSize ?? "A4"}
          field={{
            id: "pageSize",
            required: true,
            valueKey: "value",
            labelKey: "label",
          }}
          data={propertiesState}
          onChangeData={(data: any) => {
            onChange?.({ ...propertiesState, pageSize: data.pageSize })
          }}
          id="pageSize"
          options={isRetailTemplate() ? retailPageSizes : pageSizeOptions}
          label={t("page_size")}
        />
        <ERPDataCombobox
          id="orientation"
          field={{
            id: "orientation",
            required: true,
            valueKey: "value",
            labelKey: "label",
          }}
          defaultValue={propertiesState?.orientation ?? "Portrait"}
          value={propertiesState?.orientation ?? "Portrait"}
          data={propertiesState}
          onChangeData={(data: any) => {
            onChange?.({ ...propertiesState, orientation: data.orientation })
          }}
          options={[
            { label: "Portrait", value: "portrait" },
            { label: "Landscape", value: "landscape" },
          ]}
          label={t("orientation")}
        />

        <div>
          <label htmlFor="padding" className="font-light text-sm">
            {t("padding")} <span className="text-xs">{t("in_pts")}</span>
          </label>
          <div className="flex gap-2 mt-1">
 
            <ERPInput
              id="padding_top"
              label={t("top")}
              type="number"
              value={propertiesState?.padding?.top}
          
              onChange={(e) =>
                onChange?.({ ...propertiesState, padding: { ...propertiesState?.padding, top: parseInt(e.target.value, 10)} })
              }
              placeholder=" "
              className="w-full"
              min={0}
              step={10}
              max={60}
            />
            <ERPInput
              value={propertiesState?.padding?.bottom}
           
              onChange={(e) =>
                onChange?.({ ...propertiesState, padding: { ...propertiesState?.padding, bottom: parseInt(e.target.value, 10)} })
              }
              label={t("bottom")}
              type="number"
              id="padding_bottom"
              placeholder=" "
              className="w-full"
              min={0}
              max={60}
            />
            <ERPInput
              value={propertiesState?.padding?.left}
           
              onChange={(e) =>
                onChange?.({ ...propertiesState, padding: { ...propertiesState?.padding, left: parseInt(e.target.value, 10)} })
              }
              label={t("left")}
              type="number"
              id="padding_left"
              placeholder=" "
              className="w-full"
              min={0}
              max={60}
            />
            <ERPInput
              value={propertiesState?.padding?.right}
              onChange={(e) =>
                onChange?.({ ...propertiesState, padding: { ...propertiesState?.padding, right: parseInt(e.target.value, 10)} })
              }
              label={t("right")}
              type="number"
              id="padding_right"
              placeholder=" "
              className="w-full"
              min={0}
              max={60}
            />
          </div>
        </div>

        {["SI"]?.includes(templateGroup!) &&
          <div>
            <ERPCheckbox
              id="includePaymentStub"
              label={t("include_payment_stub")}
              checked={propertiesState?.includePaymentStub}
              onChange={(e) => onChange?.({ ...propertiesState, includePaymentStub: e.target.checked })}
            />
            {propertiesState?.includePaymentStub && <div className="space-y-3 my-3">
              <ERPInput
                label={t("payment_stub")}
                id="payment_stub_label"
                value={propertiesState?.payment_stub_label ?? "Payment Stub"}
                onChange={(e) => onChange?.({ ...propertiesState, payment_stub_label: e.target?.value })}
              />
              <ERPInput
                label={t("amount_enclosed")}
                id="amount_enclosed_label"
                value={propertiesState?.amount_enclosed_label ?? "Amount Enclosed"}
                onChange={(e) => onChange?.({ ...propertiesState, amount_enclosed_label: e.target?.value })}
              />
              <ERPDataCombobox
                id="Payment Stub Position"
                defaultValue={propertiesState?.payment_stub_position ?? "new_page"}
                value={propertiesState?.payment_stub_position ?? "new_page"}
                onChangeData={(data: any) => {
                  onChange?.({ ...propertiesState, payment_stub_position: data.payment_stub_position })
                }}
                options={[
                  { label: t("on_a_separate_page"), value: "new_page" },
                  { label: t("on_existing_page"), value: "same_page" },
                ]}
              />
            </div>}
          </div>
        }
      </div>

      <div className="transition-all  flex flex-col gap-4  p-4">
        <div className="flex flex-col gap-2 mt-1">
        {["Cheque"]?.includes(templateGroup!) &&
         <ERPCheckbox
         checked={propertiesState?.print_on_same_page}
         id="printSamePage"
         label={t("print_on_same_page")}
        onChange={(e) => onChange?.({ ...propertiesState, print_on_same_page: e.target.checked })}
       />
        }
           
          <ERPDataCombobox
            id="font_family"
            label={t("pdf_font")}
            field={{
              id: "font_family",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            data={propertiesState}
            defaultValue={propertiesState?.font_family ?? "Roboto"}
            value={propertiesState?.font_family ?? "Roboto"}
            onChangeData={(data: any) => {
              onChange?.({ ...propertiesState, font_family: data.font_family })
            }}
            options={[
              { value: "Roboto", label: t("roboto") },
              { value: "RobotoMono", label: t("roboto_mono") },
              { value: "FiraSans", label: t("fira_sans") },
            ]}
          />
          <ERPDataCombobox
            id="fontStyle"
            label={t("font_style")}
            data={propertiesState}
            field={{
              id: "fontStyle",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            defaultValue={propertiesState?.fontStyle ?? "normal"}
            value={propertiesState?.fontStyle ?? "normal"}
            onChangeData={(data: any) => {
              onChange?.({ ...propertiesState, fontStyle: data.fontStyle })
            }}
            options={[
              { value: "normal", label: t("normal") },
              { value: "italic", label: t("italic") },
            ]}
          />
          <ERPStepInput
            value={propertiesState?.font_size}
            onChange={(font_size) => onChange?.({ ...propertiesState, font_size })}
            label={t("font_size")}
            id="font_size"
            placeholder=" "
            min={8}
            max={28}
            step={1}
          />
         
        </div>
        <div className="flex flex-col gap-2 mt-1">
          <ERPDataCombobox
            id="label_font_style"
            label={t("label_font_style")}
            value={propertiesState?.label_font_style ?? "normal"}
            defaultValue={propertiesState?.label_font_style ?? "normal"}
            data={propertiesState}
            field={{
              id: "label_font_style",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            onChangeData={(data: any) => {
              onChange?.({ ...propertiesState, label_font_style: data.label_font_style })
            }}
            options={[
              { value: "normal", label: t("normal") },
              { value: "italic", label: t("italic") },
            ]}
          />
          <ERPStepInput
            value={propertiesState?.label_font_size}
            onChange={(label_font_size) => onChange?.({ ...propertiesState, label_font_size })}
            label={t("label_font_size")}
            id="label_font_size"
            placeholder=" "
            min={8}
            max={28}
            step={1}
          />
          <div className="flex items-center space-x-3">
            <div className="basis-2/3 ">
              <ERPSlider
                id="label_font_weight"
                label={t("label_font_weight")}
                className="bg-slate-300"
                value={propertiesState?.label_font_weight}
                onChange={(e) =>
                  onChange?.({ ...propertiesState, label_font_weight: parseInt(e.target.value, 10) })
                }
                min={300}
                max={700}
                step={100}
              />
            </div>
            <div className="basis-1/3 translate-y-3">
              <ERPInput
                id="label_font_weight"
                type="number"
                noLabel
                value={propertiesState?.label_font_weight}
                data={propertiesState}
                onChange={(e) =>
                  onChange?.({ ...propertiesState, label_font_weight: parseInt(e.target.value, 10) })
                }
                min={300}
                max={700}
                step={100}
              />
            </div>
          </div>

          <ERPInput
            value={propertiesState?.font_color}
            onChange={(e) => onChange?.({ ...propertiesState, font_color: e.target?.value })}
            label={t("fore_color")}
            id="font_color"
            placeholder=" "
            type="color"
          />
          <ERPInput
            value={propertiesState?.label_font_color}
            onChange={(e) => onChange?.({ ...propertiesState, label_font_color: e.target?.value })}
            label={t("label_color")}
            id="label_font_color"
            placeholder=" "
            type="color"
          />
        </div>
      </div>
      {/* <div
        className="flex justify-between items-center pb-4 border-b cursor-pointer  p-4"
        onClick={() => setTab(currentTab === "bg_props" ? "" : "bg_props")}
      >
        <div>Background</div>
        <div>
          <ChevronDownIcon className={`h-5  ${currentTab === "bg_props" ? "" : "-rotate-90"} transition-all`} />
        </div>
      </div> */}
      <div className="transition-all  flex flex-col gap-4  p-4">
        <label htmlFor="background" className="font-regular text-sm">
          {t("background_image")}
        </label>
        <div className="flex flex-col gap-2">
          {!["journal_entry", "customer", "vendor"]?.includes(templateGroup!) && <>
            <ERPInput
              ref={inputFile}
              type="file"
              onChange={(e: any) => {
                if (e.target.files[0].size > 2097152) {
                  ERPToast.showWith(t("max_file_size_error"));
                } else {
                  handleSetTemplateBackgroundImage(e.target.files[0], dispatch);
                }
              }}
              className={"hidden"}
              accept="image/png,image/jpeg"
              label={t("image")}
              id="background_image "
              placeholder=" "
            />

            <label htmlFor="background_image">
              <div onClick={() => inputFile?.current?.click()} className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${templateData.activeTemplate.background_image ? "hidden" : ""}`}>
                {t("choose_from_desktop")}</div>
            </label>
            {
              templateData.activeTemplate.background_image ?
                <>
                  <div className="text-xs bg-[#FEF4EA] px-2 py-2 rounded">{t("click_save_to_apply")}</div>
                  {templateData.activeTemplate.background_image && <img src={templateData.activeTemplate.background_image} alt="background_image" height={100} width={100} className="size-5" />}21`1`
                  <div
                    className="text-accent text-xs cursor-pointer max-w-min"
                    onClick={() => { handleSetTemplateBackgroundImage(undefined, dispatch); inputFile.current!.value = "" }}>
                    {t("remove")}
                  </div>
                </> : <></>
            }
            <ERPDataCombobox
              data={propertiesState}
              label={t("image_position")}
              id="bg_image_position"
              field={{
                id: "bg_image_position",
                required: true,
                valueKey: "value",
                labelKey: "label",
              }}
              value={propertiesState?.bg_image_position ?? "top left"}
              defaultValue={propertiesState?.bg_image_position ?? "top left"}
              handleChange={(id, value) => {
                dispatch(setTemplatePropertiesState({
                  ...templateData,
                  bg_image_position: value
                }))
              }}
              options={[
                { label: "Top left", value: "top left" },
                { label: "Top center", value: "top center" },
                { label: "Top right", value: "top right" },
                { label: "Center left", value: "center left" },
                { label: "Center center", value: "center center" },
                { label: "Center right", value: "center right" },
                { label: "Bottom left", value: "bottom left" },
                { label: "Bottom center", value: "bottom center" },
                { label: "Bottom right", value: "bottom right" },
              ]}
            />
          </>
          }
          <ERPInput
            value={propertiesState?.bg_color}
            onChange={(e) => { onChange?.({ ...propertiesState, bg_color: e.target?.value }) }}
            label={t("color")}
            id="bg_color"
            type="color"
            placeholder=""
          />
        </div>
      </div>
    </ERPScrollArea>
  );
};
export default PropertiesDesigner;