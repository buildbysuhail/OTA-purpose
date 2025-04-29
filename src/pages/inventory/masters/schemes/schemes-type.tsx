import moment from "moment";

export interface SchemesData {
  schemeId: number | null;
  schemeCode: string;
  schemeName: string;
  dateFrom: string;
  dateTo: string;
  schemeType: string;
  itemProductId: number;
  qtyLimit: number;
  schemeRate: number;
  freeQty: number;
  freeItemProductId: number;
  schemeStatus: string;
  itemBatchNo: number;
  discPerc: number;
}

export const initialSchemesData = {
  data: {
    schemeId: 0,
  schemeCode: '',
  schemeName: '',
  dateFrom: moment().local().toDate(),
  dateTo: moment().add(10, 'days').local().toDate(),
  schemeType: '',
  itemProductId: 0,
  qtyLimit: 0,
  schemeRate: 0,
  freeQty: 0,
  freeItemProductId: 0,
  schemeStatus: -2,
  itemBatchNo: 0,
  discPerc: 0,
  },
  validations: {
    vehicleName: "",
    vehicleNumber: ""
  },
};
