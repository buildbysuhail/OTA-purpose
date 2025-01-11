import { useDispatch, useSelector } from "react-redux";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { PropertiesState } from "./interfaces";
import { TemplateImagesTypes } from "../InvoiceDesigner";
import { isFile } from "../../../utilities/Utils";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { handleSetTemplateBackgroundImage, setTemplateBackgroundImage, setTemplatePropertiesState, setTemplateThumbImage } from "../../../redux/slices/templates/reducer";
import { TemplateReducerState } from "../../../redux/reducers/TemplateReducer";
import VoucherType from "../../../enums/voucher-types";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import { ERPScrollArea } from "../../../components/ERPComponents/erp-scrollbar";
import ERPSlider from "../../../components/ERPComponents/erp-slider";

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
  const inputFile = useRef<HTMLInputElement>(null);
  const [maxHeight, setMaxHeight] = useState<number>(500);

  useEffect(() => {
    let wh= window.innerHeight; 
    setMaxHeight(wh);
  }, []);

  const isRetailTemplate = () => {
    return (["3Inch", "4Inch"]?.includes(propertiesState?.pageSize!));
  }
  /* ########################################################################################### */

  return (
    <ERPScrollArea 
    className={`overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${maxHeight - 100}px] flex-col gap-1`}>

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

        {/* */}
        <div>
          <label htmlFor="template_name" className="font-light text-[#ef4444] text-sm">
            Template Name *
          </label>
          <ERPInput
            value={propertiesState?.templateName}
            onChange={(e) => onChange?.({ ...propertiesState, templateName: e.target?.value })}
            label="Template Name"
            id="template_name"
            noLabel
          />
        </div>
        {/* */}

        {/* */}
      
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
            onChangeData={(data: any) => {
              onChange?.({ ...propertiesState, pageSize: data.pageSize })
            }}
            id="pageSize"
            options={isRetailTemplate() ? retailPageSizes : pageSizeOptions}
            label="Page Size"
          />
      
      
        {/* */}

        {/* */}
      
          <ERPDataCombobox
            id="orientation"
            field={{
              id: "orientation",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            defaultData={propertiesState?.orientation ?? "Portrait"}
            data={propertiesState}
            onChangeData={(data: any) => {
              onChange?.({ ...propertiesState, orientation: data.orientation} )
            }}
            defaultValue={propertiesState?.orientation ?? "portrait"}
            options={[
              { label: "Portrait", value: "portrait" },
              { label: "Landscape", value: "landscape" },
            ]}
            label="Orientation"
          />
      
        {/* */}

        {/* */}
        <div>
          <label htmlFor="padding" className="font-light text-sm">
            padding <span className="text-xs">(in pts)</span>
          </label>
          <div className="flex gap-2 mt-1">
            <ERPInput
              value={propertiesState?.padding?.top}
              onChange={(e) => {
                if (!(e.target?.valueAsNumber > 60)) {
                  onChange?.({ ...propertiesState, padding: { ...propertiesState?.padding, top: e.target?.valueAsNumber } });
                }
              }}
              label="Top"
              type="number"
              id="padding_top"
              placeholder=" "
              className="w-full"
              min={0}
              max={60}
            />
            <ERPInput
              value={propertiesState?.padding?.bottom}
              onChange={(e) => {
                if (!(e.target?.valueAsNumber > 60)) {
                  onChange?.({ ...propertiesState, padding: { ...propertiesState?.padding, bottom: e.target?.valueAsNumber } });
                }
              }}
              label="Bottom"
              type="number"
              id="padding_bottom"
              placeholder=" "
              className="w-full"
              min={0}
              max={60}
            />
            <ERPInput
              value={propertiesState?.padding?.left}
              onChange={(e) => {
                if (!(e.target?.valueAsNumber > 60)) {
                  onChange?.({ ...propertiesState, padding: { ...propertiesState?.padding, left: e.target?.valueAsNumber } });
                }
              }}
              label="Left"
              type="number"
              id="padding_left"
              placeholder=" "
              className="w-full"
              min={0}
              max={60}
            />
            <ERPInput
              value={propertiesState?.padding?.right}
              onChange={(e) => {
                if (!(e.target?.valueAsNumber > 60)) {
                  onChange?.({ ...propertiesState, padding: { ...propertiesState?.padding, right: e.target?.valueAsNumber } });
                }
              }}
              label="Right"
              type="number"
              id="padding_right"
              placeholder=" "
              className="w-full"
              min={0}
              max={60}
            />
          </div>
        </div>
        {/* */}

        {["SI"]?.includes(templateGroup!) &&
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
                onChange={(e) => onChange?.({ ...propertiesState, payment_stub_label: e.target?.value })}
              />
              <ERPInput
                label="Amount Enclosed"
                id="amount_enclosed_label"
                value={propertiesState?.amount_enclosed_label ?? "Amount Enclosed"}
                onChange={(e) => onChange?.({ ...propertiesState, amount_enclosed_label: e.target?.value })}
              />
              <ERPDataCombobox
                id="Payment Stub Position"
                defaultValue={propertiesState?.payment_stub_position ?? "new_page"}
                onChangeData={(data: any) => {
                  onChange?.({ ...propertiesState, payment_stub_position: data.payment_stub_position} )
                }}
                options={[
                  { label: "On a Seperate Page", value: "new_page" },
                  { label: "On Existing Page", value: "same_page" },
                ]}
              />
            </div>}
          </div>
        }
      </div>


      <div className="transition-all  flex flex-col gap-4  p-4">
        <div className="flex flex-col gap-2 mt-1">
          <ERPDataCombobox
            id="font_family"
            label="PDF Font"
            field={{
              id: "font_family",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            data={propertiesState}
            defaultValue={propertiesState?.font_family ?? "Roboto"}
            onChangeData={(data: any) => {
              onChange?.({ ...propertiesState, font_family: data.font_family} )
            }}
         
              options={[
                { value: "Roboto", label: "Roboto" },
                { value: "RobotoMono", label: "RobotoMono" },
                { value: "FiraSans", label: "FiraSans" },
              ]}
          />
           <ERPDataCombobox
            id="fontStyle"
            label="Font Style"
            data={propertiesState}
            field={{
              id: "fontStyle",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            defaultValue={propertiesState?.fontStyle ?? "normal"}
            onChangeData={(data: any) => {
              onChange?.({ ...propertiesState, fontStyle: data.fontStyle} )
            }}
            
              options={[
                { value: "normal", label: "normal" },
               
                { value: "italic", label: "italic" },
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
            <div className="flex items-center space-x-3">
              <div className="basis-2/3 ">
                <ERPSlider
                  id="font_weight"
                  label="Font Weight"
                  // className="bg-slate-300"
                  value={propertiesState?.font_weight}
                  onChange={(e) =>
                      onChange?.({ ...propertiesState, font_weight: parseInt(e.target.value,10) })
                  }
                  min={300}
                  max={700}
                  step={100}
                />
              </div>
              <div className="basis-1/3 translate-y-3">
                <ERPInput
                  id="font_weight"
                  type="number"
                  noLabel
                  value={propertiesState?.font_weight}
                  data={propertiesState}
                  onChange={(e) =>
                    onChange?.({ ...propertiesState, font_weight: parseInt(e.target.value,10) })
                  }
                  min={300}
                  max={700}
                  step={100}
                />

              </div>
            </div>
        </div>
        <div className="flex flex-col gap-2 mt-1">
        
           <ERPDataCombobox
            id="label_font_style"
            label="Label Font Style"
            defaultValue={propertiesState?.label_font_style ?? "normal"}
            data={propertiesState}
            field={{
              id: "label_font_style",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            onChangeData={(data: any) => {
              onChange?.({ ...propertiesState, label_font_style: data.label_font_style} )
            }}
            
              options={[
                { value: "normal", label: "normal" },
               
                { value: "italic", label: "italic" },
              ]}
          />
    
           
          <ERPStepInput
            value={propertiesState?.label_font_size}
            onChange={(label_font_size) => onChange?.({ ...propertiesState, label_font_size})}
            label="Label Font Size"
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
                  label="Label Font Weight"
                  className="bg-slate-300"
                  value={propertiesState?.label_font_weight}
                  onChange={(e) =>
                      onChange?.({ ...propertiesState, label_font_weight: parseInt(e.target.value,10) })
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
                    onChange?.({ ...propertiesState, label_font_weight: parseInt(e.target.value,10) })
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
            label="Fore Color"
            id="font_color"
            placeholder=" "
            type="color"
          />
          <ERPInput
            value={propertiesState?.label_font_color}
            onChange={(e) => onChange?.({ ...propertiesState, label_font_color: e.target?.value })}
            label="Label Color"
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

      {/* */}
       <div className="transition-all  flex flex-col gap-4  p-4">
        <label htmlFor="background" className="font-regular text-sm">
          Background Image
        </label>
        <div className="flex flex-col gap-2">
          {!["journal_entry", "customer", "vendor"]?.includes(templateGroup!) && <>
            <ERPInput
              ref={inputFile}
              type="file"
              onChange={(e: any) => {
                
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
             data={propertiesState}
              label="Image Position"
              id="bg_image_position"
              field={{
                id: "bg_image_position",
                required: true,
                valueKey: "value",
                labelKey: "label",
              }}
              defaultValue={propertiesState?.bg_image_position ?? "top left"}
              handleChange={(id, value) => {
                
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
            onChange={(e) => {onChange?.({ ...propertiesState, bg_color: e.target?.value })}}
            label="Color"
            id="bg_color"
            type="color"
            placeholder=""
          />
        </div>
      </div>
      {/* */}

      {/* */}


    </ERPScrollArea>
    
  );
};

export default PropertiesDesigner;
