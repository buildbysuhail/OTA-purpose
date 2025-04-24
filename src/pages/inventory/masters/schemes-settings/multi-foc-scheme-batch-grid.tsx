// src/components/MultiFocSchemeBatchGrid.tsx

import React from "react";
import { DataGrid, Column, Paging, Selection, KeyboardNavigation } from "devextreme-react/data-grid";
import { useTranslation } from "react-i18next";

interface Props {
  show: boolean;
  dataSource: any[];
  onKeyDown?: (e: any) => void;
  onContentReady?: (e: any) => void;
  gridRef?: React.RefObject<any>;
}

const MultiFocSchemeBatchGrid: React.FC<Props> = ({
  show,
  dataSource,
  onKeyDown,
  onContentReady,
  gridRef
}) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className="w-full">
      <DataGrid
        ref={gridRef}
        loadPanel={{ enabled: false }}
        dataSource={dataSource}
        height={300}
        keyExpr="productBatchID"
        showBorders
        showRowLines
        remoteOperations={{ filtering: true, paging: true, sorting: true }}
        onKeyDown={onKeyDown}
        onContentReady={onContentReady}
      >
        <KeyboardNavigation editOnKeyPress={false} enterKeyAction="moveFocus" enterKeyDirection="row" />
        <Paging pageSize={10} />
        <Selection mode="single" />
        <Column dataField="productBatchID" caption={t("productBatchID")} dataType="number" width={150} />
        <Column dataField="productCode" caption={t("productCode")} dataType="string" width={150} />
        <Column dataField="autoBarcode" caption={t("autoBarcode")} dataType="string" width={150} />
        <Column dataField="sPrice" caption={t("sprice")} dataType="number" width={100} />
        <Column dataField="pPrice" caption={t("pPrice")} dataType="number" width={100} />
        <Column dataField="mrp" caption={t("mrp")} dataType="number" width={100} />
        <Column dataField="stock" caption={t("stock")} dataType="number" width={100} />
        <Column dataField="unitID" caption={t("unitID")} dataType="number" minWidth={100} />
        <Column dataField="unit" caption={t("unit")} dataType="string" minWidth={100} />
        <Column dataField="brandID" caption={t("brandID")} dataType="number" minWidth={100} />
        <Column dataField="brandName" caption={t("brandName")} dataType="string" minWidth={100} />
      </DataGrid>
    </div>
  );
};

export default MultiFocSchemeBatchGrid;
