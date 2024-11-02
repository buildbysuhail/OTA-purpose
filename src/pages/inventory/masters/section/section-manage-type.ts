export interface SectionData {
    sectionID: number,
    sectionName: string,
    sectionCode: string,
    shortName: string,
    remarks: string,
    isCommon: boolean,
    
  }

  export const initialSectionData = {
    data: {
        sectionID: 0,
        sectionName: "",
        sectionCode: "",
        shortName: "",
        remarks: "",
        isCommon: false,
    },
    validations: {
        sectionID: "",
        sectionName: "",
        sectionCode: "",
        shortName: "",
        remarks: "",
        isCommon: "",
    },
  };
  