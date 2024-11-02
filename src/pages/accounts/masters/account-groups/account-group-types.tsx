export const initialAccountGroup = {
  data: {
    accGroupID: 0,
    accGroupName: "",
    shortName: "",
    parentGroupID: 0,
    remarks: "",
    isEditable: true,
    isDeletable: true,
    isProtected: false,
    isCommon: false,
    aStatus: "",
    displayOrder: 0,
    arabicName: "",
    reasonForModification: ""
  },
  validations: {
    accGroupName: "",
    shortName: "",
    parentGroup: "",
    isEditable: "",
    isDeletable: "",
    isProtected: "",
    isCommon: "",
    reasonForModification: "",
    parentGroupId: "",
    arabicName: ""
  },
};

export interface AccountGroupData {
  accGroupID: number,
  accGroupName: string,
  shortName: string,
  parentGroupID: number,
  remarks: string,
  isEditable: true,
  isDeletable: true,
  isProtected: true,
  isCommon: true,
  aStatus: string,
  displayOrder: number,
  arabicName: string,
  reasonForModification: string
}