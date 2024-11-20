
export interface FormField {
  id: string;
  value: any;
  data: any;
  onChangeData?: (data: any) => void; 
  label?: string
  validation?: string;
  checked?: any;
}