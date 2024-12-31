import { useCallback, useMemo } from 'react';
import { accFormStateRowHandleFieldChange } from './reducer';
import { RootState } from '../../../redux/store';
import Urls from '../../../redux/urls';
import { useAppSelector } from '../../../utilities/hooks/useAppDispatch';
import { useDispatch } from 'react-redux';

const useFormComponent = () => {
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
 const dispatch = useDispatch();
    
  const bankAccountParams = useMemo(() => ({
    ledgerID: formState.row.ledgerId || 0,
  }), [formState.row.ledgerId]);

  const bankAccountField = useMemo(() => ({
    valueKey: "id",
    labelKey: "name",
    getListUrl: Urls.partiesBankNames,
    params: bankAccountParams,
  }), [bankAccountParams]);

  const handleBankNameChange = useCallback((e: any) => {
    dispatch(accFormStateRowHandleFieldChange({
      fields: { bankName: e.value },
    }));
  }, [dispatch]);

  const handleLedgerChange = useCallback((e: any) => {
    dispatch(accFormStateRowHandleFieldChange({
      fields: { 
        ledgerId: e.value, 
        ledgerName: e.label,
      },
    }));
  }, [dispatch]);

  return {
    bankAccountField,
    handleBankNameChange,
    handleLedgerChange,
  };
};

export default useFormComponent;