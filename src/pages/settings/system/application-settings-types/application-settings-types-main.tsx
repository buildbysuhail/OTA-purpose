export interface ApplicationMainSettings {
  currency: string;
  unitPrice_decimalPoint: string;
  decimalPoints: number;
  // cashSalesVoucherPrefix: string;
  showNumberFormat: string;
  roundingMethod: string;
  pOSRoundingMethod: string;
  tax_DecimalPoint: string;
  roundingMethodGLOBAL: string;
  autoChangeTransactionDateByMidnight: boolean;
  autoUpdateReleaseUpTo: number;
  oTPEmail: string;
  oTPVerification: string;
  allowPrivilegeCard: boolean;
  previlegeCardPerc: number;
  allowPostdatedTrans: boolean;
  postDatedTransInNumbers: number;
  allowPredatedTrans: boolean;
  preDatedTransInNumbers: number;
  maintainSeperatePrefixforCashSales: boolean;
  saveModTransSum: boolean;
  maintainProduction: boolean;
  showReminders: boolean;
  enableSecondDisplay: boolean;
  allowSalesRouteArea: boolean;
  enableDayEnd: boolean;
  maintainSalesRouteCreditLimit: boolean;
  maintainMultilanguage__: boolean;
  showUserMessages: boolean;
  maintainBusinessType: string;
}
export const ApplicationMainSettingsInitialState: ApplicationMainSettings = {
  currency: "2",
  unitPrice_decimalPoint: "2",
  decimalPoints: 2,
  // cashSalesVoucherPrefix: "",
  showNumberFormat: "Millions",
  roundingMethod: "Normal",
  pOSRoundingMethod: "No Rounding",
  tax_DecimalPoint: "2",
  roundingMethodGLOBAL: "Normal",
  autoChangeTransactionDateByMidnight: false,
  autoUpdateReleaseUpTo: 0,
  oTPEmail: "",
  oTPVerification: "",
  allowPrivilegeCard: false,
  previlegeCardPerc: 1,
  allowPostdatedTrans: true,
  postDatedTransInNumbers: 0,
  allowPredatedTrans: true,
  preDatedTransInNumbers: 110,
  maintainSeperatePrefixforCashSales: false,
  saveModTransSum: false,
  maintainProduction: false,
  showReminders: false,
  enableSecondDisplay: false,
  allowSalesRouteArea: false,
  enableDayEnd: false,
  maintainSalesRouteCreditLimit: false,
  maintainMultilanguage__: false,
  showUserMessages: false,
  maintainBusinessType: "",
};