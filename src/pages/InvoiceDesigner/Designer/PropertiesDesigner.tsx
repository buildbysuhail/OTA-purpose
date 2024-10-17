import { useDispatch, useSelector } from "react-redux";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useRef, useState } from "react";

import { PropertiesState } from "./interfaces";
import { TemplateImagesTypes } from "../InvoiceDesigner";
import { isFile } from "../../../utilities/Utils";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import { TemplateGroupTypes } from "../constants/TemplateCategories";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { handleSetTemplateBackgroundImage, setTemplateBackgroundImage, setTemplatePropertiesState, setTemplateThumbImage } from "../../../redux/slices/templates/reducer";
import { TemplateReducerState } from "../../../redux/reducers/TemplateReducer";

interface PropertiesDesignerProps {
  propertiesState?: PropertiesState;
  templateGroup?: TemplateGroupTypes;
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
  const inputFile = useRef<HTMLInputElement>(null);
  const [currentTab, setTab] = useState<"temp_props" | "font_props" | "bg_props" | "">("temp_props");


  const isRetailTemplate = () => {
    return (["3Inch", "4Inch"]?.includes(propertiesState?.pageSize!));
  }
  /* ########################################################################################### */

  return (
    <div className="flex h-full overflow-auto flex-col gap-1 bg-[#F9F9FB]">

      <div
        className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
        onClick={() => setTab(currentTab === "temp_props" ? "" : "temp_props")}
      >
        <div>Template Properties</div>
        <div>
          <ChevronDownIcon className={`h-5  ${currentTab === "temp_props" ? "" : "-rotate-90"} transition-all`} />
        </div>
      </div>

      {currentTab === "temp_props" && <div className="transition-all  flex flex-col gap-4 bg-white p-4">

        {/* */}
        <div>
          <label htmlFor="template_name" className="font-light text-red-500 text-sm">
            Template Name *
          </label>
          <ERPInput
            value={propertiesState?.templateName}
            onChange={(e) => onChange?.({ ...propertiesState, templateName: e.target.value })}
            label="Template Name"
            id="template_name"
            noLabel
          />
        </div>
        {/* */}

        {/* */}
        <div className="flex items-center justify-between">
          <label htmlFor="page_size" className="font-light text-sm">
            Page Size
          </label>
          <ERPDataCombobox
            defaultValue={propertiesState?.pageSize ?? "A4"}
            // value={propertiesState?.pageSize ?? "A4"}
            field={{
              id: "pageSize",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            data={propertiesState}
            onChangeData={(data: any) => {debugger;
              onChange?.({ ...propertiesState, pageSize: data.pageSize })
            }}
            id="pageSize"
            options={isRetailTemplate() ? retailPageSizes : pageSizeOptions}
            noLabel
          />
        </div>
        {/* */}

        {/* */}
        {/* <div className="flex items-center justify-between">
          <div className="font-light text-sm">Orientation</div>
          <ERPDataCombobox
            id="orientation"
            field={{
              id: "orientation",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            data={propertiesState?.pageSize}
            onChangeData={(data: any) => {debugger;
              onChange?.({ ...propertiesState, orientation: data.orientation} )
            }}
            defaultValue={propertiesState?.orientation ?? "portrait"}
            options={[
              { label: "Portrait", value: "portrait" },
              { label: "Landscape", value: "landscape" },
            ]}
            noLabel
          />
        </div> */}
        {/* */}

        {/* */}
        <div>
          <label htmlFor="margins" className="font-light text-sm">
            Margins <span className="text-xs">(in pts)</span>
          </label>
          <div className="flex gap-2 mt-1">
            <ERPInput
              value={propertiesState?.margins?.top}
              onChange={(e) => {
                if (!(e.target.valueAsNumber > 60)) {
                  onChange?.({ ...propertiesState, margins: { ...propertiesState?.margins, top: e.target.valueAsNumber } });
                }
              }}
              label="Top"
              type="number"
              id="margins_top"
              placeholder=" "
              className="w-full"
              min={0}
              max={60}
            />
            <ERPInput
              value={propertiesState?.margins?.bottom}
              onChange={(e) => {
                if (!(e.target.valueAsNumber > 60)) {
                  onChange?.({ ...propertiesState, margins: { ...propertiesState?.margins, bottom: e.target.valueAsNumber } });
                }
              }}
              label="Bottom"
              type="number"
              id="margins_bottom"
              placeholder=" "
              className="w-full"
              min={0}
              max={60}
            />
            <ERPInput
              value={propertiesState?.margins?.left}
              onChange={(e) => {
                if (!(e.target.valueAsNumber > 60)) {
                  onChange?.({ ...propertiesState, margins: { ...propertiesState?.margins, left: e.target.valueAsNumber } });
                }
              }}
              label="Left"
              type="number"
              id="margins_left"
              placeholder=" "
              className="w-full"
              min={0}
              max={60}
            />
            <ERPInput
              value={propertiesState?.margins?.right}
              onChange={(e) => {
                if (!(e.target.valueAsNumber > 60)) {
                  onChange?.({ ...propertiesState, margins: { ...propertiesState?.margins, right: e.target.valueAsNumber } });
                }
              }}
              label="Right"
              type="number"
              id="margins_right"
              placeholder=" "
              className="w-full"
              min={0}
              max={60}
            />
          </div>
        </div>
        {/* */}

        {["sales_invoice"]?.includes(templateGroup!) &&
          <div>
            <ERPCheckbox
              id="includePaymentStub"
              label="Include Payment Stub"
              checked={propertiesState?.includePaymentStub}
              onChange={(e) => onChange?.({ ...propertiesState, includePaymentStub: e.target.checked })}
            />

            {propertiesState?.includePaymentStub && <div className="space-y-3 my-3">
              <ERPInput
                label="Payment Stub"
                id="payment_stub_label"
                value={propertiesState?.payment_stub_label ?? "Payment Stub"}
                onChange={(e) => onChange?.({ ...propertiesState, payment_stub_label: e.target.value })}
              />
              <ERPInput
                label="Amount Enclosed"
                id="amount_enclosed_label"
                value={propertiesState?.amount_enclosed_label ?? "Amount Enclosed"}
                onChange={(e) => onChange?.({ ...propertiesState, amount_enclosed_label: e.target.value })}
              />
              <ERPDataCombobox
                id="Payment Stub Position"
                defaultValue={propertiesState?.payment_stub_position ?? "new_page"}
                handleChange={(id, value) => onChange?.({ ...propertiesState, payment_stub_position: value?.value })}
                options={[
                  { label: "On a Seperate Page", value: "new_page" },
                  { label: "On Existing Page", value: "same_page" },
                ]}
              />
            </div>}
          </div>
        }
      </div>}


      <div
        className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
        onClick={() => setTab(currentTab === "font_props" ? "" : "font_props")}
      >
        <div>Font</div>
        <div>
          <ChevronDownIcon className={`h-5  ${currentTab === "font_props" ? "" : "-rotate-90"} transition-all`} />
        </div>
      </div>


      {currentTab === "font_props" && <div className="transition-all  flex flex-col gap-4 bg-white p-4">
        <div className="flex flex-col gap-2 mt-1">
          <ERPDataCombobox
            id="font"
            label="PDF Font"
            defaultValue={propertiesState?.font ?? "Helvetica"}
            handleChange={(id, value) => onChange?.({ ...propertiesState, font: value?.value })}
            options={[
              { label: "Helvetica", value: "Helvetica" },
              { label: "Courier", value: "Courier" },
              { label: "Times-Roman", value: "Times-Roman" },
            ]}
          />
          <ERPStepInput
            value={propertiesState?.font_size}
            onChange={(font_size) => onChange?.({ ...propertiesState, font_size })}
            label="Font Size"
            id="font_size"
            placeholder=" "
            min={8}
            max={28}
            step={1}
          />
          <ERPInput
            value={propertiesState?.font_color}
            onChange={(e) => onChange?.({ ...propertiesState, font_color: e.target.value })}
            label="Font Color"
            id="font_color"
            placeholder=" "
            type="color"
          />
          <ERPInput
            value={propertiesState?.label_font_color}
            onChange={(e) => onChange?.({ ...propertiesState, label_font_color: e.target.value })}
            label="Label Color"
            id="label_font_color"
            placeholder=" "
            type="color"
          />
        </div>
      </div>}

      <div
        className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
        onClick={() => setTab(currentTab === "bg_props" ? "" : "bg_props")}
      >
        <div>Background</div>
        <div>
          <ChevronDownIcon className={`h-5  ${currentTab === "bg_props" ? "" : "-rotate-90"} transition-all`} />
        </div>
      </div>

      {/* */}
      {currentTab === "bg_props" && <div className="transition-all  flex flex-col gap-4 bg-white p-4">
        <label htmlFor="background" className="font-regular text-sm">
          Background Image
        </label>
        <div className="flex flex-col gap-2">
          {!["journal_entry", "customer", "vendor"]?.includes(templateGroup!) && <>
            <ERPInput
              ref={inputFile}
              type="file"
              onChange={(e: any) => {
                debugger;
                if (e.target.files[0].size > 2097152) {
                  ERPToast.showWith("Maximum file size allowed is 2 MB, please try with different file.", "warning");
                } else {
                  handleSetTemplateBackgroundImage(e.target.files[0], dispatch);
                }
              }}
              className={"hidden"}
              accept="image/png,image/jpeg"
              label="Image"
              id="background_image "
              placeholder=" "
            />

            <label htmlFor="background_image">
              <div
                onClick={() => inputFile?.current?.click()}
                className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${templateData.activeTemplate.background_image ? "hidden" : ""}`}
              >
                Choose from Desktop</div>
            </label>

            {
              templateData.activeTemplate.background_image ?
                <>
                  <div className="text-xs bg-[#FEF4EA] px-2 py-2 rounded">Click Save to apply the selected background image</div>
                  {templateData.activeTemplate.background_image && <img src={templateData.activeTemplate.background_image} alt="background_image" height={100} width={100} className="size-5" />}21`1`
                  <div
                    className="text-accent text-xs cursor-pointer max-w-min"
                    onClick={() => { 
                      handleSetTemplateBackgroundImage(undefined, dispatch);
                      inputFile.current!.value = ""
                    }}
                  >
                    Remove
                  </div>

                </> : <></>
            }

            <ERPDataCombobox
              label="Image Position"
              id="position"
              defaultValue={propertiesState?.bg_image_position ?? "top left"}
              handleChange={(id, value) => {
                debugger;
                dispatch(setTemplatePropertiesState({
                  ...templateData,
                  bg_image_position: value
                }))
              }}
              options={[
                { label: "Top Left", value: "top left" },
                { label: "Top Center", value: "top center" },
                { label: "Top Right", value: "top right" },
                { label: "Center Left", value: "center left" },
                { label: "Center Center", value: "center center" },
                { label: "Center Right", value: "center right" },
                { label: "Bottom Left", value: "bottom left" },
                { label: "Bottom Center", value: "bottom center" },
                { label: "Bottom Right", value: "bottom right" },
              ]}
            />

          </>
          }

          <ERPInput
            value={propertiesState?.bg_color}
            onChange={(e) => {debugger;onChange?.({ ...propertiesState, bg_color: e.target.value })}}
            label="Color"
            id="bg_color"
            type="color"
            placeholder=""
          />
        </div>
      </div>}
      {/* */}

      {/* */}


    </div>
  );
};

export default PropertiesDesigner;
