
export interface UserTypePrivilegeManageData {
  data: UserTypePrivilegeManageDataDetails;
  validations: UserTypePrivilegeManageValidations;
}

export interface UserTypePrivilegeManageDataDetails {
  userType: string;
  selectAll: boolean;
  showAll: boolean;
  showAllAdd: boolean;
  showAllPrint: boolean;
  showAllEdit: boolean;
  showAllExport: boolean;
  showAllDelete: boolean;
  userRightType: boolean;
  userType2: string;
}

export interface UserTypePrivilegeManageValidations {
  userType: string;
  selectAll: string;
  showAll: string;
  showAllAdd: string;
  showAllPrint: string;
  showAllEdit: string;
  showAllExport: string;
  showAllDelete: string;
  userRightType: string;
  userType2: string;
}
export const initialUserTypePrivilegeManageData: UserTypePrivilegeManageData = {
  data: {
    userType: "",
    selectAll: false,
    showAll: false,
    showAllAdd: false,
    showAllPrint: false,
    showAllEdit: false,
    showAllExport: false,
    showAllDelete: false,
    userRightType: false,
    userType2: "",
  },
  validations: {
    userType: "",
    selectAll: "",
    showAll: "",
    showAllAdd: "",
    showAllPrint: "",
    showAllEdit: "",
    showAllExport: "",
    showAllDelete: "",
    userRightType: "",
    userType2: "",
  },
};
export interface UserRightData {
  branchID: number;
  createdDate: Date;
  createdUserID: number;
  formCode: string;
  modifiedDate: Date;
  modifiedUserID: number;
  treeNodeIndex: number;
  userRightID: number;
  userRights: string;
  userTypeCode: string;
}
export interface UserTypeTreeProps {
}