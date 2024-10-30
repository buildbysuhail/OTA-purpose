export interface WarehouseData {
  warehouseID: number,
  warehouseName: string,
  shortName: string,
  remarks: string,
  warehouseType: string,
  isStockWarehouse: true,
  isCommon: true,
  cashLedgerID: number,
  negativeStock: string
}

export const initialWarehouseData = {
  data: {
    warehouseID: 0,
    warehouseName: "",
    shortName: "",
    remarks: "",
    warehouseType: "",
    isStockWarehouse: true,
    isCommon: true,
    cashLedgerID: 0,
    negativeStock: ""
  },
  validations: {
    warehouseName: "",
    shortName: "",
    warehouseType: "",
    cashLedgerID: ""
  },
};
