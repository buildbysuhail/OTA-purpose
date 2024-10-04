export const initialDataUser = {
  data: {
    branchIDs: "",
    counterID: 0,
    Passwd: "",
    confrimPassword: "",
    userTypeCode: "",
    employeeID: 0,
    maxDecimalPerAllowed: 0,
    email: "",
    phoneNumber: "",
    displayName: "",
  },
  validations: {
    branchIDs: "",
    counterID: "",
    Passwd: "",
    confrimPassword: "",
    userTypeCode: "",
    employeeID: "",
    maxDecimalPerAllowed: "",
    email: "",
    phoneNumber: "",
    displayName: "",
  },
};

export const initialDataUserType = {
  data: {
    userTypeName: "",
    userTypeCode: "",
    remarks: "",
    isEditable: true,
    isDeletable: true
  },
  validations: {
    userTypeName: "",
    counterID: "",
    remarks: "",
  },
};
export interface UserData {
  branchIDs: string;
  counterID: number;
  Passwd: string;
  confrimPassword: string;
  userTypeCode: string;
  employeeID: number;
  maxDecimalPerAllowed: number;
  email: string;
  phoneNumber: string;
  displayName: string;
}