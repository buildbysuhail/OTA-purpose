import VoucherType from "../../../../enums/voucher-types";
import { TemplateState } from "../../Designer/interfaces";
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
export interface AccountPreviewProps {
  data: any;
  currency?: string;
  docTitle?: string;
  docIDKey?: string;
  template?: TemplateState;
  templateGroupId?: VoucherType | string;
}

const AccountPreviewWrapper = ({
  data,
  template,
  templateGroupId,
  docIDKey,
  docTitle,
  currency,
}: AccountPreviewProps) => {

  
  // let fontStyle = "Roboto"
  // switch (template?.propertiesState?.font_family) {
  //   case "Roboto": fontStyle = "font-Helvetica"
  //     break;
  //   case "RobotoMono": fontStyle = "font-TimesRoman"
  //     break;
  //   case "FiraSans": fontStyle = "font-Courier"
  //     break;
  // }

  return (
   <div className="">
     <div>
      <Header
        data={data}
        template={template}
        docTitle={docTitle}
        docIDKey={docIDKey}
        templateGroupId={templateGroupId}
        currency={currency}
      />
      <ItemTable data={data} templateGroupId={templateGroupId} template={template}  currency={currency} />
      <Total data={data} templateGroupId={templateGroupId} template={template} currency={currency} />
      <Footer data={data} template={template} templateGroupId={templateGroupId}  />
    </div>
   </div>
  );
};

export default AccountPreviewWrapper;
