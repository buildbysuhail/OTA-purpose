import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

import FooterPreview from "./FooterPreview";
import HeaderPreview from "./HeaderPreview";
import ItemTablePreview from "./ItemTablePreview";
import TotalSummaryPreview from "./TotalSummaryPreview";
import { TemplateState } from "../../Designer/interfaces";
import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";

export interface DownloadPreviewProps {
  data: any;
  template?: TemplateState;
  docIDKey?: string;
  docTitle?: any;
  currencySymbol?: string;
  totalAmountInwords?: string;
  currentBranch?: any;
}

type TemplatePageSizes = "A4" | "A5" | "LETTER" | { width: string | number; height?: string | number };

const DownloadRetailPreview = ({
  template,
  data,
  docIDKey,
  docTitle,
  currencySymbol,
  totalAmountInwords,
}: DownloadPreviewProps) => {
  const backgroundColor = template?.propertiesState?.bg_color || "#fff";
  const topBackgroundColor = template?.headerState?.bgColor || "#fff";
  const bottomBackgroundColor = template?.footerState?.bg_color || "#fff";

  /// Padings
  const paddingTop = template?.propertiesState?.margins?.top || 25;
  const paddingLeft = template?.propertiesState?.margins?.left;
  const paddingRight = template?.propertiesState?.margins?.right;
  const paddingBottom = template?.propertiesState?.margins?.bottom || 25;

  // Selection of paper size from the template

  let paperSize = (template?.propertiesState?.pageSize as TemplatePageSizes) || "A4";
  if (template?.propertiesState?.pageSize === "3Inch") {
    paperSize = {
      width: 3 * 72, // 3 inches in points
    };
  } else if (template?.propertiesState?.pageSize === "4Inch") {
    paperSize = {
      width: 4 * 72, // 4 inches in points
    };
  }

  // Styling

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
    },
  });

  const templateFont = template?.propertiesState?.font === "Poppins" ? "Courier" : template?.propertiesState?.font

  const currentBranch = useCurrentBranch();
  return (
    <Document>
      <Page size={paperSize} orientation="portrait" style={{ fontFamily: templateFont }} wrap>
        <View style={[styles.headerFooterStyle, { backgroundColor: topBackgroundColor, paddingTop }]} fixed />

        <View style={{ backgroundColor }}>
          <HeaderPreview
            template={template}
            data={data}
            docIDKey={docIDKey}
            docTitle={docTitle}
            currencySymbol={currencySymbol}
            currentBranch={currentBranch}
          />
          <ItemTablePreview template={template} data={data} />
          <TotalSummaryPreview template={template} data={data} currencySymbol={currencySymbol} totalAmountInwords={totalAmountInwords} />
          <FooterPreview template={template} data={data} />
        </View>

        <View style={[styles.headerFooterStyle, { backgroundColor: bottomBackgroundColor, paddingBottom }]} fixed></View>
      </Page>
    </Document>
  );
};

export default DownloadRetailPreview;
