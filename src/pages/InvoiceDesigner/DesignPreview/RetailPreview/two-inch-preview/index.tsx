import React from "react";
import { TemplateState } from "../../../Designer/interfaces";

import { AccTransactionRow } from "../../../../accounts/transactions/acc-transaction-types";

import { AccountTransactionProps } from "../../../DownloadPreview/account/account_transactiocn-premium";
import ReceiptHeader from "./header";


const RetailRollSheetPrev = ({ data, template, currentBranch, userSession, clientSession }: AccountTransactionProps) => {
  const paddingLeft = template?.propertiesState?.padding?.left || 10;
  const paddingRight = template?.propertiesState?.padding?.right || 10;
  const paddingTop = template?.propertiesState?.padding?.top || 10;
  const paddingBottom = template?.propertiesState?.padding?.bottom || 10;

  return (
    <div className="flex flex-col w-full"
     style={{ padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px` ,
             }}
     >
      {data?.details.map((item: AccTransactionRow, index: number) => (
        <div key={index} className="flex flex-col">
          <ReceiptHeader data={data} template={template} currentBranch={currentBranch} />
          {/* <Content data={data} template={template} currentBranch={currentBranch} indexNO={index} clientSession={clientSession} /> */}
        </div>
      ))}
    </div>
  );
};

export default RetailRollSheetPrev;
