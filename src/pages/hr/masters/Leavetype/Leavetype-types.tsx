export const initialLeaveType = {
  data: {
    leaveTypeID: 0,
    branchID: 0,
    leaveTypeName: "",
    leaveDescription: "",
    affectOnBasic: false,
  },
  validations: {
    leaveTypeID: "",
    branchID: "",
    leaveTypeName: "",
    leaveDescription: "",
    affectOnBasic: "",
  },
};
export interface LeaveType {
  leaveTypeID: number;
  branchID: number;
  leaveTypeName: string;
  leaveDescription: string;
  affectOnBasic: boolean;
}
