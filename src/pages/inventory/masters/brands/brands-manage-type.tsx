export interface BrandsData {
  brandID: number,
  brandName: string,
  brandShortName: string,
  remarks: string,
  isCommon: true
}

export const initialBrandsData = {
  data: {
    brandID: 0,
    brandName: "",
    brandShortName: "",
    remarks: "",
    isCommon: true
  },
  validations: {
    brandName: "",
    brandShortName: ""
  },
};
