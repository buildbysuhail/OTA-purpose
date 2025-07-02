import { useEffect, useState } from "react";
import { customJsonParse, modelToBase64 } from "../../../../utilities/jsonConverter";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { useDispatch } from "react-redux";
import { formStateHandleFieldChange } from "./reducer";
import { handleResponse } from "../../../../utilities/HandleResponse";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { UserConfig } from "./transaction-types";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { UserCog, ChevronRight, Settings, Palette, Layout, Building2, RotateCcw, Grid } from "lucide-react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { inputBox } from "../../../../redux/slices/app/types";
import InputBoxStyling from "../../../../components/ERPComponents/erp-inputboxStyle-preference";
import { hexToRgb } from "../../../../components/common/switcher/switcherdata/switcherdata";
import { useTranslation } from "react-i18next";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";

const api = new APIClient();

interface TransactionUserConfigProps {
  phone?: boolean;
  transactionType: string;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
}

const CollapsibleSection: React.FC<SectionProps> = ({
  title,
  children,
  defaultExpanded = false,
  icon
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-2 bg-white dark:bg-dark-bg-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-hover-bg dark:to-dark-border hover:from-gray-100 hover:to-gray-200 dark:hover:from-dark-border dark:hover:to-gray-700 transition-all duration-300 ease-in-out flex items-center justify-between text-left group"
      >
        <div className="flex items-center space-x-2">
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

export const TransactionUserConfig: React.FC<TransactionUserConfigProps> = ({
  phone = false,
  transactionType
}) => {
  const formState = useAppSelector((state: RootState) => state.InventoryTransaction);
  const dispatch = useDispatch();
  const { t } = useTranslation("transaction");
  const [isExpanded, setIsExpanded] = useState<boolean>(formState.userConfig?.isExpanded || false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = () => {
    const newValue = !isExpanded;
    setIsExpanded(newValue);
    const updatedUserConfig = {
      ...formState.userConfig,
      isExpanded: newValue,
    };
    dispatch(formStateHandleFieldChange({ fields: { userConfig: updatedUserConfig } }));
  };

  const handleInputBoxChange = (field: keyof inputBox, value: any) => {
    const updatedUserConfig = {
      ...formState.userConfig,
      inputBoxStyle: {
        ...formState.userConfig?.inputBoxStyle,
        [field]: value,
      },
    };
    dispatch(formStateHandleFieldChange({ fields: { userConfig: updatedUserConfig } }));
  };

  useEffect(() => { }, []);

  const postUserConfigOnOk = async (response: any) => {
    const base64 = modelToBase64(response);
    localStorage.setItem("utInvc", base64);
  };

  const postUserConfig = async () => {
    try {
      const response = await api.post(`${Urls.inv_transaction_base}${transactionType}/UpdateLocalSettings`, formState.userConfig);
      handleResponse(response, () => {
        const base64 = modelToBase64(formState.userConfig);
        localStorage.setItem("utInvc", base64);
      });
    } catch (error) {
      console.error("Error post System Code settings:", error);
    } finally {
      setIsOpen(false);
    }
  };

  const handleFieldChange = (field: keyof UserConfig, value: any) => {
    const updatedUserConfig = {
      ...formState.userConfig,
      [field]: value,
    };
    dispatch(formStateHandleFieldChange({ fields: { userConfig: updatedUserConfig } }));
  };

  const resetThemeChange = async () => {
    try {
      ERPAlert.show({
        title: t("are_you_sure_reset_now"),
        icon: "warning",
        confirmButtonText: t("reset_now"),
        cancelButtonText: t("cancel"),
        onConfirm: async (result: any) => {
          const res = await api.postAsync(Urls.reset_user_settings, {});
          handleResponse(res, () => {
            const st = atob(res.item);
            localStorage.setItem("utInvc", res.item);
            const _st: any = customJsonParse(st);
            dispatch(formStateHandleFieldChange({ fields: { userConfig: _st } }));
          });
        },
      });
    } catch (error) {
      console.error("Error getInputBox data:", error);
    }
  };

  const rgbToHex = (rgb: string): string => {
    if (!rgb) return "#000000";
    const [r, g, b] = rgb.split(',').map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  return (
    <>
      <div className="group relative inline-flex flex-col items-center" title={t("settings")}>
        <button
          className={`flex items-center dark:bg-dark-bg-card dark:hover:bg-dark-hover-bg bg-gray-100 ${phone ? "p-1.5" : "p-2"} rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105`}
          onClick={() => setIsOpen(true)}
        >
          <UserCog className="w-4 h-4 dark:text-dark-text text-gray-600 hover:text-gray-800 transition-colors duration-300" />
        </button>
      </div>

      <ERPModal
        isOpen={isOpen}
        title={t("user_config")}
        width={1000}
        height={850}
        isForm={true}
        closeModal={() => setIsOpen(false)}
        content={
          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto p-2">
            {/* View Toggle Section */}
            <div className="mb-2 p-2 bg-gradient-to-br from-[#eff6ff] via-[#eef2ff] to-[#faf5ff] dark:from-dark-bg dark:via-dark-hover-bg dark:to-dark-border rounded-xl border border-[#bfdbfe] dark:border-dark-border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#dbeafe] dark:bg-[#1e3a8a4D]">
                    <Layout className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-dark-text">
                      {t("view_settings")}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-dark-text/70">
                      {t("choose_between_compact_or_expanded_view")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 dark:text-dark-text font-medium">  {isExpanded ? t("expanded_view") : t("compact_view")} </span>
                  <div className="relative inline-block w-16 h-8">
                    <input
                      type="checkbox"
                      id="toggle-view"
                      className="sr-only"
                      checked={isExpanded}
                      onChange={handleToggle}
                    />
                    <label
                      htmlFor="toggle-view"
                      className={`block cursor-pointer rounded-full p-1 transition-all duration-300 ease-in-out shadow-inner ${isExpanded
                        ? "bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] shadow-[#bfdbfe]"
                        : "bg-gray-300 dark:bg-gray-600 shadow-gray-200"
                        }`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${isExpanded ? "translate-x-8 shadow-[#93c5fd]" : "translate-x-0 shadow-gray-300"}`}></div>
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 dark:text-dark-text font-medium">{t("footer_position")}</span>
                    <div className="relative inline-block w-16 h-8">
                      <input
                        type="checkbox"
                        id="footer-position"
                        className="sr-only"
                        checked={formState.userConfig?.footerPosition === 'right'} 
                        onChange={() => {
                          const newPosition = formState.userConfig?.footerPosition === 'bottom' ? 'right' : 'bottom';
                          handleFieldChange('footerPosition', newPosition); 
                        }}
                      />
                      <label
                        htmlFor="footer-position"
                        className={`block cursor-pointer rounded-full p-1 transition-all duration-300 ease-in-out shadow-inner ${formState.userConfig?.footerPosition === 'right'
                            ? 'bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] shadow-[#bfdbfe]'
                            : 'bg-gray-300 dark:bg-gray-600 shadow-gray-200'
                          }`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${formState.userConfig?.footerPosition === 'right' ? 'translate-x-8 shadow-[#93c5fd]' : 'translate-x-0 shadow-gray-300'
                          }`}></div>
                      </label>
                    </div>
                    <span className="text-gray-700 dark:text-dark-text font-medium">
                      {formState.userConfig?.footerPosition === 'bottom' ? t('bottom') : t('right')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Configuration Options - All checkboxes in one section */}
            <CollapsibleSection
              title={t("configuration_options")}
              defaultExpanded={true}
              icon={<Settings className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <ERPCheckbox
                    id="useBarcode"
                    label={t("use_barcode")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.useBarcode}
                    onChangeData={(e) => handleFieldChange("useBarcode", e.useBarcode)}
                  />
                  <ERPCheckbox
                    id="resizeGrid"
                    label={t("resize_grid")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.resizeGrid}
                    onChangeData={(e) => handleFieldChange("resizeGrid", e.resizeGrid)}
                  />
                  <ERPCheckbox
                    id="showProductInfoPopup"
                    label={t("show_product_info_popup")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.showProductInfoPopup}
                    onChangeData={(e) => handleFieldChange("showProductInfoPopup", e.showProductInfoPopup)}
                  />
                  <ERPCheckbox
                    id="showPurchaserOnly"
                    label={t("show_purchaser_only")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.showPurchaserOnly}
                    onChangeData={(e) => handleFieldChange("showPurchaserOnly", e.showPurchaserOnly)}
                  />
                  <ERPCheckbox
                    id="useSupplierProductCode"
                    label={t("use_supplier_product_code")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.useSupplierProductCode}
                    onChangeData={(e) => handleFieldChange("useSupplierProductCode", e.useSupplierProductCode)}
                  />
                </div>

                <div className="space-y-2">
                  <ERPCheckbox
                    id="enableItemCodeSearchInNameColumn"
                    label={t("enable_item_code_search_in_name_column")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.enableItemCodeSearchInNameColumn}
                    onChangeData={(e) => handleFieldChange("enableItemCodeSearchInNameColumn", e.enableItemCodeSearchInNameColumn)}
                  />
                  <ERPCheckbox
                    id="holdSameCode"
                    label={t("hold_same_code")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.holdSameCode}
                    onChangeData={(e) => handleFieldChange("holdSameCode", e.holdSameCode)}
                  />
                  <ERPCheckbox
                    id="printPreview"
                    label={t("print_preview")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.printPreview}
                    onChangeData={(e) => handleFieldChange("printPreview", e.printPreview)}
                  />
                  <ERPCheckbox
                    id="dummyProducts"
                    label={t("dummy_products")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.dummyProducts}
                    onChangeData={(e) => handleFieldChange("dummyProducts", e.dummyProducts)}
                  />
                  <ERPCheckbox
                    id="duplicationMessage"
                    label={t("duplication_message")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.duplicationMessage}
                    onChangeData={(e) => handleFieldChange("duplicationMessage", e.duplicationMessage)}
                  />
                </div>

                <div className="space-y-2">
                  <ERPCheckbox
                    id="setDefaultQuantity"
                    label={t("set_default_quantity")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.setDefaultQuantity}
                    onChangeData={(e) => handleFieldChange("setDefaultQuantity", e.setDefaultQuantity)}
                  />
                  <ERPCheckbox
                    id="useInSearch"
                    label={t("use_in_search")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.useInSearch}
                    onChangeData={(e) => handleFieldChange("useInSearch", e.useInSearch)}
                  />
                  <ERPCheckbox
                    id="useCodeSearch"
                    label={t("use_code_search")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.useCodeSearch}
                    onChangeData={(e) => handleFieldChange("useCodeSearch", e.useCodeSearch)}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Cost Center Settings */}
            <CollapsibleSection
              title={t("cost_center_settings")}
              defaultExpanded={false}
              icon={<Building2 className="w-4 h-4 text-[#7c3aed] dark:text-[#a78bfa]" />}
            >
              <ERPDataCombobox
                id="presetCostenterId"
                data={formState.userConfig}
                label={t("preset_cost_center")}
                field={{
                  id: "presetCostenterId",
                  getListUrl: Urls.data_costcentres,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChangeData={(e) => handleFieldChange("presetCostenterId", e.presetCostenterId)}
              />
            </CollapsibleSection>

            {/* Layout & Dimensions */}
            <CollapsibleSection
              title={t("layout_dimensions")}
              defaultExpanded={false}
              icon={<Layout className="w-4 h-4 text-[#0891b2] dark:text-[#22d3ee]" />}
            >
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <ERPInput
                    id="maxWidth"
                    label={t("max_width")}
                    placeholder={t("max_width_eg")}
                    type="number"
                    className="w-full"
                    data={formState.userConfig}
                    value={formState?.userConfig?.maxWidth}
                    onChangeData={(e: { maxWidth: any }) => handleFieldChange("maxWidth", e.maxWidth)}
                  />
                  <ERPInput
                    id="gridMaxWidth"
                    label={t("grid_max_width")}
                    placeholder={t("max_width_eg")}
                    type="number"
                    className="w-full"
                    data={formState.userConfig}
                    value={formState?.userConfig?.gridMaxWidth}
                    onChangeData={(e: { gridMaxWidth: any }) => handleFieldChange("gridMaxWidth", e.gridMaxWidth)}
                  />
                  <ERPInput
                    id="gridHeight"
                    label={t("grid_height")}
                    placeholder={t("grid_height_eg")}
                    type="number"
                    className="w-full"
                    data={formState.userConfig}
                    value={formState?.userConfig?.gridHeight}
                    onChangeData={(e: { gridHeight: any }) => handleFieldChange("gridHeight", e.gridHeight)}
                  />
                </div>

                <div className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] dark:from-dark-hover-bg dark:to-dark-border rounded-xl p-4 border border-gray-200 dark:border-dark-border shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#dbeafe] dark:bg-[#1e3a8a4D] shadow-sm">
                      <Layout className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-dark-text text-base">
                        {t("alignment")}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-dark-text/70">
                        {t("choose_content_alignment_preference")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <ERPButton
                      title={t("left")}
                      variant={formState?.userConfig?.alignment === "left" ? "primary" : "secondary"}
                      onClick={() => handleFieldChange("alignment", "left")}
                      className="min-w-[100px] transition-all duration-300"
                    />
                    <ERPButton
                      title={t("center")}
                      variant={formState?.userConfig?.alignment === "center" ? "primary" : "secondary"}
                      onClick={() => handleFieldChange("alignment", "center")}
                      className="min-w-[100px] transition-all duration-300"
                    />
                    <ERPButton
                      title={t("right")}
                      variant={formState?.userConfig?.alignment === "right" ? "primary" : "secondary"}
                      onClick={() => handleFieldChange("alignment", "right")}
                      className="min-w-[100px] transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Color & Theme Settings */}
            <CollapsibleSection
              title={t("color_theme_settings")}
              defaultExpanded={false}
              icon={<Palette className="w-4 h-4 text-[#db2777] dark:text-[#f472b6]" />}
            >
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#fef3c7] dark:bg-[#f59e0b44]">
                        <Palette className="w-4 h-4 text-[#f59e0b] dark:text-[#fbbf24]" />
                      </div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-dark-text">
                        {t("page_background_color")}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                        style={{ backgroundColor: `rgb(${formState.userConfig?.outerPageBg})` }}
                      >
                        <i className="ri-palette-line text-white text-lg absolute pointer-events-none drop-shadow-md"></i>
                        <input
                          type="color"
                          value={formState.userConfig?.outerPageBg}
                          onChange={(e) => {
                            const rgb = hexToRgb(e.target?.value);
                            if (rgb) {
                              handleFieldChange("outerPageBg", `${rgb.r},${rgb.g},${rgb.b}`);
                            }
                          }}
                          className="opacity-0 w-full h-full cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        {/* <span className="text-xs text-gray-500 dark:text-dark-text/70 uppercase tracking-wide font-medium">RGB Value</span> */}
                        <div className="text-sm text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-2 rounded-md mt-1">
                          rgb({formState.userConfig?.outerPageBg})
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#ddd6fe] dark:bg-[#7c3aed44]">
                        <Palette className="w-4 h-4 text-[#7c3aed] dark:text-[#a78bfa]" />
                      </div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-dark-text">
                        {t("form_background_color")}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                        style={{ backgroundColor: `rgb(${formState.userConfig?.innerPageBg})` }}
                      >
                        <i className="ri-palette-line text-white text-lg absolute pointer-events-none drop-shadow-md"></i>
                        <input
                          type="color"
                          value={formState.userConfig?.innerPageBg}
                          onChange={(e) => {
                            const rgb = hexToRgb(e.target?.value);
                            if (rgb) {
                              handleFieldChange("innerPageBg", `${rgb.r},${rgb.g},${rgb.b}`);
                            }
                          }}
                          className="opacity-0 w-full h-full cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        {/* <span className="text-xs text-gray-500 dark:text-dark-text/70 uppercase tracking-wide font-medium">RGB Value</span> */}
                        <div className="text-sm text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-2 rounded-md mt-1">
                          rgb({formState.userConfig?.innerPageBg})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-dark-border pt-2">
                  <h4 className="font-semibold text-gray-700 dark:text-dark-text mb-2 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">{t("input_box_style")}</span>
                  </h4>
                  <div className="bg-gray-50 dark:bg-dark-hover-bg rounded-lg p-2">
                    <InputBoxStyling
                      isInputBgColor
                      inputBox={formState.userConfig?.inputBoxStyle}
                      onInputBoxChange={handleInputBoxChange}
                    />
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title={t("grid_settings")}
              defaultExpanded={false}
              icon={<Grid className="w-4 h-4 text-[#059669] dark:text-[#34d399]" />}
            >
              <div className="space-y-4">
                {/* Existing grid settings fields */}
                <div className="flex items-end gap-3">
                  <ERPInput
                    id="gridFontSize"
                    label={t("font_size")}
                    type="number"
                    data={formState.userConfig}
                    value={formState.userConfig?.gridFontSize || 0}
                    onChangeData={(e: { gridFontSize: any }) => handleFieldChange("gridFontSize", parseInt(e.gridFontSize))}
                  />
                  <ERPCheckbox
                    id="gridIsBold"
                    label={t("bold")}
                    data={formState.userConfig}
                    checked={formState.userConfig?.gridIsBold || false}
                    onChangeData={(e: { gridIsBold: boolean }) => handleFieldChange("gridIsBold", e.gridIsBold)}
                  />
                  <ERPInput
                    id="gridRowHeight"
                    label={t("row_height")}
                    type="number"
                    data={formState.userConfig}
                    value={formState.userConfig?.gridRowHeight || 0}
                    onChangeData={(e: { gridRowHeight: any }) => handleFieldChange("gridRowHeight", parseInt(e.gridRowHeight))}
                  />
                </div>

                {/* Existing gridBorderColor field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#ddd6fe] dark:bg-[#7c3aed44]">
                      <Palette className="w-4 h-4 text-[#7c3aed] dark:text-[#a78bfa]" />
                    </div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-dark-text">
                      {t("grid_border_color")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                      style={{
                        backgroundColor: formState.userConfig?.gridBorderColor
                          ? `rgb(${formState.userConfig.gridBorderColor})`
                          : "#000000"
                      }}
                    >
                      <i className="ri-palette-line text-white text-lg absolute pointer-events-none drop-shadow-md"></i>
                      <input
                        type="color"
                        value={formState.userConfig?.gridBorderColor ? rgbToHex(formState.userConfig.gridBorderColor) : "#000000"}
                        onChange={(e) => {
                          const rgb = hexToRgb(e.target?.value);
                          if (rgb) {
                            handleFieldChange("gridBorderColor", `${rgb.r},${rgb.g},${rgb.b}`);
                          }
                        }}
                        className="opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-2 rounded-md mt-1">
                        rgb({formState.userConfig?.gridBorderColor || "0,0,0"})
                      </div>
                    </div>
                  </div>
                </div>

                {/* New gridHeaderBg field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#ddd6fe] dark:bg-[#7c3aed44]">
                      <Palette className="w-4 h-4 text-[#7c3aed] dark:text-[#a78bfa]" />
                    </div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-dark-text">
                      {t("grid_header_background_color")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                      style={{
                        backgroundColor: formState.userConfig?.gridHeaderBg
                          ? `rgb(${formState.userConfig.gridHeaderBg})`
                          : "#ffffff"
                      }}
                    >
                      <i className="ri-palette-line text-white text-lg absolute pointer-events-none drop-shadow-md"></i>
                      <input
                        type="color"
                        value={formState.userConfig?.gridHeaderBg ? rgbToHex(formState.userConfig.gridHeaderBg) : "#ffffff"}
                        onChange={(e) => {
                          const rgb = hexToRgb(e.target?.value);
                          if (rgb) {
                            handleFieldChange("gridHeaderBg", `${rgb.r},${rgb.g},${rgb.b}`);
                          }
                        }}
                        className="opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-2 rounded-md mt-1">
                        rgb({formState.userConfig?.gridHeaderBg || "255,255,255"})
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Reset Section */}
            <div className="bg-gradient-to-r from-[#fef2f2] to-[#fdf2f8] dark:from-[#7f1d1d33] dark:to-[#83184333] border border-[#fecaca] dark:border-[#991b1b] rounded-xl p-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#fee2e2] dark:bg-[#7f1d1d4D]">
                    <RotateCcw className="w-4 h-4 text-[#dc2626] dark:text-[#f87171]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#991b1b] dark:text-[#fca5a5] text-sm">{t("reset_settings")}</h4>
                    <p className="text-xs text-[#dc2626] dark:text-[#f87171] mt-1">
                      {t("reset_all_settings_to_default")}
                    </p>
                  </div>
                </div>
                <ERPButton
                  title={t("reset_to_default")}
                  variant="secondary"
                  // className="bg-[#fee2e2] hover:bg-[#fecaca] text-[#b91c1c] border-[#fca5a5] hover:border-[#f87171] transition-all duration-300 min-w-[140px]"
                  onClick={resetThemeChange}
                />
              </div>
            </div>
          </div>
        }
        footer={
          <div className="h-[70px] w-full flex justify-end items-center space-x-2 dark:!border-dark-border dark:!bg-dark-bg bg-gradient-to-r from-gray-50 to-white border-t p-2 rounded-b-md">
            <ERPButton
              title={t("reset_all")}
              onClick={resetThemeChange}
              type="reset"
              variant="secondary"
              className="min-w-[100px] transition-all duration-300"
            />
            <ERPButton
              title={t("save_changes")}
              onClick={postUserConfig}
              variant="primary"
              className="min-w-[140px] bg-gradient-to-r from-[#2563eb] to-[#4f46e5] hover:from-[#1d4ed8] hover:to-[#4338ca] transition-all duration-300"
            />
          </div>
        }
      />
    </>
  );
};