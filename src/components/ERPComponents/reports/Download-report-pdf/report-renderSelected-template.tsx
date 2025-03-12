import CustomerBalanceTemplate from "./customer-balance";
import { ReportRenderProps } from "./report-interface";
import StatementTemplate from "./statement-template";


export const renderReportSelectedTemplate = (props: ReportRenderProps) => {
  const { orientation, data, currentBranch, userSession,printCase } = props;

  switch (printCase) {
    case "statement":
      return (
        <StatementTemplate
        orientation={orientation}
        data={data}
        currentBranch={currentBranch}
        userSession={userSession}
        />
      );
    case "customer_balance":
      return (
        <CustomerBalanceTemplate
        orientation={orientation}
        data={data}
        currentBranch={currentBranch}
        userSession={userSession}
        />
      );
    case "":
      return (
     <></>
      );
    default:
      return <></>;
  }
};