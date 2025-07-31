import Table from "./Table";
import { getPageDimensions, getPageSizeForPDF } from "../../../utils/pdf-util";
import Header from "./Header";
import Content from "./Content";
import FontRegistration from "../../../../LabelDesigner/fontRegister";
import { TemplateState } from "../../../Designer/interfaces";

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
  const paperSize = template?.propertiesState?.pageSize || "A4";
  const pageOrientation = template?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";
  const paddingLeft = template?.propertiesState?.padding?.left || 10;
  const paddingRight = template?.propertiesState?.padding?.right || 10;
  const paddingTop = template?.propertiesState?.padding?.top || 10;
  const paddingBottom = template?.propertiesState?.padding?.bottom || 10;
  const pageSize = template?.propertiesState?.pageSize ?? "A4";
  const selectedPageSize = getPageDimensions(pageSize, template?.propertiesState?.width, template?.propertiesState?.height,);
  const pdfPageSize = getPageSizeForPDF(pageSize, selectedPageSize);

  return (
    <div>
      <FontRegistration />
      <div data-size={pdfPageSize} data-orientation={pageOrientation}>
        {/* Header */}
        <Header data={data} template={template} currentBranch={currentBranch} userSession={userSession} bindData={bindingDemoData} />
        {/* Main Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: template?.propertiesState?.bg_color || "#fff",
            padding: paddingTop, paddingRight, paddingBottom, paddingLeft,
            flexGrow: 1,
          }}>
          {/* Background Image */}
          {template?.background_image && (
            <img
              src={template.background_image || "/placeholder.svg"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -20,
                objectPosition: template?.propertiesState?.bg_image_position ?? "center",
              }}
            />
          )}
          {/* Content Section */}
          <Content data={data} template={template} currentBranch={currentBranch} clientSession={clientSession} />

          {/* Table Section - Allow to break across pages */}
          <Table data={data} template={template} />
        </div>

        {/* Footer */}
        {/* <Footer data={data} template={template} /> */}
      </div>
    </div>
  );
};

export default AccountTransactionsTemplatePreview;