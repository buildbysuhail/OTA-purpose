export interface CounterData {
  counterName: string;
  descriptions: string;
  cashLedgerID: number;
  warehouseID: number;
  maintainShift: boolean;
}

export const initialDataCounter = {
  data: {
    counterName: "",
    descriptions: "",
    cashLedgerID: 0,
    warehouseID: 0,
    counterID: 0,
    maintainShift: true,
  },
  validations: {
    counterName: "",
    descriptions: "",
    cashLedgerID: "",
    warehouseID: "",
    maintainShift: "",
  },
};
