import React, { useEffect, useRef, useState } from "react";
import {
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  ZoomOut,
  ZoomIn,
  RotateCcw,
  Settings,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import Urls from "../../../redux/urls";
import { APIClient } from "../../../helpers/api-client";
import { t } from "i18next";
import {
  fetchDefaultTemplateFromApi,
  fetchDefaultTemplateFromToken,
} from "../../use-print";
import { useCommenPrint } from "../../transaction-base/use-commen-print";
import { useDirectPrint } from "../../../utilities/hooks/use-direct-print";
import { de } from "date-fns/locale";
import { Box } from "@mui/material";
import SharedTemplatePreview from "../../InvoiceDesigner/DesignPreview/shared";
import {
  DesignerElementType,
  PlacedComponent,
} from "../../InvoiceDesigner/Designer/interfaces";
import { generateQRCodeDataUrl } from "../../InvoiceDesigner/utils/qrSvgToImg";
import {
  getOrientedDimensions,
  getPageDimensions,
} from "../../InvoiceDesigner/utils/pdf-util";
import { ERPScrollArea } from "../../../components/ERPComponents/erp-scrollbar";
import { PrintData } from "../../use-print-type";
const TwilioPdfDownloader = ({}) => {
  const { directPrint } = useDirectPrint();
  const location = useLocation();
  const [error, setError] = useState<any>(null);
  const [token, setToken] = useState("");
  const [TemplateProps, setTemplateProps] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number>(500);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wh = window.innerHeight;
    setMaxHeight(wh);
  }, []);
  // Extract token from query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      console.log("Token extracted from URL:", tokenFromUrl);
    } else {
      setError("No token found in URL parameters");
    }
  }, [location.search]);
  
const handlePrintPdf =async()=>{
  try{
    setLoading(true)
 await directPrint({isDirectDownload:true ,template:TemplateProps?.template,data:TemplateProps?.data,})
  }catch(error){
 console.log(error);
 
  }finally{
 setLoading(false)
  }
  
}
  // Main function to fetch and download PDF
  const generatePdf = async (token: string) => {
    if (!token) {
      setError("No token available");
      return;
    }

    try {
      setLoading(true);
      // Call API to get PDF data
      const Data = await fetchDefaultTemplateFromToken(token);
      if (Data) {
        

        const { template, data } = Data;
        // Generate QR codes
        const elements: PlacedComponent[] = [
          ...(template?.headerState?.customElements?.elements ?? []),
          ...(template?.footerState?.customElements?.elements ?? []),
        ].filter((comp) => comp.type === DesignerElementType.qrCode);

        const qrImages: { [key: string]: string } = {};
        for (const comp of elements) {
          if (comp.qrCodeProps) {
            qrImages[comp.id] = await generateQRCodeDataUrl(comp.qrCodeProps);
          }
        }

        const pageOrientation =
          template?.propertiesState?.orientation === "landscape"
            ? "landscape"
            : "portrait";
        const pageSize = template?.propertiesState?.pageSize ?? "A4";

        const selectedPageSize = getPageDimensions(
          pageSize,
          template?.propertiesState?.width,
          template?.propertiesState?.height
        );

        const orientedDimensions = getOrientedDimensions(
          selectedPageSize,
          pageOrientation
        );
        const PrintData:PrintData = {
          data: data,
          kind: "voucher",
        }
        const props = {
          template,
          PrintData,
          qrCodeImages: qrImages,
          orientedDimensions,
        };

        setTemplateProps(props);
      } else {
        setError("No data received from server");
      }
    } catch (err: any) {
      console.error("PDF generation error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-download when token is available
  useEffect(() => {
    
    if (token) {
      generatePdf(token);
    }
  }, [token]);



  return (
    <>
      {/* Main Content */}
   <div className="flex   dark:text-white bg-white dark:bg-body_dark "
   style={{ maxHeight, }}
   >
        {/* Modern Preview Panel */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          {/* Preview Header */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-bg-card border-b border-gray-200 dark:border-gray-700 h-[70px]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Preview
              </h2>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {TemplateProps?.orientedDimensions?.width}pt ×{" "}
                {TemplateProps?.orientedDimensions?.height}pt
              </div>
            </div>

            {/* Preview Controls */}
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] text-center">
                100%
              </span>
              <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Preview Content   overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${maxHeight - 100}px] flex-col gap-1*/}
          <ERPScrollArea
            className={`overflow-auto  flex-1 p-6 bg-gray-50 dark:bg-dark-bg-card`}
            maxHeight={maxHeight - 100}
          >
            <div className="flex justify-center">
              <div className="relative group">
                {TemplateProps?.template && (
                  <div className="absolute top-0 right-0 rounded-bl-md shadow-md overflow-hidden opacity-0 z-[39] group-hover:opacity-100 transition-opacity duration-300">
                    <button
                    disabled={loading}
                      onClick={handlePrintPdf}
                      className="flex items-center gap-2 px-3 py-2 bg-[#408dfb] text-white font-medium hover:bg-[#2f74e0] focus:bg-[#2f74e0] active:bg-[#255ccf] focus:outline-none focus:ring-2 focus:ring-white transition-all duration-150 rounded-bl-md select-none"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {/* Preview Container with Modern Styling */}
                <div
                  ref={previewContainerRef}
                  className="shadow-lg   border border-gray-200 dark:border-dark-border overflow-hidden bg-white dark:bg-dark-bg-card"
                  style={{
                    width: `${
                      TemplateProps?.orientedDimensions?.width ?? 500
                    }pt`,
                    height: `${
                      TemplateProps?.orientedDimensions?.height ?? 500
                    }pt`,
                    transformOrigin: "top left",
                  }}
                >
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="relative h-full   w-full ">
                      {TemplateProps?.template ? (
                        <SharedTemplatePreview
                          template={TemplateProps?.template}
                          printData={TemplateProps?.PrintData}
                          qrCodeImages={TemplateProps?.qrCodeImages}
                        />
                      ) : (
                        <div className="flex items-center justify-center gap-2 h-full">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="flex items-center">
                            <strong className="text-red-700 mt-1 ">{`${error}`}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Drop Shadow Effect */}
                <div
                  className="absolute -bottom-2 -right-2 bg-gray-400/20 dark:bg-gray-600/20 rounded-lg -z-10"
                  style={{
                    width: `${TemplateProps?.orientedDimensions?.width}pt`,
                    height: `${TemplateProps?.orientedDimensions?.height}pt`,
                    minHeight: "400px",
                  }}
                />
              </div>
            </div>
          </ERPScrollArea>
                    {/* Preview Footer */}
          {/* <div className="p-3 bg-white dark:bg-dark-bg-card border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Template: {TemplateProps?.template?.templateGroup??""}</span>
                <div className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
                <span>Type: {TemplateProps?.template?.designerKind??""}</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>

  );
};

export default TwilioPdfDownloader;
