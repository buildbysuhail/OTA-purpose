import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { APIClient } from "../../../../helpers/api-client";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { RootState } from "../../../../redux/store";
import Urls from "../../../../redux/urls";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";


interface visionDetailsProps {
  closeModal: () => void;
  t: any;
}

interface visionDetails {
  warehouseID: number;
  warehouseName: string;
  stock: number;
  stockDetails: string;
}

const api = new APIClient();
const visionDetails: React.FC<visionDetailsProps> = ({closeModal, t}) => {
  const gridColumns: DevGridColumn[] = [
    {
      dataField: "warehouseName",
      caption: t("warehouse_name"),
      dataType: "string",
      width: 150,
    },
    {
      dataField: "stock",
      caption: t("stock"),
      dataType: "number",
      width: 250,
    },
    {
      dataField: "stockDetails",
      caption: t("stock_details"),
      dataType: "string",
      width: 250,
    },
  ];
  const formState = useSelector((state: RootState) => state.InventoryTransaction);


  return (
    <>
      <div className="flex items-end gap-2">
      </div>
      <div className="mt-4">
        <ErpDevGrid
          columns={gridColumns}
          // dataSource={warehouseStock}
          gridId="WStockDetailsDetailsGrid"
          keyExpr="warehouseID"
          height={400}
          hideGridAddButton={true}
          columnHidingEnabled={true}
          hideDefaultExportButton={true}
          hideDefaultSearchPanel={true}
          allowSearching={false}
          allowExport={false}
          hideGridHeader={false}
          enablefilter={false}
          hideToolbar={true}
          remoteOperations={false}
          enableScrollButton={false}
          ShowGridPreferenceChooser={false}
          showPrintButton={false}
          focusedRowEnabled={true}
          tabIndex={0}
          selectionMode="single"
          keyboardNavigation={{
            editOnKeyPress: false,
            enabled: true,
            enterKeyDirection: "row",
          }}
        />
      </div>
    </>
  );
};

export default visionDetails;
