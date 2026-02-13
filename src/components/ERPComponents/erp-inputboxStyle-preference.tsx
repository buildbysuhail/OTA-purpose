import React, { useState } from "react";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPSlider from "../../components/ERPComponents/erp-slider";
import ERPRadio from "../../components/ERPComponents/erp-radio";
import ERPCheckbox from "../../components/ERPComponents/erp-checkbox";
import ERPDateInput from "../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import { hexToRgb } from "../../components/common/switcher/switcherdata/switcherdata";
import { inputBox } from "../../redux/slices/app/types";
import { useTranslation } from "react-i18next";
import { CheckSquare, ChevronRight, Layout, Palette, Settings, Sliders, Type } from "lucide-react";
import useDebounce from "../../pages/transaction-base/use-debounce";

interface InputBoxStylingProps {
  inputBox?: inputBox; // Pass the inputBox state
  onInputBoxChange: (field: keyof inputBox, value: any) => void; // Handler for state updates
  //   resetInputBox?: () => void; // Reset handler
  isInputBgColor?: boolean;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
}

const StyleSection: React.FC<SectionProps> = ({ title, children, icon, className = "", defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`mb-2 bg-white dark:bg-dark-bg-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-hover-bg dark:to-dark-border hover:from-gray-100 hover:to-gray-200 dark:hover:from-dark-border dark:hover:to-gray-700 transition-all duration-300 ease-in-out flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-dark-bg shadow-sm group-hover:shadow-md transition-shadow duration-300">
            {icon}
          </div>
          <h3 className="font-semibold text-sm text-gray-800 dark:text-dark-text group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
        </div>
        <div className={`transform transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
          <ChevronRight className="w-4 h-4 text-gray-500 dark:text-dark-text group-hover:text-gray-700 dark:group-hover:text-white" />
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-2 border-t border-gray-100 dark:border-dark-border bg-white dark:bg-dark-bg-card">
          {children}
        </div>
      </div>
    </div>
  );
};

 export const ColorPickerInput: React.FC<{
  label: string
  value?: string
  onChange: (value: string) => void
  defaultColor?: string
}> = ({ label, value, onChange, defaultColor = "128, 128, 128" }) => {

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-dark-hover-bg rounded-lg border border-gray-200 dark:border-dark-border">
        <div
          className="relative h-12 w-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
          style={{ backgroundColor: `rgb(${value ?? defaultColor})` }}
        >
          <i className="ri-palette-line text-white text-lg absolute pointer-events-none drop-shadow-md"></i>
          <input
            type="color"
            value={value}
            onChange={(e) => {
              const rgb = hexToRgb(e.target?.value)
              if (rgb){
                 onChange(`${rgb.r},${rgb.g},${rgb.b}`)
              }
            }}
            className="opacity-0 w-full h-full cursor-pointer"
          />
        </div>
        <div className="flex-1">
           <label className="block text-xs font-medium text-gray-700 dark:text-dark-text">{label}</label>
          <div className="text-sm text-gray-700 dark:text-dark-text font-mono bg-white dark:bg-dark-bg p-2 rounded-md mt-1 border border-gray-200 dark:border-dark-border">
            rgb({value ?? defaultColor})
          </div>
        </div>
      </div>
    </div>
  )
}

const InputBoxStyling: React.FC<InputBoxStylingProps> = ({
  inputBox,
  onInputBoxChange,
  isInputBgColor = false,
}) => {
  // Internal demo state for live preview
  const [demo, setDemo] = useState({
    inputBox: "",
    dateBox: "",
    selectBox: "",
    radioButton: false,
    checkBox: false,
  });
  const { t } = useTranslation('main')
  const debouncedOnInputBoxChange = useDebounce(onInputBoxChange, 300);

  return (
    <div className="space-y-2">
      {/* Bold Option */}
      {isInputBgColor && (
        <div className="bg-[#eff6ff] dark:bg-[#1e3a8a33] rounded-lg py-2 px-4  border border-[#bfdbfe] dark:border-[#1e40af]">
          <ERPCheckbox
            localInputBox={inputBox}
            id="bold"
            customSize="sm"
            name="bold"
            checked={inputBox?.bold}
            onChange={(e) => { debouncedOnInputBoxChange("bold", e.target.checked); }}
            label={t("bold")}
          />
        </div>
      )}

      {/* Live Demo Section */}
      <StyleSection title={t("live_preview")} defaultExpanded={true} icon={<Layout className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ERPInput
            id="inputBox"
            label={t("demo_input")}
            onChange={(e) => { setDemo((prevDemo) => ({ ...prevDemo, inputBox: e.target?.value, })); }}
            value={demo.inputBox}
            localInputBox={inputBox}
          />
          <ERPDateInput
            id="dateBox"
            label={t("date_input")}
            onChange={(e) => { setDemo((prevDemo) => ({ ...prevDemo, dateBox: e.target?.value, })); }}
            value={demo.dateBox}
            localInputBox={inputBox}
          />
          <ERPDataCombobox
            id="selectBox"
            data={demo}
            label={t("demo_select_box")}
            field={{
              id: "selectBox",
              valueKey: "value",
              labelKey: "label",
            }}
            onChange={(e) => { setDemo((prevDemo) => ({ ...prevDemo, selectBox: e?.value ?? null, })); }}
            options={[
              { value: 0, label: "0" },
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
            ]}
            localInputBox={inputBox}
          />
        </div>
      </StyleSection>

      {/* Input Style Selection */}
      <StyleSection title={t("input_style")} icon={<Settings className="w-4 h-4 text-[#16a34a] dark:text-[#4ade80]" />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center p-2 bg-gray-50 dark:bg-dark-hover-bg rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
            <input
              type="radio"
              name="inputBox"
              className="ti-form-radio"
              id="input-normal"
              checked={inputBox?.inputStyle === "normal"}
              onChange={(e) => {
                if (e.target.checked) {
                  debouncedOnInputBoxChange("inputStyle", "normal");
                }
              }}
            />
            <label
              htmlFor="input-normal"
              className="text-sm text-gray-700 dark:text-dark-text ms-3 font-medium cursor-pointer"
            >
              {t("normal")}
            </label>
          </div>

          {/* <div className="flex items-center">
          <input
            type="radio"
            name="inputBox"
            className="ti-form-radio"
            id="input-standard"
            checked={inputBox?.inputStyle === "standard"}
            onChange={(e) => {
              if (e.target.checked) {
                onInputBoxChange("inputStyle", "standard");
              }
            }}
          />
          <label htmlFor="input-standard" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
            {t("standard")}
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            name="inputBox"
            className="ti-form-radio"
            id="input-outlined"
            checked={inputBox?.inputStyle === "outlined"}
            onChange={(e) => {
              if (e.target.checked) {
                onInputBoxChange("inputStyle", "outlined");
              }
            }}
          />
          <label htmlFor="input-outlined" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
            {t("outlined")}
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            name="inputBox"
            className="ti-form-radio"
            id="input-filled"
            checked={inputBox?.inputStyle === "filled"}
            onChange={(e) => {
              if (e.target.checked) {
                onInputBoxChange("inputStyle", "filled");
              }
            }}
          />
          <label htmlFor="input-filled" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
            {t("filled")}
          </label>
        </div> */}
        </div>
      </StyleSection>

      <StyleSection title={t("input_size")} icon={<Sliders className="w-4 h-4 text-[#9333ea] dark:text-[#a78bfa]" />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 switcher-style">
          <div className="flex items-center">
            <input
              type="radio"
              name="inputBoxSize"
              className="ti-form-radio"
              id="input-sm"
              checked={inputBox?.inputSize === "sm"}
              onChange={(e) => {
                if (e.target.checked) {
                  debouncedOnInputBoxChange("inputSize", "sm");
                }
              }}
            />
            <label htmlFor="input-sm" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
              {t("small")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              name="inputBoxSize"
              className="ti-form-radio"
              id="input-md"
              checked={inputBox?.inputSize === "md"}
              onChange={(e) => {
                if (e.target.checked) {
                  debouncedOnInputBoxChange("inputSize", "md");
                }
              }}
            />
            <label htmlFor="input-md" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
              {t("medium")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              name="inputBoxSize"
              className="ti-form-radio"
              id="input-lg"
              checked={inputBox?.inputSize === "lg"}
              onChange={(e) => {
                if (e.target.checked) {
                  debouncedOnInputBoxChange("inputSize", "lg");
                }
              }}
            />
            <label htmlFor="input-lg" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
              {t("large")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              name="inputBoxSize"
              className="ti-form-radio"
              id="input-customize"
              checked={inputBox?.inputSize === "customize"}
              onChange={(e) => {
                if (e.target.checked) {
                  debouncedOnInputBoxChange("inputSize", "customize");
                }
              }}
            />
            <label htmlFor="input-customize" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
              {t("customize")}
            </label>
          </div>
        </div>
      </StyleSection>

      {/* Basic Adjustments */}
      <StyleSection
        title={t("basic_adjustments")}
        icon={<Sliders className="w-4 h-4 text-[#ea580c] dark:text-[#fb923c]" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Border Radius */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text">{t("border_radius")}</h4>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <ERPSlider
                  id="borderRadius"
                  label={t("border_radius")}
                  className="bg-slate-300"
                  value={inputBox?.borderRadius}
                  onChange={(e) => { const newValue = parseInt(e.target?.value, 10); debouncedOnInputBoxChange("borderRadius", newValue); }}
                  min={0}
                  max={20}
                />
              </div>
              <div className="w-20">
                <ERPInput
                  id="borderRadius"
                  noLabel={true}
                  type="number"
                  value={inputBox?.borderRadius}
                  data={inputBox}
                  onChange={(e) => { const newValue = parseInt(e.target?.value, 10); debouncedOnInputBoxChange("borderRadius", newValue); }}
                  min={0}
                  max={20}
                />
              </div>
            </div>
          </div>

          {/* Margins */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text">{t("margins")}</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <ERPSlider
                    id="marginBottom"
                    label={`${t("margin_bottom")} (${inputBox?.marginBottom ?? 0})`}
                    className="bg-slate-300"
                    value={inputBox?.marginBottom}
                    onChange={(e) => { const newValue = parseInt(e.target?.value); debouncedOnInputBoxChange("marginBottom", newValue); }}
                    min={0}
                    max={30}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <ERPSlider
                    id="marginTop"
                    label={`${t("margin_top")} (${inputBox?.marginTop ?? 0})`}
                    className="bg-slate-300"
                    value={inputBox?.marginTop}
                    onChange={(e) => { const newValue = parseInt(e.target?.value); debouncedOnInputBoxChange("marginTop", newValue); }}
                    min={0}
                    max={30}
                  />
                </div>
              </div>
            </div>
            <div className="p-2 bg-[#eff6ff] dark:bg-[#1e3a8a33] rounded-lg border border-[#bfdbfe] dark:border-[#1e40af]">
              <p className="text-xs text-[#1d4ed8] dark:text-[#93c5fd]">
                <span className="font-semibold">{t("note")}</span> {t("alignment_issue_tip")}
              </p>
            </div>
          </div>
        </div>
      </StyleSection>

      {/* Advanced Customization - Only show when customize is selected */}
      {inputBox?.inputSize === "customize" && (
        <StyleSection
          title={t("advanced_customization")}
          icon={<Type className="w-4 h-4 text-[#dc2626] dark:text-[#f87171]" />}
          defaultExpanded={true}
        >
          <div className="space-y-2">
            {/* Font Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                {/* <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text">{t("font_size")}</h4> */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <ERPSlider
                      id="fontSize"
                      label={t("font_size")}
                      className="bg-slate-300"
                      value={inputBox?.fontSize}
                      onChange={(e) => { const newValue = parseInt(e.target?.value, 10); debouncedOnInputBoxChange("fontSize", newValue); }}
                      min={5}
                      max={25}
                    />
                  </div>
                  <div className="w-20">
                    <ERPInput
                      id="fontSize"
                      type="number"
                      noLabel={true}
                      value={inputBox?.fontSize}
                      data={inputBox}
                      onChange={(e) => { const newValue = parseInt(e.target?.value, 10); debouncedOnInputBoxChange("fontSize", newValue); }}
                      min={5}
                      max={25}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {/* <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text">{t("label_font_size")}</h4> */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <ERPSlider
                      id="labelFontSize"
                      label={t("label_font_size")}
                      className="bg-slate-300"
                      value={inputBox?.labelFontSize}
                      onChange={(e) => { const newValue = parseInt(e.target?.value, 10); debouncedOnInputBoxChange("labelFontSize", newValue); }}
                      min={5}
                      max={25}
                    />
                  </div>
                  <div className="w-20">
                    <ERPInput
                      id="labelFontSize"
                      type="number"
                      noLabel={true}
                      value={inputBox?.labelFontSize}
                      data={inputBox}
                      onChange={(e) => { const newValue = parseInt(e.target?.value, 10); debouncedOnInputBoxChange("labelFontSize", newValue); }}
                      min={5}
                      max={25}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {/* <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text">{t("font_weight")}</h4> */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <ERPSlider
                      id="fontWeight"
                      label={t("font_weight")}
                      className="bg-slate-300"
                      value={inputBox?.fontWeight}
                      onChange={(e) => { const newValue = parseInt(e.target?.value, 10); debouncedOnInputBoxChange("fontWeight", newValue); }}
                      min={300}
                      max={700}
                      step={100}
                    />
                  </div>
                  <div className="w-20">
                    <ERPInput
                      id="fontWeight"
                      type="number"
                      noLabel={true}
                      value={inputBox?.fontWeight}
                      data={inputBox}
                      onChange={(e) => { const newValue = parseInt(e.target?.value, 10); debouncedOnInputBoxChange("fontWeight", newValue); }}
                      min={300}
                      max={700}
                      step={100}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {/* <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text">{t("height")}</h4> */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <ERPSlider
                      id="inputHeight"
                      label={t("height")}
                      className="bg-slate-300"
                      value={inputBox?.inputHeight}
                      onChange={(e) => { const newValue = parseFloat(e.target?.value); debouncedOnInputBoxChange("inputHeight", newValue); }}
                      min={1.2}
                      max={5}
                      step={0.1}
                    />
                  </div>
                  <div className="w-20">
                    <ERPInput
                      id="inputHeight"
                      type="number"
                      noLabel={true}
                      value={inputBox?.inputHeight}
                      data={inputBox}
                      onChange={(e) => { const newValue = parseFloat(e.target?.value); debouncedOnInputBoxChange("inputHeight", newValue); }}
                      min={0}
                      max={5}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Adjustment Controls */}
            <div className="space-y-2">
              {/* <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text">{t("fine_adjustments")}</h4> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <ERPSlider
                    id="adjustA"
                    label={`${t("adjust_a")} (${inputBox?.adjustA ?? 0})`}
                    className="bg-slate-300"
                    value={inputBox?.adjustA}
                    onChange={(e) => { const newValue = parseInt(e.target?.value); debouncedOnInputBoxChange("adjustA", newValue); }}
                    min={-30}
                    max={30}
                  />
                  <ERPSlider
                    id="adjustC"
                    label={`${t("adjust_c")} (${inputBox?.adjustC ?? 0})`}
                    className="bg-slate-300"
                    value={inputBox?.adjustC}
                    onChange={(e) => { const newValue = parseInt(e.target?.value); debouncedOnInputBoxChange("adjustC", newValue); }}
                    min={-30}
                    max={30}
                  />
                </div>
                <div className="space-y-2">
                  <ERPSlider
                    id="adjustB"
                    label={`${t("adjust_b")} (${inputBox?.adjustB ?? 0})`}
                    className="bg-slate-300"
                    value={inputBox?.adjustB}
                    onChange={(e) => { const newValue = parseInt(e.target?.value); debouncedOnInputBoxChange("adjustB", newValue); }}
                    min={-30}
                    max={30}
                  />
                  <ERPSlider
                    id="adjustD"
                    label={`${t("adjust_d")} (${inputBox?.adjustD ?? 0})`}
                    className="bg-slate-300"
                    value={inputBox?.adjustD}
                    onChange={(e) => { const newValue = parseInt(e.target?.value); debouncedOnInputBoxChange("adjustD", newValue); }}
                    min={-30}
                    max={30}
                  />
                </div>
              </div>
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <span className="font-semibold">{t("note")}:</span> {t("input_style_note")}
                </p>
              </div>
            </div>
          </div>
        </StyleSection>
      )}

      {/* Color Customization */}
      <StyleSection
        title={t("color_customization")}
        icon={<Palette className="w-4 h-4 text-[#db2777] dark:text-[#f472b6]" />}
      >
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {isInputBgColor && (
            <ColorPickerInput
              label={t("input_background_color")}
              value={inputBox?.inputBgColor}
              onChange={(value) => debouncedOnInputBoxChange("inputBgColor", value)}
            />
          )}
          <ColorPickerInput
            label={t("border_color")}
            value={inputBox?.borderColor}
            onChange={(value) => debouncedOnInputBoxChange("borderColor", value)}
          />
          <ColorPickerInput
            label={t("font_color")}
            value={inputBox?.fontColor}
            onChange={(value) => debouncedOnInputBoxChange("fontColor", value)}
          />
          <ColorPickerInput
            label={t("label_color")}
            value={inputBox?.labelColor}
            onChange={(value) => debouncedOnInputBoxChange("labelColor", value)}
          />
          <ColorPickerInput
            label={t("border_focus")}
            value={inputBox?.borderFocus}
            onChange={(value) => debouncedOnInputBoxChange("borderFocus", value)}
          />
          <ColorPickerInput
            label={t("active_select_box")}
            value={inputBox?.selectColor}
            onChange={(value) => debouncedOnInputBoxChange("selectColor", value)}
          />
          <ColorPickerInput
            label={t("focus_background")}
            value={inputBox?.focusBgColor}
            onChange={(value) => debouncedOnInputBoxChange("focusBgColor", value)}
            defaultColor="255, 204, 88"
          />
          <ColorPickerInput
            label={t("focus_fore_color")}
            value={inputBox?.focusForeColor}
            onChange={(value) => debouncedOnInputBoxChange("focusForeColor", value)}
            defaultColor="0, 0, 0"
          />
          <ColorPickerInput
            label={t("focus_button_color")}
            value={inputBox?.buttonFocusBg}
            onChange={(value) => debouncedOnInputBoxChange("buttonFocusBg", value)}
            defaultColor="0, 0, 0"
          />
        </div>
      </StyleSection>

      {/* Radio & Checkbox Customization */}
      <StyleSection
        title={t("radio_&_check_box")}
        icon={<CheckSquare className="w-4 h-4 text-[#4f46e5] dark:text-[#818cf8]" />}
      >
        <div className="space-y-2">
          {/* Demo Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-2 bg-gray-50 dark:bg-dark-hover-bg rounded-lg border border-gray-200 dark:border-dark-border">
              <ERPRadio
                localInputBox={inputBox}
                id="radioButton"
                name="radioButton"
                data={demo}
                checked={demo.radioButton}
                onChange={(e) => { setDemo((prevDemo) => ({ ...prevDemo, radioButton: !demo.radioButton, })); }}
                label={t("demo_radio_button")}
              />
            </div>
            <div className="p-2 bg-gray-50 dark:bg-dark-hover-bg rounded-lg border border-gray-200 dark:border-dark-border">
              <ERPCheckbox
                localInputBox={inputBox}
                id="checkBox"
                name="checkBox"
                data={demo}
                checked={demo.checkBox}
                onChange={(e) => setDemo((prev) => ({ ...prev, checkBox: !demo.checkBox }))}
                label={t("demo_checkBox")}
              />
            </div>
          </div>

          {/* Size Options */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text">{t("size_options")}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["sm", "md", "lg"].map((size) => (
                <div
                  key={size}
                  className="flex items-center p-2 bg-gray-50 dark:bg-dark-hover-bg rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                >
                  <input
                    type="radio"
                    name="inputCheckBoxSize"
                    className="ti-form-radio"
                    id={`inputCheck-${size}`}
                    checked={inputBox?.checkButtonInputSize === size}
                    onChange={(e) => {
                      if (e.target.checked) {
                        debouncedOnInputBoxChange("checkButtonInputSize", size)
                      }
                    }}
                  />
                  <label
                    htmlFor={`inputCheck-${size}`}
                    className="text-sm text-gray-700 dark:text-dark-text ms-3 font-medium cursor-pointer"
                  >
                    {t(size === "sm" ? "small" : size === "md" ? "medium" : "large")}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </StyleSection>
    </div>
  );
};

export default InputBoxStyling;