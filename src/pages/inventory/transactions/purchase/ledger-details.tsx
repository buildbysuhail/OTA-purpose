import React, { useState } from "react";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";

interface LedgerDetailsGrid {
  id: string;
  partyCode: string;
  partyName: string;
  displayName: string;
}

interface LedgerDetailsProps {
  closeModal: () => void;
  t: any;
}

const LedgerDetails: React.FC<LedgerDetailsProps> = ({ closeModal, t }) => {
  const [gridData, setGridData] = useState<LedgerDetailsGrid[]>([]);

  const gridColumns: DevGridColumn[] = [
    {
      dataField: "partyCode",
      caption: t("party_code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250
    },
    {
      dataField: "displayName",
      caption: t("display_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250
    }
  ];

  return (
    <>
      <ErpDevGrid
        columns={gridColumns}
        data={gridData}
        gridId="ledgerDetailsGrid"
        height={450}
        hideGridAddButton={true}
      />
    </>
  );
};

export default LedgerDetails;