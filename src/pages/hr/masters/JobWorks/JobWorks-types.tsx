export const initialJobWorks = {
  data: {
    jobID: 0,
    jobName: "",
    jobCode: "",
    unitRate: 0,
    remarks: "",
  },
  validations: {
    jobID: "",
    jobName: "",
    jobCode: "",
    unitRate: "",
    remarks: "",
  },
};
export interface JobWorks {
  jobID: number;
  jobName: string;
  jobCode: string;
  unitRate: number;
  remarks: string;
}
