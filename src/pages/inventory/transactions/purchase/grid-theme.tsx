import React, { useEffect, useState, useRef } from "react";
import ERPResizableSidebar from "../../../../components/ERPComponents/erp-resizable-sidebar";
import { X, Check, Palette } from "lucide-react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { TransactionFormState } from "./transaction-types";
import { useDispatch } from "react-redux";
import { formStateHandleFieldChangeKeysOnly } from "./reducer";
import { handleResponse } from "../../../../utilities/HandleResponse";
import { modelToBase64 } from "../../../../utilities/jsonConverter";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";

interface GridThemeProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  formState: TransactionFormState;
  transactionType:any
}

interface Theme {
  themeName: string;
  preview: string;
  gridFontSize: number;
  gridIsBold: boolean;
  gridBorderColor: string;
  gridHeaderBg: string;
  gridHeaderFontColor: string;
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
  const borderColor = `rgb(${theme.gridBorderColor})`;
  const activeRowBg = `rgb(${theme.activeRowBg})`;

  return (
    <div className="w-full h-24 overflow-hidden text-xs bg-gray-50" style={{ borderRadius: `${theme.gridBorderRadius}px` }}>
      <table className="w-full h-full border-collapse">
        <thead>
          <tr style={{ backgroundColor: headerBgColor, color: headerTextColor }}>
            <th className="px-1 py-1 text-left"
              style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontWeight: theme.gridIsBold ? 'bold' : 'normal', fontSize: `${Math.max(theme.gridFontSize - 2, 8)}px` }} >
              ID
            </th>
            <th
              className="px-1 py-1 text-left"
              style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontWeight: theme.gridIsBold ? 'bold' : 'normal', fontSize: `${Math.max(theme.gridFontSize - 2, 8)}px` }}>
              Item
            </th>
            <th
              className="px-1 py-1 text-left"
              style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontWeight: theme.gridIsBold ? 'bold' : 'normal', fontSize: `${Math.max(theme.gridFontSize - 2, 8)}px` }}>
              Status
            </th>
          </tr>
        </thead>
        {/* Body */}
        <tbody className="bg-white">
          <tr style={{ backgroundColor: activeRowBg }}>
            <td
              className="px-1 py-1"
              style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px`, height: `${Math.max(theme.gridRowHeight / 3, 8)}px` }}>
              001
            </td>
            <td
              className="px-1 py-1"
              style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }}>
              Laptop
            </td>
            <td
              className="px-1 py-1"
              style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }}>
              Delivered
            </td>
          </tr>
          <tr className="bg-white">
            <td
              className="px-1 py-1"
              style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px`, height: `${Math.max(theme.gridRowHeight / 3, 8)}px` }}>
              002
            </td>
            <td
              className="px-1 py-1"
              style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }}>
              Phone
            </td>
            <td
              className="px-1 py-1"
              style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }} >
              Pending
            </td>
          </tr>
          <tr className="bg-white">
            <td
              className="px-1 py-1"
              style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px`, height: `${Math.max(theme.gridRowHeight / 3, 8)}px` }}>
              003
            </td>
            <td
              className="px-1 py-1"
              style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }}>
              Headphones
            </td>
            <td
              className="px-1 py-1"
              style={{ border: theme.showColumnBorder ? `1px solid ${borderColor}` : 'none', fontSize: `${Math.max(theme.gridFontSize - 3, 7)}px` }}>
              Cancelled
            </td>
          </tr>
        </tbody>
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
    gridBorderColor: "186,186,186",
    gridHeaderBg: "242,242,242",
    gridHeaderFontColor: "31,41,55",
    gridBorderRadius: 0,
    showColumnBorder: true,
    activeRowBg: "227,242,253",
    gridRowHeight: 33,
    colors: ["#f2f2f2", "#e3f2fd", "#bababa"]
  },
  {
    themeName: "Blue",
    preview: "Modern Blue",
    gridFontSize: 12,
    gridIsBold: true,
    gridBorderColor: "225,225,225",
    gridHeaderBg: "41,61,163",
    gridHeaderFontColor: "255,255,255",
    gridBorderRadius: 10,
    showColumnBorder: true,
    activeRowBg: "173,197,245",
    gridRowHeight: 40,
    colors: ["#293da3", "#adc5f5", "#3b82f6"]
  },
  {
    themeName: "Forest Green",
    preview: "Nature Inspired",
    gridFontSize: 14,
    gridIsBold: false,
    gridBorderColor: "48,161,103",
    gridHeaderBg: "42,146,101",
    gridHeaderFontColor: "255,255,255",
    gridBorderRadius: 15,
    showColumnBorder: false,
    activeRowBg: "220,252,231",
    gridRowHeight: 40,
    colors: ["#2a9265", "#dcfce7", "#30a167"]
  },
  {
    themeName: "Ocean Blue",
    preview: "Deep & Calming",
    gridFontSize: 13,
    gridIsBold: true,
    gridBorderColor: "15,114,141",
    gridHeaderBg: "9,126,153",
    gridHeaderFontColor: "255,255,255",
    gridBorderRadius: 8,
    showColumnBorder: true,
    activeRowBg: "186,230,253",
    gridRowHeight: 36,
    colors: ["#097e99", "#bae6fd", "#0f728d"]
  },
  {
    themeName: "Sunset Orange",
    preview: "Warm & Energetic",
    gridFontSize: 13,
    gridIsBold: false,
    gridBorderColor: "249,115,22",
    gridHeaderBg: "234,85,6",
    gridHeaderFontColor: "255,255,255",
    gridBorderRadius: 6,
    showColumnBorder: true,
    activeRowBg: "255,237,213",
    gridRowHeight: 38,
    colors: ["#ea5506", "#ffedd5", "#f97316"]
  },
  {
    themeName: "Purple Elegance",
    preview: "Luxurious & Modern",
    gridFontSize: 14,
    gridIsBold: true,
    gridBorderColor: "139,92,246",
    gridHeaderBg: "124,58,237",
    gridHeaderFontColor: "255,255,255",
    gridBorderRadius: 12,
    showColumnBorder: false,
    activeRowBg: "237,233,254",
    gridRowHeight: 42,
    colors: ["#7c3aed", "#ede9fe", "#8b5cf6"]
  },
  {
    themeName: "Rose Gold",
    preview: "Sophisticated & Elegant",
    gridFontSize: 13,
    gridIsBold: false,
    gridBorderColor: "241,148,167",
    gridHeaderBg: "229,23,109",
    gridHeaderFontColor: "255,255,255",
    gridBorderRadius: 8,
    showColumnBorder: true,
    activeRowBg: "255,228,230",
    gridRowHeight: 36,
    colors: ["#e5176d", "#ffe4e6", "#f194a7"]
  },
  {
    themeName: "Bold Vibrant",
    preview: "Energetic & Creative",
    gridFontSize: 13,
    gridIsBold: true,
    gridBorderColor: "76,29,149",
    gridHeaderBg: "30,27,75",
    gridHeaderFontColor: "250,204,21",
    gridBorderRadius: 6,
    showColumnBorder: true,
    activeRowBg: "244,114,182",
    gridRowHeight: 36,
    colors: ["#1E1B4B", "#FACC15", "#F472B6"]
  },
  {
    themeName: "Custom",
    preview: "Energetic & Creative",
    gridFontSize: 13,
    gridIsBold: true,
    gridBorderColor: "76,29,149",
    gridHeaderBg: "30,27,75",
    gridHeaderFontColor: "250,204,21",
    gridBorderRadius: 6,
    showColumnBorder: true,
    activeRowBg: "244,114,182",
    gridRowHeight: 36,
    colors: ["#1E1B4B", "#FACC15", "#F472B6"]
  },
];

const GridTheme: React.FC<GridThemeProps> = ({ isOpen, onClose, t, formState,transactionType }) => {
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [currentTheme, setCurrentTheme] = useState<any>(null);
  const [countdown, setCountdown] = useState(8);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();
  const onResetTheme = () => {
    dispatch(formStateHandleFieldChangeKeysOnly(
      {
        fields: {
          userConfig: {
            ...currentTheme
          }
        }
      }
    ))
  }
  useEffect(() => {
    debugger;
    const ct = {
      themeName: formState?.userConfig?.themeName ?? "Custom",
      gridFontSize: formState?.userConfig?.gridFontSize,
      gridIsBold: formState?.userConfig?.gridIsBold,
      gridBorderColor: formState?.userConfig?.gridBorderColor,
      gridHeaderBg: formState?.userConfig?.gridHeaderBg,
      gridHeaderFontColor: formState?.userConfig?.gridHeaderFontColor,
      gridBorderRadius: formState?.userConfig?.gridBorderRadius,
      showColumnBorder: formState?.userConfig?.showColumnBorder,
      activeRowBg: formState?.userConfig?.activeRowBg,
      gridRowHeight: formState?.userConfig?.gridRowHeight,
      isInitial: true
    }
    setCurrentTheme(ct)
    setSelectedTheme(ct)
  }, [formState?.userConfig]);
  

  useEffect(() => {
    if (selectedTheme && selectedTheme.isInitial !== true) {
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            userConfig: {
              ...selectedTheme,
            },
          },
        })
      );

      setCountdown(8);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            onResetTheme();
            setSelectedTheme(currentTheme);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [selectedTheme]);

  const handleSelectTheme = (theme: any) => {
    if (selectedTheme?.themeName !== theme.themeName) {
      setSelectedTheme(theme);
    }
  };

 
const handleSave = async () => {
    try {
      debugger;
      if(!selectedTheme) return;
      console.log("fulluserconfig",{...formState?.userConfig,...selectedTheme});
      const response = await api.post(`${Urls.inv_transaction_base}${transactionType}/UpdateLocalSettings`,{...formState?.userConfig,...selectedTheme});
      handleResponse(response, () => {
        const base64 = modelToBase64({...formState?.userConfig,...selectedTheme});
        localStorage.setItem("utInvc", base64);
      setSelectedTheme(null);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      onClose();
      });
     
    } catch (error) {
     console.log("error in save table theme",error

 );
 
    } finally {

    }
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
        <div className={`flex-1 px-4 overflow-y-auto ${selectedTheme ? 'pb-32' : 'pb-4'}`}>
          <div className="grid grid-cols-2 gap-4">
            {gridThemes.map((theme) => (
              <div
                key={theme.themeName}
                onClick={() => handleSelectTheme(theme)}
                className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${selectedTheme?.themeName === theme.themeName
                  ? "ring-2 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30"
                  : "ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600 shadow-md hover:shadow-lg bg-white dark:bg-gray-800"}`}>
                {/* Theme Preview Table */}
                <div className="relative h-24 overflow-hidden">
                  <TablePreview theme={theme} />
                  {selectedTheme?.themeName === theme.themeName && (
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
                    {theme.gridIsBold && (
                      <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">Bold</span>
                    )}
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">{theme.gridRowHeight}px</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown and Actions - Sticky Bottom */}
        {selectedTheme && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border-t border-blue-200 dark:border-blue-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {t('previewing')}<span className="text-blue-600 dark:text-blue-400">{selectedTheme.themeName}</span>
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${countdown > 2 ? 'bg-green-500' : countdown > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    {t('auto_reset_in')}{countdown}s
                  </div>
                </div>
              </div>

              <ERPButton
                title={t("save_changes")}
                onClick={handleSave}
                variant="primary"
                disabled={countdown === 0}
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