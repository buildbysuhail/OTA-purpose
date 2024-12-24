export interface PartyCategoryData {
    partyCategoryID: number;
    branchId: number;
    partyCategoryName: string;
    partyColor:string;
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
      partyColor: '',
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
      partyColor: '',
      remarks: '',
      createdUserId: '',
      modifiedUserId: '',
      isEdit: '',
      isDelete: '',
    },
  };
  