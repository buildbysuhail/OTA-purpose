export interface PrintMasterDto {
  invTransactionMasterID: number;
  branchID: number;
  financialYearID: number;
  counterID: number;
  salesMan: number;
  inventoryLedgerID: number;
  ledgerID: number;
  referalAgentID?: number | null;

  address1: string;
  address2: string;
  address3: string;
  address4: string;

  voucherPrefix: string;
  voucherNumber: string;
  dailyVoucherNumber: string;
  transactionDate: Date;
  remarks: string;

  fromWarehouseID?: number | null;
  toWarehouseID?: number | null;

  createdUserID: number;
  modifiedUserID: number;
  systemDateTime: Date;

  voucherType: string;
  voucherForm: string;
  purchaseInvoiceNumber: string;
  purchaseInvoiceDate?: Date | null;
  quotationNumber: string;
  quotationDate?: Date | null;
  dueDate?: Date | null;

  deliveryNoteNumber: string;
  refNoSales: string;
  deliveryDate?: Date | null;
  refDateSales?: Date | null;

  despatchDocumentNumber: string;
  despatchDate?: Date | null;

  vehicelID?: number | null;
  salesManID?: number | null;
  deliveryManID?: number | null;
  driverID?: number | null;

  vatAmount: number;
  totalVat: number;
  vatPercentage: number;
  totalGross: number;

  privRedeem: number;
  privAddAmount: number;
  privCardID?: number | null;

  netTotal: number;
  totalDiscount: number;
  sumofDiscount: number;
  totItemDiscPlusBillDisc: number;
  billDiscount: number;

  adjustmentAmount: number;
  grandTotal: number;
  totalProfit: number;
  roundAmount: number;

  cashReceived: number;
  advanceAmt: number;
  cashReturned: number;
  shortageAmount: number;
  salesManIncentive: number;

  gatePassNo: string;
  displayOrderNumber: string;

  cashAmt: number;
  bankAmt: number;
  creditAmt: number;

  oldInvTransactionID?: number | null;
  createdDate: Date;
  modifiedDate: Date;
  isActive: boolean;

  tokenNumber: string;
  inout: string;
  fcAmount: number;

  customerType: string;
  taxOnDiscount: boolean;

  counterName: string;
  salesManCode: string;
  salesManName: string;
  costCentreName: string;
  projectName: string;
  projectAddress1: string;
  projectAddress2: string;
  projectAddress3: string;
  privCardNumber: string;

  userName: string;
  orderNumber: string;
  orderDate?: Date | null;
  srAmount: number;
  warehouseName: string;
  fromWarehouseName: string;
  toWarehouseName: string;
  salesManEmail: string;
  salesManMobile: string;
  referenceNumber: string;
  mannualInvoiceNumber: string;
  transactionDateWithTime: Date;
  couponAmt: number;
  noofItems: number;
  tableLocation: string;
  tableNo: string;
  seatNumber: string;

  exchangeRate: number;
  grandTotalFC: number;
  totalDiscountFC: number;

  priceCategoryName: string;

  master2Data: InvMaster2ForPrint;
  master3Data: InvMaster3ForPrint;
  vehicleData: VehicleDetailsForPrint;
  partyData: PartyDetailsForPrint;
  companyData: CompanyDetailsForPrint;
  opDVData: OpticalDetailsDV;
  opADDData: OpticalDetailsADD;
  opCLData: OpticalDetailsCL;
  eInvoiceData: EInvoiceDetailsForPrint;
  multiPaymentData: MultiPaymentForPrint;
  accTransactionMasterID: number;
  departmentID: number;
  costCentreID: number;
  billwiseMasterID: number;
  employeeID: number;
  invTransactionID: number;
  prevTransDate?: string;         // ISO string
  bankDate: string;               // ISO string
  referenceDate: string;          // ISO string
  particulars: string;
  totalDebit?: number;
  billwiseTotalAdjAmt?: number;
  billwiseAdjAmt?: number;
  totalCredit?: number;
  totDiscount?: number;
  empIncentive?: number;
  commonNarration: string;
  formType: string;
  debitNoteTransID: number;
  creditNoteTransID: number;
  currencyID: number;
  accTransDetailID: number;
  adjustedTransDetailID: number;
  currencyRate?: number;
  isPosted: boolean;
  randomKey: number;
  onlineTrans: string;
  isEdit: boolean;
  chequeStatus: string;
  checkBouncedDate?: string;      // ISO string
  drCr: string;
  isSalesView: boolean;
  refBranchID: number;
  uuid: string;

  oldAccTransactionMasterID?: number;
  actionStatus?: string;
  counterShiftID?: number;
  isLocked?: boolean;
  editId?: number;

  notes: string;
  masterAccount: string;
  employeeName: string;
  employeeCode: string;
  branch: string;

  netAmount: number;
  returnAmount: number;
}

export interface InvMaster2ForPrint {
  cardTip: number;
  cashTip: number;
  creditCardDetails: string;
  notes1: string;
  notes2: string;
}

export interface InvMaster3ForPrint {
  shipLegalName: string;
  shipTradeName: string;
  shipAddress1: string;
  shipAddress2: string;
  shipGstIn: string;
}

export interface PartyDetailsForPrint {
  partyName: string;
  partyDisplayName: string;
  partyCode: string;
  officePhone: string;
  workPhone: string;
  mobilePhone: string;
  contactPhone: string;
  faxNumber: string;
  partyAddress2: string;
  partyAddress3: string;
  partyAddress4: string;
  partyStreet: string;
  partyCity: string;
  partyDistrict: string;
  partyBuildingNo: string;
  partyPostalCode: string;
  partyAdditionalNo: string;
  stateCode: string;
  stateName: string;
  webURL: string;
  email: string;
  taxNumber: string;
  partyCRNumber: string;
  partyType: string;
  partyNameInArabic: string;
  partyName2: string;
  creditDays: number;
  partyAdditionalNumber: string;
  partyBuildingNumber: string;
  partyCitySubDivision: string;
  partyCountrySubDivision: string;
  partyCountry: string;
}

export interface CompanyDetailsForPrint {
  companyRegistredNameEnglish: string;
  companyRegistredNameArabic: string;
  companyTaxRegNumber: string;
  companyCRNumber: string;
  companyBuildingNo: string;
  companyStreetName: string;
  companyDistrict: string;
  companyCity: string;
  companyPostalCode: string;
  companyAdditionalNo: string;
  companyCountry: string;
  companyEmail: string;
  companyTelephone: string;
  companyMobile: string;
}

export interface VehicleDetailsForPrint {
  vehicleName: string;
  vehicleNumber: string;
  vehicleModel: string;
  vehicleCapacity: string;
  vehicleManufacturer: string;
  vehicleOwner: string;
  vehicleColor: string;
  vehicleOdometer: string;
  vehicleRemarks: string;
  driver: string;
}

export interface OpticalDetailsDV {
  dvREAXIS: number;
  dvRECYL: number;
  dvRESPH: number;
  dvREVn: number;
  dvLECYL: number;
  dvLESPH: number;
  dvLEAXIS: number;
  dvLEVN: number;
  dvRemarks: string;
  dvVisionType: string;
}

export interface OpticalDetailsCL {
  clREAXIS: number;
  clRECYL: number;
  clRESPH: number;
  clREVn: number;
  clLECYL: number;
  clLESPH: number;
  clLEAXIS: number;
  clLEVN: number;
  clRemarks: string;
  clVisionType: string;
}

export interface OpticalDetailsADD {
  addREAXIS: number;
  addRECYL: number;
  addRESPH: number;
  addREVn: number;
  addLECYL: number;
  addLESPH: number;
  addLEAXIS: number;
  addLEVN: number;
  addRemarks: string;
  addVisionType: string;
}

export interface EInvoiceDetailsForPrint {
  iqr: string;
  eInvoiceQRCode: string;
  acknowledgementNumber: string;
  acknowledgementDate?: Date | null;
  irn: string;
}

export interface PrintDetailDto {
  slNo: number;
  invTransactionDetailID: number;
  invTransactionMasterID: number;
  productBatchID: number;
  productDescription: string;
  quantity: number;
  qtyInBaseUnit: number;
  baseUnitUnitPrice: number;
  taxIncludedBasePrice: number;
  baseQty: number;
  free: number;
  qtyInNumbers: number;
  unitID: number;
  totalQty: number;
  barcodeQty: number;
  unitPrice: number;
  valuationPrice: number;
  rateWithTax: number;
  grossValue: number;
  discountPer1: number;
  discountAmt1: number;
  totalDiscount: number;
  vatPercentage: number;
  vat: number;
  netValue: number;
  taxIncludedPrice: number;
  cstPerc: number;
  cst: number;
  netAmount: number;
  costPerItem: number;
  totalProfit: number;
  marginPer: number;
  marginAmt: number;
  stdSalesPrice: number;
  mrp: number;
  invStatus: string;
  salesManID: number;
  qtyIn: number;
  qtyOut: number;
  qtyNosIn: number;
  qtyNosOut: number;
  adjQty: number;
  adjQtyNos: number;
  modelNo: string;
  specification: string;
  color: string;
  autoBarcode: string;
  mannualBarcode: string;
  mfgDate?: string; // ISO string

  brandName: string;
  brandID: number;
  brandShortName: string;

  sVatPerc: number;
  pVatPerc: number;
  taxCategoryName: string;

  productCode: string;
  productName: string;
  hsnCode: string;
  commodityCode: string;
  itemAliasCode: string;
  itemAlias: string;
  itemNameinSecondLanguage: string;
  arabicName: string;

  batchStdSalesPrice: number;
  stdPurchasePrice: number;
  batchMRP: number;
  modelNumber: string;
  batchSpecification: string;
  upcCode: string;
  packing: string;
  partNumber: string;
  productColour: string;
  warranty: string;

  productCategoryCode: string;
  productCategoryName: string;

  unitCode: string;
  unitName: string;
  unitRemarks: string;

  groupName: string;
  serialNumber: string;
  location: string;
  salesValue: number;
  unitSalesValue: number;
  unitQty: number;
  additionalExpense: number;
  scannedBarcode: string;
  unitPriceFC: number;
  grossFC: number;
  netValueFC: number;
  netAmountFC: number;
  totalDiscountFC: number;
  exchangeRate: number;
  productUnitRemarks: string;
  warehouseID: number;
  warehouse: string;
  supplierReferenceProductCode: string;
  batchNo: string;
  expiryDate?: string; // ISO string

  schemeDiscAmt: number;
  schemeDiscPerc: number;
  memo: string;

  stock: number;
  netWeight: number;
  netWeightUnitName: string;

  productNotes1: string;
  productNotes2: string;
  productNotes3: string;
  productNotes4: string;

  itemType: string;
  gatePass: number;
  stockDetails: string;

  voucherNumber: string;
  dailyVoucherNumber: string;
  voucherType: string;
  branchID: number;
  counterID: number;
  partyName: string;
  vatAmount: number;
  billDiscount: number;
  grandTotal: number;
  roundAmount: number;
  cashReceived: number;
  advanceAmt: number;
  cashReturned: number;
  salesManIncentive: number;
  adjustmentAmount: number;

  branch: string;

  siNo: number;
  accTransactionDetailID: number;

  ledgerCode: string;
  accountName: string;
  relatedLedgerCode: string;
  particulars: string;
  particularLedgerCode: string;

  ledgerID: number;
  relatedLedgerID: number;

  debit?: number;
  credit?: number;
  amount: number;

  narration: string;
  discount?: number;
  incentives?: number;
  adjAmount?: number;

  bankDate?: string; // ISO string
  chequeNumber: string;
  checkStatus: string;
  checkBouncedDate?: string; // ISO string
  chequeDate?: string; // ISO string

  billwiseDetails: string;

  ledgerNameArabic: string;
  relatedLedgerNameArabic: string;

  costCentreName: string;

  txp_PartyName: string;
  txp_TaxNo: string;
  txp_TaxPercentage?: number;
  txp_TaxAmount?: number;
  txp_TaxableAmount?: number;
  txp_RefNo: string;
  txp_RefDate?: string; // ISO string

  detail2Data: InvDetail2ForPrint;
}

export interface InvDetail2ForPrint {
  cgst: number;
  cgstPerc: number;
  sgst: number;
  sgstPerc: number;
  igst: number;
  igstPerc: number;
  cessAmt: number;
  cessPerc: number;
  additionalCess: number;
  additionalCessPerc: number;
  gstPerc: number;
}

export interface PrintResponse {
  master: PrintMasterDto;
  details: PrintDetailDto[];

  ledgerBalance: number;
  previousLedgerBalance: number;
  loyaltyCardBalance: number;

  totalTaxableValue0Percent: number;
  totalTaxableValue5Percent: number;
  totalTaxableValue15Percent: number;

  totalTaxValue5Percent: number;
  totalTaxValue15Percent: number;

  printCount: number;

  configData: EInvoiceIntegrationSettings;

  isCashInHandLedger: boolean;
  isLedgerUnderBank: boolean;
  isLedgerUnderCashOrBank: boolean;

  salesBillNumbers: string;
  salesBillAmounts: string;
  salesRetBillNumbers: string;
  salesRetBillAmounts: string;
  custom: PrintCustomFields;
}

export interface EInvoiceIntegrationSettings {
  branchId?: number;
  otp?: string;
  privateKey?: string;
  csrConfig?: string;
  publicKey?: string;
  csr?: string;
  complienceCsidToken?: string;
  complianceCsidSecret?: string;
  complianceReqId?: string;
  prodCertificate?: string;
  productionCsidToken?: string;
  productionCsidSecret?: string;
  productionReqId?: string;
  generatedDate?: string;   // ISO-8601 string, e.g. "2025-09-02T12:34:56Z"
  isSimulation?: boolean;
  systemCode?: string;
}

export interface MultiPaymentForPrint {
  cardAmt: number;
  upi: number;
}

export interface PrintCustomFields {
  // Stream & Current
  streamReader: any | null;
  currentLine: string;
  salesBillNumbers: string;
  salesRetBillNumbers: string;
  billAmounts: string;
  retBillAmounts: string;
  currentSettingsArray: any[];

  // Print settings
  backWardLines: number;
  ejectLines: number;
  linesPerPage: number;
  minLinesPerPage: number;
  linesBetweenPages: number;
  width: number;
  height: number;
  printerName: string;
  showPrinterSelection: boolean;
  gapBetweenItems: number;
  kitchenPrinterName: string;
  commonKitchenProductGroupId: number;
  pageHeight: number;
  pageSize: number;
  totalBillQty: number;
  landscape: boolean;
  dosPrint: boolean;
  sortItemList: boolean;
  portForm: string;
  backgroundImgPath: string;

  // Transaction data
  invTransactionMasterID: number;
  fldName: string;
  fldText: string;
  fldLength: string;
  fldFont: string;
  fldFontSize: string;
  fldAlign: string;
  fldLeft: string;
  fldTop: string;
  fldBold: string;
  fldItalic: string;
  fldUnderLine: string;
  fldFormat: string;
  fldHideCodes: string;

  tempFname: string;
  ihSettings: string;
  phSettings: string;
  dtSettings: string;
  pfSettings: string;
  ifSettings: string;

  // Data tables
  dtTranMaster: any | null;
  dtTransDetails: any | null;
  noOfCopies: number;
  printInCopy: number;
  groupNameHeadHeight: number;

  // Financial calculations
  grandTotal: number;
  totReturnAmount: number;
  roundAmt: number;
  adjustmentAmount: number;
  totDiscAmt: number;
  fcAmount: number;
  balancePaid: number;
  billDiscount: number;
  privilegeAmt: number;
  privilegeCardID: number;
  exchangeRate: number;
  qrPay: number;
  bankCard: number;

  // Transaction flags
  isInvTrans: boolean;
  isSalesView: boolean;
  isServiceTrans: boolean;
  isReprint: boolean;
  isFromSalesReceipt: boolean;
  lastGroupName: string;
  stateCode: string;
  stateName: string;
  bankCardName: string;
  lastGroupNameWithUnit: string;
  hasGroupHeaderPrinting: boolean;
  isPOSPrinting: boolean;

  // Kitchen data
  kitchenID: number;
  commonKitchenProductGroupID: number;
  totalBillItemNos: number;
  kitchenName: string;

  // Page and print state
  pageNo: number;
  noOfPages: number;
  totalItems: number;
  pageTotDebit: number;
  pageTotCredit: number;
  pageTotAmount: number;
  pageTotNetAmount: number;
  totalNetValue: number;
  totalNetAmount: number;
  totalQty: number;
  totalPageQty: number;

  // Detailed calculations
  sumOfGross: number;
  unitNetValue: number;
  sumOfDisc: number;
  sumOfTax: number;
  sumOfNetAmt: number;
  sumOfVAT: number;
  sumOfTotDisc: number;
  sumOfCST: number;
  sumOfNetValue: number;
  sumOfMRP: number;
  sumOfNosQty: number;
  sumOfMRPRate: number;
  sumOfSchemDisc: number;
  sumOfGrossfc: number;

  // Page totals
  pageTotalofGross: number;
  pageTotalofDisc: number;
  pageTotalofTax: number;
  pageTotalofNetAmt: number;
  pageTotalofSchmeDisc: number;
  pageTotalofVAT: number;
  pageTotalofTotDisc: number;
  pageTotalofCST: number;
  pageTotalofNetValue: number;
  pageTotalofNosQty: number;
  pageTotFree: number;
  totalFree: number;
  totalQtyFree: number;

  // GST calculations
  sumOfCGST: number;
  sumOfSGST: number;
  sumOfIGST: number;
  sumOfCessAmt: number;
  sumOfAddCessAmt: number;
  sumOfGST: number;
  sumOfNetWeight: number;

  // Service items
  serviceItems: any[];
  serviceItemsAMT: any[];

  // GST details
  zeroTaxable: number;
  sumGST: number;
  zeroCGSTAmt: number;
  zeroSGSTAmt: number;
  zeroIGSTAmt: number;
  zeroTotal: number;
  threeTaxable: number;
  threeCGST: number;
  threeSGST: number;
  threeIGST: number;
  threeTotal: number;
  fiveTaxable: number;
  fiveCGSTAmt: number;
  fiveSGSTAmt: number;
  fiveIGSTAmt: number;
  fiveTotal: number;
  twelveTaxable: number;
  twelveCGSTAmt: number;
  twelveSGSTAmt: number;
  twelveIGSTAmt: number;
  twelveTotal: number;
  eighteenTaxable: number;
  eighteenCGSTAmt: number;
  eighteenSGSTAmt: number;
  eighteenIGSTAmt: number;
  eighteenTotal: number;
  twentyEightTaxable: number;
  twentyEightCGSTAmt: number;
  twentyEightSGSTAmt: number;
  twentyEightIGSTAmt: number;
  twentyEightTotal: number;

  // Additional calculations
  mrpDifference: number;
  totalCST: number;
  mrpTotal: number;
  totalEffectiveDiscount: number;
  totalSavedAmt: number;
  partyLedgerID: number;
  productBatchID: number;
  invQty: number;
  openingBalance: number;
  cashReceived: number;
  bankAmt: number;
  cashReturned: number;
  stockTransferTotalSalesValue: number;
  cashPaidOrRcvd: number;
  loyaltyCardNo: string;

  // Tax calculations
  total5PerctaxableValue: number;
  total5PercTaxValue: number;
  totalzeroPercentTaxableValue: number;
  totalzeroPercentTaxValue: number;
  totalOtherTaxableValue: number;
  totalOtherTaxValue: number;
  total15PerctaxableValue: number;
  total15PercTaxValue: number;
  drCr: string;
  jvTotalDebit: number;
  jvTotalCredit: number;

  // Gate pass data
  gatePass: boolean;
  productNameGatePass: string;
  qtyGatePass: number;
  transactionDate: string;
  transactionTime: string;
  transDate: string;
  countGate: number;
  gt: boolean;
  voucherNumberGate: string;
  transactionTimeGate: string;
  totalItemsGate: number;
  tokenBarcodeGate: string;

  // Current row state
  currentRow: number;
  linesPerCurrentPage: number;
  freeString: string;
  prodName: string;
  prodDescription: string;
  qtyWithUnit: string;
  modelNoKOT: string;
  productCode: string;
  token: string;
  productUnitRemarks: string;
  productUnitRemarksOrProductName: string;
  narration: string;
  mannualBarcode: string;
  autoBarcode: string;
  transactionBarcode: string;
  billNumberBarcode: string;
  pageTotalBarcode: string;
  invoiceNumberAndPageTotalBarcode: string;
  pHeight: string;
  pWidth: string;
  nonHeightWidth: string;
  printCount: string;
  tokenBarcode: string;
  voucherNumberBarcode: string;
  billNumberPrefBarcode: string;
  oldInvTransactionID: number;

  // Print section states
  isIHPrinted: boolean;
  isPHPrinted: boolean;
  isPFPrinted: boolean;
  isDTPrinted: boolean;

  // Print positioning
  dtSecTop: number;
  dtSecExtra: number;
  pfSecTop: number;
  ifSecTop: number;
  stdDetSecTop: number;
  skipLineHeight: number;
  lastDetailsPrintTop: number;
  currentPrintingSection: string;

  // Address and party data
  inOut: string;
  partyName: string;
  address1: string;
  address2: string;
  mobile: string;
  noOfItemsInVoucher: number;
  deliveryAddress3: string;
  priceCategoryName: string;

  // Cheque printing
  isCheque: boolean;
  chequeDate: string;
  chequePaytoAccountName: string;
  chequeAmount: string;
  chequeAmountInWords: string;
  chequeRemarks: string;

  // Kitchen message
  kmWaiter: string;
  kmOrderNumber: string;
  kmTableNo: string;
  kmSeatNo: string;
  kmTokenNumber: string;
  kmServeType: string;
  kmKitchenRemarks: string;
  kmKitchenRemarks1: string;
  kmKitchenRemarks2: string;
  kmKitchenRemarks3: string;
  kmKitchenRemarks4: string;
  isKitchenMsg: boolean;
  kitchenId: number;
  privilageCardBalance: number;
}