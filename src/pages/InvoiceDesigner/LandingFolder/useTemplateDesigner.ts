import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import html2canvas from 'html2canvas';
import { DesignerElementType, PlacedComponent, TemplateDto, TemplateState } from "../Designer/interfaces";

import { debounce } from "lodash";
import { DummyLedgerReportDataForPrint, DummyVoucherData } from "../constants/DummyData";
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
import { addTemplateToStore, fetchTemplateById, fetchTemplateFromApiById, getOrFetchTemplate, getTemplateFromStore, loadPrintData, parseTemplateContent } from "../../use-print";
import { merge } from 'lodash';
import { generateQRCodeDataUrl } from "../utils/qrSvgToImg";
import { LedgerReportDataForPrint, PrintData, PrintDetailDto, PrintResponse, StableTemplateProps } from "../../use-print-type";
import { compressData, decompressData } from "../../../utilities/compression";
import { isNullOrUndefinedOrEmpty, removeDefaults } from "../../../utilities/Utils";
import { Countries } from "../../../redux/slices/user-session/reducer";
import moment from "moment";
import { de } from "date-fns/locale";

const api = new APIClient();

interface UseTemplateDesignerProps<T = unknown> {
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
  lastChoosedTemplate?: TemplateState<T>;
  isInLedgerReport?: boolean;
}

export const useTemplateDesigner = <T = unknown,>({
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
  lastChoosedTemplate,
  isInLedgerReport = false,
}: UseTemplateDesignerProps<T>) => {
  const { t } = useTranslation("system");
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appSettings = useSelector((state: RootState) => state.ApplicationSettings);
  let activeTemplate = useSelector((state: RootState) => state.Template?.activeTemplate);
  // State
  const [stableTemplateProps, setStableTemplateProps] = useState<StableTemplateProps | null>(null);

  // const [printData, setPrintData] = useState<PrintResponse>(DummyVoucherData as any);
  const [printData, setPrintData] = useState<PrintData>(() =>
    isInLedgerReport
      ? {
        kind: "ledgerReport",
        data: DummyLedgerReportDataForPrint,
      }
      : {
        kind: "voucher",
        data: DummyVoucherData as any,
      }
  );

  const [designTabs, setDesignTabs] = useState<DesignSectionType[]>([]);
  const [currentSection, setCurrentSection] = useState<DesignSectionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateImages, setTemplateImages] = useState<TemplateImagesTypes>({
    signature_image: null,
    background_image: null,
    background_image_header: null,
    background_image_footer: null,
  });
  const [maxHeight, setMaxHeight] = useState<number>(500);
  // Refs
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const currentMasterIdRef = useRef<number | null | undefined>(null);
  const lastFetchedTemplateIdRef = useRef<number | null>(null);
  const autoTemplateResolvedRef = useRef(false);

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
      previewHeight: isAutoHeight ? "auto" : orientedDimensions?.height,
      isAutoHeight,
    };
  }, [
    activeTemplate?.propertiesState?.orientation,
    activeTemplate?.propertiesState?.pageSize,
    activeTemplate?.propertiesState?.width,
    activeTemplate?.propertiesState?.height,
    activeTemplate?.propertiesState?.isAutoHeight,
  ]);

  const setVoucherPrintData = (data: PrintResponse) => {
    setPrintData({ kind: "voucher", data });
  };

  const setLedgerPrintData = (data: LedgerReportDataForPrint) => {
    setPrintData({ kind: "ledgerReport", data });
  };



  const loadPrintAndTemplateData = useCallback(
    async (isActiveRef: { current: boolean }) => {
      debugger;
      if (!MasterIDParam) return;

      setLoading(true);

      try {
        // -------------------------------
        // LEDGER REPORT FLOW
        // -------------------------------
        if (isInLedgerReport) {
          const ledgerData: LedgerReportDataForPrint =
            await api.postAsync(Urls.get_customer_balance, {
              LedgerID: MasterIDParam,
              AsOnDate: moment().local().toDate(),
            });

          if (!isActiveRef.current) return;

          setLedgerPrintData(ledgerData);

          if (manuvalTemplateFeatch) {
            const template = await getOrFetchTemplate("CBR", "", "");
            if (!isActiveRef.current) return;
            dispatch(setTemplate(template));

          }
          autoTemplateResolvedRef.current = true;
          return;
        }

        // -------------------------------
        // VOUCHER FLOW
        // -------------------------------
        const voucherData = await loadPrintData(
          MasterIDParam,
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
        );

        if (!isActiveRef.current) return;

        setVoucherPrintData(voucherData);

        if (!manuvalTemplateFeatch) return;

        let template = await getOrFetchTemplate(
          voucherData.master?.voucherType,
          voucherData.master?.voucherForm ?? "",
          voucherData.master?.customerType ?? ""
        );

        if (
          (!template || template.content == null) &&
          appSettings?.printerSettings?.useEmptyTaxTypeTemplateIfMissing
        ) {
          template = await getOrFetchTemplate(
            voucherData.master?.voucherType,
            "",
            ""
          );
        }

        if (!isActiveRef.current) return;

        dispatch(setTemplate(template));
        autoTemplateResolvedRef.current = true;
      } catch (err) {
        if (isActiveRef.current) {
          console.error("Error loading print/template data:", err);
        }
      } finally {
        if (isActiveRef.current) {
          setLoading(false);
        }
      }
    },
    [
      MasterIDParam,
      isInLedgerReport,
      manuvalTemplateFeatch,
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
      appSettings?.printerSettings?.useEmptyTaxTypeTemplateIfMissing,
    ]
  );

  // Effect 1: Load print data (only depends on parameters, NOT on activeTemplate)
  useEffect(() => {
    const isActiveRef = { current: true };

    loadPrintAndTemplateData(isActiveRef);

    return () => {
      isActiveRef.current = false;
    };
  }, [loadPrintAndTemplateData]);

  // Effect 2: Update stableTemplateProps when activeTemplate OR printData changes
  useEffect(() => {
    const updateProps = async () => {
      debugger;
      //    if (!activeTemplate) {
      //   setStableTemplateProps(null); 
      //   return;
      // }
      // if (!printData) return;

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

        const props: StableTemplateProps = {
          template: activeTemplate,
          printData: printData,
          qrCodeImages: qrImages,
        };

        setStableTemplateProps(props)
      } catch (err) {
        console.error("Error updating props:", err);
      }
    };

    updateProps();
  }, [activeTemplate, printData]);

  // Effect: Handle user template selection
  useEffect(() => {
    console.log("Running template selection effect");
   debugger;
    if (!manuvalTemplateFeatch) return;
    // Detect MasterIDParam change (new transaction)
    const isMasterIdChanged = currentMasterIdRef.current !== MasterIDParam;

    if (isMasterIdChanged) {
      // New transaction - sync refs and skip fetch
      currentMasterIdRef.current = MasterIDParam;
      lastFetchedTemplateIdRef.current = null;
      autoTemplateResolvedRef.current = false; // 🔴 invalidate manual restore
      return; // Let Effect 1 handle default template
    }
    // 🔒 Block manual restore until auto-fetch finishes
    if (!autoTemplateResolvedRef.current) return;
    const newTemplateId = lastChoosedTemplate?.id ?? null;

    if (isNullOrUndefinedOrEmpty(newTemplateId) || newTemplateId === lastFetchedTemplateIdRef.current) return;

    lastFetchedTemplateIdRef.current = newTemplateId;
    dispatch(setTemplate(lastChoosedTemplate));

  }, [
    lastChoosedTemplate?.id,
    MasterIDParam,
    manuvalTemplateFeatch,
  ]);

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
      const thumbImage = dataUrl;
      const backgroundImage = activeTemplate.background_image ?? "";
      const backgroundImageHeader = activeTemplate.background_image_header ?? "";
      const backgroundImageFooter = activeTemplate.background_image_footer ?? "";
      const signatureImage = activeTemplate.signature_image ?? "";
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

      } as TemplateState<T>;
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
      const currentLocalTemplate = await getTemplateFromStore(
        cleanedTemplate.templateGroup,
        cleanedTemplate.customerType,
        cleanedTemplate.formType
      );
      try {
        const res = await api.postAsync(Urls.templates, cleanedTemplate);
        handleResponse(res, async () => {
          if (!isNullOrUndefinedOrEmpty(currentLocalTemplate)) {
            //  const templateContent = await decompressData(cleanedTemplate.content);
            //     const parsedTemplate = parseTemplateContent<TemplateState<unknown>>(
            //       res,
            //       templateContent
            //     );
            //     if (!parsedTemplate) {
            //       console.warn("Failed to parse default template.");
            //       return null;
            //     }
            //     const initial = templateInitialState().activeTemplate;
            //     const merged = merge({}, initial, parsedTemplate);
            
            await addTemplateToStore({...activeTemplate,
          template_group: templateGroup,
          template_kind: templateKind,
          template_type: designerType,
            } as any);
        
          }

          navigate(`/templates?template_group=${templateGroup}&form_type=${ tmpTemplate.propertiesState?.template_formType??""}&customer_type=${ tmpTemplate.propertiesState?.template_customerType??""}`);
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

