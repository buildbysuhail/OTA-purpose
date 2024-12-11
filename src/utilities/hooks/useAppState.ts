import { useSelector, useDispatch } from 'react-redux';
import { setAppState } from '../../redux/slices/app/reducer';
import { RootState } from '../../redux/store'; // 
import { useAppDispatch } from './useAppDispatch';

export const useAppState = () => {
  const dispatch = useAppDispatch();
  const entireState = useSelector((state: RootState) => state);
  const appState = useSelector((state: RootState) => state.AppState?.appState);
  
  const updateAppState = (newState: (typeof appState)) => {
    
    dispatch(setAppState(newState));
  };
console.log(appState);

  return { appState, updateAppState };
};