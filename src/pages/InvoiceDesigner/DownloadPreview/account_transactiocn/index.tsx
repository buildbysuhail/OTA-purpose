import { Document, Page, View, Text, StyleSheet,PDFViewer } from "@react-pdf/renderer";

import Table from "./Table";
import Header from "./Header";
import Footer from "./Footer";
import { TemplateState } from "../../Designer/interfaces";
import { useEffect, useState } from "react";

export interface AccountTransactionProps {
  data: any;
  template?: TemplateState;
}

const AccountTransactionsTemplate = ({ data, template }: AccountTransactionProps) => {

  const [generalBackGroundStyle, setGeneralBackGroundStyle] = useState<any>({
    backgroundRepeat: "no-repeat",
    backgroundColor: template?.propertiesState?.bg_color || "#fff",
    backgroundPosition:
      template?.propertiesState?.bg_image_position ?? "top left",
  });
  console.log(template?.propertiesState?.orientation,"property state");
  
  useEffect(() => {
    
    setGeneralBackGroundStyle((previous: any) => ({
      ...previous,
      backgroundImage: template?.background_image
        ? `url(${template?.background_image})`
        : "",
      backgroundRepeat: "no-repeat",
      backgroundColor: template?.propertiesState?.bg_color,
      backgroundPosition:
        template?.propertiesState?.bg_image_position ?? "top left",
    }));
  }, [template, template?.propertiesState?.bg_image_position]);

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
  const backgroundColor = "#275297";
  // const topBackgroundColor = template?.headerState?.bgColor || "#275297";
  // const bottomBackgroundColor = template?.footerState?.bg_color || "#275297";

// Paddings
const paddingLeft = template?.propertiesState?.padding?.left || 10;
const paddingRight = template?.propertiesState?.padding?.right || 10;
const paddingTop = template?.propertiesState?.padding?.top || 10;
const paddingBottom = template?.propertiesState?.padding?.bottom || 10



  return (
    <Document>
      <Page size={"A4"}
      // {{
      //   width:template?.propertiesState?.orientation === "portrait" ? `${paperWidth}pt` : `${paperHeight}pt`,
      //   height:template?.propertiesState?.orientation === "portrait" ?  `${paperHeight}pt`:`${paperWidth}pt`,
      // }} 
       orientation={template?.propertiesState?.orientation === "portrait" ? "portrait":"landscape"}
          style={{
           ...generalBackGroundStyle,
           padding:`${paddingLeft}pt ${paddingRight}pt ${paddingTop}pt ${paddingBottom}pt`
          }}
          wrap
        >
        <View>
          <Text style={{color:"black"}}>{template?.headerState?.docTitle}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default AccountTransactionsTemplate;
