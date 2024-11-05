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
    sVatPerc: "",
    pVatPerc: "",
    scstPerc: "",
    pcstPerc: ""
  },
  validations: {
    taxCategoryName: ""
  },
};
