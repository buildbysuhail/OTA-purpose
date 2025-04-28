export interface ProductGroupData {
  productGroupID: number,
  groupName: string,
  shortName: string,
  parentGroupID: number,
  childCount: number,
  schemeID: number,
  isEditable: true,
  isDeletable: true,
  gStatus: string,
  remarks: string,
  groupCategoryID:number,
  sectionID: number,
  marginPerc: number,
  kitchenID: number,
  arabicName: string
}

export const initialProductGroupData = {
  data: {
    productGroupID: 0,
    groupName: "",
    shortName: "",
    parentGroupID: -2,
    childCount: 0,
    schemeID: 0,
    isEditable: true,
    isDeletable: true,
    gStatus: -2,
    remarks: "",
    groupCategoryID: -2,
    sectionID: -2,
    marginPerc: 0,
    kitchenID: 0,
    arabicName: ""
  },
  validations: {
    groupName: "",
    shortName: "",
    parentGroupID: "",
    groupCategoryID: "",
    sectionID: "",
    gStatus: "",
    remarks: "",
    marginPerc: "",
    kitchenID: ""
  },
};
