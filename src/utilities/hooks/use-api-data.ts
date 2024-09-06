import { ActionType, ApiState } from "../../redux/types";
import { reducerNameFromUrl } from "../../redux/utils";
import { useAppSelector } from "./useAppDispatch";

export const useApiSelector = <T>(endpointUrl:string, method: ActionType, isDetail?: boolean) => {
  const reducerName = reducerNameFromUrl(endpointUrl, method);
  // return useAppSelector((state): ApiState<T> => state[reducerName] as ApiState<T>);
};