import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import html2canvas from 'html2canvas';
import { DesignerElementType, PlacedComponent, TemplateDto, TemplateState } from "../Designer/interfaces";



import { debounce } from "lodash";
import { DummyVoucherData } from "../constants/DummyData";
import { RootState } from "../../../redux/store";
import { templateInitialState } from "../../../redux/reducers/TemplateReducer";
import { designerSectionsConfig, designSections, DesignSectionType } from "./designSection";
import { TemplateImagesTypes } from "./InvoiceDesignerLanding";
import Urls from "../../../redux/urls";
import { setTemplate } from "../../../redux/slices/templates/reducer";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import { handleResponse } from "../../../utilities/HandleResponse";
import { APIClient } from "../../../helpers/api-client";
import { getOrientedDimensions, getPageDimensions } from "../utils/pdf-util";
import { fetchTemplateFromApiById, getOrFetchTemplate, loadPrintData } from "../../use-print";
import { merge } from 'lodash';
import { generateQRCodeDataUrl } from "../utils/qrSvgToImg";
import { PrintDetailDto, PrintResponse } from "../../use-print-type";

const api = new APIClient();

interface UseTemplateDesignerProps {
  templateGroup?: string;
  templateKind?: string;
  designerType?: string;
  manuvalTemplateFeatch?:boolean,
  MasterIDParam?: number, voucherTypeParam?: string, isInvTrans?: boolean, isSalesView?: boolean, isServiceTrans?: boolean, transDate?: string, printCopies?: number, isReprint?: boolean, isPOSPrinting?: boolean, isFromSalesReceipt?: boolean, isPackingSlipPrint?: boolean, warehouseID?: number, kitchenIDParam?: number, kitchenPrinterNameParam?: string, kitchenNameParam?: string, commonKitchenProductGroupIDParam?: number,  transactionType?: string, dbIdValue?: string, voucherType?: string, isAppGlobal?: boolean
}

export const useTemplateDesigner = ({ templateGroup="", templateKind="", designerType="", manuvalTemplateFeatch,MasterIDParam,voucherTypeParam,isInvTrans,isSalesView,isServiceTrans,transDate,printCopies,isReprint,isPOSPrinting,isFromSalesReceipt,isPackingSlipPrint,warehouseID,kitchenIDParam,kitchenPrinterNameParam,kitchenNameParam,commonKitchenProductGroupIDParam,transactionType,dbIdValue,voucherType,isAppGlobal}: UseTemplateDesignerProps) => {
  const { t } = useTranslation("system");
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const activeTemplate = useSelector((state: RootState) => state.Template?.activeTemplate);

  const [stableTemplateProps, setStableTemplateProps] = useState<any>(null);
  const [designTabs, setDesignTabs] = useState<DesignSectionType[]>([]);
  const [currentSection, setCurrentSection] = useState<DesignSectionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [templateImages, setTemplateImages] = useState<TemplateImagesTypes>({
    signature_image: null,
    background_image: null,
    background_image_header: null,
    background_image_footer: null,
  });
  const [maxHeight, setMaxHeight] = useState<number>(500);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  //  Create consolidated template style properties object
const templateStyleProperties = useMemo(() => {
  const pageOrientation =
    activeTemplate?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";
  const pageSize = activeTemplate?.propertiesState?.pageSize ?? "A4";

  const selectedPageSize = getPageDimensions(
    pageSize,
    activeTemplate?.propertiesState?.width,
    activeTemplate?.propertiesState?.height
  );

  const orientedDimensions = getOrientedDimensions(selectedPageSize, pageOrientation);

  return {
    previewWidth: orientedDimensions.width,
    previewHeight: orientedDimensions.height,
  };
}, [
  activeTemplate?.propertiesState?.orientation,
  activeTemplate?.propertiesState?.pageSize,
  activeTemplate?.propertiesState?.width,
  activeTemplate?.propertiesState?.height,
]);



  // Stabilize props for PDFViewer
 useEffect(() => {
    const load = async () => {
      debugger;
        setLoading(true);
      try {
      
         let data: PrintResponse = DummyVoucherData as any;
         let _template = activeTemplate;
        if (MasterIDParam) {
          data = (await loadPrintData(
            MasterIDParam ?? 0,
            voucherTypeParam ?? "",
            isInvTrans,
            isSalesView,
            isServiceTrans,
            transDate,
            printCopies,
            isReprint,
            isPOSPrinting,
            isFromSalesReceipt,
            isPackingSlipPrint,
            warehouseID,
            kitchenIDParam,
            kitchenPrinterNameParam,
            kitchenNameParam,
            commonKitchenProductGroupIDParam,
            transactionType,
            dbIdValue,
            voucherType,
            isAppGlobal
          )) as any;
        }
        debugger
   if(manuvalTemplateFeatch){
      _template = await getOrFetchTemplate(data?.master?.voucherType,data?.master?.voucherForm,data?.master?.customerType); 
        debugger
      if (!_template) {
        setStableTemplateProps(null);
         setLoading(false);
         return 
      }

   }
  // Generate QR codes here
      const elements: PlacedComponent[] = [
        ...(_template?.headerState?.customElements?.elements ?? []),
        ...(_template?.footerState?.customElements?.elements ?? []),
      ].filter(comp => comp.type === DesignerElementType.qrCode);

      const qrImages: { [key: string]: string } = {};
      for (const comp of elements) {
        if (comp.qrCodeProps) {
          qrImages[comp.id] = await generateQRCodeDataUrl(comp.qrCodeProps);
        }
      }
      const props = { template: _template, data, qrCodeImages: qrImages };
      if(manuvalTemplateFeatch){
        dispatch(setTemplate(_template));
      }
        

        setStableTemplateProps(props);
      } catch (err) {
        // handle/log error if you want
         setStableTemplateProps(null);
         setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    load();
  // include all deps that should retrigger reload
  }, [
  MasterIDParam,
  transactionType,
  voucherTypeParam,
  isInvTrans,
  isSalesView,
  isServiceTrans,
  transDate,
  printCopies,
  isReprint,
  isPOSPrinting,
  isFromSalesReceipt,
  isPackingSlipPrint,
  warehouseID,
  kitchenIDParam,
  kitchenPrinterNameParam,
  kitchenNameParam,
  commonKitchenProductGroupIDParam,
  dbIdValue,
  voucherType,
  isAppGlobal,
  ]);


  // Set max height based on window size
  useEffect(() => {
    const wh = window.innerHeight;
    setMaxHeight(wh);
  }, []);

  // Filter design sections based on designer type
  // Filter design sections based on type & kind
  useEffect(() => {
    if (templateGroup) {
      const typeKey = designerType.toUpperCase();
      const validKinds = designerSectionsConfig[typeKey] || {};
      const sectionsForKind = validKinds[templateKind] || validKinds[Object.keys(validKinds)[0]] || [];
      setDesignTabs(
        designSections.filter((section) => sectionsForKind.includes(section.type))
      );
      setCurrentSection(
        designSections.find((section) => sectionsForKind.includes(section.type)) || designSections[0]
      );
    }
  }, [templateGroup, designerType, templateKind]);

  // Fetch template data for existing templates
  const getPDFTemplateData = useCallback(async () => {
    debugger;
    if (id !== "new") {
      try {
        setLoading(true)
        
        debugger;
         const _template = await fetchTemplateFromApiById(id);
              if(!_template) return null;
      
        if(_template && (_template?.id??0)> 0) {

          const initial = templateInitialState().activeTemplate;
          const _returnData = merge({}, initial, _template);
          debugger;
          dispatch(setTemplate(_returnData));
        }
      } catch (error) {
        console.error("Error fetching template data:", error);
        ERPToast.show(t("failed_to_fetch_template"));
      }finally {
        setLoading(false);
      }
    }
  }, [id, dispatch, t]);

  useEffect(() => {
    if(!manuvalTemplateFeatch){
    getPDFTemplateData();
    }
   
  }, [getPDFTemplateData]);

  // Function to convert preview component to image
  const capturePreviewAsImage = useCallback(async (): Promise<string> => {
    if (!previewContainerRef.current) {
      throw new Error("Preview container not found");
    }

    // Find the actual preview content container (the one with template styling)
    const previewContent = previewContainerRef.current.querySelector('[data-template-preview]') as HTMLElement;
    const targetElement = previewContent || previewContainerRef.current;

    try {
      const canvas = await html2canvas(targetElement, {
        backgroundColor: "#ffffff", // or your bg
        scale: 2,                   // smooth scaling
        useCORS: true,
      });
      return canvas.toDataURL("image/png", 0.95);
    } catch (err) {
      console.error("Image capture failed:", err);
      throw err;
    }
  }, [templateStyleProperties]);

  // Handle template saving
  const handleSave = useCallback(
    async (dataUrl: string) => {
      const tmpTemplate = {
        ...activeTemplate,
        propertiesState: {
          ...activeTemplate?.propertiesState,
          template_group: templateGroup,
          template_kind: templateKind,
          template_type: designerType,
        },
      };

      const activeTemplates: TemplateDto = {
        templateType: tmpTemplate.propertiesState.template_type ?? "standard",
        templateKind: tmpTemplate.propertiesState.template_kind ?? "standard",
        templateGroup: tmpTemplate.propertiesState.template_group ?? "",
        templateName: tmpTemplate.propertiesState?.templateName ?? "",
        formType:tmpTemplate.propertiesState?.template_formType??null,
        customerType:tmpTemplate.propertiesState?.template_customerType??null,
        thumbImage: dataUrl,
        content: JSON.stringify(tmpTemplate),
        isCurrent: tmpTemplate.isCurrent ?? false,
        backgroundImage: tmpTemplate.background_image ?? "",
        backgroundImageHeader: tmpTemplate.background_image_header ?? "",
        backgroundImageFooter: tmpTemplate.background_image_footer ?? "",
        signatureImage: tmpTemplate.signature_image ?? "",
        branchId: 0,
        id: id == "new" ? 0 :activeTemplate?.id,
      };
         const initial = templateInitialState().activeTemplate;
        const _returnData = merge({}, initial, activeTemplates);
      dispatch(setTemplate(_returnData));

      try {
        const res = await api.postAsync(Urls.templates, _returnData);
        handleResponse(res, () => {
          navigate(`/templates?template_group=${templateGroup}`);
        });
      } catch (error) {
        console.error("Error saving template:", error);
        ERPToast.show(t("failed_to_save_template"));
      } 
    },
    [activeTemplate, templateGroup, templateKind, dispatch, navigate, t]
  );

  // Updated save function that captures preview as image
  const manageSaveAccTemplate = useCallback(async () => {
    if (id === "new" && !activeTemplate?.propertiesState?.templateName) {
      ERPToast.show(t("template_name_is_required"));
      return;
    }

    try {
      setLoading(true);
      // Capture the preview as image
      const imageDataUrl = await capturePreviewAsImage();
      // Save with the captured image
      await handleSave(imageDataUrl);
    } catch (error) {
      console.error("Error saving template:", error);
      ERPToast.show(t("failed_to_save_template"));
    }
    finally {
        setLoading(false);
    }
  }, [id, activeTemplate, capturePreviewAsImage, handleSave, t]);

  // Debounced version if needed
  const debouncedSaveAccTemplate = useCallback(
    debounce(manageSaveAccTemplate, 500),
    [manageSaveAccTemplate]
  );

  return {
    t,
    id,
    navigate,
    templateGroup: templateGroup,
    designTabs,
    currentSection,
    setCurrentSection,
    loading,
    templateImages,
    setTemplateImages,
    maxHeight,
    activeTemplate,
    stableTemplateProps,
    manageSaveAccTemplate,
    dispatch,
    templateStyleProperties,
    previewContainerRef,
    masterId:MasterIDParam,

  };
};