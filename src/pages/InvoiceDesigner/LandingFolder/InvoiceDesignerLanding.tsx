


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
import { RootState } from "../../../redux/store";
import SharedTemplatePreview from "../DesignPreview/shared";
import VoucherType from "../../../enums/voucher-types";


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
  const templateData = useSelector((state: RootState) => state.Template);
  const rootState = useRootState();
  const tg = searchParams.get("template_group");
  const templateGroup = tg && Object.values(VoucherType).includes(tg as VoucherType)? (tg as VoucherType): ""; 
  const { templateKind,templateType} = (location.state as LocationState) || {};

  // const groupKey = templateGroup;
 const groupKey = templateGroup && Object.values(VoucherType).includes(templateGroup as VoucherType) 
  ? (templateGroup as VoucherType) 
  : undefined;

const typeKey = templateType?.toUpperCase() ?? "STANDARD";
const kindsForMap = groupKey ? templateConfig[groupKey]?.[typeKey] || {} : {};
const kindKey = templateKind ?? Object.keys(kindsForMap)[0];
const config = groupKey ? templateConfig[groupKey]?.[typeKey]?.[kindKey] : undefined;
  
  
  if (!config) {
    throw new Error(`No template for group='${groupKey}', type='${typeKey}', kind='${kindKey}'`);
  }


  return (
    <div className="h-full">
        <BaseDesigner
          designerType={templateType || "STANDARD"}
          designerKind={templateKind ||"standard"}
          templateGroup={templateGroup} // Pass templateGroup explicitly
          templateComponent={config.PreviewComponent}
          sections={config?.sections}
        />
      <ERPModal
        isForm={true}
        isOpen={rootState.PopupData.CustomDesignerPopup.isOpen ?? false}
        title={t("custom_designer")}
        closeModal={() => dispatch(toggleCustomDesignerPopup({ isOpen: false }))}
        width={2000}
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
