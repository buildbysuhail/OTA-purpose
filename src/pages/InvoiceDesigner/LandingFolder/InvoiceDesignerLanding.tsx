

export interface TemplateImagesTypes {
  signature_image: string | null;
  background_image: string | null;
  background_image_header: string | null;
  background_image_footer: string | null;
}
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



type DesignerType = keyof DesignerConfigMap;
interface LocationState {
  templateKind?: DesignerType;
}
const InvoiceDesigner = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { t } = useTranslation("system");
  const dispatch = useDispatch();
  const templateData = useSelector((state: any) => state.Template) as TemplateReducerState;
  const rootState = useRootState();
  const templateGroup = searchParams.get("template_group") || "";
   const { templateKind } = (location.state as LocationState) || {};

   // Type guard to ensure templateKind is a valid key
  const isValidDesignerType = (type: any): type is DesignerType => {
    return type && Object.keys(templateConfig).includes(type);
  };

  const designerType: DesignerType = isValidDesignerType(templateKind) ? templateKind : "standard";
  const config = templateConfig[designerType];

  return (
    <div className="h-full">
        <BaseDesigner
          designerType={templateKind || "standard"}
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
