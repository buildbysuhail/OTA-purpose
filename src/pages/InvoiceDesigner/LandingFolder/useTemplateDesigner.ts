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
import { fetchTemplateById, fetchTemplateFromApiById, getOrFetchTemplate, loadPrintData } from "../../use-print";
import { merge } from 'lodash';
import { generateQRCodeDataUrl } from "../utils/qrSvgToImg";
import { PrintDetailDto, PrintResponse } from "../../use-print-type";
import { compressData } from "../../../utilities/compression";
import { removeDefaults } from "../../../utilities/Utils";

const api = new APIClient();

interface UseTemplateDesignerProps {
  templateGroup?: string;
  templateKind?: string;
  designerType?: string;
  manuvalTemplateFeatch?: boolean;
  MasterIDParam?: number;
  voucherTypeParam?: string;
  isInvTrans?: boolean;
  isSalesView?: boolean;
  isServiceTrans?: boolean;
  transDate?: string;
  printCopies?: number;
  isReprint?: boolean;
  isPOSPrinting?: boolean;
  isFromSalesReceipt?: boolean;
  isPackingSlipPrint?: boolean;
  warehouseID?: number;
  kitchenIDParam?: number;
  kitchenPrinterNameParam?: string;
  kitchenNameParam?: string;
  commonKitchenProductGroupIDParam?: number;
  transactionType?: string;
  dbIdValue?: string;
  voucherType?: string;
  isAppGlobal?: boolean;
}

export const useTemplateDesigner = ({
  templateGroup = "",
  templateKind = "",
  designerType = "",
  manuvalTemplateFeatch,
  MasterIDParam,
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
  transactionType,
  dbIdValue,
  voucherType,
  isAppGlobal,
}: UseTemplateDesignerProps) => {
  const { t } = useTranslation("system");
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const activeTemplate = useSelector((state: RootState) => state.Template?.activeTemplate);

  const [stableTemplateProps, setStableTemplateProps] = useState<any>(null);
  const [printData, setPrintData] = useState<PrintResponse | null>(null);
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

  // Create consolidated template style properties object
  const templateStyleProperties = useMemo(() => {
    const pageOrientation =
      activeTemplate?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";
    const pageSize = activeTemplate?.propertiesState?.pageSize ?? "A4";
 const isAutoHeight = activeTemplate?.propertiesState?.isAutoHeight ?? false;
    const selectedPageSize = getPageDimensions(
      pageSize,
      activeTemplate?.propertiesState?.width,
      activeTemplate?.propertiesState?.height
    );

    const orientedDimensions = getOrientedDimensions(selectedPageSize, pageOrientation);

    return {
      previewWidth: orientedDimensions.width,
      previewHeight: isAutoHeight ? "auto" : orientedDimensions.height,
      isAutoHeight,
    };
  }, [
    activeTemplate?.propertiesState?.orientation,
    activeTemplate?.propertiesState?.pageSize,
    activeTemplate?.propertiesState?.width,
    activeTemplate?.propertiesState?.height,
     activeTemplate?.propertiesState?.isAutoHeight,
  ]);

  // Effect 1: Load print data (only depends on parameters, NOT on activeTemplate)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let data: PrintResponse = DummyVoucherData as any;
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
          console.log("data for print",data);
          
        setPrintData(data);
        
           
        // Fetch template if needed
        if (manuvalTemplateFeatch) {
          let _template;
          _template = await getOrFetchTemplate(
            data?.master?.voucherType,
            data?.master?.voucherForm,
            data?.master?.customerType
          );
          
          if (!_template || _template.content == null){
                _template = await getOrFetchTemplate(
            data?.master?.voucherType,
            "",""
          );
         };
          if (_template) {
            dispatch(setTemplate(_template));
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    manuvalTemplateFeatch,
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

  // Effect 2: Update stableTemplateProps when activeTemplate OR printData changes
  useEffect(() => {
    const updateProps = async () => {
      if (!activeTemplate || !printData) return;

      try {
        // Generate QR codes
        const elements: PlacedComponent[] = [
          ...(activeTemplate?.headerState?.customElements?.elements ?? []),
          ...(activeTemplate?.footerState?.customElements?.elements ?? []),
        ].filter(comp => comp.type === DesignerElementType.qrCode);

        const qrImages: { [key: string]: string } = {};
        for (const comp of elements) {
          if (comp.qrCodeProps) {
            qrImages[comp.id] = await generateQRCodeDataUrl(comp.qrCodeProps);
          }
        }

        const props = {
          template: activeTemplate,
          data: printData,
          qrCodeImages: qrImages
        };

        setStableTemplateProps(props);
      } catch (err) {
        console.error("Error updating props:", err);
      }
    };

    updateProps();
  }, [activeTemplate, printData]);

  // Set max height based on window size
  useEffect(() => {
    const wh = window.innerHeight;
    setMaxHeight(wh);
  }, []);

  // Filter design sections based on designer type
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
    if (id !== "new") {
      
      try {
        setLoading(true);
        
        const _template = await fetchTemplateFromApiById(id);

          dispatch(setTemplate(_template));
        
      } catch (error) {
        console.error("Error fetching template data:", error);
        ERPToast.show(t("failed_to_fetch_template"));
      } finally {
        setLoading(false);
      }
    }
  }, [id, dispatch, t]);

  useEffect(() => {
    if (!manuvalTemplateFeatch) {
      getPDFTemplateData();
    }
  }, [getPDFTemplateData, manuvalTemplateFeatch]);

  // Function to convert preview component to image
  const capturePreviewAsImage = useCallback(async (): Promise<string> => {
    if (!previewContainerRef.current) {
      throw new Error("Preview container not found");
    }

    const previewContent = previewContainerRef.current.querySelector('[data-template-preview]') as HTMLElement;
    const targetElement = previewContent || previewContainerRef.current;

    try {
      const canvas = await html2canvas(targetElement, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      return canvas.toDataURL("image/png", 0.95);
    } catch (err) {
      console.error("Image capture failed:", err);
      throw err;
    }
  }, []);

  // Handle template saving
  const handleSave = useCallback(
    async (dataUrl: string) => {
      debugger
       const thumbImage= dataUrl;
       const backgroundImage= activeTemplate.background_image ?? "";
       const backgroundImageHeader= activeTemplate.background_image_header ?? "";
       const backgroundImageFooter= activeTemplate.background_image_footer ?? "";
       const signatureImage= activeTemplate.signature_image ?? "";
      const tmpTemplate = {
        ...activeTemplate,
        content: null, 
        background_image: "",
        thumbImage: "",
        backgroundImageHeader: "",
        backgroundImageFooter: "",
        signatureImage: "",
        propertiesState: {
          ...activeTemplate?.propertiesState,
          template_group: templateGroup,
          template_kind: templateKind,
          template_type: designerType,

        },

      } as TemplateState<unknown>;
      console.log(tmpTemplate);
      
      const compressedContent = await compressData(tmpTemplate);
      const activeTemplates: TemplateDto = {
        templateType: tmpTemplate.propertiesState?.template_type ?? "standard",
        templateKind: tmpTemplate.propertiesState?.template_kind ?? "standard",
        templateGroup: tmpTemplate.propertiesState?.template_group ?? "",
        templateName: tmpTemplate.propertiesState?.templateName ?? "",
        formType: tmpTemplate.propertiesState?.template_formType ?? "",
        customerType: tmpTemplate.propertiesState?.template_customerType ?? "",
        thumbImage: thumbImage,
        content: compressedContent,
        isCurrent: tmpTemplate.isCurrent ?? false,
        background_image: backgroundImage,
        background_image_header: backgroundImageHeader,
        background_image_footer: backgroundImageFooter,
        signature_image: signatureImage,
        branchId: 0,
        id: id == "new" ? 0 : activeTemplate?.id,
      };

      const initial = templateInitialState().activeTemplate;
      const cleanedTemplate = removeDefaults(activeTemplates, initial);
      // dispatch(setTemplate(_returnData));

      try {
        const res = await api.postAsync(Urls.templates, cleanedTemplate);
        handleResponse(res, () => {
          navigate(`/templates?template_group=${templateGroup}`);
        });
      } catch (error) {
        console.error("Error saving template:", error);
        ERPToast.show(t("failed_to_save_template"));
      }
    },
    [activeTemplate, templateGroup, templateKind, designerType, dispatch, navigate, t, id]
  );

  // Updated save function that captures preview as image
  const manageSaveAccTemplate = useCallback(async () => {
    if (id === "new" && !activeTemplate?.propertiesState?.templateName) {
      ERPToast.show(t("template_name_is_required"));
      return;
    }

    try {
      setLoading(true);
      const imageDataUrl = await capturePreviewAsImage();
      await handleSave(imageDataUrl);
    } catch (error) {
      console.error("Error saving template:", error);
      ERPToast.show(t("failed_to_save_template"));
    } finally {
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
    masterId: MasterIDParam,
  };
};