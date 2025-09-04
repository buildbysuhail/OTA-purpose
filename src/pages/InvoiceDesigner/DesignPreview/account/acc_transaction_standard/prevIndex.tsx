import React from "react";
import { TemplateState } from "../../../Designer/interfaces";

import { AccTransactionRow } from "../../../../accounts/transactions/acc-transaction-types";

import { AccountTransactionProps } from "../../../DownloadPreview/account/account_transactiocn-premium";
import PrevHeader from "./prevHeader";
import Content from "./prevContent";

const AccountPrvTransactionsVoucher = ({ data, template, currentBranch, userSession, clientSession }: AccountTransactionProps) => {

const propertiesState = template?.propertiesState
  return (


        <div  className="flex flex-col h-full w-full border border-gray-600"
        style={{
          paddingTop: `${propertiesState?.padding?.top ?? 0}pt`,
          paddingRight: `${propertiesState?.padding?.right ?? 0}pt`,
          paddingBottom: `${propertiesState?.padding?.bottom ?? 0}pt`,
          paddingLeft: `${propertiesState?.padding?.left ?? 0}pt`,
        }}
        >
          {
            template?.headerState?.showHeader &&(
           <PrevHeader data={data} template={template} currentBranch={currentBranch} userSession={userSession} />
            )
          }
          
          <Content data={data} template={template} currentBranch={currentBranch} indexNO={0} clientSession={clientSession} />
        </div>
      

  );
};

export default AccountPrvTransactionsVoucher;
