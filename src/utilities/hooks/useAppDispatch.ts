import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const useAppDynamicSelector = <T>(url: string,method: ActionType, isDetail = false): T  => {
  
    // return ({} as T)
    // return useAppSelector((state: RootState) => state[sliceName]) as T ;
  // };