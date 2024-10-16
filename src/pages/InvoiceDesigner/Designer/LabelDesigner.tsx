import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { BarcodeState, TemplateState } from "./interfaces";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
// import ERPDataCombobox from "../../../components/ERPComponents/erp-select";
import { useSelector } from "react-redux";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";


interface LabelDesignerProps {
  onChange: (state: BarcodeState) => void;
  barcodeState?: BarcodeState;
  template?: TemplateState;
}
const barcodeTypes = [
  { label: 'CODE128', value: 'CODE128' },
  { label: 'EAN', value: 'EAN' },
  { label: 'UPC', value: 'UPC' },
  { label: 'CODE39', value: 'CODE39' },
  { label: 'ITF', value: 'ITF' },
  { label: 'MSI', value: 'MSI' },
  { label: 'Pharmacode', value: 'Pharmacode' },
  { label: 'Codabar', value: 'Codabar' }
];

const barcodeData = [
  { label: 'CODE128 (automatic mode switching)', value: 'CODE128_AUTO', type: 'CODE128' },
  { label: 'CODE128 A', value: 'CODE128_A', type: 'CODE128' },
  { label: 'CODE128 B', value: 'CODE128_B', type: 'CODE128' },
  { label: 'CODE128 C', value: 'CODE128_C', type: 'CODE128' },

  { label: 'EAN-13', value: 'EAN-13', type: 'EAN' },
  { label: 'EAN-8', value: 'EAN-8', type: 'EAN' },
  { label: 'EAN-5', value: 'EAN-5', type: 'EAN' },
  { label: 'EAN-2', value: 'EAN-2', type: 'EAN' },

  { label: 'UPC-A', value: 'UPC-A', type: 'UPC' },
  { label: 'UPC-E', value: 'UPC-E', type: 'UPC' },

  { label: 'ITF', value: 'ITF', type: 'ITF' },
  { label: 'ITF-14', value: 'ITF-14', type: 'ITF' },

  { label: 'MSI', value: 'MSI', type: 'MSI' },
  { label: 'MSI10', value: 'MSI10', type: 'MSI' },
  { label: 'MSI11', value: 'MSI11', type: 'MSI' },
  { label: 'MSI1010', value: 'MSI1010', type: 'MSI' },
  { label: 'MSI1110', value: 'MSI1110', type: 'MSI' },

  { label: 'Pharmacode', value: 'Pharmacode', type: 'Pharmacode' },

  { label: 'Codabar', value: 'Codabar', type: 'Codabar' }
];
const LabelDesigner = ({ template, onChange }: LabelDesignerProps) => {
  const [searchParams] = useSearchParams();
  const [currentTab, setTab] = useState<"common_settings" | "another_settings" | "other_settings" | "">("");
  const templateGroup = searchParams?.get("template_group");

  const barcodeState = template?.barcodeState;
  const companies = useSelector((state: any) => state?.GetUserCompanies);
  const activeBranch = companies?.data?.find((item: any) => item?.is_active);

  const handleClear = () => {
    onChange({
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      printer: false,
      length: 20,
      angle: 0,
      field: '',
      value: '',
      format: 'NONE',
      align: 'Left',
      font: '',
      fontSize: 7,
      bold: false,
      italic: false,
      underline: false,
      thermalPrintHeight: 30,
      thermalPrintWidth: 20,
    });
  };

  const angleOptions = Array.from({ length: 37 }, (_, i) => ({
    label: `${i * 10}°`,
    value: i * 10
  }));

  const fontSizeOptions = Array.from({ length: 67 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1
  }));

  return (
    <div className="flex h-full overflow-auto flex-col gap-1 bg-[#F9F9FB]">
      <div className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
        onClick={() => setTab(currentTab === "common_settings" ? "" : "common_settings")}
      >
        Common Settings<ChevronDownIcon className={`h-5 ${currentTab === "common_settings" ? "" : "-rotate-90"} transition-all`} />
      </div>

      {currentTab === "common_settings" &&
        <>
          <div className="flex flex-col gap-5 bg-white p-4">
            <div className="grid grid-cols-2 gap-6">
              <ERPInput
                id="top"
                label="Top"
                type="number"
                value={barcodeState?.top ?? 0}
                onChange={(e) => onChange({ ...barcodeState, top: parseInt(e.target.value) })}
              />

              <ERPInput
                id="left"
                label="Left"
                type="number"
                value={barcodeState?.left ?? 0}
                onChange={(e) => onChange({ ...barcodeState, left: parseInt(e.target.value) })}
                min={0}
                max={100}
              />

              <ERPInput
                id="width"
                label="Width"
                type="number"
                value={barcodeState?.width ?? 0}
                onChange={(e) => onChange({ ...barcodeState, width: parseInt(e.target.value) })}
                min={50}
                max={500}
              />

              <ERPInput
                id="height"
                label="Height"
                type="number"
                value={barcodeState?.height ?? 0}
                onChange={(e) => onChange({ ...barcodeState, height: parseInt(e.target.value) })}
                min={25}
                max={250}
              />
            </div>

            <ERPDataCombobox
              label="Printer"
              id="printer"
              defaultValue={barcodeState?.printer ? "enabled" : "disabled"}
              handleChange={(id, value) => onChange({ ...barcodeState, printer: value.value === "enabled" })}
              options={[
                { label: "Enabled", value: "enabled" },
                { label: "Disabled", value: "disabled" },
              ]}
            />
          </div>
          <div className="flex flex-col gap-5 bg-white p-4">
            <div className="grid grid-cols-2 gap-6">
              <ERPInput
                id="hGaps"
                label="HGaps"
                type="number"
                value={barcodeState?.hGaps ?? 0}
                onChange={(e) => onChange({ ...barcodeState, hGaps: parseInt(e.target.value) })}
                min={25}
                max={250}
              />
              <ERPInput
                id="vGaps"
                label="VGaps"
                type="number"
                value={barcodeState?.vGaps ?? 0}
                onChange={(e) => onChange({ ...barcodeState, vGaps: parseInt(e.target.value) })}
                min={25}
                max={250}
              />
              <ERPInput
                id="rows"
                label="Rows"
                type="number"
                value={barcodeState?.rows ?? 0}
                onChange={(e) => onChange({ ...barcodeState, rows: parseInt(e.target.value) })}
                min={25}
                max={250}
              />
              <ERPInput
                id="cols"
                label="Cols"
                type="number"
                value={barcodeState?.cols ?? 0}
                onChange={(e) => onChange({ ...barcodeState, cols: parseInt(e.target.value) })}
                min={25}
                max={250}
              />
            </div>
            <ERPInput
              id="image"
              label="Image"
              type="number"
              value={barcodeState?.image}
              onChange={(e) => onChange({ ...barcodeState, length: parseInt(e.target.value) })}
            />
          </div>
        </>
      }

      <div className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
        onClick={() => setTab(currentTab === "another_settings" ? "" : "another_settings")}>
        Another Settings<ChevronDownIcon className={`h-5 ${currentTab === "another_settings" ? "" : "-rotate-90"} transition-all`} />
      </div>

      {currentTab === "another_settings" &&
        <div className="flex flex-col gap-5 bg-white p-4">
          <div className="grid grid-cols-2 gap-6">
            <ERPInput
              id="top"
              label="Top"
              type="number"
              value={barcodeState?.top ?? 0}
              onChange={(e) => onChange({ ...barcodeState, top: parseInt(e.target.value) })}
              min={0}
              max={100}
            />

            <ERPInput
              id="left"
              label="Left"
              type="number"
              value={barcodeState?.left ?? 0}
              onChange={(e) => onChange({ ...barcodeState, left: parseInt(e.target.value) })}
              min={0}
              max={100}
            />

            <ERPInput
              id="length"
              label="Length"
              type="number"
              value={barcodeState?.length ?? 0}
              onChange={(e) => onChange({ ...barcodeState, length: parseInt(e.target.value) })}
            />

            <ERPDataCombobox
              label="Angle"
              id="angle"
              defaultValue={barcodeState?.angle ?? 0}
              handleChange={(id, value) => onChange({ ...barcodeState, angle: parseInt(value.value) })}
              options={angleOptions}
            />

            <ERPInput
              id="width"
              label="Width"
              type="number"
              value={barcodeState?.width ?? 0}
              onChange={(e) => onChange({ ...barcodeState, width: parseInt(e.target.value) })}
              min={50}
              max={500}
            />

            <ERPInput
              id="height"
              label="Height"
              type="number"
              value={barcodeState?.height ?? 0}
              onChange={(e) => onChange({ ...barcodeState, height: parseInt(e.target.value) })}
              min={25}
              max={250}
            />

            <ERPDataCombobox
              label="Field"
              id="field"
              defaultValue={barcodeState?.field}
              handleChange={(id, value) => onChange({ ...barcodeState, field: value.value })}
              options={[

              ]}
            />

            <ERPInput
              id="value"
              label="Value"
              type="text"
              value={barcodeState?.value ?? ""}
              onChange={(e) => onChange({ ...barcodeState, value: e.target.value })}
            />

            <ERPDataCombobox
              label="Format"
              id="format"
              defaultValue={barcodeState?.format ?? "NONE"}
              handleChange={(id, value) => onChange({ ...barcodeState, format: value.value })}
              options={[
                { label: "NONE", value: "NONE" },

              ]}
            />

            <ERPDataCombobox
              label="Align"
              id="align"
              defaultValue={barcodeState?.align ?? "Left"}
              handleChange={(id, value) => onChange({ ...barcodeState, align: value.value })}
              options={[
                { label: "Left", value: "Left" },
                { label: "Center", value: "Center" },
                { label: "Right", value: "Right" },
              ]}
            />

            <ERPDataCombobox
              label="Font"
              id="font"
              defaultValue={barcodeState?.font}
              handleChange={(id, value) => onChange({ ...barcodeState, font: value.value })}
              options={[
                // Add your font options here
              ]}
            />

            <ERPDataCombobox
              label="Font Size"
              id="fontSize"
              defaultValue={barcodeState?.fontSize ?? 0}
              handleChange={(id, value) => onChange({ ...barcodeState, fontSize: parseInt(value.value) })}
              options={fontSizeOptions}
            />
          </div>



          <div className="flex align-center justify-center gap-4">
            <ERPCheckbox
              checked={barcodeState?.bold}
              id="bold"
              label="Bold"
              onChange={(e) => onChange({ ...barcodeState, bold: e.target.checked })}
            />
            <ERPCheckbox
              checked={barcodeState?.italic}
              id="italic"
              label="Italic"
              onChange={(e) => onChange({ ...barcodeState, italic: e.target.checked })}
            />
            <ERPCheckbox
              checked={barcodeState?.underline}
              id="underline"
              label="Underline"
              onChange={(e) => onChange({ ...barcodeState, underline: e.target.checked })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <ERPInput
              id="thermalPrintHeight"
              label="Thermal Print F Height"
              type="number"
              value={barcodeState?.thermalPrintHeight ?? 0}
              onChange={(e) => onChange({ ...barcodeState, thermalPrintHeight: parseInt(e.target.value) })}
            />

            <ERPInput
              id="thermalPrintWidth"
              label="F Width"
              type="number"
              value={barcodeState?.thermalPrintWidth ?? 0}
              onChange={(e) => onChange({ ...barcodeState, thermalPrintWidth: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex gap-4">
            <ERPButton
              type="reset"
              title="Clear"
              variant="secondary"
              onClick={handleClear}
            />
            <ERPButton
              type="reset"
              title="Delete"
              variant="primary"
            // onClick={handleDelete}
            />
          </div>
        </div>}

      <div className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
        onClick={() => setTab(currentTab === "other_settings" ? "" : "other_settings")}>
        Other Settings<ChevronDownIcon className={`h-5 ${currentTab === "other_settings" ? "" : "-rotate-90"} transition-all`} />
      </div>
      {currentTab === "other_settings" &&
        <div className="flex flex-col gap-5 bg-white p-4">
          <div className="grid grid-cols-1 gap-6">
            <ERPCheckbox
              checked={barcodeState?.autoSave}
              id="autoSave"
              label="Auto Save Designer File"
              onChange={(e) => onChange({ ...barcodeState, autoSave: e.target.checked })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ERPButton
              type="button"
              title="Set Default"
              variant="secondary"
              className="text-xs px-4 py-2 font-bold"
            />

            <ERPButton
              type="button"
              title="Set Default2"
              variant="secondary"
            // onClick={handleDefault2}
            />
            <ERPButton
              type="button"
              title="Set Default Tag"
              variant="secondary"
            // onClick={handleDefaultTag}
            />
          </div>
        </div>
      }
    </div>
  );
};

export default LabelDesigner;