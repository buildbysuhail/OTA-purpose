


import { useLocation, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { TemplateReducerState } from "../../../redux/reducers/TemplateReducer";
import BaseDesigner from "./BaseDesigner";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { toggleCustomDesignerPopup } from "../../../redux/slices/popup-reducer";
import PDFBarcodeDesigner from "../../LabelDesigner/label_designer";
import { DesignerConfigMap, templateConfig } from "./designSection";


export interface TemplateImagesTypes {
  signature_image: string | null;
  background_image: string | null;
  background_image_header: string | null;
  background_image_footer: string | null;
}

interface LocationState {
templateType?: string;
  templateKind?: string;
}
const InvoiceDesigner = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { t } = useTranslation("system");
  const dispatch = useDispatch();
  const templateData = useSelector((state: any) => state.Template) as TemplateReducerState;
  const rootState = useRootState();
  const templateGroup = searchParams.get("template_group") || "";
   const { templateKind,templateType} = (location.state as LocationState) || {};

// Validate templateType and templateKind
  const isValidTemplateType = (type: any): type is keyof DesignerConfigMap => {
    return type && Object.keys(templateConfig).includes(type);
  };

  const isValidTemplateKind = (type: string, kind: any): kind is string => {
    return kind && isValidTemplateType(type) && Object.keys(templateConfig[type]).includes(kind);
  };

 const selectedTemplateType = isValidTemplateType(templateType) ? templateType : "Standard";
  const selectedTemplateKind = isValidTemplateKind(selectedTemplateType, templateKind)
    ? templateKind
    : Object.keys(templateConfig[selectedTemplateType])[0] || "standard";

  const config = templateConfig[selectedTemplateType][selectedTemplateKind];

  return (
    <div className="h-full">
        <BaseDesigner
          designerType={templateType || "Standard"}
          designerKind={templateKind ||"standard"}
          templateGroup={templateGroup} // Pass templateGroup explicitly
          templateComponent={config.PreviewComponent}
          sections={config.sections}
        />
      <ERPModal
        isForm={true}
        isOpen={rootState.PopupData.CustomDesignerPopup.isOpen ?? false}
        title={t("custom_designer")}
        closeModal={() => dispatch(toggleCustomDesignerPopup({ isOpen: false }))}
        width={5000}
        height={5000}
        content={
          <PDFBarcodeDesigner
            forCustomRows
            template={templateData?.activeTemplate}
            customTemplate={rootState.PopupData.CustomDesignerPopup.customTemplate}
            onSuccess={() => dispatch(toggleCustomDesignerPopup({ isOpen: false, customTemplate: "" }))}
          />
        }
      />
    </div>
  );
};

export default InvoiceDesigner;
