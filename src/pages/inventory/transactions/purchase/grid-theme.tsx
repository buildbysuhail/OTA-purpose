import React, { useEffect } from "react";
import ERPResizableSidebar from "../../../../components/ERPComponents/erp-resizable-sidebar";
import { X, Check, Palette } from "lucide-react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { TransactionFormState } from "./transaction-types";
import { useDispatch, useSelector } from "react-redux";
import { formStateHandleFieldChangeKeysOnly } from "./reducer";
import { handleResponse } from "../../../../utilities/HandleResponse";
import { modelToBase64 } from "../../../../utilities/jsonConverter";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import { RootState } from "../../../../redux/store";

interface GridThemeProps {
  isOpen: boolean;
  onClose: () => void;
  onClearThemeChangeInterval: () => void;
  t: (key: string) => string;
  formState: TransactionFormState;
  transactionType: any
}

interface Theme {
  themeName: string;
  preview: string;
  gridFontSize: number;
  gridIsBold: boolean;
  gridBorderColor: string;
  gridHeaderBg: string;
  gridHeaderFontColor: string;
  gridHeaderRowHeight: number;
  gridFooterBg: string;
  gridFooterFontColor: string;
  gridBorderRadius: number;
  showColumnBorder: boolean;
  activeRowBg: string;
  gridRowHeight: number;
  colors: string[];
}
const api = new APIClient();
// TablePreview Component
const TablePreview = ({ theme }: { theme: Theme }) => {
  const headerBgColor = `rgb(${theme.gridHeaderBg})`;
  const headerTextColor = `rgb(${theme.gridHeaderFontColor})`;
  const footerBgColor = `rgb(${theme.gridFooterBg})`;
  const footerTextColor = `rgb(${theme.gridFooterFontColor})`;
  const borderColor = `rgb(${theme.gridBorderColor})`;
  const activeRowBg = `rgb(${theme.activeRowBg})`;

  return (
    <div className="w-full h-24 overflow-hidden text-xs bg-gray-50" style={{ borderRadius: `${theme.gridBorderRadius}px` }}>
      <table className="w-full h-full border-collapse">
        <thead>
          <tr style={{ backgroundColor: headerBgColor, color: headerTextColor }}>
            <th className="px-1 py-1 text-left" style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontWeight: theme.gridIsBold ? 'bold' : 'normal', fontSize: `${Math.max(theme.gridFontSize - 2, 8)}px` }} >
              ID
            </th>
            <th className="px-1 py-1 text-left" style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontWeight: theme.gridIsBold ? 'bold' : 'normal', fontSize: `${Math.max(theme.gridFontSize - 2, 8)}px` }}>
              Item
            </th>
            <th className="px-1 py-1 text-left" style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontWeight: theme.gridIsBold ? 'bold' : 'normal', fontSize: `${Math.max(theme.gridFontSize - 2, 8)}px` }}>
              Status
            </th>
          </tr>
        </thead>
        {/* Body */}
        <tbody className="bg-white">
          <tr style={{ backgroundColor: activeRowBg }}>
            <td className="px-1 py-1" style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px`, height: `${Math.max(theme.gridRowHeight / 3, 8)}px` }}>
              001
            </td>
            <td className="px-1 py-1" style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }}>
              Laptop
            </td>
            <td className="px-1 py-1" style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }}>
              Delivered
            </td>
          </tr>
          <tr className="bg-white">
            <td className="px-1 py-1" style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px`, height: `${Math.max(theme.gridRowHeight / 3, 8)}px` }}>
              002
            </td>
            <td className="px-1 py-1" style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }}>
              Phone
            </td>
            <td className="px-1 py-1" style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }} >
              Pending
            </td>
          </tr>
        </tbody>
        {/* Footer */}
        <tfoot>
          <tr style={{ backgroundColor: footerBgColor, color: footerTextColor }}>
            <td className="px-1 py-1 text-left font-medium" style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }}>
              Total
            </td>
            <td className="px-1 py-1 text-left" style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }}>
              2 Items
            </td>
            <td className="px-1 py-1 text-left" style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }}>
              Summary
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const gridThemes = [
  {
    themeName: "Classic Default",
    preview: "Clean & Professional",
    gridFontSize: 12,
    gridIsBold: true,
    gridBorderColor: "226,232,240",
    gridHeaderBg: "248,250,252",
    gridHeaderFontColor: "15,23,42",
    gridHeaderRowHeight: 40,
    gridFooterBg: "241,245,249",
    gridFooterFontColor: "51,65,85",
    gridBorderRadius: 8,
    showColumnBorder: true,
    activeRowBg: "240,249,255",
    gridRowHeight: 33,
    colors: ["#f8fafc", "#e2e8f0", "#cbd5e1"]
  },
  {
    themeName: "Modern Blue",
    preview: "Professional & Trust",
    gridFontSize: 12,
    gridIsBold: true,
    gridBorderColor: "191,219,254",
    gridHeaderBg: "37,99,235",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 45,
    gridFooterBg: "219,234,254",
    gridFooterFontColor: "30,58,138",
    gridBorderRadius: 10,
    showColumnBorder: true,
    activeRowBg: "219,234,254",
    gridRowHeight: 40,
    colors: ["#2563eb", "#3b82f6", "#dbeafe"]
  },
  {
    themeName: "Emerald Green",
    preview: "Fresh & Natural",
    gridFontSize: 14,
    gridIsBold: false,
    gridBorderColor: "167,243,208",
    gridHeaderBg: "5,150,105",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 45,
    gridFooterBg: "209,250,229",
    gridFooterFontColor: "6,78,59",
    gridBorderRadius: 12,
    showColumnBorder: false,
    activeRowBg: "209,250,229",
    gridRowHeight: 40,
    colors: ["#059669", "#10b981", "#d1fae5"]
  },
  {
    themeName: "Teal Ocean",
    preview: "Calm & Sophisticated",
    gridFontSize: 13,
    gridIsBold: true,
    gridBorderColor: "153,246,228",
    gridHeaderBg: "13,148,136",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 40,
    gridFooterBg: "204,251,241",
    gridFooterFontColor: "19,78,74",
    gridBorderRadius: 8,
    showColumnBorder: true,
    activeRowBg: "204,251,241",
    gridRowHeight: 36,
    colors: ["#0d9488", "#14b8a6", "#ccfbf1"]
  },
  {
    themeName: "Purple Luxury",
    preview: "Premium & Creative",
    gridFontSize: 14,
    gridIsBold: true,
    gridBorderColor: "196,181,253",
    gridHeaderBg: "109,40,217",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 46,
    gridFooterBg: "237,233,254",
    gridFooterFontColor: "91,33,182",
    gridBorderRadius: 12,
    showColumnBorder: false,
    activeRowBg: "237,233,254",
    gridRowHeight: 42,
    colors: ["#6d28d9", "#7c3aed", "#ede9fe"]
  },
  {
    themeName: "Rose Elegance",
    preview: "Sophisticated & Warm",
    gridFontSize: 13,
    gridIsBold: false,
    gridBorderColor: "253,164,175",
    gridHeaderBg: "190,18,60",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 40,
    gridFooterBg: "255,228,230",
    gridFooterFontColor: "159,18,57",
    gridBorderRadius: 8,
    showColumnBorder: true,
    activeRowBg: "255,228,230",
    gridRowHeight: 36,
    colors: ["#be123c", "#e11d48", "#ffe4e6"]
  },
  {
    themeName: "Indigo Tech",
    preview: "Modern & Tech-Forward",
    gridFontSize: 13,
    gridIsBold: true,
    gridBorderColor: "165,180,252",
    gridHeaderBg: "67,56,202",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 44,
    gridFooterBg: "224,231,255",
    gridFooterFontColor: "49,46,129",
    gridBorderRadius: 10,
    showColumnBorder: true,
    activeRowBg: "224,231,255",
    gridRowHeight: 38,
    colors: ["#4338ca", "#6366f1", "#e0e7ff"]
  },
  {
    themeName: "Slate Professional",
    preview: "Minimal & Executive",
    gridFontSize: 13,
    gridIsBold: true,
    gridBorderColor: "203,213,225",
    gridHeaderBg: "51,65,85",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 42,
    gridFooterBg: "226,232,240",
    gridFooterFontColor: "30,41,59",
    gridBorderRadius: 6,
    showColumnBorder: true,
    activeRowBg: "226,232,240",
    gridRowHeight: 36,
    colors: ["#334155", "#475569", "#e2e8f0"]
  },
  {
    themeName: "Monochrome Pro",
    preview: "Timeless Black & White",
    gridFontSize: 12,
    gridIsBold: true,
    gridBorderColor: "229,231,235",
    gridHeaderBg: "17,24,39",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 40,
    gridFooterBg: "243,244,246",
    gridFooterFontColor: "31,41,55",
    gridBorderRadius: 4,
    showColumnBorder: true,
    activeRowBg: "243,244,246",
    gridRowHeight: 36,
    colors: ["#111827", "#374151", "#f3f4f6"]
  },
  {
    themeName: "Pastel Mint",
    preview: "Fresh & Modern",
    gridFontSize: 13,
    gridIsBold: false,
    gridBorderColor: "167,243,208",
    gridHeaderBg: "34,197,94",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 42,
    gridFooterBg: "220,252,231",
    gridFooterFontColor: "22,101,52",
    gridBorderRadius: 10,
    showColumnBorder: false,
    activeRowBg: "220,252,231",
    gridRowHeight: 38,
    colors: ["#22c55e", "#4ade80", "#dcfce7"]
  },
  {
    themeName: "Soft Sky",
    preview: "Light & Calm",
    gridFontSize: 13,
    gridIsBold: false,
    gridBorderColor: "191,219,254",
    gridHeaderBg: "14,165,233",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 42,
    gridFooterBg: "224,242,254",
    gridFooterFontColor: "7,89,133",
    gridBorderRadius: 10,
    showColumnBorder: true,
    activeRowBg: "224,242,254",
    gridRowHeight: 38,
    colors: ["#0ea5e9", "#38bdf8", "#e0f2fe"]
  },
  {
    themeName: "Neutral Gray",
    preview: "Corporate & Minimal",
    gridFontSize: 12,
    gridIsBold: true,
    gridBorderColor: "229,231,235",
    gridHeaderBg: "75,85,99",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 42,
    gridFooterBg: "243,244,246",
    gridFooterFontColor: "31,41,55",
    gridBorderRadius: 8,
    showColumnBorder: true,
    activeRowBg: "243,244,246",
    gridRowHeight: 36,
    colors: ["#4b5563", "#6b7280", "#f3f4f6"]
  },
  {
    themeName: "Blush Peach",
    preview: "Elegant & Soft",
    gridFontSize: 13,
    gridIsBold: false,
    gridBorderColor: "254,215,170",
    gridHeaderBg: "249,115,22",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 42,
    gridFooterBg: "255,237,213",
    gridFooterFontColor: "124,45,18",
    gridBorderRadius: 12,
    showColumnBorder: true,
    activeRowBg: "255,237,213",
    gridRowHeight: 38,
    colors: ["#f97316", "#fb923c", "#fed7aa"]
  },
  {
    themeName: "Ocean Blue Gradient",
    preview: "Cool & Modern",
    gridFontSize: 13,
    gridIsBold: true,
    gridBorderColor: "191,219,254",
    gridHeaderBg: "29,78,216",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 44,
    gridFooterBg: "219,234,254",
    gridFooterFontColor: "30,64,175",
    gridBorderRadius: 12,
    showColumnBorder: true,
    activeRowBg: "219,234,254",
    gridRowHeight: 38,
    colors: ["#1d4ed8", "#3b82f6", "#dbeafe"]
  },
  {
    themeName: "Custom",
    preview: "Customizable Theme",
    gridFontSize: 13,
    gridIsBold: true,
    gridBorderColor: "203,213,225",
    gridHeaderBg: "100,116,139",
    gridHeaderFontColor: "255,255,255",
    gridHeaderRowHeight: 40,
    gridFooterBg: "226,232,240",
    gridFooterFontColor: "30,41,59",
    gridBorderRadius: 6,
    showColumnBorder: true,
    activeRowBg: "226,232,240",
    gridRowHeight: 36,
    colors: ["#64748b", "#94a3b8", "#e2e8f0"]
  },
];

const GridTheme: React.FC<GridThemeProps> = ({ isOpen, onClose, t, transactionType, onClearThemeChangeInterval }) => {
  const dispatch = useDispatch();
  const formState = useSelector(
    (state: RootState) => state.InventoryTransaction
  );
  const onResetTheme = () => {
    dispatch(formStateHandleFieldChangeKeysOnly(
      {
        fields: {
          userConfig: {
            ...formState.currentTheme
          }
        }
      }
    ))
  }

  // useEffect(() => {
  //   if (formState.selectedTheme && formState.selectedTheme?.isInitial !== true) {
  //     dispatch(
  //       formStateHandleFieldChangeKeysOnly({
  //         fields: {
  //           userConfig: {
  //             ...formState.selectedTheme,
  //           },
  //         },
  //       })
  //     );
  //   }
  // }, [formState.selectedTheme]);

  const handleSelectTheme = (theme: any) => {
    if (formState.selectedTheme?.themeName !== theme.themeName) {
      dispatch(formStateHandleFieldChangeKeysOnly({ fields: { selectedTheme: { ...theme, isInitial: false } } }));
    }
  };

  const handleSave = async () => {
    try {
      debugger;
      if (!formState.selectedTheme) return;
      console.log("fulluserconfig", { ...formState?.userConfig, ...formState.selectedTheme });
      const response = await api.post(`${Urls.inv_transaction_base}${transactionType}/UpdateLocalSettings`, { ...formState?.userConfig, ...formState.selectedTheme });
      handleResponse(response, () => {
        const base64 = modelToBase64({ ...formState?.userConfig, ...formState.selectedTheme });
        localStorage.setItem("utInvc", base64);
        dispatch(formStateHandleFieldChangeKeysOnly({ fields: { selectedTheme: null, themeChangeCountdown: undefined } }))
        onClearThemeChangeInterval && onClearThemeChangeInterval();
        onClose();
      });
    } catch (error) {
      console.log("error in save table theme", error
      );
    } finally { }
  };

  return (
    <ERPResizableSidebar isOpen={isOpen} setIsOpen={onClose} minWidth={450}>
      <div className="flex flex-col h-[94vh] dark:bg-dark-bg bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h6 className="font-gridIsBold text-xl tracking-tight dark:text-dark-text text-gray-900">
                {t("grid_themes")}
              </h6>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('choose_your_perfect_grid_style')}
                {/* {formState.selectedTheme?.themeName} */}
                {/* {JSON.stringify(formState.selectedTheme)} */}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onResetTheme();
              onClose();
            }}
            aria-label="Close"
            className="dark:bg-dark-bg-card dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white bg-white text-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-400 transition-all duration-200 p-2.5 rounded-xl shadow-lg hover:shadow-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Grid - Scrollable */}
        <div className={`flex-1 px-4 overflow-y-auto ${formState.selectedTheme ? 'pb-32' : 'pb-4'}`}>
          <div className="grid grid-cols-2 gap-4">
            {gridThemes.map((theme) => (
              <div
                key={theme.themeName}
                onClick={() => handleSelectTheme(theme)}
                className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${formState.selectedTheme?.themeName === theme.themeName
                  ? "ring-2 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30"
                  : "ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600 shadow-md hover:shadow-lg bg-white dark:bg-gray-800"}`}>
                {/* Theme Preview Table */}
                <div className="relative h-24 overflow-hidden">
                  <TablePreview theme={theme} />
                  {formState.selectedTheme?.themeName === theme.themeName && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1.5 shadow-lg">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 truncate">{theme.themeName} </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{theme.preview}</p>

                  {/* Color Palette */}
                  <div className="flex items-center gap-1.5">
                    {theme.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full ring-1 ring-gray-200 dark:ring-gray-600"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Theme Properties */}
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">{theme.gridFontSize}px</span>
                    {theme.gridIsBold && (<span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">Bold</span>)}
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">{theme.gridRowHeight}px</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown and Actions - Sticky Bottom */}
        {formState.selectedTheme && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border-t border-blue-200 dark:border-blue-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {t('previewing')}<span className="text-blue-600 dark:text-blue-400">{formState.selectedTheme.themeName}</span>
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${formState.themeChangeCountdown ?? 0 > 2 ? 'bg-green-500' : formState.themeChangeCountdown ?? 0 > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    {t('auto_reset_in')}{formState.themeChangeCountdown ?? 0}s
                  </div>
                </div>
              </div>

              <ERPButton
                title={t("save_changes")}
                onClick={handleSave}
                variant="primary"
                disabled={formState.themeChangeCountdown === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium py-2.5"
              />
            </div>
          </div>
        )}
      </div>
    </ERPResizableSidebar>
  );
};

export default React.memo(GridTheme, (prevProps, nextProps) => {
  return prevProps.isOpen === nextProps.isOpen;
});