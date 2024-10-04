export interface BankPoseData {
    machineBrand?: string;
    model?: string;
    comPort?: string;
    geldeaWsPort?: string;
    gediaService?: string;
  }
  export const initialBankPoseData = {
    data: {
      machineBrand: "",
      model: "",
      comPort: "",
      geldeaWsPort: "",
      gediaService: "",
    },
    validations: {
      machineBrand: "",
      model: "",
      comPort: "",
      geldeaWsPort: "",
      gediaService: "",
    },
  };