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
  isTemplateDesigner?: boolean;
  isAccAdviceReport?: boolean;
  externalTemplate?: TemplateState<T>;
  externalPrintData?: PrintData;
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
  isTemplateDesigner = false,
  isAccAdviceReport=false,
  externalTemplate,
  externalPrintData
}: UseTemplateDesignerProps<T>) => {
  const { t } = useTranslation("system");
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appSettings = useSelector((state: RootState) => state.ApplicationSettings);
  let activeTemplate = useSelector((state: RootState) => state.Template?.activeTemplate);
  // State
  const [stableTemplateProps, setStableTemplateProps] = useState<StableTemplateProps<T>  | null>(null);

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
  // NEW: Skip data loading if external data is provided
  const shouldSkipFetch = !!externalTemplate && !!externalPrintData;
  // templateStyleProperties will work with both external and fetched templates
  const templateStyleProperties = useMemo(() => {
    const templateToUse = externalTemplate || activeTemplate;
    
    const pageOrientation =
      templateToUse?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";
    const pageSize = templateToUse?.propertiesState?.pageSize ?? "A4";
    const isAutoHeight = templateToUse?.propertiesState?.isAutoHeight ?? false;
    const selectedPageSize = getPageDimensions(
      pageSize,
      templateToUse?.propertiesState?.width,
      templateToUse?.propertiesState?.height
    );

    const orientedDimensions = getOrientedDimensions(selectedPageSize, pageOrientation);

    return {
      previewWidth: orientedDimensions.width,
      previewHeight: isAutoHeight ? "auto" : orientedDimensions?.height,
      isAutoHeight,
    };
  }, [
    externalTemplate?.propertiesState?.orientation,
    externalTemplate?.propertiesState?.pageSize,
    externalTemplate?.propertiesState?.width,
    externalTemplate?.propertiesState?.height,
    externalTemplate?.propertiesState?.isAutoHeight,
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
        // ACC-ADVICE-DATA FLOW
        // -------------------------------
       if(isAccAdviceReport) {
          const adviceData = await api.getAsync(`${Urls.acc_advice_payment}?masterId=${MasterIDParam}`)
          if (!isActiveRef.current) return;
          setVoucherPrintData(adviceData);
           if (!manuvalTemplateFeatch) return;

        const adviceVoucherTyp =  ["CP", "BP", "CQP"].includes(voucherType??"")
      ? "PARP"
      : ["CR", "BR", "CQR"].includes(voucherType??"")
        ? "RARP"
        : ""
         const template = await getOrFetchTemplate(adviceVoucherTyp,"","")
           dispatch(setTemplate(template));
            // autoTemplateResolvedRef.current = true;
        return
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
debugger;
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
      isAccAdviceReport,
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
    if (shouldSkipFetch) return; // Skip if using external data
    
    const isActiveRef = { current: true };
    if (!isTemplateDesigner) {
      loadPrintAndTemplateData(isActiveRef);
    }

    return () => {
      isActiveRef.current = false;
    };
  }, [loadPrintAndTemplateData, isTemplateDesigner, shouldSkipFetch]);

  // Effect 2: Update stableTemplateProps when activeTemplate OR printData changes
  useEffect(() => {
    const updateProps = async () => {
      const templateToUse = externalTemplate || activeTemplate;
      const printDataToUse = externalPrintData || printData;

      // if (!templateToUse) {
      //   setStableTemplateProps(null);
      //   return;
      // }

      try {
     // ✅ Recursive function to collect ALL QR codes including nested in containers
      const collectQRCodes = (components: PlacedComponent[]): PlacedComponent[] => {
        const result: PlacedComponent[] = [];
        for (const comp of components) {
          if (comp.type === DesignerElementType.qrCode) {
            result.push(comp);
          }
          // If container, recurse into children
          if (comp.type === DesignerElementType.container && comp.children?.length) {
            result.push(...collectQRCodes(comp.children));
          }
        }
        return result;
      };

      const allElements: PlacedComponent[] = [
        ...collectQRCodes(templateToUse?.headerState?.customElements?.elements ?? []),
        ...collectQRCodes(templateToUse?.footerState?.customElements?.elements ?? []),
      ];

      const qrImages: { [key: string]: string } = {};
      for (const comp of allElements) {
        if (comp.qrCodeProps) {
          qrImages[comp.id] = await generateQRCodeDataUrl(comp.qrCodeProps);
        }
      }

        const props: StableTemplateProps<T> = {
          template: templateToUse,
          printData: printDataToUse,
          qrCodeImages: qrImages,
        };

        setStableTemplateProps(props);
      } catch (err) {
        console.error("Error updating props:", err);
      }
    };

    updateProps();
  }, [activeTemplate, printData, externalTemplate, externalPrintData]);

  // Effect: Handle user template selection
  useEffect(() => {
   if(!isTemplateDesigner && !isAccAdviceReport){
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
   } 

  }, [
    lastChoosedTemplate?.id,
    MasterIDParam,
    manuvalTemplateFeatch,
    isTemplateDesigner,
    isAccAdviceReport
  ]);

  // Set max height based on window size
  useEffect(() => {
    const wh = window.innerHeight;
    setMaxHeight(wh);
  }, []);

  // Filter design sections based on designer type
  useEffect(() => {
    if (templateGroup && isTemplateDesigner ) {
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
    if (!manuvalTemplateFeatch && isTemplateDesigner) {
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
  //const userSession = useSelector((state: RootState) => state.UserSession);

  // Handle template saving
  const handleSave = useCallback(
    async (dataUrl: string, overrides?: { templateGroup?: string; templateName?: string; formType?: string; customerType?: string; isCurrent?: boolean; skipNavigate?: boolean }) => {
      const thumbImage = dataUrl;
      const backgroundImage = activeTemplate.background_image ?? "";
      const backgroundImageHeader = activeTemplate.background_image_header ?? "";
      const backgroundImageFooter = activeTemplate.background_image_footer ?? "";
      const signatureImage = activeTemplate.signature_image ?? "";
      const resolvedGroup = overrides?.templateGroup ?? templateGroup;
      const tmpTemplate = {
        ...activeTemplate,
        isCurrent: overrides?.isCurrent ?? (activeTemplate?.isCurrent ?? false),
        content: null,
        background_image: "",
        thumbImage: "",
        backgroundImageHeader: "",
        backgroundImageFooter: "",
        signatureImage: "",
        propertiesState: {
          ...activeTemplate?.propertiesState,
          template_group: resolvedGroup,
          template_kind: templateKind,
          template_type: designerType,
          templateName: overrides?.templateName ?? activeTemplate?.propertiesState?.templateName,
          template_formType: overrides?.formType ?? activeTemplate?.propertiesState?.template_formType,
          template_customerType: overrides?.customerType ?? activeTemplate?.propertiesState?.template_customerType,
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



// const taxType = userSession.countryId == Countries.India ? "GST" : "VAT"      
// const templateViewToCopy: any = {
//   TemplateType: activeTemplate.templateType ?? "standard",
//   TemplateKind: activeTemplate.templateKind ?? "",
//   TemplateGroup: activeTemplate.templateGroup ?? "",
//   Content: compressedContent,
//   thumbImage:thumbImage,
//   TaxType: activeTemplate.formType ?? taxType,
// };

// // Helper function to escape single quotes for SQL
// const sqlEscape = (value: any) => {
//   if (value === null || value === undefined || value === '') return 'NULL';
//   const escaped = String(value).replace(/'/g, "''");
//   return `'${escaped}'`;
// };

// // Generate template name first (same logic as SQL CONCAT)
// const templateName = `${templateViewToCopy.TemplateGroup || ''}-${templateViewToCopy.TaxType || 'DEF'}-${templateViewToCopy.TemplateType === 'standard' ? 'STD' : 'UN'}-${templateViewToCopy.TemplateKind.toUpperCase()}`;

// // Build VALUES row - only 6 properties
// const valuesRow = `${sqlEscape(templateViewToCopy.TemplateType)}, ${sqlEscape(templateViewToCopy.TemplateKind)}, ${sqlEscape(templateViewToCopy.TemplateGroup)}, ${sqlEscape(templateViewToCopy.Content)}, ${sqlEscape(templateViewToCopy.thumbImage)}, ${sqlEscape(templateViewToCopy.TaxType)}`;

// // Generate SQL INSERT statement
// const sqlContent = `INSERT INTO Templates (
//     TemplateType,
//     TemplateKind,
//     TemplateGroup,
//     TemplateName,
//     Content,
//     TemplateDescription,
//     thumbImage,
//     background_image,
//     background_image_header,
//     background_image_footer,
//     signature_image,
//     TaxType
// )
// SELECT
//     v.TemplateType,
//     v.TemplateKind,
//     v.TemplateGroup,
//     tn.TemplateName,
//     v.Content,
//     NULL,
//     v.thumbImage,
//     NULL,
//     NULL,
//     NULL,
//     NULL,
//     v.TaxType
// FROM (
//     VALUES
//         (${valuesRow})
// ) AS v (
//     TemplateType,
//     TemplateKind,
//     TemplateGroup,
//     Content,
//     thumbImage,
//     TaxType
// )
// CROSS APPLY (
//     SELECT
//         CONCAT(
//             v.TemplateGroup, '-',
//             COALESCE(v.TaxType, 'DEF'), '-',
//             CASE v.TemplateType
//                 WHEN 'standard'  THEN 'STD'
//                 WHEN 'universal' THEN 'UN'
//             END, '-',
//             UPPER(v.TemplateKind)
//         ) AS TemplateName
// ) tn
// WHERE NOT EXISTS (
//     SELECT 1
//     FROM Templates t
//     WHERE t.TemplateName = tn.TemplateName
// );`;

// // Use template name as filename (sanitize for filesystem)
// const fileName = `${templateName}.txt`;

// try {
//   // Check if File System Access API is supported
//   if ('showSaveFilePicker' in window) {
//     // Modern approach - User chooses location
//     const handle = await (window as any).showSaveFilePicker({
//       suggestedName: fileName,
//       types: [{
//         description: 'SQL File',
//         accept: { 'text/plain': ['.txt'] }
//       }]
//     });
    
//     const writable = await handle.createWritable();
//     await writable.write(sqlContent);
//     await writable.close();
    
//     alert(`SQL file saved as: ${fileName}`);
//   } else {
//     // Fallback - Downloads folder
//     const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = fileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
    
//     alert(`SQL file saved as: ${fileName}`);
//   }
// } catch (err) {
//   console.error('Failed to save file:', err);
//   // Fallback if user cancels
//   const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = fileName;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// }

// // Also copy to clipboard
// navigator.clipboard.writeText(sqlContent).catch(() => {
//   console.warn("Clipboard copy failed");
// });

// console.log(`Template name: ${templateName}`);
// console.log(`File saved as: ${fileName}`);
// return;


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
          template_group: resolvedGroup,
          template_kind: templateKind,
          template_type: designerType,
            } as any);

          }

          if (!overrides?.skipNavigate) {
            navigate(`/templates?template_group=${resolvedGroup}&form_type=${ tmpTemplate.propertiesState?.template_formType??""}&customer_type=${ tmpTemplate.propertiesState?.template_customerType??""}`);
          }
        });
      } catch (error) {
        console.error("Error saving template:", error);
        ERPToast.show(t("failed_to_save_template"));
      }
    },
    [activeTemplate, templateGroup, templateKind, designerType, dispatch, navigate, t, id]
  );

  // Updated save function that captures preview as image
  const manageSaveAccTemplate = useCallback(async (overrides?: { templateGroup?: string; templateName?: string; formType?: string; customerType?: string; isCurrent?: boolean; skipNavigate?: boolean }) => {
    const templateNameToCheck = overrides?.templateName ?? activeTemplate?.propertiesState?.templateName;
    if (id === "new" && !templateNameToCheck) {
      ERPToast.show(t("template_name_is_required"));
      return;
    }

    try {
      setLoading(true);
      const imageDataUrl = await capturePreviewAsImage();

      await handleSave(imageDataUrl, overrides);
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

