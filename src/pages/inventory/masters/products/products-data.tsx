import { productDto } from "./products-type";

const initialProductData: productDto = {
  product: {
    productID: 1,
    productCode: "",
    productName: "",
    productGroupId: 0,
    productCategoryID: 0,
    supplyMethod: "",
    hsnCode: "",
    commodityCode: "",
    active: true,
    aliasItemCode: "",
    aliasItemName: "",
    remarks: "",
    unitID: 0,
    minimumStock: 0,
    maximumStock: 0,
    reorderLevel: 0,
    reorderQty: 0,
    secondLanguage: "",
    marginPercentage: 0,
    canSale: true,
    canPurchase: true,
    canManufacture: false,
    itemType: "",
    createdUserID: 0,
    supplierID: 0,
    taxCategoryID: 0,
    batchCriteria: "",
    isRawMaterial: false,
    isFinishedGood: true,
    isWeighingScale: false,
    unitQty: 0,
    packingSlip: true,
    financialYearID: 0,
    manual: true, // newly added
    groupCategory: "", // newly added
    section: "", // newly added
    baseUnit: "", // newly added
    upcBarcode: true, // newly added
    mu: true, // newly added
    mr: true, // newly added
    purchasePrice: 0, // newly added
    salesPrice: 0, // newly added
    markup: 0, // newly added
    displayCost: 0, // newly added
    mrp: 0, // newly added
    opStock: 0, // newly added
    msp: 0, // newly added
    stock: 0, // newly added
    foreignLanguage: "", // newly added
    batchCriteriaType: "", // newly added
    productType: "", // newly added
    details: "", // newly added
    defaultVendor: "", // newly added
    avgCost: 0, // newly added
    warehouseID: 0, // newly added
    brandID: 0, // newly added
    specification: "", // newly added
    expiryDate: new Date("2024-01-01"), // newly added
    autoBarcode: 0, // newly added
    batchNo: "", // newly added
    netWeight: "", // newly added
    unitName: "", // newly added
    mfgDate: new Date("2023-01-01"), // newly added
    location: "", // newly added
    gatePass: true, // newly added
    hold: true, // newly added
    poFrequency: true, // newly added
    poFrequencyData: "", // newly added
    avgSales: "", // newly added
    avgRate: "", // newly added
    searchWith: "", // newly added
    searchInactive: "", // newly added
  },
  productValidation: {
    productName: "",
    productGroupId: 0,
    unitID: 0,
    commodityCode: "",
    taxCategoryID: 0,
    productCategoryID: 0,
    defSalesUnitID: 0,
    defPurchaseUnitID: 0,
    defReportUnitID: 0,
    brandID: 0,
    salesPrice: "",
    stdSalesPrice: ""
  },
  batch: {
    productID: 0,
    productBatchID: 0,
    manualBarcode: "",
    brandID: 0,
    stdPurchasePrice: 0,
    stdSalesPrice: 0,
    mrp: 0,
    warehouseID: 0,
    shelfID: 0,
    specification: "",
    batchNo: "",
    modifiedUserID: 0,
    isActive: true,
    mfgDate: new Date("2023-01-01"),
    expiryDate: new Date("2024-01-01"),
    margingPerc: 0,
    supplierLedgerID: 0,
    voucherType: "",
    systemName: "",
    unitID2: 0,
    unit2Qty: 0,
    unit2SalesRate: 0,
    unit2MRP: 0,
    autoBarcode: 0,
    unitMBarCode: "",
    unit3ID: 0,
    unit3Qty: 0,
    unit2Barcode: "",
    unit3Barcode: "",
    unit3SalesPrice: 0,
    unit3MRP: 0,
    unit2MinSalesRate: 0,
    unit3MinSalesRate: 0,
    basicUnitID: 0,
    defSalesUnitID: 0,
    defPurchaseUnitID: 0,
    defReportUnitID: 0,
    location: "",
    displayCost: 0,
    modelNumber: "",
    upcCode: "",
    packing: 0,
    packingUnitID: 0,
    onlineStatus: true,
    openingStock: 0,
    openingStockNOs: 0,
    openingDate: new Date("2023-01-01"),
    warrantyPeriod: "",
    partNumber: "",
    refItemID: 0,
    refItemName: "",
    landingCost: 0,
    stockIN: 0,
    createdUserID: 0,
    isForm6_2: false,
    freeBatchID: 0,
    gatePass: true,
    selectedProductBatchID: 0,
    selectedUnitID: 0,
    prevProductBatchID: 0,
    supplierWiseBatchCreation: true,
    baseUnitRemarks: ""
  },
  moreInfo: {
    id: 0,
    productId: 0,
    notes1: "",
    notes2: "",
    notes3: "",
    notes4: "",
    notes5: "",
    notes6: "",
    notes7: "",
    notes8: "",
    notes9: "",
    notes10: ""
  },
  prices: [
    {
      productMultiPriceID: 0,
      productBatchID: 0,
      priceCategoryID: 0,
      salesPrice: 0,
      purchasePrice: 0,
      discountPerc: 0,
      unitID: 0,
      profitAmt: 0,
      mrp: 0,
      msp: 0
    }
  ],
  units: [
    {
      productUnitID: 0,
      productBatchID: 0,
      unitID: 0,
      multiFactor: 0,
      barCode: "",
      sprice: 0,
      description: "",
      descriptionFL: "",
      unitRemarks: "",
      gatePass: true,
      multiBarcodes: ""
    }
  ],
  nutrients: [
    {
      nutrients: "",
      valuePerServing: ""
    }
  ],
  supplierProducts: [
    {
      ledgerID: 0,
      refCode: ""
    }
  ],
  multiUnits: [
    {
      productBatchID: 0,
      unit1: 0,
      unit2: 0,
      unit3: 0,
      unit4: 0,
      unit5: 0,
      unit6: 0,
      unit7: 0,
      unit8: 0,
      unit9: 0,
      unit10: 0,
    }
  ],
  config: {
    showProductDuplicateWarning: true,
    showProductDetailesAfterSave: true,
    blockConvertProductNameToUpperCase: false,
    calculateMarkUpValue: true,
    showDisplayCost: true
  },
};

export default initialProductData;