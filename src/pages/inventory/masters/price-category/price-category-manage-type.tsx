export interface PriceCategoryData {
  priceCategoryName: string,
  shortName: string,
  discountPerc: number,
  marginPerc: number,
  remarks: string,
  priceCategoryID: number
}

export const initialPriceCategoryData = {
  data: {
    priceCategoryName: "",
    shortName: "",
    discountPerc: 0,
    marginPerc: 0,
    remarks: "",
    priceCategoryID: 0
  },
  validations: {
    priceCategoryName: "",
    shortName: "",
    discountPerc: "",
    marginPerc: ""
  },
};
