import { Document, Page, View, Text, StyleSheet,PDFViewer,Image  } from "@react-pdf/renderer";
import { TemplateState } from "../../Designer/interfaces";
import FontRegistration from "../../../LabelDesigner/fontRegister";

import { AccountTransactionProps } from "../account_transactiocn-premium";
import { Header } from "./Header";
import { Content } from "./Content";
import Table from "./Table";
import { Footer } from "./Footer";

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
    <View style={{ width: '100%',flex:1, flexDirection: 'column',
     padding: `${paddingTop}pt ${paddingRight}pt ${paddingBottom}pt ${paddingLeft}pt`,
    }}>
   
        {/* Header */}
       <Header data={data} template={template} currentBranch={currentBranch} />
        
        <Content data={data} template={template} currentBranch={currentBranch} />
        {/* Table */}
        <View style={{flexGrow:1}}>
        <Table data={data} template={template} />
        </View>
      
        {/* Footer */}
        {/* <Footer data={data} template={template}/> */}

        {template?.footerState?.show_page_number && (
          <>
            <View style={{ width: '100%',display:"flex", flexDirection: 'row',justifyContent:"space-between",marginVertical:2
      }}fixed>
        <Text style={{fontSize: 8}}>01/03/2025 09:52 AM </Text>
        <Text
          style={{
            fontSize: 8,
          }}
          fixed
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
        </View>
          </>
        )
    
        }
    
      
    </View>
  </Page>
</Document>
);
};
export default AdviceTemplate;
