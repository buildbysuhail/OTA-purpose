import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

import Table from "./Table";
import Header from "./Header";
import Footer from "./Footer";
import { TemplateState } from "../../Designer/interfaces";

export interface DNSPTEmpProps {
  data: any;
  template?: TemplateState;
}

const DNPSTemplate = ({ data, template }: DNSPTEmpProps) => {
  const backgroundColor = template?.propertiesState?.bg_color || "#fff";
  const topBackgroundColor = template?.headerState?.bgColor || "#fff";
  const bottomBackgroundColor = template?.footerState?.bg_color || "#fff";

  /// Padings
  const paddingLeft = template?.propertiesState?.padding?.left || 30;
  const paddingRight = template?.propertiesState?.padding?.right || 30;

  const styles = StyleSheet.create({
    headerFooterStyle: {
      fontSize: 12,
      color: "#000000",
      fontWeight: 500,
      display: "flex",
      paddingLeft,
      paddingRight,
      paddingVertical: "15pt",
      width: "100%",
      height: "50px",
    },
  });

  return (
    <Document>
      <Page size={"A4"} orientation="portrait" style={{ backgroundColor }} wrap>
        {/* Header Section */}
        <View style={[styles.headerFooterStyle, { backgroundColor: topBackgroundColor }]} fixed />
        {/*   */}

        <View style={{ paddingLeft, paddingRight, fontSize: 12 }}>
          <Header data={data}  template={template} />
          <Table data={data}  template={template} />
          <Footer data={data} template={template} />
        </View>

        {/* Footer  Section  */}
        <View fixed style={[styles.headerFooterStyle]}></View>
        <View
          fixed
          style={[styles.headerFooterStyle, { backgroundColor: bottomBackgroundColor, position: "absolute", bottom: 0, left: 0, right: 0 }]}
        >
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

export default DNPSTemplate;
