import { ActionType } from "../redux/types";

export type ApiEndpoint = {
    url: string;
    method: ActionType;
    initialData?: any;
  };