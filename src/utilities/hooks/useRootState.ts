import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store'; // 

export const useRootState = () => {
  const entireState = useSelector((state: RootState) => state);
  return entireState;
};