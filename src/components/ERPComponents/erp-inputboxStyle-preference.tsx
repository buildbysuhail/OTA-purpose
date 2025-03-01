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

interface InputBoxStylingProps {
  inputBox?: inputBox; // Pass the inputBox state
  onInputBoxChange: (field: keyof inputBox, value: any) => void; // Handler for state updates
  //   resetInputBox?: () => void; // Reset handler
  isInputBgColor?: boolean;
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

  return (
    <div className="flex flex-col">
      {/* Live Demo Section */}
      <div className={`${isInputBgColor ? "pt-3" : ""}`}>
        <ERPCheckbox
          localInputBox={inputBox}
          id="bold"
          customSize="sm"
          name="bold"
          checked={inputBox?.bold}
          onChange={(e) => { onInputBoxChange("bold", e.target.checked); }}
          label={t("bold")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start switcher-style">
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

      {/* Input Style Customization */}
      <div className="grid grid-cols-2 md:grid-cols-4 switcher-style">
        <div className="flex items-center">
          <input
            type="radio"
            name="inputBox"
            className="ti-form-radio"
            id="input-normal"
            checked={inputBox?.inputStyle === "normal"}
            onChange={(e) => {
              if (e.target.checked) {
                onInputBoxChange("inputStyle", "normal");
              }
            }}
          />
          <label htmlFor="input-normal" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
            {t("normal")}
          </label>
        </div>

        <div className="flex items-center">
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
        </div>
      </div>

      {/* Input Size Customization */}
      <div className="grid grid-cols-2 md:grid-cols-4 switcher-style">
        <div className="flex items-center">
          <input
            type="radio"
            name="inputBoxSize"
            className="ti-form-radio"
            id="input-sm"
            checked={inputBox?.inputSize === "sm"}
            onChange={(e) => {
              if (e.target.checked) {
                onInputBoxChange("inputSize", "sm");
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
                onInputBoxChange("inputSize", "md");
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
                onInputBoxChange("inputSize", "lg");
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
                onInputBoxChange("inputSize", "customize");
              }
            }}
          />
          <label htmlFor="input-customize" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
            {t("customize")}
          </label>
        </div>
      </div>

      {/* Border Radius and Margin Customization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 switcher-style mb-1">
        <div className="flex items-center space-x-3">
          <div className="basis-2/3">
            <ERPSlider
              id="borderRadius"
              label={t("border_radius")}
              className="bg-slate-300"
              value={inputBox?.borderRadius}
              onChange={(e) => { const newValue = parseInt(e.target?.value, 10); onInputBoxChange("borderRadius", newValue); }}
              min={0}
              max={20}
            />
          </div>

          <div className="basis-1/3">
            <ERPInput
              id="borderRadius"
              noLabel={true}
              type="number"
              value={inputBox?.borderRadius}
              data={inputBox}
              onChange={(e) => { const newValue = parseInt(e.target?.value, 10); onInputBoxChange("borderRadius", newValue); }}
              min={0}
              max={20}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1 translate-y-4">
          <div className="flex items-center space-x-3">
            <div className="basis-1/2">
              <ERPSlider
                id="marginBottom"
                label={`${t("margin_bottom")} (${inputBox?.marginBottom ?? 0})`}
                className="bg-slate-300"
                value={inputBox?.marginBottom}
                onChange={(e) => { const newValue = parseInt(e.target?.value); onInputBoxChange("marginBottom", newValue); }}
                min={0}
                max={30}
              />
            </div>

            <div className="basis-1/2">
              <ERPSlider
                id="marginTop"
                label={`${t("margin_top")} (${inputBox?.marginTop ?? 0})`}
                className="bg-slate-300"
                value={inputBox?.marginTop}
                onChange={(e) => { const newValue = parseInt(e.target?.value); onInputBoxChange("marginTop", newValue); }}
                min={0}
                max={30}
              />
            </div>
          </div>

          <div className="px-4 text-secondary text-xs">
            <b className="me-2">{t("note")}</b>
            {t("alignment_issue_tip")}
          </div>
        </div>
      </div>

      {/* Font Size, Label Font Size, and Font Weight Customization */}
      {
        inputBox?.inputSize === "customize" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 switcher-style mb-1">
            <div className="flex items-center space-x-3">
              <div className="basis-2/3">
                <ERPSlider
                  id="fontSize"
                  label={t("font_size")}
                  className="bg-slate-300"
                  value={inputBox?.fontSize}
                  onChange={(e) => { const newValue = parseInt(e.target?.value, 10); onInputBoxChange("fontSize", newValue); }}
                  min={5}
                  max={25}
                />
              </div>

              <div className="basis-1/3 translate-y-3">
                <ERPInput
                  id="fontSize"
                  type="number"
                  noLabel={true}
                  value={inputBox?.fontSize}
                  data={inputBox}
                  onChange={(e) => { const newValue = parseInt(e.target?.value, 10); onInputBoxChange("fontSize", newValue); }}
                  min={5}
                  max={25}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="basis-2/3">
                <ERPSlider
                  id="labelFontSize"
                  label={t("label_font_size")}
                  className="bg-slate-300"
                  value={inputBox?.labelFontSize}
                  onChange={(e) => { const newValue = parseInt(e.target?.value, 10); onInputBoxChange("labelFontSize", newValue); }}
                  min={5}
                  max={25}
                />
              </div>

              <div className="basis-1/3 translate-y-3">
                <ERPInput
                  id="labelFontSize"
                  type="number"
                  noLabel={true}
                  value={inputBox?.labelFontSize}
                  data={inputBox}
                  onChange={(e) => { const newValue = parseInt(e.target?.value, 10); onInputBoxChange("labelFontSize", newValue); }}
                  min={5}
                  max={25}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="basis-2/3">
                <ERPSlider
                  id="fontWeight"
                  label={t("font_weight")}
                  className="bg-slate-300"
                  value={inputBox?.fontWeight}
                  onChange={(e) => { const newValue = parseInt(e.target?.value, 10); onInputBoxChange("fontWeight", newValue); }}
                  min={300}
                  max={700}
                  step={100}
                />
              </div>

              <div className="basis-1/3 translate-y-3">
                <ERPInput
                  id="fontWeight"
                  type="number"
                  noLabel={true}
                  value={inputBox?.fontWeight}
                  data={inputBox}
                  onChange={(e) => { const newValue = parseInt(e.target?.value, 10); onInputBoxChange("fontWeight", newValue); }}
                  min={300}
                  max={700}
                  step={100}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="basis-2/3">
                <ERPSlider
                  id="inputHeight"
                  label={t("height")}
                  className="bg-slate-300"
                  value={inputBox?.inputHeight}
                  onChange={(e) => { const newValue = parseFloat(e.target?.value); onInputBoxChange("inputHeight", newValue); }}
                  min={0}
                  max={5}
                  step={0.1}
                />
              </div>

              <div className="basis-1/3 translate-y-3">
                <ERPInput
                  id="inputHeight"
                  type="number"
                  noLabel={true}
                  value={inputBox?.inputHeight}
                  data={inputBox}
                  onChange={(e) => { const newValue = parseFloat(e.target?.value); onInputBoxChange("inputHeight", newValue); }}
                  min={0}
                  max={5}
                  step={0.1}
                />
              </div>
            </div>

            {/* AdjustA, AdjustB, AdjustC, and AdjustD Sliders */}
            <div className="flex items-center space-x-3">
              <div className="basis-1/2">
                <ERPSlider
                  id="adjustA"
                  label={`${t("adjust_a")} (${inputBox?.adjustA ?? 0})`}
                  className="bg-slate-300"
                  value={inputBox?.adjustA}
                  onChange={(e) => { const newValue = parseInt(e.target?.value); onInputBoxChange("adjustA", newValue); }}
                  min={-30}
                  max={30}
                />
              </div>

              <div className="basis-1/2">
                <ERPSlider
                  id="adjustB"
                  label={`${t("adjust_b")} (${inputBox?.adjustB ?? 0})`}
                  className="bg-slate-300"
                  value={inputBox?.adjustB}
                  onChange={(e) => { const newValue = parseInt(e.target?.value); onInputBoxChange("adjustB", newValue); }}
                  min={-30}
                  max={30}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1 translate-y-[10px]">
              <div className="flex items-center space-x-3">
                <div className="basis-1/2">
                  <ERPSlider
                    id="adjustC"
                    label={`${t("adjust_c")} (${inputBox?.adjustC ?? 0})`}
                    className="bg-slate-300"
                    value={inputBox?.adjustC}
                    onChange={(e) => { const newValue = parseInt(e.target?.value); onInputBoxChange("adjustC", newValue); }}
                    min={-30}
                    max={30}
                  />
                </div>

                <div className="basis-1/2">
                  <ERPSlider
                    id="adjustD"
                    label={`${t("adjust_d")} (${inputBox?.adjustD ?? 0})`}
                    className="bg-slate-300"
                    value={inputBox?.adjustD}
                    onChange={(e) => { const newValue = parseInt(e.target?.value); onInputBoxChange("adjustD", newValue); }}
                    min={-30}
                    max={30}
                  />
                </div>
              </div>

              <div className="px-4 text-secondary text-xs">
                <b className="me-2">{t("note")}</b>
                {t("input_style_note")}
              </div>
            </div>
          </div>
        )
      }

      {/* Color Customization */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {
          isInputBgColor && (
            <div className="flex items-center">
              <label htmlFor="inputBgColor" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold -translate-y-2">
                {t("input_background_color")}
              </label>
              <div className="ti-form-radio">
                <div className="relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: `rgb(${inputBox?.inputBgColor ?? "128, 128, 128"})`, }}>
                  <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
                  <input
                    type="color"
                    value={inputBox?.inputBgColor}
                    onChange={(e) => {
                      const rgb = hexToRgb(e.target?.value);
                      if (rgb) {
                        onInputBoxChange("inputBgColor", `${rgb?.r},${rgb?.g},${rgb?.b}`);
                      }
                    }}
                    className="opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )
        }

        <div className="flex items-center">
          <label htmlFor="borderColor" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold -translate-y-2">
            {t("border_color")}
          </label>
          <div className="ti-form-radio">
            <div
              className="relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: `rgb(${inputBox?.borderColor ?? "128, 128, 128"})`, }}  >
              <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
              <input
                type="color"
                value={inputBox?.borderColor}
                onChange={(e) => {
                  const rgb = hexToRgb(e.target?.value);
                  if (rgb) {
                    onInputBoxChange("borderColor", `${rgb?.r},${rgb?.g},${rgb?.b}`);
                  }
                }}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label htmlFor="fontColor" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold -translate-y-2">
            {t("font_color")}
          </label>
          <div className="ti-form-radio">
            <div
              className="relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: `rgb(${inputBox?.fontColor ?? "128, 128, 128"})`, }}>
              <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
              <input
                type="color"
                value={inputBox?.fontColor}
                onChange={(e) => {
                  const rgb = hexToRgb(e.target?.value);
                  if (rgb) {
                    onInputBoxChange("fontColor", `${rgb?.r},${rgb?.g},${rgb?.b}`);
                  }
                }}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label htmlFor="labelColor" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold -translate-y-2">
            {t("label_color")}
          </label>
          <div className="ti-form-radio">
            <div
              className="relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: `rgb(${inputBox?.labelColor ?? "128, 128, 128"})`, }} >
              <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
              <input
                type="color"
                value={inputBox?.labelColor}
                onChange={(e) => {
                  const rgb = hexToRgb(e.target?.value);
                  if (rgb) {
                    onInputBoxChange("labelColor", `${rgb?.r},${rgb?.g},${rgb?.b}`);
                  }
                }}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label htmlFor="borderFocus" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold -translate-y-2">
            {t("border_focus")}
          </label>
          <div className="ti-form-radio">
            <div
              className="relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: `rgb(${inputBox?.borderFocus ?? "128, 128, 128"})`, }} >
              <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
              <input
                type="color"
                value={inputBox?.borderFocus}
                onChange={(e) => {
                  const rgb = hexToRgb(e.target?.value);
                  if (rgb) {
                    onInputBoxChange("borderFocus", `${rgb?.r},${rgb?.g},${rgb?.b}`);
                  }
                }}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label htmlFor="selectColor" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold -translate-y-2">
            {t("active_select_box")}
          </label>
          <div className="ti-form-radio">
            <div
              className="relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: `rgb(${inputBox?.selectColor ?? "128, 128, 128"})`, }}>
              <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
              <input
                type="color"
                value={inputBox?.selectColor}
                onChange={(e) => {
                  const rgb = hexToRgb(e.target?.value);
                  if (rgb) {
                    onInputBoxChange("selectColor", `${rgb?.r},${rgb?.g},${rgb?.b}`);
                  }
                }}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label htmlFor="focusBgColor" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold -translate-y-2">
            {t("focus_background")}
          </label>
          <div className="ti-form-radio">
            <div
              className="relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: `rgb(${inputBox?.focusBgColor ?? "255, 204, 88"})`, }}  >
              <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
              <input
                type="color"
                value={inputBox?.focusBgColor}
                onChange={(e) => {
                  const rgb = hexToRgb(e.target?.value);
                  if (rgb) {
                    onInputBoxChange("focusBgColor", `${rgb?.r},${rgb?.g},${rgb?.b}`);
                  }
                }}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label htmlFor="focusForeColor" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold -translate-y-2">
            {t("focus_fore_color")}
          </label>
          <div className="ti-form-radio">
            <div
              className="relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: `rgb(${inputBox?.focusForeColor ?? "black"})`, }}     >
              <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
              <input
                type="color"
                value={inputBox?.focusForeColor}
                onChange={(e) => {
                  const rgb = hexToRgb(e.target?.value);
                  if (rgb) {
                    onInputBoxChange("focusForeColor", `${rgb?.r},${rgb?.g},${rgb?.b}`);
                  }
                }}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label htmlFor="focusButtonColor" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold -translate-y-2">
            {t("focus_button_color")}
          </label>
          <div className="ti-form-radio">
            <div
              className="relative theme-container h-8 w-8 rounded-full border border-solid border-gray-300 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: `rgb(${inputBox?.buttonFocusBg ?? "black"})`, }}     >
              <i className="ri-palette-line text-white text-lg absolute pointer-events-none"></i>
              <input
                type="color"
                value={inputBox?.buttonFocusBg}
                onChange={(e) => {
                  const rgb = hexToRgb(e.target?.value);
                  if (rgb) {
                    onInputBoxChange("buttonFocusBg", `${rgb?.r},${rgb?.g},${rgb?.b}`);
                  }
                }}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Radio & Checkbox Customization */}
      <div className="mt-2">
        <p className="switcher-style-head ">{t("radio_&_check_box")}</p>
        <div className="grid grid-cols-2 gap-3 items-center switcher-style">
          <ERPRadio
            localInputBox={inputBox}
            id="radioButton"
            name="radioButton"
            data={demo}
            checked={demo.radioButton}
            onChange={(e) => { setDemo((prevDemo) => ({ ...prevDemo, radioButton: !demo.radioButton, })); }}
            label={t("demo_radio_button")}
          />

          <ERPCheckbox
            localInputBox={inputBox}
            id="radioButton"
            name="radioButton"
            data={demo}
            checked={demo.checkBox}
            onChange={(e) => { setDemo((prevDemo) => ({ ...prevDemo, checkBox: !demo.checkBox, })); }}
            label={t("demo_checkBox")}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 switcher-style">
          <div className="flex items-center">
            <input
              type="radio"
              name="inputCheckBoxSize"
              className="ti-form-radio"
              id="inputCheck-sm"
              checked={inputBox?.checkButtonInputSize === "sm"}
              onChange={(e) => {
                if (e.target.checked) {
                  onInputBoxChange("checkButtonInputSize", "sm");
                }
              }}
            />
            <label htmlFor="input-sm" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
              {t("sm")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              name="inputCheckBoxSize"
              className="ti-form-radio"
              id="inputCheck-md"
              checked={inputBox?.checkButtonInputSize === "md"}
              onChange={(e) => {
                if (e.target.checked) {
                  onInputBoxChange("checkButtonInputSize", "md");
                }
              }}
            />
            <label htmlFor="input-md" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
              {t("md")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              name="inputCheckBoxSize"
              className="ti-form-radio"
              id="inputCheck-lg"
              checked={inputBox?.checkButtonInputSize === "lg"}
              onChange={(e) => {
                if (e.target.checked) {
                  onInputBoxChange("checkButtonInputSize", "lg");
                }
              }}
            />
            <label htmlFor="input-lg" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2 font-semibold">
              {t("lg")}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputBoxStyling;