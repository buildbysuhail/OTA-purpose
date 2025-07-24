import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

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

const api = new APIClient();

interface UseTemplateDesignerProps {
  templateGroup: string;
  templateKind: string;
  designerType: string;
}

export const useTemplateDesigner = ({ templateGroup, templateKind, designerType }: UseTemplateDesignerProps) => {
  const { t } = useTranslation("system");
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const currentBranch = useCurrentBranch();
  const userSession = useSelector((state: RootState) => state.UserSession);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  const templateData = useSelector((state: RootState) => state.Template) as TemplateReducerState;

    // Add page size and orientation logic
  const pageOrientation = templateData?.activeTemplate?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";
  const pageSize = templateData?.activeTemplate?.propertiesState?.pageSize ?? "A4";

    const selectedPageSize = getPageDimensions(
    pageSize,
    templateData?.activeTemplate?.propertiesState?.width,
    templateData?.activeTemplate?.propertiesState?.height,
  );

  const orientedDimensions = getOrientedDimensions(selectedPageSize, pageOrientation);

  // Optional: preview scaling
  const scale = 0.9; // You can adjust this or make it dynamic
  const previewWidth = orientedDimensions.width * scale;
  const previewHeight = orientedDimensions.height *scale ;
  // Validate templateGroup from searchParams


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

  // Stabilize props for PDFViewer
  const stableTemplateProps = useMemo(
    () => ({
      template: templateData.activeTemplate,
      data: DummyVoucherData,
      currentBranch,
      userSession,
      clientSession,
    }),
    [templateData.activeTemplate, currentBranch, userSession, clientSession]
  );

  // Set max height based on window size
  useEffect(() => {
    const wh = window.innerHeight ;
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
        const res = await api.getAsync(`${Urls.templates}${id || ""}`);
        const cc: TemplateState = customJsonParse(res.content);
        const template: TemplateDto = {
          ...cc,
          id: res.id,
          branchId: res.branchId,
          content: res.content,
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
      }
    }
  }, [id, dispatch, t]);

  useEffect(() => {
    getPDFTemplateData();
  }, [getPDFTemplateData]);

  // Handle template saving
  const handleSave = useCallback(
    async (dataUrl: string) => {
      const tmpTemplate = {
        ...templateData.activeTemplate,
        propertiesState: {
          ...templateData.activeTemplate.propertiesState,
          template_group: templateGroup,
          template_kind: templateKind,
          template_type:designerType,
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
        id: templateData.activeTemplate?.id ?? 0,
      };

      dispatch(setTemplate(activeTemplate));
      setLoading(true);

      try {
        const res = await api.postAsync(Urls.templates, activeTemplate);
        handleResponse(res, () => {
          navigate(`/templates?template_group=${templateGroup}`);
        });
      } catch (error) {
        console.error("Error saving template:", error);
        ERPToast.show(t("failed_to_save_template"));
      } finally {
        setLoading(false);
      }
    },
    [templateData, templateGroup, templateKind, dispatch, navigate, t]
  );

  // Debounced save to prevent frequent updates
  const debouncedSaveAccTemplate = useCallback(
    debounce(async (Component: React.ReactElement) => {
      if (id === "new" && !templateData?.activeTemplate?.propertiesState?.templateName) {
        ERPToast.show(t("template_name_is_required"));
        return;
      }
      try {
        const pdfBlob = await generatePdfBlob(Component);
        const imageDataUrl = await convertPdfBlobToImage(pdfBlob);
        await handleSave(imageDataUrl);
      } catch (error) {
        console.error("Error saving component:", error);
        ERPToast.show(t("failed_to_save_template"));
      }
    }, 500),
    [id, templateData, handleSave, t]
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
    manageSaveAccTemplate: debouncedSaveAccTemplate,
    dispatch,
    pageOrientation,
    pageSize,
    previewWidth,
    previewHeight,
    orientedDimensions,
    scale,
  };
};