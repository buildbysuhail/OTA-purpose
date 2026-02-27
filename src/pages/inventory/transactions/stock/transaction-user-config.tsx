import { useEffect, useState } from "react";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import {
  ChevronRight,
  Settings,
  Palette,
  Layout,
  Building2,
  Grid,
  Mouse,
  Undo,
} from "lucide-react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { AppState, inputBox } from "../../../../redux/slices/app/types";
import InputBoxStyling from "../../../../components/ERPComponents/erp-inputboxStyle-preference";
import { hexToRgb } from "../../../../components/common/switcher/switcherdata/switcherdata";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../../../utilities/hooks/useAppState";
import { ERPScrollArea } from "../../../../components/ERPComponents/erp-scrollbar";
import {
  formStateHandleFieldChange,
  formStateHandleFieldChangeKeysOnly,
  formStateMasterHandleFieldChange,
} from "../reducer";
import { UserConfig } from "../transaction-types";
import { appInitialState } from "../../../../redux/slices/app/reducer";
import useDebounce from "../../../transaction-base/use-debounce";
import VoucherType from "../../../../enums/voucher-types";

const api = new APIClient();

interface TransactionUserConfigProps {
  phone?: boolean;
  transactionType: string;
  undoEditMode?: (isEdit: boolean, transactionMasterId: number) => void;
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
  icon,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  return (
    <div className="mb-2 bg-white dark:bg-dark-bg-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
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
        <div
          className={`transform transition-transform duration-300 ease-in-out ${
            isExpanded ? "rotate-90" : "rotate-0"
          }`}
        >
          <ChevronRight className="w-4 h-4 text-gray-500 dark:text-dark-text group-hover:text-gray-700 dark:group-hover:text-white" />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-2 border-t border-gray-100 dark:border-dark-border bg-white dark:bg-dark-bg-card">
          {children}
        </div>
      </div>
    </div>
  );
};

export const TransactionUserConfig: React.FC<TransactionUserConfigProps> = ({
  phone = false,
  transactionType,
  undoEditMode,
}) => {
  const formState = useAppSelector(
    (state: RootState) => state.InventoryTransaction
  );
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const dispatch = useDispatch();
  const { t } = useTranslation("transaction");
  const [isExpanded, setIsExpanded] = useState<boolean>(
    formState.userConfig?.isExpanded || false
  );
  const { appState, updateAppState } = useAppState();
  const isRtl = appState.locale.rtl;
  const [stockUpdate, setStockUpdate] = useState<boolean>(false);
  const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
  useEffect(() => {
    dispatch(
      formStateHandleFieldChange({
        fields: { privConfig: JSON.stringify(formState.userConfig || {}) },
      })
    );
  }, []);

  const handleToggle = () => {
    const newValue = !isExpanded;
    setIsExpanded(newValue);
    const updatedUserConfig = {
      ...formState.userConfig,
      isExpanded: newValue,
    };
    dispatch(
      formStateHandleFieldChange({ fields: { userConfig: updatedUserConfig } })
    );
  };

  const handleStockUpdateChange = (value: boolean) => {
    dispatch(
      formStateMasterHandleFieldChange({ fields: { stockUpdate: value } })
    );
  };

  const handleInputBoxChange = (field: keyof inputBox, value: any) => {
    const updatedUserConfig: UserConfig = {
      ...(formState.userConfig || {}),
      inputBoxStyle: {
        ...appInitialState.inputBox,
        ...(formState.userConfig?.inputBoxStyle || {}),
        [field]: value,
      },
    };
    dispatch(
      formStateHandleFieldChange({ fields: { userConfig: updatedUserConfig } })
    );
  };

  const handleUndoClick = () => {
    undoEditMode?.(
      formState.transaction.master.invTransactionMasterID > 0,
      formState.transaction.master.invTransactionMasterID
    );
  };

  // const postUserConfig = async () => {
  //   try {
  //     const base64 = modelToBase64Unicode({...formState.userConfig, themeName: 'Custom'});
  //     const response = await api.post(`${Urls.inv_transaction_base}${transactionType}/UpdateLocalSettings`, base64);
  //     handleResponse(response, async () => {
  //       const key = btoa(`${userSession.userId}-${transactionType}_LocalSettings`) ;
  //       await setStorageString(key, base64);
  //       dispatch(
  //         formStateHandleFieldChangeKeysOnly({
  //           fields: {
  //             userConfig: {themeName: 'Custom',},
  //             isUserConfigOpen: false
  //           },
  //         })
  //       );
  //     });
  //   } catch (error) {
  //     console.error("Error post System Code settings:", error);
  //   }
  // };

  const handleFieldChange = (field: keyof UserConfig, value: any) => {
    const updatedUserConfig: UserConfig = {
      ...(formState.userConfig || {}),
      [field]: value,
    };
    dispatch(
      formStateHandleFieldChangeKeysOnly({
        fields: { userConfig: { [field]: value } },
      })
    );
  };

  const handleScrollbarChange = (field: keyof AppState, value: any) => {
    const _appState = {
      ...appState,
      [field]: value,
    };
    updateAppState(_appState);
  };

  const debouncedHandleScrollbarChange = useDebounce(
    handleScrollbarChange,
    300
  );
  const debouncedHandleFieldChange = useDebounce(handleFieldChange, 300);
  // const resetThemeChange = async () => {
  //   try {
  //     ERPAlert.show({
  //       title: t("are_you_sure_reset_now"),
  //       icon: "warning",
  //       confirmButtonText: t("reset_now"),
  //       cancelButtonText: t("cancel"),
  //       showCancelButton: true,
  //       onConfirm: async (result: any) => {
  //         const res = await api.postAsync(`${Urls.inv_transaction_base}${transactionType}/ResetLocalSettings`, {});
  //         handleResponse(res, async () => {

  //           const st = base64ToModelUnicode(res.item);
  //            const key = btoa(`${userSession.userId}-${transactionType}_LocalSettings`) ;
  //           await setStorageString(key, res.item);
  //           dispatch(formStateHandleFieldChange({ fields: { userConfig: st ,isUserConfigOpen: false} }));
  //         });
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error getInputBox data:", error);
  //   }
  // };

  // const previousThemeChange = async () => {
  //     dispatch(formStateHandleFieldChange({ fields: { userConfig: JSON.parse(formState?.privConfig??"") ,isUserConfigOpen: false } }));
  // };

  const rgbToHex = (rgb: string): string => {
    if (!rgb) return "#000000";
    const [r, g, b] = rgb.split(",").map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  return (
    <>
      <div
        className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto p-2"
        style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
      >
        {/* View Toggle Section */}
        <div className="mb-2 p-3 sm:p-4 bg-gradient-to-br from-[#eff6ff] via-[#eef2ff] to-[#faf5ff] dark:from-dark-bg dark:via-dark-hover-bg dark:to-dark-border rounded-xl border border-[#bfdbfe] dark:border-dark-border shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#dbeafe] dark:bg-[#1e3a8a4D] flex-shrink-0">
                <Layout className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-dark-text">
                  {t("view_settings")}
                </h3>
                <p className="text-xs text-gray-600 dark:text-dark-text/70">
                  {t("choose_between_compact_or_expanded_view")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <span className="text-sm text-gray-700 dark:text-dark-text font-medium">
                  {isExpanded ? t("expanded_view") : t("compact_view")}
                </span>
                <div className="relative inline-block w-16 h-8 flex-shrink-0">
                  <input
                    type="checkbox"
                    id="toggle-view"
                    className="sr-only"
                    checked={isExpanded}
                    onChange={handleToggle}
                  />
                  <label
                    htmlFor="toggle-view"
                    className={`block cursor-pointer rounded-full p-1 transition-all duration-300 ease-in-out shadow-inner ${
                      isExpanded
                        ? "bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] shadow-[#bfdbfe]"
                        : "bg-gray-300 dark:bg-gray-600 shadow-gray-200"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${
                        isExpanded
                          ? isRtl
                            ? "translate-x-[-2rem]"
                            : "translate-x-8"
                          : "translate-x-0"
                      }`}
                    ></div>
                  </label>
                </div>
              </div>

              <div
                className={`flex items-center justify-between sm:justify-start ${
                  formState.transaction.master.voucherType === "LPO"
                    ? "hidden"
                    : "block"
                } gap-3`}
              >
                <span className="text-sm text-gray-700 dark:text-dark-text font-medium">
                  {t("footer_position")}
                </span>
                <div className="relative inline-block w-16 h-8 flex-shrink-0">
                  <input
                    type="checkbox"
                    id="footer-position"
                    className="sr-only"
                    checked={formState.userConfig?.footerPosition === "right"}
                    onChange={() => {
                      const newPosition =
                        formState.userConfig?.footerPosition === "bottom"
                          ? "right"
                          : "bottom";
                      handleFieldChange("footerPosition", newPosition);
                    }}
                  />
                  <label
                    htmlFor="footer-position"
                    className={`block cursor-pointer rounded-full p-1 transition-all duration-300 ease-in-out shadow-inner ${
                      formState.userConfig?.footerPosition === "right"
                        ? "bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] shadow-[#bfdbfe]"
                        : "bg-gray-300 dark:bg-gray-600 shadow-gray-200"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${
                        formState.userConfig?.footerPosition === "right"
                          ? isRtl
                            ? "-translate-x-8"
                            : "translate-x-8"
                          : "translate-x-0"
                      }`}
                    ></div>
                  </label>
                </div>
                <span className="text-sm text-gray-700 dark:text-dark-text font-medium">
                  {formState.userConfig?.footerPosition === "bottom"
                    ? t("bottom")
                    : t("right")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Configuration Options - All checkboxes in one section */}
        <CollapsibleSection
          title={t("configuration_options")}
          defaultExpanded={true}
          icon={
            <Settings className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" />
          }
        >
          <div className="flex flex-row">
            <div className="flex flex-wrap space-y-1 px-4">
              {/* ------------- Common Fields-------------------- */}
              {![VoucherType.OpeningStock].includes(formState.transaction.master.voucherType as VoucherType) && (
              <>
                <ERPCheckbox
                  id="useBarcode"
                  label={t("use_barcode")}
                  data={formState.userConfig}
                  checked={formState?.userConfig?.useBarcode}
                  onChangeData={(e) =>
                    handleFieldChange("useBarcode", e.useBarcode)
                  }
                  className="w-1/3 mt-1"
                />

                <ERPCheckbox
                  id="resizeGrid"
                  label={t("resize_grid")}
                  data={formState.userConfig}
                  checked={formState?.userConfig?.resizeGrid}
                  onChangeData={(e) =>
                    handleFieldChange("resizeGrid", e.resizeGrid)
                  }
                  className="w-1/3"
                />

                <ERPCheckbox
                  id="roundOff"
                  label={t("round_off")}
                  data={formState.userConfig}
                  checked={formState?.userConfig?.roundOff}
                  onChangeData={(e) =>
                    handleFieldChange("roundOff", e.roundOff)
                  }
                  className="w-1/3"
                />

                <ERPCheckbox
                  id="duplicationMessage"
                  label={t("duplication_message")}
                  data={formState.userConfig}
                  checked={formState?.userConfig?.duplicationMessage}
                  onChangeData={(e) =>
                    handleFieldChange(
                      "duplicationMessage",
                      e.duplicationMessage
                    )
                  }
                  className="w-1/3"
                />

                <ERPCheckbox
                  id="discAmtReadOnly"
                  label={t("disc_amt_read_only")}
                  data={formState.userConfig}
                  checked={formState?.userConfig?.discAmtReadOnly}
                  onChangeData={(e) =>
                    handleFieldChange("discAmtReadOnly", e.discAmtReadOnly)
                  }
                  className="w-1/3"
                />

                <ERPCheckbox
                  id="printPreview"
                  label={t("print_preview")}
                  data={formState.userConfig}
                  checked={formState?.userConfig?.printPreview ?? false}
                  onChangeData={(e) =>
                    handleFieldChange("printPreview", e.printPreview)
                  }
                  className="w-1/3"
                />
              </>
              )}

              {/* -------------------Fields in ST,BTO,BTI--------------------- */}

              {[VoucherType.StockTransfer, VoucherType.BranchTransferOut, VoucherType.BranchTransferIn,].includes(formState.transaction.master.voucherType as VoucherType) && (
                <>
                  <ERPCheckbox
                    id="userSalesPriceForStockTransfer"
                    label={t("use_sales_price_to_transfer")}
                    data={formState.userConfig}
                    checked={
                      formState?.userConfig?.userSalesPriceForStockTransfer
                    }
                    onChangeData={(e) =>
                      handleFieldChange(
                        "userSalesPriceForStockTransfer",
                        e.userSalesPriceForStockTransfer
                      )
                    }
                    className="w-1/3"
                  />
                </>
              )}

              {/* -------------------Fields in Stock Adjuster----------------------- */}

              {[VoucherType.StockAdjuster].includes(formState.transaction.master.voucherType as VoucherType) && (
                <>
                  <ERPCheckbox
                    id="enableItemCodeSearchInNameColumn"
                    label={t("enable_item_code_search_in_name_column")}
                    data={formState.userConfig}
                    checked={
                      formState?.userConfig?.enableItemCodeSearchInNameColumn
                    }
                    onChangeData={(e) =>
                      handleFieldChange(
                        "enableItemCodeSearchInNameColumn",
                        e.enableItemCodeSearchInNameColumn
                      )
                    }
                    className="w-1/3"
                  />
                </>
              )}

              {/* --------------------Fields in BTO, BTI----------------------- */}

              {[VoucherType.BranchTransferOut, VoucherType.BranchTransferIn,].includes(formState.transaction.master.voucherType as VoucherType) && (
                <>
                  <ERPCheckbox
                    id="showProductInfoPopup"
                    label={t("show_product_info_popup")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.showProductInfoPopup}
                    onChangeData={(e) =>
                      handleFieldChange(
                        "showProductInfoPopup",
                        e.showProductInfoPopup
                      )
                    }
                    className="w-1/3"
                  />

                  <ERPCheckbox
                    id="autoIncrementQty"
                    label={t("auto_increment_qty")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.autoIncrementQty}
                    onChangeData={(e) =>
                      handleFieldChange("autoIncrementQty", e.autoIncrementQty)
                    }
                    className="w-1/3"
                  />

                  <ERPCheckbox
                    id="useMSPasUnitPrice"
                    label={t("use_msp_as_unit_price")}
                    data={formState.userConfig}
                    checked={applicationSettings?.inventorySettings?.bTOUsingMSP ? formState?.userConfig?.useMSPasUnitPrice ?? true : false}
                    onChangeData={(e) =>
                      handleFieldChange(
                        "useMSPasUnitPrice",
                        e.useMSPasUnitPrice
                      )
                    }
                    className="w-1/3"
                    disabled={applicationSettings?.inventorySettings?.bTOUsingMSP ? false : true }
                  />

                  <ERPCheckbox
                    id="skipNonMandatoryFields"
                    label={t("skip_non_mandatory_fields")}
                    data={formState.userConfig}
                    checked={formState?.userConfig?.skipNonMandatoryFields}
                    onChangeData={(e) =>
                      handleFieldChange(
                        "skipNonMandatoryFields",
                        e.skipNonMandatoryFields
                      )
                    }
                    className="w-1/3"
                  />
                </>
              )}
            </div>
          </div>
          {/* Check if the below undo Section is available in stock, if have uncomment it */}
          {/* <div className="absolute top-[200px] right-[30px]">
            {formState.transaction.master.invTransactionMasterID > 0 && (
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
                onClick={handleUndoClick}
                title="undo"
              >
                <Undo className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" />
              </button>
            )}
          </div> */}
        </CollapsibleSection>

        {/* Cost Center Settings */}
        <CollapsibleSection
          title={t("cost_center_settings")}
          defaultExpanded={false}
          icon={
            <Building2 className="w-4 h-4 text-[#7c3aed] dark:text-[#a78bfa]" />
          }
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
            onChangeData={(e) =>
              handleFieldChange("presetCostenterId", e.presetCostenterId)
            }
          />
        </CollapsibleSection>

        {/* Layout & Dimensions */}
        <CollapsibleSection
          title={t("layout_dimensions")}
          defaultExpanded={false}
          icon={
            <Layout className="w-4 h-4 text-[#0891b2] dark:text-[#22d3ee]" />
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-end gap-4">
              <ERPInput
                id="maxWidth"
                label={t("max_width")}
                placeholder={t("max_width_eg")}
                type="number"
                className="w-full"
                data={formState.userConfig}
                value={formState?.userConfig?.maxWidth}
                onChangeData={(e: { maxWidth: any }) =>
                  handleFieldChange("maxWidth", e.maxWidth)
                }
              />
              <ERPInput
                id="gridMaxWidth"
                label={t("grid_max_width")}
                placeholder={t("max_width_eg")}
                type="number"
                className="w-full"
                data={formState.userConfig}
                value={formState?.userConfig?.gridMaxWidth}
                onChangeData={(e: { gridMaxWidth: any }) =>
                  handleFieldChange("gridMaxWidth", e.gridMaxWidth)
                }
              />
              <ERPInput
                id="gridHeight"
                label={t("grid_height")}
                placeholder={t("grid_height_eg")}
                type="number"
                className="w-full"
                data={formState.userConfig}
                value={formState?.userConfig?.gridHeight}
                onChangeData={(e: { gridHeight: any }) =>
                  handleFieldChange("gridHeight", e.gridHeight)
                }
              />
              <ERPCheckbox
                id="useNewFooter"
                label={t("use_new_footer")}
                data={formState.userConfig}
                checked={formState?.userConfig?.useNewFooter ?? false}
                onChangeData={(e) =>
                  handleFieldChange("useNewFooter", e.useNewFooter)
                }
              />
            </div>

            <div className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] dark:from-dark-hover-bg dark:to-dark-border rounded-xl p-4 border border-gray-200 dark:border-dark-border shadow-sm">
              <div className="flex gap-2 mb-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#dbeafe] dark:bg-[#1e3a8a4D] shadow-sm">
                  <Layout className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-dark-text text-base">
                    {t("alignment")}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-dark-text/70">
                    {t("choose_content_alignment_preference")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <ERPButton
                  title={t("left")}
                  variant={
                    formState?.userConfig?.alignment === "left"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => handleFieldChange("alignment", "left")}
                  className="flex-1 sm:flex-none min-w-[80px] sm:min-w-[100px] transition-all duration-300"
                />
                <ERPButton
                  title={t("center")}
                  variant={
                    formState?.userConfig?.alignment === "center"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => handleFieldChange("alignment", "center")}
                  className="flex-1 sm:flex-none min-w-[80px] sm:min-w-[100px] transition-all duration-300"
                />
                <ERPButton
                  title={t("right")}
                  variant={
                    formState?.userConfig?.alignment === "right"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => handleFieldChange("alignment", "right")}
                  className="flex-1 sm:flex-none min-w-[80px] sm:min-w-[100px] transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Scrollbar Settings */}
        <CollapsibleSection
          title={t("scrollbar_settings")}
          defaultExpanded={false}
          icon={
            <Mouse className="w-4 h-4 text-[#8b5cf6] dark:text-[#a78bfa]" />
          }
        >
          <div className="space-y-4">
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h6 className="font-semibold text-gray-700 dark:text-dark-text text-sm flex items-center space-x-2">
                    <span>{t("scrollbar_width")}</span>
                  </h6>
                  <div className="space-y-1">
                    {["md", "sm"].map((width) => (
                      <div
                        key={width}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover-bg transition-all duration-200"
                      >
                        <input
                          type="radio"
                          name="data-page-scrollbar"
                          className="ti-form-radio w-4 h-4 text-[#8b5cf6] focus:ring-[#8b5cf6] focus:ring-2"
                          id={`scrollbar-${width}`}
                          checked={appState.scrollbarWidth === width}
                          onChange={() => {
                            handleScrollbarChange("scrollbarWidth", width);
                          }}
                        />
                        <label
                          htmlFor={`scrollbar-${width}`}
                          className="text-sm font-medium text-gray-700 dark:text-dark-text cursor-pointer"
                        >
                          {width === "md" ? t("normal") : t("thin")}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Scrollbar Color Picker */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="relative h-12 w-12 flex-shrink-0 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                        style={{
                          backgroundColor: `rgb(${
                            formState.userConfig?.scrollbarColor ??
                            "128, 128, 128"
                          })`,
                        }}
                      >
                        <i className="ri-palette-line text-white text-sm absolute pointer-events-none drop-shadow-md"></i>
                        <input
                          type="color"
                          value={rgbToHex(
                            formState.userConfig?.scrollbarColor ||
                              "128,128,128"
                          )}
                          onChange={(e) => {
                            const rgb = hexToRgb(e.target?.value);
                            if (rgb) {
                              debouncedHandleFieldChange(
                                "scrollbarColor",
                                `${rgb?.r},${rgb?.g},${rgb?.b}`
                              );
                            }
                          }}
                          className="opacity-0 w-full h-full cursor-pointer"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-dark-text block mb-1">
                          {t("scrollbar_color")}
                        </label>
                        <div className="text-xs text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-2 rounded-md break-all">
                          rgb(
                          {formState.userConfig?.scrollbarColor ||
                            "128,128,128"}
                          )
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="space-y-3">
                  <div className="bg-white dark:bg-dark-bg-card rounded-lg border border-gray-200 dark:border-dark-border shadow-sm overflow-hidden">
                    <div className="p-3 bg-gray-50 dark:bg-dark-hover-bg border-b border-gray-200 dark:border-dark-border">
                      <h6 className="text-sm font-medium text-gray-700 dark:text-dark-text">
                        {t("scrollbar_preview")}
                      </h6>
                    </div>
                    <ERPScrollArea className="w-full h-48 sm:h-64 overflow-y-auto rounded-md">
                      <div className="space-y-2 p-4 text-sm text-gray-600 dark:text-dark-text/70">
                        <p className="font-medium text-gray-800 dark:text-dark-text">
                          {t("scroll_down_to_see_the_effect")}
                        </p>
                        <p>{t("normal_and_thin_options_are_available")}</p>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </p>
                        <p>
                          Sed do eiusmod tempor incididunt ut labore et dolore
                          magna aliqua.
                        </p>
                        <p>
                          Ut enim ad minim veniam, quis nostrud exercitation
                          ullamco.
                        </p>
                        <p>Laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>
                          Duis aute irure dolor in reprehenderit in voluptate
                          velit esse.
                        </p>
                        <p>Cillum dolore eu fugiat nulla pariatur.</p>
                        <p>Excepteur sint occaecat cupidatat non proident.</p>
                        <p>
                          Sunt in culpa qui officia deserunt mollit anim id est
                          laborum.
                        </p>
                        <p>
                          Nemo enim ipsam voluptatem quia voluptas sit
                          aspernatur.
                        </p>
                        <p>
                          Aut odit aut fugit, sed quia consequuntur magni
                          dolores.
                        </p>
                        <p>Eos qui ratione voluptatem sequi nesciunt.</p>
                        <p>Neque porro quisquam est, qui dolorem ipsum quia.</p>
                        <p>Dolor sit amet, consectetur, adipisci velit.</p>
                        <p>Sed quia non numquam eius modi tempora incidunt.</p>
                        <p>
                          Ut labore et dolore magnam aliquam quaerat voluptatem.
                        </p>
                      </div>
                    </ERPScrollArea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Color & Theme Settings */}
        <CollapsibleSection
          title={t("color_theme_settings")}
          defaultExpanded={false}
          icon={
            <Palette className="w-4 h-4 text-[#db2777] dark:text-[#f472b6]" />
          }
        >
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: `rgb(${formState.userConfig?.outerPageBg})`,
                    }}
                  >
                    <i className="ri-palette-line text-white text-sm absolute pointer-events-none drop-shadow-md"></i>
                    <input
                      type="color"
                      value={formState.userConfig?.outerPageBg}
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target?.value);
                        if (rgb) {
                          debouncedHandleFieldChange(
                            "outerPageBg",
                            `${rgb.r},${rgb.g},${rgb.b}`
                          );
                        }
                      }}
                      className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-dark-text block mb-1">
                      {t("page_background_color")}
                    </label>
                    <div className="text-xs text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-1 rounded-md break-all">
                      rgb({formState.userConfig?.outerPageBg})
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: `rgb(${formState.userConfig?.innerPageBg})`,
                    }}
                  >
                    <i className="ri-palette-line text-white text-sm absolute pointer-events-none drop-shadow-md"></i>
                    <input
                      type="color"
                      value={formState.userConfig?.innerPageBg}
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target?.value);
                        if (rgb) {
                          debouncedHandleFieldChange(
                            "innerPageBg",
                            `${rgb.r},${rgb.g},${rgb.b}`
                          );
                        }
                      }}
                      className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-dark-text block mb-1">
                      {t("form_background_color")}
                    </label>
                    <div className="text-xs text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-1 rounded-md">
                      rgb({formState.userConfig?.innerPageBg})
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: `rgb(${
                        formState.userConfig?.footerBg || "248,248,255"
                      })`,
                    }}
                  >
                    <i className="ri-palette-line text-white text-sm absolute pointer-events-none drop-shadow-md"></i>
                    <input
                      type="color"
                      value={
                        formState.userConfig?.footerBg
                          ? rgbToHex(formState.userConfig.footerBg)
                          : "#f8f8ff"
                      }
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target?.value);
                        if (rgb) {
                          debouncedHandleFieldChange(
                            "footerBg",
                            `${rgb.r},${rgb.g},${rgb.b}`
                          );
                        }
                      }}
                      className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-dark-text block mb-1">
                      {t("footer_background_color")}
                    </label>
                    <div className="text-xs text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-1 rounded-md">
                      rgb({formState.userConfig?.footerBg || "248,248,255"})
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-dark-border pt-2">
              <h4 className="font-semibold text-gray-700 dark:text-dark-text mb-2 flex items-center gap-2">
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
            <div className="flex flex-wrap items-end gap-2">
              <div className="w-full sm:w-32">
                <ERPInput
                  id="gridFontSize"
                  label={t("font_size")}
                  type="number"
                  data={formState.userConfig}
                  value={formState.userConfig?.gridFontSize || 0}
                  onChangeData={(e: { gridFontSize: any }) =>
                    handleFieldChange("gridFontSize", parseInt(e.gridFontSize))
                  }
                />
              </div>
              <div className="w-full sm:w-32">
                <ERPInput
                  id="gridRowHeight"
                  type="number"
                  label={t("row_height")}
                  data={formState.userConfig}
                  value={formState.userConfig?.gridRowHeight || 0}
                  onChangeData={(e: { gridRowHeight: any }) =>
                    handleFieldChange(
                      "gridRowHeight",
                      parseInt(e.gridRowHeight)
                    )
                  }
                />
              </div>
              <div className="w-full sm:w-32">
                <ERPInput
                  type="number"
                  id="gridHeaderRowHeight"
                  label={t("header_row_height")}
                  data={formState.userConfig}
                  value={formState.userConfig?.gridHeaderRowHeight || 0}
                  onChangeData={(e: { gridHeaderRowHeight: any }) =>
                    handleFieldChange(
                      "gridHeaderRowHeight",
                      parseInt(e.gridHeaderRowHeight)
                    )
                  }
                />
              </div>
              <div className="w-full sm:w-32">
                <ERPInput
                  min={0}
                  step={1}
                  type="number"
                  id="gridBorderRadius"
                  label={t("grid_border_radius_px")}
                  data={formState.userConfig}
                  value={formState.userConfig?.gridBorderRadius ?? 0}
                  onChangeData={(e: { gridBorderRadius: any }) =>
                    handleFieldChange(
                      "gridBorderRadius",
                      parseInt(e.gridBorderRadius)
                    )
                  }
                />
              </div>
              <ERPCheckbox
                id="gridIsBold"
                label={t("bold")}
                data={formState.userConfig}
                checked={formState.userConfig?.gridIsBold || false}
                onChangeData={(e: { gridIsBold: boolean }) =>
                  handleFieldChange("gridIsBold", e.gridIsBold)
                }
              />
              <ERPCheckbox
                id="showColumnBorder"
                label={t("show_column_border")}
                data={formState.userConfig}
                checked={formState.userConfig?.showColumnBorder ?? true}
                onChangeData={(e: { showColumnBorder: boolean }) =>
                  handleFieldChange("showColumnBorder", e.showColumnBorder)
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Compact gridBorderColor field */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: formState.userConfig?.gridBorderColor
                        ? `rgb(${formState.userConfig.gridBorderColor})`
                        : "#000000",
                    }}
                  >
                    <i className="ri-palette-line text-white text-sm absolute pointer-events-none drop-shadow-md"></i>
                    <input
                      type="color"
                      value={
                        formState.userConfig?.gridBorderColor
                          ? rgbToHex(formState.userConfig.gridBorderColor)
                          : "#000000"
                      }
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target?.value);
                        if (rgb) {
                          debouncedHandleFieldChange(
                            "gridBorderColor",
                            `${rgb.r},${rgb.g},${rgb.b}`
                          );
                        }
                      }}
                      className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-dark-text block mb-1">
                      {t("grid_border_color")}
                    </label>
                    <div className="text-xs text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-1 rounded-md">
                      rgb({formState.userConfig?.gridBorderColor || "0,0,0"})
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact gridHeaderBg field */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: formState.userConfig?.gridHeaderBg
                        ? `rgb(${formState.userConfig.gridHeaderBg})`
                        : "#ffffff",
                    }}
                  >
                    <i className="ri-palette-line text-white text-sm absolute pointer-events-none drop-shadow-md"></i>
                    <input
                      type="color"
                      value={
                        formState.userConfig?.gridHeaderBg
                          ? rgbToHex(formState.userConfig.gridHeaderBg)
                          : "#ffffff"
                      }
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target?.value);
                        if (rgb) {
                          debouncedHandleFieldChange(
                            "gridHeaderBg",
                            `${rgb.r},${rgb.g},${rgb.b}`
                          );
                        }
                      }}
                      className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-dark-text block mb-1">
                      {t("grid_header_background_color")}
                    </label>
                    <div className="text-xs text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-1 rounded-md">
                      rgb({formState.userConfig?.gridHeaderBg || "255,255,255"})
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact gridHeaderFontColor field */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: formState.userConfig?.gridHeaderFontColor
                        ? `rgb(${formState.userConfig.gridHeaderFontColor})`
                        : "#1f2937",
                    }}
                  >
                    <i className="ri-palette-line text-white text-sm absolute pointer-events-none drop-shadow-md"></i>
                    <input
                      type="color"
                      value={
                        formState.userConfig?.gridHeaderFontColor
                          ? rgbToHex(formState.userConfig.gridHeaderFontColor)
                          : "#1f2937"
                      }
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target?.value);
                        if (rgb) {
                          debouncedHandleFieldChange(
                            "gridHeaderFontColor",
                            `${rgb.r},${rgb.g},${rgb.b}`
                          );
                        }
                      }}
                      className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-dark-text block mb-1">
                      {t("grid_header_font_color")}
                    </label>
                    <div className="text-xs text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-1 rounded-md">
                      rgb(
                      {formState.userConfig?.gridHeaderFontColor || "31,41,55"})
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact activeRowBg field */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: formState.userConfig?.activeRowBg
                        ? `rgb(${formState.userConfig.activeRowBg})`
                        : "#e3f2fd",
                    }}
                  >
                    <i className="ri-palette-line text-white text-sm absolute pointer-events-none drop-shadow-md"></i>
                    <input
                      type="color"
                      value={
                        formState.userConfig?.activeRowBg
                          ? rgbToHex(formState.userConfig.activeRowBg)
                          : "#e3f2fd"
                      }
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target?.value);
                        if (rgb) {
                          debouncedHandleFieldChange(
                            "activeRowBg",
                            `${rgb.r},${rgb.g},${rgb.b}`
                          );
                        }
                      }}
                      className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-dark-text block mb-1">
                      {t("active_row_background_color")}
                    </label>
                    <div className="text-xs text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-1 rounded-md">
                      rgb({formState.userConfig?.activeRowBg || "227,242,253"})
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: formState.userConfig?.gridFooterBg
                        ? `rgb(${formState.userConfig.gridFooterBg})`
                        : "#f8f9fa",
                    }}
                  >
                    <i className="ri-palette-line text-white text-sm absolute pointer-events-none drop-shadow-md"></i>
                    <input
                      type="color"
                      value={
                        formState.userConfig?.gridFooterBg
                          ? rgbToHex(formState.userConfig.gridFooterBg)
                          : "#f8f9fa"
                      }
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target?.value);
                        if (rgb) {
                          debouncedHandleFieldChange(
                            "gridFooterBg",
                            `${rgb.r},${rgb.g},${rgb.b}`
                          );
                        }
                      }}
                      className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-dark-text block mb-1">
                      {t("grid_footer_background_color")}
                    </label>
                    <div className="text-xs text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-1 rounded-md">
                      rgb({formState.userConfig?.gridFooterBg || "248,249,250"})
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: formState.userConfig?.gridFooterFontColor
                        ? `rgb(${formState.userConfig.gridFooterFontColor})`
                        : "#000000",
                    }}
                  >
                    <i className="ri-palette-line text-white text-sm absolute pointer-events-none drop-shadow-md"></i>
                    <input
                      type="color"
                      value={
                        formState.userConfig?.gridFooterFontColor
                          ? rgbToHex(formState.userConfig.gridFooterFontColor)
                          : "#000000"
                      }
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target?.value);
                        if (rgb) {
                          debouncedHandleFieldChange(
                            "gridFooterFontColor",
                            `${rgb.r},${rgb.g},${rgb.b}`
                          );
                        }
                      }}
                      className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-dark-text block mb-1">
                      {t("grid_footer_font_color")}
                    </label>
                    <div className="text-xs text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-1 rounded-md">
                      rgb({formState.userConfig?.gridFooterFontColor || "0,0,0"}
                      )
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Reset Section */}
        {/* <div className="bg-gradient-to-r from-[#fef2f2] to-[#fdf2f8] dark:from-[#7f1d1d33] dark:to-[#83184333] border border-[#fecaca] dark:border-[#991b1b] rounded-xl p-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
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
            </div> */}
      </div>
      {/* <div className="w-full flex justify-end items-center gap-2 dark:!border-dark-border dark:!bg-dark-bg rounded-b-md">
            <ERPButton
              title={t("cancel")}
              onClick={previousThemeChange}
              variant="secondary"
              className="min-w-[100px] transition-all duration-300"             

            /> 
            <ERPButton
              title={t("reset_all")}
              onClick={resetThemeChange}
              type="reset"
              variant="custom"
              className="min-w-[140px] bg-gradient-to-r from-[#2563eb] to-[#4f46e5] hover:from-[#1d4ed8] hover:to-[#4338ca] transition-all duration-300"
            />
            <ERPButton
              title={t("save_changes")}
              onClick={postUserConfig}
              variant="primary"
              className="min-w-[140px] transition-all duration-300"
            />
          </div> */}
    </>
  );
};
