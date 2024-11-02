export interface GroupCategoryData {
    groupCategoryID: number,
    groupCategoryName: string,
    groupCategoryCode: string,
    shortName: string,
    remarks: string,
    isCommon: boolean,
    
  }
  
  export const initialGroupCategoryData = {
    data: {
        groupCategoryID: 0,
        groupCategoryName: "",
        groupCategoryCode: "",
        shortName: "",
        remarks: "",
        isCommon: false,
    },
    validations: {
        groupCategoryID: "",
        groupCategoryName: "",
        groupCategoryCode: "",
        shortName: "",
        remarks: "",
        isCommon: "",
    },
  };
  