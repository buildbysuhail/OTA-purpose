export const initialEmpDesignation = {
  data: {
    designationID: 0,
    branchID: 0,
    designationName: "",
    shortName: "",
    remarks: "",
    isDeleted: false,
    isEditable: true,
  },
  validations: {
    designationID: "",
    branchID: "",
    designationName: "",
    shortName: "",
    remarks: "",
    isDeleted: "",
    isEditable: "",
  },
};
export interface EmpDesignation {
  designationID: number;
  branchID: number;
  designationName: string;
  shortName: string;
  remarks: string;
  isDeletable: boolean;
  isEditable: boolean;
}
