import SharedPrvTable from "./Table_Prv";
import { getPageDimensions, getPageSizeForPDF } from "../../utils/pdf-util";
import ShardPrevHeader from "./Header_Prv";
import SharedPrvFooter from "./Footer_Prv";
import FontRegistration from "../../../LabelDesigner/fontRegister";
import { TemplateState } from "../../Designer/interfaces";
import { useEffect } from "react";
import { PrintResponse } from "../../../use-print-type";

export interface AccountTransactionProps {
  data?: PrintResponse;
  template?: TemplateState<unknown>
  qrCodeImages?: { [key: string]: string } 
  AmountToEnglish?: any;
  AmountToArabic?: any;
}

const SharedTemplatePreview = ({ data, template, qrCodeImages = {}}: AccountTransactionProps) => {

   const headerState = template?.headerState;
  const propertiesState = template?.propertiesState;
  return (
    <div  className="flex flex-col h-full w-full"
    style={{
          backgroundColor: template?.propertiesState?.bg_color || "#fff",
          paddingTop: `${propertiesState?.padding?.top ?? 0}pt`,
          paddingRight: `${propertiesState?.padding?.right ?? 0}pt`,
          paddingBottom: `${propertiesState?.padding?.bottom ?? 0}pt`,
          paddingLeft: `${propertiesState?.padding?.left ?? 0}pt`,
          boxSizing: "border-box",
    }}
    >
        {/* Header */}
        {headerState?.showHeader &&(
         <ShardPrevHeader data={data} template={template} qrCodes={qrCodeImages}/>
        )}
        
        {/* Main Content Container */}
        <div
        className=" relative  flex flex-col flex-grow-1 h-full w-full"
          style={{
          flex:1,

          backgroundImage: template?.background_image ? `url(${template?.background_image})` : "none",
          backgroundPosition: propertiesState?.bg_image_position ?? "center",
          backgroundSize: propertiesState?.bg_image_objectFit ?? "fill",   
          backgroundRepeat: "no-repeat",
          boxSizing: "border-box",

          }}>
          <SharedPrvTable data={data?.details??[]} template={template} />
        </div>
          <SharedPrvFooter data={data} template={template} qrCodes={qrCodeImages}/>
      </div>

  );
};

export default SharedTemplatePreview;