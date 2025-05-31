import AccountTransactionsTemplate, { AccountTransactionProps } from "../../../InvoiceDesigner/DownloadPreview/account/account_transactiocn-premium";
import AccountTransactionsVoucher from "../../../InvoiceDesigner/DownloadPreview/account/account_transactiocn_standard";
import AccountTransactionsUniversal from "../../../InvoiceDesigner/DownloadPreview/account/account_transaction-universal";

export const renderSelectedTemplate = (props: AccountTransactionProps) => {
  const { template, data, currentBranch, userSession } = props;

  switch (template?.templateKind) {
    case "premium":
      return (
        <AccountTransactionsTemplate
          template={template}
          data={data}
          currentBranch={currentBranch}
        />
      );
    case "standard":
      return (
        <AccountTransactionsVoucher
          template={template}
          data={data}
          currentBranch={currentBranch}
        />
      );
    case "universal":
      return (
        <AccountTransactionsUniversal
          template={template}
          data={data}
          currentBranch={currentBranch}
          userSession={userSession}
        />
      );
    default:
      return <></>;
  }
};