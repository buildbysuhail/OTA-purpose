import { Document, Page, View, Text, StyleSheet,PDFViewer,Image  } from "@react-pdf/renderer";
import { TemplateState } from "../../Designer/interfaces";
import FontRegistration from "../../../LabelDesigner/fontRegister";

import { AccountTransactionProps } from "../account_transactiocn-premium";
import { Header } from "./Header";
import { Content } from "./Content";

const AdviceTemplate = ({ data, template, currentBranch,userSession }: AccountTransactionProps) => {

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
    <View style={{ width: '100%', height: '100%' ,
     padding: `${paddingTop}pt ${paddingRight}pt ${paddingBottom}pt ${paddingLeft}pt`,
   
    }}>
       
      {/* Main Content */}
      <View style={{
        flex: 1,
        flexDirection: 'column',
        border:"1.5px solid rgb(104, 101, 101)"
        
      }}>
          
        {/* Header */}
       <Header data={data} template={template} currentBranch={currentBranch} />
        {/* Content */}
          <Content data={data} template={template} currentBranch={currentBranch} />
      </View>

    </View>
  </Page>
</Document>
);
};
export default AdviceTemplate;
