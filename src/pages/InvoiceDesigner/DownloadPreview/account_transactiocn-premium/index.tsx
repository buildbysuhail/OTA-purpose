import { Document, Page, View, Text, StyleSheet,PDFViewer,Image  } from "@react-pdf/renderer";

import Table from "./Table";
import Footer from "./Footer";
import { TemplateState } from "../../Designer/interfaces";
import FontRegistration from "../../../LabelDesigner/fontRegister";
import { Header } from "./Header";
import { Content } from "./Content";

export interface AccountTransactionProps {
  data: any;
  template?: TemplateState;
  currentBranch?: any;
  userSession?:any;
}


const AccountTransactionsTemplate = ({ data, template, currentBranch,userSession }: AccountTransactionProps) => {
  let paperWidth=500, paperHeight=500;
  
  const paperSize = template?.propertiesState?.pageSize || "A4";

  switch (paperSize) {
    case "A5":
      paperWidth = 420; // 5.83in x 8.27in
      paperHeight = 595;
      break;
    case "A4":
      paperWidth = 589; // 8.27in x 11.69in
      paperHeight = 842;
      break;
    case "LETTER":
      paperWidth = 612; // 8.5in x 11in
      paperHeight = 792;
      break;
    case "3Inch":
      paperWidth = 216; // 3in x 6in
      paperHeight = 432;
      break;
    case "4Inch":
      paperWidth = 288; // 4in x 8in
      paperHeight = 576;
      break;
  }

  // const topBackgroundColor = template?.headerState?.bgColor || "#275297";
  // const bottomBackgroundColor = template?.footerState?.bg_color || "#275297";

// Paddings
const paddingLeft = template?.propertiesState?.padding?.left || 10;
const paddingRight = template?.propertiesState?.padding?.right || 10;
const paddingTop = template?.propertiesState?.padding?.top || 10;
const paddingBottom = template?.propertiesState?.padding?.bottom || 10
const pageOrientation = template?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";

return (
  <Document>
    <FontRegistration />
    <Page
      size={"A4"}
      orientation={pageOrientation}
      wrap
    >
      {/* Main Container */}
      <View style={{ flex: 1, flexDirection: 'column', width: '100%',}}>
        {/* Header */}
        <Header data={data} template={template} currentBranch={currentBranch} />
        {/* Main Content */}
        <View style={{
          flex: 1, // Takes up remaining space
          position: 'relative',
          backgroundColor: template?.propertiesState?.bg_color || "#fff",
          
        }}>
          {/* Background Image */}
          {template?.background_image && (
            <Image
              src={template.background_image}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -20,
                objectPosition: template?.propertiesState?.bg_image_position ??"center"
              }}
            />
          )}
     
          {/* Content */}
          <View style={{ zIndex: 50 ,
            padding: `${paddingTop}pt ${paddingRight}pt ${paddingBottom}pt ${paddingLeft}pt`,
          }} wrap>
            <Content data={data} template={template} currentBranch={currentBranch} />
            <Table data={data} template={template} />
            {/* Add other components like Table, Header, Footer here */}
          </View>
        </View>

        {/* Footer */}
        <Footer data={data} template={template}/>
  
      </View>
           {/* ✅ Page Number - Show on Every Page */}
  
    </Page>
  </Document>
);
};
export default AccountTransactionsTemplate;
