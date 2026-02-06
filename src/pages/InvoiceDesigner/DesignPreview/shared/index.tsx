import SharedPrvTable from "./Table_Prv";
import ShardPrevHeader from "./Header_Prv";
import SharedPrvFooter from "./Footer_Prv";
import { TemplateState } from "../../Designer/interfaces";
import { useState, useRef, useEffect } from "react";
import { PrintData, PrintResponse } from "../../../use-print-type";
import { ChevronDown, RefreshCw, Settings } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { toggleTemplateChooserModal } from "../../../../redux/slices/popup-reducer";

export interface AccountTransactionProps {
  printData?: PrintData;
  template?: TemplateState<unknown>;
  qrCodeImages?: { [key: string]: string };
  AmountToEnglish?: any;
  AmountToArabic?: any;
  isTemplateDesigner?: boolean
  isInvTrans?: boolean;
  isInLedgerReport?: boolean;

}
export type TemplateChangeHandler = {
  openTemplateChooser: () => {}
};
const SharedTemplatePreview = ({ printData, template, qrCodeImages = {}, isTemplateDesigner = true, isInvTrans, isInLedgerReport }: AccountTransactionProps) => {
  const headerState = template?.headerState;
  const isAutoHeight =template?.propertiesState?.isAutoHeight??false; 
  const propertiesState = template?.propertiesState;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state: RootState) => state.InventoryTransaction);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };
    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <>
      <div
        className="flex flex-col w-full group"
        style={{
          minHeight: isAutoHeight ? 'auto' : '100%',
          backgroundColor: template?.propertiesState?.bg_color || "#fff",
          paddingTop: `${propertiesState?.padding?.top ?? 0}pt`,
          paddingRight: `${propertiesState?.padding?.right ?? 0}pt`,
          paddingBottom: `${propertiesState?.padding?.bottom ?? 0}pt`,
          paddingLeft: `${propertiesState?.padding?.left ?? 0}pt`,
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        {headerState?.showHeader && printData&&(
          <ShardPrevHeader printData={printData} template={template} qrCodes={qrCodeImages} />
        )}
        {/* Main Content Container */}
        <div
          className="relative flex flex-col flex-grow-1 h-full w-full"
          style={{
            flex: 1,
            backgroundImage: template?.background_image ? `url(${template?.background_image})` : "none",
            backgroundPosition: propertiesState?.bg_image_position ?? "center",
            backgroundSize: propertiesState?.bg_image_objectFit ?? "fill",
            backgroundRepeat: "no-repeat",
            boxSizing: "border-box",
          }}
        >
          {printData?.kind === "voucher" && (
          <SharedPrvTable data={printData?.data?.details ?? []} template={template} isAutoHeight={isAutoHeight} />

          )}
        </div>
        {/* Hoverable Customize Button */}
        {!isTemplateDesigner && (
          <div className="absolute top-0 right-0 rounded-bl-md shadow-md overflow-hidden opacity-0 z-[39] group-hover:opacity-100 transition-opacity duration-300">
            <button
              ref={buttonRef}
              onClick={togglePopup}
              className="flex items-center gap-2 px-3 py-2 bg-[#408dfb] text-white font-medium hover:bg-[#2f74e0] focus:bg-[#2f74e0] active:bg-[#255ccf] focus:outline-none focus:ring-2 focus:ring-white transition-all duration-150 rounded-bl-md select-none"
            >
              <Settings className="w-4 h-4" />
              <div className="flex items-center gap-1">
                <span>Customize</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isPopupOpen ? "rotate-180" : ""}`}
                />
              </div>
            </button>
          </div>
        )}

        {isPopupOpen && (
          <div ref={popupRef} className="absolute top-[37px] right-0 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl z-[39] overflow-hidden border border-violet-200/50 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
            {/* Decorative Top Border */}
            <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>
            {/* Header Section */}
            <div className="relative px-6 py-5 bg-gradient-to-br from-violet-50/80 via-purple-50/60 to-fuchsia-50/80 border-b border-violet-100/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-300/20 to-fuchsia-300/20 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-3.5 h-3.5 text-violet-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <p className="text-[10px] font-bold text-violet-600 uppercase tracking-[0.15em]">
                    Active Template
                  </p>
                </div>
                <p className="text-base font-bold text-slate-800 truncate leading-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
                  {template?.templateName}
                </p>
                <p className="text-xs text-slate-500 mt-1">Ready to customize</p>
              </div>
            </div>

            {/* Menu Options */}
            <div className="p-3">
              <button
                className="group relative w-full px-5 py-4 text-sm text-slate-700 hover:bg-gradient-to-br hover:from-violet-50 hover:to-fuchsia-50 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden border border-transparent hover:border-violet-200/50 hover:shadow-lg hover:shadow-violet-500/10"
                onClick={() => {
                  debugger;
                  dispatch(
                    toggleTemplateChooserModal({ isOpen: true, templateGroup: template?.templateGroup, customerType: template?.customerType, formType: template?.formType, isInv: isInvTrans,isInLedgerReport })
                  );
                }}>
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-purple-500/0 to-fuchsia-500/0 group-hover:from-violet-500/10 group-hover:via-purple-500/10 group-hover:to-fuchsia-500/10 transition-all duration-500 group-hover:scale-110"></div>

                {/* Icon Container */}
                <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 group-hover:from-violet-200 group-hover:to-fuchsia-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-md group-hover:shadow-violet-500/20">
                  <RefreshCw className="w-5 h-5 text-violet-600 group-hover:text-violet-700 group-hover:rotate-180 transition-all duration-500" />
                </div>

                {/* Text Content */}
                <div className="relative flex-1 text-left">
                  <span className="block font-bold text-slate-800 group-hover:text-violet-700 transition-colors duration-300">
                    Change Template
                  </span>
                  <p className="text-xs text-slate-500 group-hover:text-violet-600/80 transition-colors duration-300 mt-0.5">
                    Browse & select new designs
                  </p>
                </div>

                {/* Arrow Icon */}
                <svg className="relative w-5 h-5 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              </button>
              {/* <button className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150">
                <Edit3 className="w-4 h-4 text-gray-500" />
                <span>Edit Template</span>
              </button> */}
            </div>

            {/* Footer with gradient accent */}
            <div className="px-6 py-3 bg-gradient-to-r from-violet-50/50 to-fuchsia-50/50 border-t border-violet-100/50">
              <p className="text-[10px] text-center text-slate-500 font-medium">
                Click to explore more options
              </p>
            </div>
          </div>
        )}
        {printData&&(
        <SharedPrvFooter printData={printData} template={template} qrCodes={qrCodeImages} />
        )}
      </div>
    </>
  );
};

export default SharedTemplatePreview;
