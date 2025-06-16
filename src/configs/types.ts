import { ActionType } from "../redux/types";

export type ApiEndpoint = {
    url: string;
    method?: ActionType;
    initialData?: any;
  };
  export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};