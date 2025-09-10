import React from "react";
import { AccountTransactionProps } from "../../InvoiceDesigner/DownloadPreview/Shared";
import { templateConfig } from "../../InvoiceDesigner/LandingFolder/designSection";
import { DocumentProps,Document  } from "@react-pdf/renderer";


export const renderSelectedTemplate = (props: AccountTransactionProps) : React.ReactElement<DocumentProps> => {
  const { template, data } = props;
  const groupKey = template?.templateGroup ?? "";
  const typeKey = template?.templateType?.toUpperCase() ?? "STANDARD";
  const kindKey = template?.templateKind ?? "";

  const config = templateConfig[groupKey]?.[typeKey]?.[kindKey];

  if (config?.downloadComponent && template) {
    return React.cloneElement(config.downloadComponent, {
      data,
      template,
    })as React.ReactElement<DocumentProps>;
  }

  return <Document />;
};