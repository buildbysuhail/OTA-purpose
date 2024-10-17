import { TemplateState } from "../../Designer/interfaces";
import { TemplateGroupTypes } from "../../constants/TemplateCategories";
import Footer from "./Footer";
import Header from "./Header";
import ItemTable from "./ItemTable";
import Total from "./Total";


interface TemplateImages {
  signature_image: string | null;
  background_image: string | null;
  background_image_header: string | null;
  background_image_footer: string | null;
}
export interface StandardPreviewProps {
  data: any;
  company?: any;
  currency?: string;
  docTitle?: string;
  docIDKey?: string;
  addressTemplates?: any;
  template?: TemplateState;
  templateGroupId?: TemplateGroupTypes;
  preferences?: any;
  templateImages?: TemplateImages
}

const StandardPreviewWrapper = ({
  data,
  template,
  company,
  templateGroupId,
  addressTemplates,
  docIDKey,
  docTitle,
  currency,
  preferences,
  templateImages
}: StandardPreviewProps) => {

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
      <Header
        data={data}
        company={company}
        template={template}
        docTitle={docTitle}
        docIDKey={docIDKey}
        templateGroupId={templateGroupId}
        addressTemplates={addressTemplates}
        currency={currency}
        templateImages={templateImages}
      />
      <ItemTable data={data} templateGroupId={templateGroupId} template={template} preferences={preferences} currency={currency} />
      <Total data={data} templateGroupId={templateGroupId} template={template} currency={currency} />
      <Footer data={data} template={template} templateGroupId={templateGroupId} templateImages={templateImages} />
    </div>
   </div>
  );
};

export default StandardPreviewWrapper;
