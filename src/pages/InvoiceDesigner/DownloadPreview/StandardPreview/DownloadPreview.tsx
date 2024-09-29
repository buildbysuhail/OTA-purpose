import { Document, Page, View, Text, StyleSheet, Font, Image } from "@react-pdf/renderer";

import BottomPreview from "./FooterPreview";
import TopPreview from "./HeaderPreview";
import ItemTablePreview from "./ItemTablePreview";
import TotalSummaryPreview from "./TotalSummaryPreview";
import { TemplateState } from "../../Designer/interfaces";
import { TemplateGroupTypes } from "../../constants/TemplateCategories";
import { TemplateReducerState } from "../../../../redux/reducers/TemplateReducer";

export interface DownloadPreviewProps {
  data: any;
  docTitle?: any;
  docIDKey?: string;
  ActiveBranch?: any;
  AddressTemplates?: any;
  currencySymbol?: string;
  template?: TemplateState;
  totalAmountInwords?: string;
  templateGroupId?: TemplateGroupTypes;
  preferences?: any;
  templateImages?: any;
  taxInfo?: any
}

type TemplatePageSizes = "A4" | "A5" | "LETTER" | { width: string | number; height?: string | number };

// Font.register({ family: 'Roboto', src: source });

const DownloadStandardPreview = ({
  data,
  template,
  docIDKey,
  docTitle,
  ActiveBranch,
  currencySymbol,
  templateGroupId,
  totalAmountInwords,
  AddressTemplates,
  preferences,
  templateImages, taxInfo
}: DownloadPreviewProps) => {

  const backgroundColor = template?.propertiesState?.bg_color || "#fff";
  const topBackgroundColor = template?.headerState?.bgColor || "#fff";
  const bottomBackgroundColor = template?.footerState?.bg_color || "#fff";

  const footerFontColor = template?.footerState?.footerFontColor || "#000";

  /// Padings
  const paddingLeft = template?.propertiesState?.margins?.left;
  const paddingRight = template?.propertiesState?.margins?.right;

  // Selection of paper size from the template

  let paperSize = (template?.propertiesState?.pageSize?.value as TemplatePageSizes) || "A4";
  if (template?.propertiesState?.pageSize?.value === "3Inch") {
    paperSize = {
      width: 3 * 72, // 3 inches in points
    };
  } else if (template?.propertiesState?.pageSize?.value === "4Inch") {
    paperSize = {
      width: 4 * 72, // 4 inches in points
    };
  }

  // Styling

  const styles = StyleSheet.create({
    headerFooterStyle: {
      fontSize: 12,
      fontWeight: 500,
      display: "flex",
      paddingLeft,
      paddingRight,
      width: "100%",
      height: "50px",
    },
  });

  const templateFont = ["borel", "Poppins"].includes(template?.propertiesState?.font!) ? "Helvetica" : template?.propertiesState?.font

  return (
    <Document>
      <Page size={paperSize} orientation="portrait" style={{ backgroundColor, fontFamily: templateFont }} wrap>
        {/* Header Section */}
        <View
          fixed={!template?.headerState?.isFirstOnly}
          style={[styles.headerFooterStyle,
          {
            backgroundColor: topBackgroundColor,
            paddingVertical: templateImages?.background_image_header ? "0pt" : "15pt"
          }]}
        >
          <Image
            style={{ width: "100%", objectFit: "cover", objectPosition: "center center" }}
            src={{
              uri: templateImages?.background_image_header ?? "",
              method: "GET",
              headers: { "Cache-Control": "no-cache" },
              body: "",
            }}
          />
        </View>
        {/*   */}
        <View style={{ backgroundColor }}>
          {/* Top Section  */}
          <TopPreview
            data={data}
            template={template}
            docIDKey={docIDKey}
            docTitle={docTitle}
            ActiveBranch={ActiveBranch}
            currencySymbol={currencySymbol}
            AddressTemplates={AddressTemplates}
          />
          {/*   */}
          {/* Table Section  */}
          <ItemTablePreview templateGroupId={templateGroupId} template={template} data={data} preferences={preferences} />
          {/*   */}
          {/* Total Summary Section  */}
          <TotalSummaryPreview
            data={data}
            template={template}
            taxInfo={taxInfo}
            currencySymbol={currencySymbol}
            templateGroupId={templateGroupId}
            totalAmountInwords={totalAmountInwords}
          />
          {/*   */}
          {/* Bottom  Section  */}
          <BottomPreview ActiveBranch={ActiveBranch} templateGroupId={templateGroupId} template={template} data={data} />
          {/*   */}
        </View>

        {/* Footer  Section  */}

        {/* Don't Remove this: Footer Space reserved !! */}
        <View fixed style={[styles.headerFooterStyle]}></View>

        <View
          fixed
          style={[styles.headerFooterStyle, {
            color: footerFontColor,
            backgroundColor: bottomBackgroundColor,
            position: "absolute", bottom: 0, left: 0, right: 0,
            paddingVertical: templateImages?.background_image_footer ? "0pt" : "15pt",
          }]}
        >
          <Image
            style={{ width: "100%", objectFit: "cover", objectPosition: "center center" }}
            src={{
              uri: templateImages?.background_image_footer ?? "",
              method: "GET",
              headers: { "Cache-Control": "no-cache" },
              body: "",
            }}
          />
          {template?.footerState?.show_page_number && <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />}
        </View>

        {/*   */}
      </Page>
    </Document>
  );
};

export default DownloadStandardPreview;
