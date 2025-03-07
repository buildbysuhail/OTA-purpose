import { ReportRenderProps } from "./report-interface";
import StatementTemplate from "./statement-template";


export const renderReportSelectedTemplate = (props: ReportRenderProps) => {
  const { orientation, data, currentBranch, userSession } = props;

  switch ("") {
    case "":
      return (
        <StatementTemplate
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
    case "":
      return (
     <></>
      );
    default:
      return <></>;
  }
};