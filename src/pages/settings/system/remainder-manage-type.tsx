export interface RemainderData {
    remiandingID: number;
    branchID: number;
    remainderName: string;
    descriptions: string;
    remaindingDate: string;
    noOfDays: number;
  }

  export const initialDataRemainder = {
    data: {
      remiandingID: 0,
      branchID: 0,
      remainderName: "",
      descriptions: "",
      remaindingDate: "",
      noOfDays: 0,
    },
    validations: {
      remiandingID: "",
      branchID: "",
      remainderName: "",
      descriptions: "",
      remaindingDate: "",
      noOfDays: "",
    },
  };
  