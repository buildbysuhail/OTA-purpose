import { Document, Page, View, Text, StyleSheet,PDFViewer,Image  } from "@react-pdf/renderer";
import FontRegistration from "../../../../../pages/LabelDesigner/fontRegister";
import { ReportRenderProps } from "../report-interface";
import { HeaderTemp } from "./HeaderTem";


const StatementTemplate = ({ data, orientation, currentBranch,userSession }: ReportRenderProps) => {


return (
  <Document>
  <FontRegistration />
  <Page
    size={"A4"}
    orientation={orientation === "landscape" ? "landscape" : "portrait"}
    wrap
  >
    {/* Main Container */}
    <View style={{ width: '100%',display:"flex", flexDirection: 'column',
    paddingHorizontal:20,paddingVertical:10,gap:10
    }}>
 
       <HeaderTemp data={data}  currentBranch={currentBranch} userSession={userSession} />
        {/* Content /LabelDesigner/fontRegister"*/}
        {/* <Content data={data} template={template} currentBranch={currentBranch} /> */}
        {/* Table */}
        {/* <View style={{flex:1}}>
        <Table data={data} template={template} />
        </View> */}
      
        {/* Footer */}
        {/* <Footer data={data} template={template}  /> */}
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
      
    </View>
  </Page>
</Document>
);
};
export default StatementTemplate;
