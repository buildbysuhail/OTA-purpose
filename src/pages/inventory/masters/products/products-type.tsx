export interface productDto {
  product: DetailsDto
  productValidation: ProductValidationDto
  batch: ProductBatchInputDto
  moreInfo: ProductMoreInfoInputDto
  prices: ProductPriceInputDto[]
  units: ProductUnitInputDto[]
  nutrients: ProductNutrientsInputDto[]
  supplierProducts: SupplierProductsInputDto[]
  config: ProductLocalConfig
  multiUnits: UnitExistDto[] // newly created
}

export interface DetailsDto {
  productID?: number
  productCode?: string  //
  productName?: string //
  productGroupId?: number //
  productCategoryID?: number //
  supplyMethod?: string
  hsnCode?: string //
  commodityCode?: string //
  active?: boolean //
  aliasItemCode?: string
  aliasItemName?: string //
  remarks?: string
  unitID?: number
  minimumStock?: number //
  maximumStock?: number //
  reorderLevel?: number
  reorderQty?: number //
  secondLanguage?: string
  marginPercentage?: number
  canSale?: boolean //
  canPurchase?: boolean //
  canManufacture?: boolean
  itemType: string
  createdUserID?: number
  supplierID?: number
  taxCategoryID?: number //
  batchCriteria?: string //
  isRawMaterial?: boolean //
  isFinishedGood?: boolean //
  isWeighingScale?: boolean //
  unitQty?: number //
  packingSlip?: boolean
  financialYearID?: number
  manual: boolean // newly added
  groupCategory?: string // newly added
  section: string // newly added
  baseUnit: string // newly added
  upcBarcode: boolean // newly added
  mu: boolean // newly added
  mr: boolean // newly added
  purchasePrice: number // newly added
  salesPrice: number // newly added
  markup: number // newly added
  displayCost: number // newly added
  mrp: number // newly added
  opStock: number // newly added
  msp?: number // newly added
  stock?: number // newly added
  foreignLanguage?: string // newly added
  batchCriteriaType?: string // newly added
  productType?: string // newly added
  details?: string // newly added
  defaultVendor?: string // newly added
  avgCost?: number // newly added
  warehouseID?: number // newly added
  brandID: number // newly added
  specification: string // newly added
  expiryDate?: Date // newly added
  autoBarcode?: number // newly added
  batchNo: string // newly added
  netWeight: string // newly added
  unitName: string // newly added
  mfgDate?: Date // newly added
  location: string // newly added
  gatePass?: boolean // newly added
  hold?: boolean // newly added
  poFrequency?: boolean // newly added
  poFrequencyData?: string // newly added
  avgSales?: string // newly added
  avgRate?: string // newly added
  searchWith?: string // newly added
  searchInactive?: string // newly added
}

export interface ProductValidationDto {
  productName: string
  productGroupId: number
  unitID: number
  commodityCode: string
  taxCategoryID: number
  productCategoryID: number
  // batch
  defSalesUnitID: number
  defPurchaseUnitID: number
  defReportUnitID: number
  brandID: number
  salesPrice: string
  stdSalesPrice: string
}

export interface ProductLocalConfig {
  showProductDuplicateWarning: boolean
  showProductDetailesAfterSave: boolean
  blockConvertProductNameToUpperCase: boolean
  calculateMarkUpValue: boolean
  showDisplayCost: boolean
}

export interface ProductBatchInputDto {
  productID?: number
  productBatchID?: number
  manualBarcode: string
  brandID?: number
  stdPurchasePrice: number
  stdSalesPrice: number
  mrp: number
  msp?: number
  warehouseID?: number
  shelfID?: number
  specification: string
  batchNo: string
  modifiedUserID?: number
  isActive?: boolean
  mfgDate?: Date
  expiryDate?: Date
  margingPerc?: number
  supplierLedgerID?: number
  voucherType: string
  systemName: string
  unitID2?: number
  unit2Qty?: number
  unit2SalesRate?: number
  unit2MRP?: number
  autoBarcode?: number
  unitMBarCode: string
  unit3ID?: number
  unit3Qty?: number
  unit2Barcode: string
  unit3Barcode: string
  unit3SalesPrice?: number
  unit3MRP?: number
  unit2MinSalesRate?: number
  unit3MinSalesRate?: number
  basicUnitID: number
  prevBasicUnitID?: number
  defSalesUnitID?: number
  defPurchaseUnitID?: number
  defReportUnitID?: number
  location: string
  displayCost?: number
  modelNumber: string
  upcCode: string
  packing?: number
  packingUnitID?: number
  onlineStatus?: boolean
  openingStock?: number
  openingStockNOs?: number
  openingDate?: Date
  warrantyPeriod: string
  partNumber: string
  refItemID?: number
  refItemName: string
  landingCost?: number
  stockIN?: number
  createdUserID?: number
  isForm6_2?: boolean
  freeBatchID?: number
  gatePass?: boolean
  selectedProductBatchID?: number
  selectedUnitID?: number
  prevProductBatchID?: number
  supplierWiseBatchCreation?: boolean
  baseUnitRemarks: string
}

export type ProductBatchValidationDto = {}

export interface ProductMoreInfoInputDto {
  id?: number
  productId?: number
  notes1?: string
  notes2?: string
  notes3?: string
  notes4?: string
  notes5?: string
  notes6?: string
  notes7?: string
  notes8?: string
  notes9?: string
  notes10?: string
}

export type ProductMoreInfoValidationDto = {}

export interface ProductPriceOutputDto {
  salesPrice: number
  purchasePrice: number
  discountPerc: number
  categoryName: string
  unitName: string
  unitID: number
  priceCategoryID: number
  mrp: number
  profitAmt: number
}

export interface ProductPriceInputDto {
  productMultiPriceID: number
  productBatchID: number
  priceCategoryID: number
  salesPrice: number
  purchasePrice: number
  discountPerc: number
  unitID: number
  profitAmt: number
  mrp: number
  msp: number
}

export interface ProductPriceValidationDto {
  branchID: number
  productBatchID: number
  priceCategoryID: number
  productMultiPriceID: number
  salesPrice: string
  purchasePrice: string
  discountPerc: string
  unitID: number
  profitAmt: string
  mrp: string
  msp: string
}

export interface ProductUnitInputDto {
  productUnitID?: number
  productBatchID?: number
  unitID?: number
  multiFactor?: number
  barCode?: string
  sprice?: number
  description?: string
  descriptionFL?: string
  unitRemarks?: string
  gatePass?: boolean
  multiBarcodes?: string
}

export type ProductUnitValidationDto = {}

export interface UnitExistDto {
  productBatchID?: number
  unit1?: number
  unit2?: number
  unit3?: number
  unit4?: number
  unit5?: number
  unit6?: number
  unit7?: number
  unit8?: number
  unit9?: number
  unit10?: number
}

export interface UnitNameDto {
  unitName: string
}

export interface ProductNutrientsInputDto {
  nutrients?: string
  valuePerServing?: string
}

export type ProductNutrientsValidationsDto = {}

export interface SupplierProductsInputDto {
  ledgerID: number
  refCode: string
}

export type SupplierProductsValidationDto = {}