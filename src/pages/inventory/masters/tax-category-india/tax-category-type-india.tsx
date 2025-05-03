interface TaxCategory {
  taxCategoryID?: number;
  taxCategoryName: string;
  s_SGSTPerc: number;
  p_SGSTPerc: number;
  s_CGSTPerc: number;
  p_CGSTPerc: number;
  s_IGSTPerc: number;
  p_IGSTPerc: number;
  s_CessPerc: number;
  p_CessPerc: number;
  s_AdditionalCessPerc: number;
  p_AdditionalCessPerc: number;
  s_CalamityCessPerc: number;
  p_CalamityCessPerc: number;
}

const initialTaxCategoryData: TaxCategory = {
  taxCategoryName: "",
  s_SGSTPerc: 0,
  p_SGSTPerc: 0,
  s_CGSTPerc: 0,
  p_CGSTPerc: 0,
  s_IGSTPerc: 0,
  p_IGSTPerc: 0,
  s_CessPerc: 0,
  p_CessPerc: 0,
  s_AdditionalCessPerc: 0,
  p_AdditionalCessPerc: 0,
  s_CalamityCessPerc: 0,
  p_CalamityCessPerc: 0
};