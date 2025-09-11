import { Document, Page, View, Text, StyleSheet,PDFViewer,Image  } from "@react-pdf/renderer";
import { TemplateState } from "../../../Designer/interfaces";
import FontRegistration from "../../../../LabelDesigner/fontRegister";
import { Header } from "./Header";
import { Content } from "./Content";
import { AccountTransactionProps } from "../account_transactiocn-premium";
import { getPageDimensions, getPageSizeForPDF } from "../../../utils/pdf-util";


const AccountTransactionsUniversal = ({ data, template,}: AccountTransactionProps) => {

// Paddings
const paddingLeft = template?.propertiesState?.padding?.left || 10;
const paddingRight = template?.propertiesState?.padding?.right || 10;
const paddingTop = template?.propertiesState?.padding?.top || 10;
const paddingBottom = template?.propertiesState?.padding?.bottom || 10
const pageOrientation = template?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";
  // Get the page size for the PDF
    const pageSize = template?.propertiesState?.pageSize ?? "A4"
          // Get the actual page dimensions based on the selected page size
          const selectedPageSize = getPageDimensions(
            pageSize,
            template?.propertiesState?.width,
            template?.propertiesState?.height,
          )
        const pdfPageSize = getPageSizeForPDF(pageSize, selectedPageSize)
return (
  <Document>
  <FontRegistration />
  <Page
    size={pdfPageSize}
    orientation={pageOrientation}
    wrap
  >
    {/* Main Container */}
    <View style={{ width: '100%', height: '100%' ,
     padding: `${paddingTop}pt ${paddingRight}pt ${paddingBottom}pt ${paddingLeft}pt`,
   
    }}>
       
      {/* Main Content */}
      <View style={{
        flex: 1,
        flexDirection: 'column',
        border:"1.5pt solid rgb(104, 101, 101)",
        padding:2
      }}>
          <View style={{
          flex: 1,
          border:"3pt solid rgb(104, 101, 101)",
          }}>
        {/* Header */}
        {/* <Header data={data} template={template} currentBranch={currentBranch} userSession={userSession}/> */}
        {/* Content */}
          {/* <Content data={data} template={template} currentBranch={currentBranch} /> */}
      </View>
      </View>
    </View>
  </Page>
</Document>
);
};
export default AccountTransactionsUniversal;
