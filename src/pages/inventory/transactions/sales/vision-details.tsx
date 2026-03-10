import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { APIClient } from "../../../../helpers/api-client";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { RootState } from "../../../../redux/store";
import Urls from "../../../../redux/urls";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";


interface visionDetailsProps {
  closeModal: () => void;
  t: any;
}

const api = new APIClient();
const formState = useSelector((state: RootState) => state.InventoryTransaction);
const visionDetails: React.FC<visionDetailsProps> = ({closeModal, t}) => {
  const gridColumns: DevGridColumn[] = [
    {
      dataField: "CType",
      caption: t("..."),
      dataType: "string",
      width: 150,
    },
    {
      dataField: "RE_SPH",
      caption: t("sph"),
      dataType: "string",
      width: 150,
    },
    {
      dataField: "RE_CYL",
      caption: t("cyl"),
      dataType: "string",
      width: 250,
    },
    {
      dataField: "RE_AXIS",
      caption: t("axis"),
      dataType: "string",
      width: 250,
    },

    {
      dataField: "RE_VN",
      caption: t("vn"),
      dataType: "string",
      width: 250,
    },

    {
      dataField: "LE_SPH",
      caption: t("sph"),
      dataType: "string",
      width: 250,
    },

    {
      dataField: "LE_CYL",
      caption: t("cyl"),
      dataType: "string",
      width: 250,
    },

    {
      dataField: "LE_AXIS",
      caption: t("axis"),
      dataType: "string",
      width: 250,
    },

    {
      dataField: "LE_VN",
      caption: t("vn"),
      dataType: "string",
      width: 250,
    },
  ];
  
 
  return (
    <>
      <div className="flex items-end gap-2">
      </div>
      <div className="mt-4">
        <ErpDevGrid
          columns={gridColumns}
          // dataSource={warehouseStock}
          gridId="visionDetailGrid"
          keyExpr="CType"
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
    <div className="flex justify-center items-center gap-3">
      <ERPInput
        localInputBox={formState?.userConfig?.inputBoxStyle}
        id="remarks"
        label={t("Remarks")}
        type="text"
        className="p-2 w-96 !mb-4"
        placeholder={t("enter_remarks")}
  
      />

      <ERPButton
        title={t("Save")}
        variant="primary"
      />
    </div>
    </>
  );
};

export default visionDetails;
