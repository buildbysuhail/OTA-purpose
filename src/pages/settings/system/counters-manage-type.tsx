export interface CounterData {
  counterName: string;
  descriptions: string;
  cashLedgerID: number;
  warehouseID: number;
  vrPrefix: string;
  maintainShift: boolean;
}

export const initialDataCounter = {
  data: {
    counterName: "",
    descriptions: "",
    cashLedgerID: 0,
    warehouseID: 0,
    counterID: 0,
    vrPrefix: "",
    maintainShift: false,
  },
  validations: {
    counterName: "",
    descriptions: "",
    cashLedgerID: "",
    warehouseID: "",
    vrPrefix: "",
    maintainShift: "",
  },
};
