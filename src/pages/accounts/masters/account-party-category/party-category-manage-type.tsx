export interface PartyCategoryData {
    partyCategoryID: number;
    branchId: number;
    partyCategoryName: string;
    remarks: string;
    createdUserId: number;
    modifiedUserId: number;
    isEdit: boolean;
    isDelete: boolean;
  }
  

export const initialPartyCategory = {
    data: {
      partyCategoryID: 0,
      branchId: 0,
      partyCategoryName: '',
      remarks: '',
      createdUserId: 0,
      modifiedUserId: 0,
      isEdit: true,
      isDelete: true,
    },
    validations: {
      partyCategoryID: '',
      branchId: '',
      partyCategoryName: '',
      remarks: '',
      createdUserId: '',
      modifiedUserId: '',
      isEdit: '',
      isDelete: '',
    },
  };
  