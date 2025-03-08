export interface ProductData {
  // Product basic info
  productCode: string;
  productName: string;
  productCategory: number | undefined;
  productGroup: number | undefined;
  groupCategory: number | undefined;
  section: number | undefined;
  baseUnit: number | undefined;
  unitQty: number;
  upcBarcode: boolean;
  mu: boolean;
  mr: boolean;
  taxCategory: number | undefined;
  isWeighingScaleItem: boolean;

  // Price info
  purchasePrice: number;
  salesPrice: number;
  markup: number;
  displayCost: number;
  mrp: number;
  opStock: number;
  msp: number;
  stock: number;

  // Additional info
  foreignLanguage: string;
  batchCriteria: boolean;
  batchCriteriaType: string;
  productType: string;
  kit: boolean;
  details: boolean;
  defaultVendor: number | undefined;
  avgCost: number;

  // Stock info
  stockMin: number;
  stockMax: number;
  reOrderQty: number;
  warehouse: number | undefined;
  brand: number | undefined;
  commodityCode: string;
  aliasName: string;
  specification: string;
  hsnCode: string;
  autoBarcode: string;
  batchNo: string;
  expDate: Date | null;
  mfgDate: Date | null;
  netWeight: number;
  unitName: string;
  location: number | undefined;

  // Checkboxes
  canPurchase: boolean;
  canSale: boolean;
  isFinishedGood: boolean;
  isRawMaterial: boolean;
  isActiveBatch: boolean;
  gatePass: boolean;
  hold: boolean;

  id?: number;
  createdUser?: string;
  createdDate?: string;
  modifiedUser?: string;
  modifiedDate?: string;
}

export const initialProductData = {
  data: {
    productCode: "",
    productName: "",
    productCategory: undefined,
    productGroup: undefined,
    groupCategory: undefined,
    section: undefined,
    baseUnit: undefined,
    unitQty: 1,
    upcBarcode: false,
    mu: false,
    mr: false,
    taxCategory: undefined,
    isWeighingScaleItem: false,

    purchasePrice: 0,
    salesPrice: 0,
    markup: 0,
    displayCost: 0,
    mrp: 0,
    opStock: 0,
    msp: 0,
    stock: 0,

    foreignLanguage: "",
    batchCriteria: false,
    batchCriteriaType: "",
    productType: "Inventory",
    kit: false,
    details: false,
    defaultVendor: undefined,
    avgCost: 0,

    stockMin: 0,
    stockMax: 0,
    reOrderQty: 0,
    warehouse: undefined,
    brand: undefined,
    commodityCode: "",
    aliasName: "",
    specification: "",
    hsnCode: "",
    autoBarcode: "",
    batchNo: "",
    expDate: new Date(),
    mfgDate: new Date(),
    netWeight: 0,
    unitName: "",
    location: undefined,

    canPurchase: true,
    canSale: true,
    isFinishedGood: false,
    isRawMaterial: false,
    isActiveBatch: true,
    gatePass: false,
    hold: false,

    id: undefined,
    createdUser: undefined,
    createdDate: undefined,
    modifiedUser: undefined,
    modifiedDate: undefined,
  },
  validations: {
    productCode: "",
    productName: "",
    productCategory: "",
    productGroup: "",
    groupCategory: "",
    section: "",
    baseUnit: "",
    unitQty: "",
    upcBarcode: "",
    mu: "",
    mr: "",
    taxCategory: "",
    isWeighingScaleItem: "",

    purchasePrice: "",
    salesPrice: "",
    markup: "",
    displayCost: "",
    mrp: "",
    opStock: "",
    msp: "",
    stock: "",

    foreignLanguage: "",
    batchCriteria: "",
    batchCriteriaType: "",
    productType: "",
    kit: "",
    details: "",
    defaultVendor: "",
    avgCost: "",

    stockMin: "",
    stockMax: "",
    reOrderQty: "",
    warehouse: "",
    brand: "",
    commodityCode: "",
    aliasName: "",
    specification: "",
    hsnCode: "",
    autoBarcode: "",
    batchNo: "",
    expDate: "",
    mfgDate: "",
    netWeight: "",
    unitName: "",
    location: "",

    canPurchase: "",
    canSale: "",
    isFinishedGood: "",
    isRawMaterial: "",
    isActiveBatch: "",
    gatePass: "",
    hold: "",

    id: "",
    createdUser: "",
    createdDate: "",
    modifiedUser: "",
    modifiedDate: "",
  },
};