export interface ProductCategoryManageData {
  productCategoryID: number,
  productCategoryName: string,
  productCategoryCode: string,
  shortName: string,
  remarks: string,
  isCommon: boolean
}

export const initialProductCategoryManageData = {
  data: {
    productCategoryID: 0,
    productCategoryName: "",
    productCategoryCode: "",
    shortName: "",
    remarks: "",
    isCommon: true
  },
  validations: {
    productCategoryName: "",
    productCategoryCode: "",
    shortName: ""
  },
};
