export type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | symbol
  | bigint;

// Limit recursion to 5 levels max (safe for TS)
export type Prev = [never, 0, 1, 2, 3, 4, 5];

// Get dot notation keys safely
export type DotNestedKeys<T, Depth extends number = 5> = [Depth] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T & string]: T[K] extends Primitive | Array<any>
        ? K
        : K | `${K}.${DotNestedKeys<T[K], Prev[Depth]>}`;
    }[keyof T & string]
  : never;

// Get value by dot path
export type PathValue<
  T,
  P extends string
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;
export type ProductFieldPath = DotNestedKeys<productDto>;
export interface productDto {
  product: DetailsDto;
  productValidation: ProductValidationDto;
  batch: ProductBatchInputDto;
  moreInfo: ProductMoreInfoInputDto;
  prices: ProductPriceInputDto[];
  units: ProductUnitInputDto[];
  nutrients: ProductNutrientsInputDto[];
  supplierProducts: SupplierProductsInputDto[];
  config: ProductLocalConfig;
  multiUnits: ProductUnitDto[]; // newly created
}

export interface DeetailsDto {}

export interface DetailsDto {
  productID?: number; // ProductID: long?
  productCode?: string; // ProductCode: string?
  productName?: string; // ProductName: string?
  productGroupID?: number; // ProductGroupId: long?
  productCategoryID?: number; // ProductCategoryID: long?
  supplyMethod?: string; // SupplyMethod: string?
  hsnCode?: string; // HSNCode: string?
  commodityCode?: string; // CommodityCode: string?
  isActive?: boolean; // Active: bool?
  aliasItemCode?: string; // AliasItemCode: string?
  aliasItemName?: string; // AliasItemName: string?
  remarks?: string; // Remarks: string?
  unitID?: number; // UnitID: long?
  minimumStock?: number; // MinimumStock: decimal?
  maximumStock?: number; // MaximumStock: decimal?
  reorderLevel?: number; // ReorderLevel: decimal?
  reorderQty?: number; // ReorderQty: decimal?
  secondLanguage?: string; // SecondLanguage: string?
  marginPercentage?: number; // MarginPercentage: decimal?
  canSale?: boolean; // CanSale: bool?
  canPurchase?: boolean; // CanPurchase: bool?
  canManufacture?: boolean; // CanManufacture: bool?
  itemType?: string; // ItemType: string?
  createdUserID?: number; // CreatedUserID: long?
  supplierID?: number; // SupplierID: long?
  taxCategoryID?: number; // TaxCategoryID: long?
  batchCriteria?: string; // BatchCriteria: string?
  isRawMaterial?: boolean; // IsRawMaterial: bool?
  isFinishedGood?: boolean; // IsFinishedGood: bool?
  isWeighingScale?: boolean; // IsWeighingScale: bool?
  unitQty?: number; // UnitQty: int?
  packingSlip?: boolean; // PackingSlip: bool?
  financialYearID?: number; // FinancialYearID: long?
  unitName?: string; // UnitName: string?
  mrp?: number; // MRP: decimal?
  autoBarcode?: string; // UnitName: string?
  stdPurchasePrice?: number; // MRP: decimal?
  stdSalesPrice?: number; // MRP: decimal?
  basicUnitID: number;
  hold?: boolean; // newly added
  active?:boolean; // newly added
}

export interface ProductValidationDto {
  productName: string;
  productGroupId: string;
  unitID: string;
  commodityCode: string;
  taxCategoryID: string;
  productCategoryID: string;
  // batch
  defSalesUnitID: string;
  defPurchaseUnitID: string;
  defReportUnitID: string;
  brandID: string;
  salesPrice: string;
  stdSalesPrice: string;
}

export interface ProductLocalConfig {
  showProductDuplicateWarning: boolean;
  showProductDetailesAfterSave: boolean;
  blockConvertProductNameToUpperCase: boolean;
  calculateMarkUpValue: boolean;
  showDisplayCost: boolean;
}

export interface ProductBatchInputDto {
  productID?: number;
  productBatchID?: number;
  manualBarcode: string;
  brandID?: number;
  stdPurchasePrice: number;
  stdSalesPrice: number;
  mrp: number;
  msp?: number;
  warehouseID?: number;
  shelfID?: number;
  specification: string;
  batchNo: string;
  modifiedUserID?: number;
  isActive?: boolean;
  mfgDate?: Date;
  expiryDate?: Date;
  margingPerc?: number;
  supplierLedgerID?: number;
  voucherType: string;
  systemName: string;
  unitID2?: number;
  unit2Qty?: number;
  unit2SalesRate?: number;
  unit2MRP?: number;
  autoBarcode?: number;
  unitMBarCode: string;
  unit3ID?: number;
  unit3Qty?: number;
  unit2Barcode: string;
  unit3Barcode: string;
  unit3SalesPrice?: number;
  unit3MRP?: number;
  unit2MinSalesRate?: number;
  unit3MinSalesRate?: number;
  basicUnitID: number;
  prevBasicUnitID?: number;
  defSalesUnitID?: number;
  defPurchaseUnitID?: number;
  defReportUnitID?: number;
  location: string;
  displayCost?: number;
  modelNumber: string;
  upcCode: string;
  packing?: number;
  packingUnitID?: number;
  onlineStatus?: boolean;
  openingStock?: number;
  openingStockNOs?: number;
  openingDate?: Date;
  warrantyPeriod: string;
  partNumber: string;
  refItemID?: number;
  refItemName: string;
  landingCost?: number;
  stockIN?: number;
  createdUserID?: number;
  isForm6_2?: boolean;
  freeBatchID?: number;
  gatePass?: boolean;
  selectedProductBatchID?: number;
  selectedUnitID?: number;
  prevProductBatchID?: number;
  supplierWiseBatchCreation?: boolean;
  baseUnitRemarks: string;
}

export type ProductBatchValidationDto = {};

export interface ProductMoreInfoInputDto {
  id?: number;
  productId?: number;
  notes1?: string;
  notes2?: string;
  notes3?: string;
  notes4?: string;
  notes5?: string;
  notes6?: string;
  notes7?: string;
  notes8?: string;
  notes9?: string;
  notes10?: string;
}

export type ProductMoreInfoValidationDto = {};

export interface ProductPriceOutputDto {
  salesPrice: number;
  purchasePrice: number;
  discountPerc: number;
  categoryName: string;
  unitName: string;
  unitID: number;
  priceCategoryID: number;
  mrp: number;
  profitAmt: number;
}

export interface ProductPriceInputDto {
  productMultiPriceID: number;
  productBatchID: number;
  priceCategoryID: number;
  salesPrice: number;
  purchasePrice: number;
  discountPerc: number;
  unitID: number;
  profitAmt: number;
  mrp: number;
  msp: number;
}

export interface ProductPriceValidationDto {
  branchID: number;
  productBatchID: number;
  priceCategoryID: number;
  productMultiPriceID: number;
  salesPrice: string;
  purchasePrice: string;
  discountPerc: string;
  unitID: number;
  profitAmt: string;
  mrp: string;
  msp: string;
}

export interface ProductUnitInputDto {
  productUnitID?: number;
  productBatchID?: number;
  unitID?: number;
  unit?: string;
  multiFactor?: number;
  barCode?: string;
  description?: string;
  descriptionFL?: string;
  unitRemarks?: string;
  gatePass?: boolean;
  multiBarcodes?: string;
  salesPrice: number;
  mrp: number;
  msp: number;
}

export type ProductUnitValidationDto = {};
export class ProductUnitDto {
  unitId?: number | null;
  multiFactor?: number | null;
  barCode?: string | null;
  sprice: number = 0;
  description: string = "";
  descriptionFL: string = "";
  unitRemarks: string = "";

  productUnitId?: number | null;
  productBatchId?: number | null;
  gatePass?: boolean | null;
  multiBarcodes?: string | null;

  unitName?: string | null;

  get unitDescription(): string {
    return `${this.unitName}:${this.multiFactor}`;
  }
}

export interface UnitExistDto {
  productBatchID?: number;
  unit1?: number;
  unit2?: number;
  unit3?: number;
  unit4?: number;
  unit5?: number;
  unit6?: number;
  unit7?: number;
  unit8?: number;
  unit9?: number;
  unit10?: number;
}

export interface UnitNameDto {
  unitName: string;
}

export interface ProductNutrientsInputDto {
  nutrients?: string;
  valuePerServing?: number;
}

export type ProductNutrientsValidationsDto = {};

export interface SupplierProductsInputDto {
  ledgerID: number;
  refCode: string;

  supplierCode: string;
  supplier: string;
}

export type SupplierProductsValidationDto = {};
