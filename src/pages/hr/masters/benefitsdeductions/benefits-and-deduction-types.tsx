export const initialBenefitsAndDeductions = {
  data: {
    benefitDeductionID: 9,
    benefitDeductionName: "",
    benefitDeductType: "",
    isBasic:false
  },
  validations: {
    benefitDeductionID: 9,
    benefitDeductionName: "",
    benefitDeductType: "",
    isBasic: false
  },
};

export interface BenefitsAndDeductions {
    benefitDeductionID: number,
    benefitDeductionName: string,
    benefitDeductType: string,
    isBasic: boolean
}