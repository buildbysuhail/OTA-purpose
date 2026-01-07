import React, { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux/es/exports";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import Urls from "../../../../../redux/urls";
import { APIClient } from "../../../../../helpers/api-client";
import { RootState } from "../../../../../redux/store";

interface WStockListProps {
  closeModal: () => void;
  t: any;
  productName?: string;
  barCode?: string;
}

interface WarehouseStock {
  warehouseID: number;
  warehouseName: string;
  stock: number;
  stockDetails: string;
}

const api = new APIClient();
const WareHouseStockList: React.FC<WStockListProps> = ({ closeModal, t, productName, barCode }) => {
//   const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const dispatch = useDispatch()
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
  const [warehouseStock, setWarehouseStock] = useState<WarehouseStock[]>([]);
  const formState = useSelector((state: RootState) => state.InventoryTransaction);

  useEffect(() => {
  if (!barCode) return;

  const loadWarehouseStock = async () => {
    try {

      const res = await api.getAsync(`${Urls.inv_transaction_base}${formState.transactionType}/WareHouseStock/${barCode}`);
      setWarehouseStock(res);
    } catch (error) {
      console.error("Warehouse stock API error:", error);
      setWarehouseStock([]);
    } finally {
    }
  };

  loadWarehouseStock();
}, [barCode]);



  return (
    <>
      <div className="flex items-end gap-2">
        <div className="w-full flex items-center text-lg text-primary justify-center font-bold">{productName || t("no_product_selected")}</div>
      </div>
      <div className="mt-4">
        <ErpDevGrid
          columns={gridColumns}
          // dataUrl={`${Urls.stockTransfer_warehouseStock}/${barCode}`}
          dataSource={warehouseStock}
          gridId="WStockDetailsDetailsGrid"
          keyExpr="warehouseID"
          height={450}
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

export default WareHouseStockList;