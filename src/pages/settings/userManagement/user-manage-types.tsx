export const initialDataUser = {
  data: {
    branchIDs: "",
    counterID: 0,
    Passwd: "",
    confrimPassword: "",
    userTypeCode: "",
    employeeID: 0,
    maxDiscPercAllowed: 0,
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
    maxDiscPercAllowed: "",
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
    isEditable: false,
    isDeletable: false
  },
  validations: {
    userTypeName: "",
    counterID: "",
    remarks: "",
  },
};
export interface UserData {
  user : string;
  Passwd: string;
  confrimPassword: string;
  email:string;
  phoneNumber : string;
  displayName:string;
  userTypeCode: string;
  counterID: number;
  employeeID: number;
  maxDiscPercAllowed: number;
  passkey: string;
}