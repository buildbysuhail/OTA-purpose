import SharedPrvTable from "./Table_Prv";
import ShardPrevHeader from "./Header_Prv";
import SharedPrvFooter from "./Footer_Prv";
import { TemplateState } from "../../Designer/interfaces";
import { useState, useRef, useEffect } from "react";
import { PrintResponse } from "../../../use-print-type";
import { ChevronDown, Edit3, RefreshCw, Settings } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { formStateHandleFieldChange } from "../../../inventory/transactions/reducer";
import ERPResizableSidebar from "../../../../components/ERPComponents/erp-resizable-sidebar";
import TemplatesView from "../../../transaction-base/template_picker";
import { RootState } from "../../../../redux/store";
import { toggleTemplateChooserModal } from "../../../../redux/slices/popup-reducer";

export interface AccountTransactionProps {
  data?: PrintResponse;
  template?: TemplateState<unknown>;
  qrCodeImages?: { [key: string]: string };
  AmountToEnglish?: any;
  AmountToArabic?: any;
}

const SharedTemplatePreview = ({
  data,
  template,
  qrCodeImages = {},
}: AccountTransactionProps) => {
  const headerState = template?.headerState;
  const propertiesState = template?.propertiesState;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const formState = useAppSelector(
    (state: RootState) => state.InventoryTransaction
  );

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
        className="flex flex-col h-full w-full group"
        style={{
          backgroundColor: template?.propertiesState?.bg_color || "#fff",
          paddingTop: `${propertiesState?.padding?.top ?? 0}pt`,
          paddingRight: `${propertiesState?.padding?.right ?? 0}pt`,
          paddingBottom: `${propertiesState?.padding?.bottom ?? 0}pt`,
          paddingLeft: `${propertiesState?.padding?.left ?? 0}pt`,
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        {headerState?.showHeader && (
          <ShardPrevHeader data={data} template={template} qrCodes={qrCodeImages} />
        )}
        {/* Main Content Container */}
        <div
          className="relative flex flex-col flex-grow-1 h-full w-full"
          style={{
            flex: 1,
            backgroundImage: template?.background_image
              ? `url(${template?.background_image})`
              : "none",
            backgroundPosition: propertiesState?.bg_image_position ?? "center",
            backgroundSize: propertiesState?.bg_image_objectFit ?? "fill",
            backgroundRepeat: "no-repeat",
            boxSizing: "border-box",
          }}
        >
          <SharedPrvTable data={data?.details ?? []} template={template} />
        </div>
        {/* Hoverable Customize Button */}
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
        {isPopupOpen && (
          <div
            ref={popupRef}
            className="absolute top-[37px] right-0 w-56 bg-white rounded-lg border border-gray-200 shadow-xl z-[39] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="py-1">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Current Template
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {template?.templateName}
                </p>
              </div>
              {/* Menu Options */}
              <div className="py-1">
                <button className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
                  onClick={() => {
                    debugger;
                    dispatch(
                      toggleTemplateChooserModal({ isOpen: true, templateGroup: template?.templateGroup, customerType: template?.customerType, formType: template?.formType })
                    );
                  }}>
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                  <span>Change Template</span>
                </button>
                {/* <button className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150">
                <Edit3 className="w-4 h-4 text-gray-500" />
                <span>Edit Template</span>
              </button> */}
              </div>
            </div>
          </div>
        )}
        <SharedPrvFooter data={data} template={template} qrCodes={qrCodeImages} />
      </div>
    </>
  );
};

export default SharedTemplatePreview;
