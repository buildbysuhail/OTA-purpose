import { useSelector, useDispatch } from 'react-redux';
import { setAppState } from '../../redux/slices/app/reducer';
import { RootState } from '../../redux/store'; // 

export const useAppState = () => {
  const dispatch = useDispatch();
  const entireState = useSelector((state: RootState) => state);
  const appState = useSelector((state: RootState) => state.AppState?.appState);
  
  const updateAppState = (newState: (typeof appState)) => {
    
    dispatch(setAppState(newState));
  };

  return { appState, updateAppState };
};