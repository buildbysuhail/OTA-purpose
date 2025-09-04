import AccPrvTable from "./Table_Prv";
import { getPageDimensions, getPageSizeForPDF } from "../../../utils/pdf-util";
import AccPrevHeader from "./Header_Prv";
import AccPrvContent from "./Content_Prv";
import FontRegistration from "../../../../LabelDesigner/fontRegister";
import { TemplateState } from "../../../Designer/interfaces";
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

const AccountTransactionsTemplatePreview = ({ data, template, currentBranch, userSession, clientSession, bindingDemoData }: AccountTransactionProps) => {

   const headerState = template?.headerState;
  const totalState = template?.totalState;
  const propertiesState = template?.propertiesState;
  return (
    <div  className="flex flex-col h-full w-full">

        {/* Header */}
        {headerState?.showHeader &&(
         <AccPrevHeader data={data} template={template} currentBranch={currentBranch} userSession={userSession} bindData={bindingDemoData}/>
        )}
        
        {/* Main Content Container */}
        <div
        className="z-10 relative  flex flex-col flex-grow-1"
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
          <AccPrvContent data={data} template={template} currentBranch={currentBranch} clientSession={clientSession} />

          {/* Table Section - Allow to break across pages */}
          <AccPrvTable data={data} template={template} />
        </div>

        {/* Footer */}
        {/* <Footer data={data} template={template} /> */}
      </div>

  );
};

export default AccountTransactionsTemplatePreview;