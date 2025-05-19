export interface TaxCategoryData {
  taxCategoryID: number,
  taxCategoryName: string,
  sVatPerc: number,
  pVatPerc: number,
  scstPerc: number,
  pcstPerc: number
}

export const initialTaxCategoryData = {
  data: {
    taxCategoryID: 0,
    taxCategoryName: "",
    sVatPerc: 0,
    pVatPerc: 0,
    scstPerc: 0,
    pcstPerc: 0,
  },
  validations: {
    taxCategoryName: ""
  },
};
