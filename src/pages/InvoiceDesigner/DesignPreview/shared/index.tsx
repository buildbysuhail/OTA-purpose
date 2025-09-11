import SharedPrvTable from "./Table_Prv";
import { getPageDimensions, getPageSizeForPDF } from "../../utils/pdf-util";
import ShardPrevHeader from "./Header_Prv";
import SharedPrvFooter from "./Footer_Prv";
import FontRegistration from "../../../LabelDesigner/fontRegister";
import { TemplateState } from "../../Designer/interfaces";
import { useEffect } from "react";

export interface AccountTransactionProps {
  data?: any;
  template?: TemplateState<unknown>
  currentBranch?: any;
  userSession?: any;
  clientSession?: any;
  currency?: string;
  bindingDemoData?: any;
}

const SharedTemplatePreview = ({ data, template, currentBranch, userSession, clientSession, bindingDemoData }: AccountTransactionProps) => {

   const headerState = template?.headerState;
  const totalState = template?.totalState;
  const propertiesState = template?.propertiesState;
  return (
    <div  className="flex flex-col h-full w-full">

        {/* Header */}
        {headerState?.showHeader &&(
         <ShardPrevHeader data={data} template={template} />
        )}
        
        {/* Main Content Container */}
        <div
        className="z-10 relative  flex flex-col flex-grow-1 h-full w-full"
          style={{
            // display: "flex",
            // flexDirection: "column",
          backgroundColor: template?.propertiesState?.bg_color || "#fff",
          paddingTop: `${propertiesState?.padding?.top ?? 0}pt`,
          paddingRight: `${propertiesState?.padding?.right ?? 0}pt`,
          paddingBottom: `${propertiesState?.padding?.bottom ?? 0}pt`,
          paddingLeft: `${propertiesState?.padding?.left ?? 0}pt`,
            // flexGrow: 1,
          }}>
          {/* Background Image */}
          {template?.background_image && (
            <img
              src={template.background_image}
               alt="Background"
               className="absolute inset-0 w-full h-full -z-10"
              style={{
                      objectPosition: (propertiesState?.bg_image_position ?? "center") as React.CSSProperties["objectPosition"],
                      objectFit: (propertiesState?.bg_image_objectFit ?? "fill") as React.CSSProperties["objectFit"],
                    }}
            />
          )}
          {/* Content Section */}
          

          {/* Table Section - Allow to break across pages */}
          <SharedPrvTable data={data} template={template} />
        </div>

        {/* Footer */}
          <SharedPrvFooter data={data} template={template} />
      </div>

  );
};

export default SharedTemplatePreview;