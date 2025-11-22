
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../utilities/hooks/useAppDispatch';
import { RootState } from '../../../../redux/store';

const useFormComponent = () => {
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
 const dispatch = useDispatch();
    
 

  return {
 
  };
};

export default useFormComponent;