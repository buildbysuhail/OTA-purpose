import { TemplateState } from "../../Designer/interfaces";
import { TemplateGroupTypes } from "../../constants/TemplateCategories";
import Content from "./Header";


interface TemplateImages {
  signature_image: string | null;
  background_image: string | null;
  background_image_header: string | null;
  background_image_footer: string | null;
}
export interface BarcodePreviewProps {
  data: any;
  currency?: string;
  docTitle?: string;
  docIDKey?: string;
  template?: TemplateState;
  templateGroupId?: TemplateGroupTypes;
}

const BarcodePreviewWrapper = ({
  data,
  template,
  templateGroupId,
  docIDKey,
  docTitle,
  currency,
}: BarcodePreviewProps) => {

  debugger;
  let fontStyle = "font-Poppins"

  switch (template?.propertiesState?.font) {
    case "Helvetica": fontStyle = "font-Helvetica"
      break;
    case "Times-Roman": fontStyle = "font-TimesRoman"
      break;
    case "Courier": fontStyle = "font-Courier"
      break;

  }

  return (
   <div className="">
     <div className={`${fontStyle} `}>
      <Content
        data={data}
        template={template}
        docTitle={docTitle}
        docIDKey={docIDKey}
        templateGroupId={templateGroupId}
        currency={currency}
      />
    </div>
   </div>
  );
};

export default BarcodePreviewWrapper;
