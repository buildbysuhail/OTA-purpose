import React from "react";
import { TemplateState } from "../../../Designer/interfaces";

import { AccTransactionRow } from "../../../../accounts/transactions/acc-transaction-types";

import { AccountTransactionProps } from "../../../DownloadPreview/account/account_transactiocn-premium";
import PrevHeader from "./prevHeader";
import Content from "./prevContent";

const AccountPrvTransactionsVoucher = ({ data, template, currentBranch, userSession, clientSession }: AccountTransactionProps) => {


  return (


        <div  className="flex flex-col border border-gray-600">
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
