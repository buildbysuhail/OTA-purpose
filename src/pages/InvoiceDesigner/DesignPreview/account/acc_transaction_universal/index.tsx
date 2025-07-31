import React from "react";
import { TemplateState } from "../../../Designer/interfaces";
import FontRegistration from "../../../../LabelDesigner/fontRegister";
import { Content } from "./Content";
import { getPageDimensions, getPageSizeForPDF } from "../../../utils/pdf-util";
import { AccountTransactionProps } from "../acc_transaction_premium";
import Header from "./Header";

const AccountTransactionsUniversalPreview = ({ data, template, currentBranch, userSession }: AccountTransactionProps) => {
  // Paddings
  const paddingLeft = template?.propertiesState?.padding?.left || 10;
  const paddingRight = template?.propertiesState?.padding?.right || 10;
  const paddingTop = template?.propertiesState?.padding?.top || 10;
  const paddingBottom = template?.propertiesState?.padding?.bottom || 10;
  const pageOrientation = template?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";
  const pageSize = template?.propertiesState?.pageSize ?? "A4";
  const selectedPageSize = getPageDimensions(pageSize, template?.propertiesState?.width, template?.propertiesState?.height,);
  const pdfPageSize = getPageSizeForPDF(pageSize, selectedPageSize);

  return (
    <div>
      <FontRegistration />
      <div data-size={pdfPageSize} data-orientation={pageOrientation}>
        <div style={{ width: '100%', height: '100%', padding: `${paddingTop}pt ${paddingRight}pt ${paddingBottom}pt ${paddingLeft}pt`, }}>
          <div style={{ flex: 1, flexDirection: 'column', border: "1.5pt solid rgb(104, 101, 101)", padding: 2 }}>
            <div style={{ flex: 1, border: "3pt solid rgb(104, 101, 101)", }}>
              <Header data={data} template={template} currentBranch={currentBranch} userSession={userSession} />
              <Content data={data} template={template} currentBranch={currentBranch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTransactionsUniversalPreview;