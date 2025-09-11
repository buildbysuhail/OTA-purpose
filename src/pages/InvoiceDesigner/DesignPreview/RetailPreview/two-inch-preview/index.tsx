import React from "react";
import { TemplateState } from "../../../Designer/interfaces";

import { AccTransactionRow } from "../../../../accounts/transactions/acc-transaction-types";

import { AccountTransactionProps } from "../../../DownloadPreview/account/account_transactiocn-premium";



const RetailRollSheetPrev = ({ data, template,}: AccountTransactionProps) => {


  return (
    <div className="flex flex-col w-full"
     style={{}}
             
     >
      {data?.details.map((item: AccTransactionRow, index: number) => (
        <div key={index} className="flex flex-col">
          {/* <ReceiptHeader data={data} template={template}  /> */}
          {/* <Content data={data} template={template} currentBranch={currentBranch} indexNO={index} clientSession={clientSession} /> */}
        </div>
      ))}
    </div>
  );
};

export default RetailRollSheetPrev;
