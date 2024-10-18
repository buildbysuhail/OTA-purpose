import Header from "./Header";
import ItemTable from "./ItemTable";
import Total from "./Total";
import Footer from "./Footer";
import { TemplateState } from "../../Designer/interfaces";
import { TemplateGroupTypes } from "../../constants/TemplateCategories";

export interface RetailPreviewProps {
  data: any;
  currency?: string;
  docTitle?: string;
  docIDKey?: string;
  template?: TemplateState;
  templateGroupId?: TemplateGroupTypes;
}

const RetailPreviewWrapper = ({ data, templateGroupId, docTitle, docIDKey, template, currency }: RetailPreviewProps) => {

  let fontStyle = "font-Poppins"

  switch (template?.propertiesState?.font) {
    case "Helvetica": fontStyle = "font-Helvetica"
      break;
    case "Times-Roman": fontStyle = "font-TimesRoman"
      break;
    case "Courier": fontStyle = "font-Courier font-thin"
      break;

  }

  return (
    <div className={`${fontStyle}`}>
      <Header
        data={data}
        template={template}
        docIDKey={docIDKey}
        docTitle={docTitle}
        currency={currency}
        templateGroupId={templateGroupId}
      />
      <ItemTable templateGroupId={templateGroupId} template={template} data={data} />
      <Total templateGroupId={templateGroupId} template={template} data={data} currency={currency} />
      <Footer templateGroupId={templateGroupId} template={template} data={data} />
    </div>
  );
};

export default RetailPreviewWrapper;
