import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import { reducerNameFromUrl } from '../../redux/utils';
import { ActionType } from '../../redux/types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDynamicSelector = <T>(url: string,method: ActionType, isDetail = false): T  => {
  debugger;
    let sliceName = reducerNameFromUrl(url, method, isDetail);
    return useAppSelector((state: RootState) => state[sliceName]) as T ;
  };