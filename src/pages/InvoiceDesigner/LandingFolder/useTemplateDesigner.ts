import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import html2canvas from 'html2canvas';
import { TemplateDto, TemplateState } from "../Designer/interfaces";

import { convertPdfBlobToImage, generatePdfBlob } from "../utils/pdf-save";

import { accTransaction } from "../constants/TemplateCategories";

import { debounce } from "lodash";
import { DummyVoucherData } from "../constants/DummyData";
import useCurrentBranch from "../../../utilities/hooks/use-current-branch";
import { RootState } from "../../../redux/store";
import { TemplateReducerState } from "../../../redux/reducers/TemplateReducer";
import { designerSectionsConfig, designSections, DesignSectionType } from "./designSection";
import { TemplateImagesTypes } from "./InvoiceDesignerLanding";
import VoucherType from "../../../enums/voucher-types";
import Urls from "../../../redux/urls";
import { customJsonParse } from "../../../utilities/jsonConverter";
import { setTemplate } from "../../../redux/slices/templates/reducer";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import { handleResponse } from "../../../utilities/HandleResponse";
import { APIClient } from "../../../helpers/api-client";
import { getOrientedDimensions, getPageDimensions } from "../utils/pdf-util";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { loadPrintData } from "../../use-print";

const api = new APIClient();

interface UseTemplateDesignerProps {
  templateGroup: string;
  templateKind: string;
  designerType: string;
  template?: TemplateState<unknown>
  MasterIDParam?: number, voucherTypeParam?: string, isInvTrans?: boolean, isSalesView?: boolean, isServiceTrans?: boolean, transDate?: string, printCopies?: number, isReprint?: boolean, isPOSPrinting?: boolean, isFromSalesReceipt?: boolean, isPackingSlipPrint?: boolean, warehouseID?: number, kitchenIDParam?: number, kitchenPrinterNameParam?: string, kitchenNameParam?: string, commonKitchenProductGroupIDParam?: number,  transactionType?: string, dbIdValue?: string, voucherType?: string, isAppGlobal?: boolean
}

export const useTemplateDesigner = ({ templateGroup, templateKind, designerType, template,MasterIDParam,voucherTypeParam,isInvTrans,isSalesView,isServiceTrans,transDate,printCopies,isReprint,isPOSPrinting,isFromSalesReceipt,isPackingSlipPrint,warehouseID,kitchenIDParam,kitchenPrinterNameParam,kitchenNameParam,commonKitchenProductGroupIDParam,transactionType,dbIdValue,voucherType,isAppGlobal}: UseTemplateDesignerProps) => {
  const { t } = useTranslation("system");
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const currentBranch = useCurrentBranch();
  const userSession = useSelector((state: RootState) => state.UserSession);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  const storeTemplate = useSelector((state: RootState) => state.Template?.activeTemplate);
  const templateData = template ?? storeTemplate;
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
  // Add ref for preview container
  const previewContainerRef = useRef<HTMLDivElement>(null);

  //  Create consolidated template style properties object
  const templateStyleProperties = useMemo(() => {
    const pageOrientation = templateData.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";
    const pageSize = templateData.propertiesState?.pageSize ?? "A4";

    const selectedPageSize = getPageDimensions(
      pageSize,
      templateData.propertiesState?.width,
      templateData.propertiesState?.height,
    );

    const orientedDimensions = getOrientedDimensions(selectedPageSize, pageOrientation);
    const previewWidth = orientedDimensions.width;
    const previewHeight = orientedDimensions.height;

    return {
      previewWidth,
      previewHeight,
    };
  }, [
    templateData.propertiesState?.orientation,
    templateData.propertiesState?.pageSize,
    templateData.propertiesState?.bg_color,
    templateData.propertiesState?.width,
    templateData.propertiesState?.height,
    templateData.propertiesState?.padding?.bottom,
    templateData.propertiesState?.padding?.left,
    templateData.propertiesState?.padding?.right,
    templateData.propertiesState?.padding?.top,

  ]);



  // Stabilize props for PDFViewer
 useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
         let data = DummyVoucherData;
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
            template,
            transactionType,
            dbIdValue,
            voucherType,
            isAppGlobal
          )) as any;
        }

        const props = {
          template: templateData,
          data,

        };

        setStableTemplateProps(props);
      } catch (err) {
        // handle/log error if you want
         setStableTemplateProps(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  // include all deps that should retrigger reload
  }, [
  templateData,
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
  template,
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
    if (id !== "new") {
      try {
        setLoading(true)
        const res = await api.getAsync(`${Urls.templates}${id || ""}`);
        const cc: TemplateState<unknown> = customJsonParse(res.content);
        const template: TemplateDto = {
          ...cc,
          id: res.id,
          branchId: res.branchId,
          // content: res.content,
          isCurrent: res.isCurrent,
          templateGroup: res.templateGroup,
          templateKind: res.templateKind,
          templateName: res.templateName,
          templateType: res.templateType,
          thumbImage: res.thumbImage,
          backgroundImage: res?.payload?.data?.background_image,
          backgroundImageHeader: res?.payload?.data?.background_image_header,
          backgroundImageFooter: res?.payload?.data?.background_image_footer,
          signatureImage: res?.payload?.data?.signature_image,
        };
        dispatch(setTemplate(template));
      } catch (error) {
        console.error("Error fetching template data:", error);
        ERPToast.show(t("failed_to_fetch_template"));
      }finally {
        setLoading(false);
      }
    }
  }, [id, dispatch, t]);

  useEffect(() => {
    getPDFTemplateData();
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
        ...templateData,
        propertiesState: {
          ...templateData.propertiesState,
          template_group: templateGroup,
          template_kind: templateKind,
          template_type: designerType,
        },
      };

      const activeTemplate: TemplateDto = {
        templateType: tmpTemplate.propertiesState.template_type ?? "standard",
        templateKind: tmpTemplate.propertiesState.template_kind ?? "standard",
        templateGroup: tmpTemplate.propertiesState.template_group ?? "",
        templateName: tmpTemplate.propertiesState?.templateName ?? "",
        thumbImage: dataUrl,
        content: JSON.stringify(tmpTemplate),
        isCurrent: tmpTemplate.isCurrent ?? false,
        backgroundImage: tmpTemplate.background_image ?? "",
        backgroundImageHeader: tmpTemplate.background_image_header ?? "",
        backgroundImageFooter: tmpTemplate.background_image_footer ?? "",
        signatureImage: tmpTemplate.signature_image ?? "",
        branchId: 0,
        id: templateData?.id ?? 0,
      };

      dispatch(setTemplate(activeTemplate));

      try {
        const res = await api.postAsync(Urls.templates, activeTemplate);
        handleResponse(res, () => {
          navigate(`/templates?template_group=${templateGroup}`);
        });
      } catch (error) {
        console.error("Error saving template:", error);
        ERPToast.show(t("failed_to_save_template"));
      } 
    },
    [templateData, templateGroup, templateKind, dispatch, navigate, t]
  );

  // Updated save function that captures preview as image
  const manageSaveAccTemplate = useCallback(async () => {
    if (id === "new" && !templateData.propertiesState?.templateName) {
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
  }, [id, templateData, capturePreviewAsImage, handleSave, t]);

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
    currentBranch,
    userSession,
    clientSession,
    templateData,
    stableTemplateProps,
    manageSaveAccTemplate,
    dispatch,
    templateStyleProperties,
    previewContainerRef,
    masterId:MasterIDParam,
  };
};