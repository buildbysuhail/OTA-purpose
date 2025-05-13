import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import GSTR1DocsFilter, {
  GSTR1DocsFilterInitialState,
} from "./gstr1-docs-filter";

const GSTR1Docs = () => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "natureOfDocument",
      caption: t("nature_of_document"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 180,
      showInPdf: true,
    },
    {
      dataField: "srNoFrom",
      caption: t("sr_no_from"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "srNoTo",
      caption: t("sr_no_to"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "totalNumber",
      caption: t("total_number"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "cancelled",
      caption: t("cancelled"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                moreOption={true}
                gridHeader={t("gstr1_documents_report")}
                dataUrl={Urls.gstr1Docs}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<GSTR1DocsFilter />}
                filterWidth={328}
                filterHeight={330}
                filterInitialData={GSTR1DocsFilterInitialState}
                reload={true}
                gridId="grd_gstr1_documents"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GSTR1Docs;
