export const initialBenefitsAndDeductions = {
  data: {
    benefitDeductionID: 0,
    benefitDeductionName: "",
    benefitDeductType: "",
    isBasic:""
  },
  validations: {
    benefitDeductionID: "",
    benefitDeductionName: "",
    benefitDeductType: "",
    isBasic: ""
  },
};

export interface BenefitsAndDeductions {
    benefitDeductionID: number,
    benefitDeductionName: string,
    benefitDeductType: string,
   
}