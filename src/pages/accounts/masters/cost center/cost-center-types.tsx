export const initialCostCenter = {
  data: {
    costCentreID: 0,
    branchID: 0,
    costCentreName: "",
    shortName: "",
    remarks: "",
    createdUserID: 0,
    modifiedUserID: 0
  },
  validations: {
    costCentreID: "",
    branchID: "",
    costCentreName: "",
    shortName: "",
    remarks: "",
    createdUserID: "",
    modifiedUserID: ""
  },
};

export interface CostCenterData {
  costCentreID: number,
  branchID: number,
  costCentreName: string,
  shortName: string,
  remarks: string,
  createdUserID: number,
  modifiedUserID: number
}