import moment from "moment";

export interface SchemesData {
  schemeID: number;
  schemeCode: string;
  schemeName: string;
  dateFrom: string;
  dateTo: string;
  schemeType: string;
  itemProductID: number;
  qtyLimit: number;
  schemeRate: number;
  freeQty: number;
  freeItemProductID: number;
  schemeStatus: string;
  itemBatchNo: number;
  discPercentage: number;
}

export const initialSchemesData = {
  data: {
    schemeID: 0,
    schemeCode: '',
    schemeName: '',
    dateFrom: moment().local().format('YYYY-MM-DD'),
    dateTo: moment().add(10, 'days').local().format('YYYY-MM-DD'),
    schemeType: '',
    itemProductID: 0,
    qtyLimit: 0,
    schemeRate: 0,
    freeQty: 0,
    freeItemProductID: 0,
    schemeStatus: '',
    itemBatchNo: 0,
    discPercentage: 0,
  },
  validations: {},
};