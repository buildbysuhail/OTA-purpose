import { useEffect, useState } from "react";

import { customJsonParse } from "../../../utilities/jsonConverter";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { accFormStateHandleFieldChange } from "./reducer";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { AccUserConfig } from "./acc-transaction-types";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPModal from "../../../components/ERPComponents/erp-modal";

const api = new APIClient();
export const AccTransactionUserConfig = () => {
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const[isOpen,setIsOpen]= useState<boolean>(false)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserConfig = async () => {
      try {
        const response = await api.get(Urls.acc_user_config); 
        const _userConfig = atob(response.data); 
        const userConfig: any = customJsonParse(_userConfig);
        dispatch(accFormStateHandleFieldChange({ fields: { userConfig } }));
      } catch (error) {
        console.error("Error fetching user config:", error);
      }
    };
  
    fetchUserConfig();
  }, []);

  const postUserConfig = async () => {
    try {
      const response = await api.post(
        `${Urls.acc_user_config}`,
        btoa(JSON.stringify(formState.userConfig))
      );
      handleResponse(response);
    } catch (error) {
      console.error("Error post System Code settings:", error);
    } finally {
    
    }
  };

  const handleFieldChange = (field: keyof AccUserConfig, value: any) => {
    const updatedUserConfig = {
      ...formState.userConfig,
      [field]: value, 
    };
    dispatch(accFormStateHandleFieldChange({ fields: { userConfig: updatedUserConfig } }));
  };

  return(
    <>
    <ERPButton
      type="button"
      startIcon="ri-settings-2-line"
      variant="primary"
      onClick={()=>setIsOpen(true)}  
    />
   <ERPModal
    isOpen={isOpen}
    title="User Config"
    width="w-full max-w-[600px]"
    isForm={true}
    closeModal={()=>setIsOpen(false)}
    content={<>
      <div className="grid gird-col-3 gap-6 p-4 ">
      <ERPCheckbox
        id="keepNarrationForJV"
        label='Keep Narration For JV'
        data={formState.userConfig}
        checked={formState?.userConfig?.keepNarrationForJV}
        onChangeData={(e) =>
          handleFieldChange("keepNarrationForJV", e.keepNarrationForJV)
        }
      />
  
      <ERPCheckbox
        id="clearDetailsAfterSaveAccounts"
        label="Clear Details After Save Accounts"
        data={formState.userConfig}
        checked={formState?.userConfig?.clearDetailsAfterSaveAccounts}
        onChangeData={(e) =>
          handleFieldChange("clearDetailsAfterSaveAccounts" , e.clearDetailsAfterSaveAccounts)
        }
      />
  
      <ERPCheckbox
        id="mnuShowConfirmationForEditOnAccounts"
        label="MnuShow Confirmation For Edit On Accounts"
        data={formState.userConfig}
        checked={formState?.userConfig?.mnuShowConfirmationForEditOnAccounts}
        onChangeData={(e) =>
          handleFieldChange("mnuShowConfirmationForEditOnAccounts" , e.mnuShowConfirmationForEditOnAccounts)
        }
      />
      </div>
      <div className="w-full p-2 flex justify-end space-x-2">
        <ERPButton
          title="Cancel"
          onClick={() => setIsOpen(false)} 
          type="reset"
        ></ERPButton>
        <ERPButton
          title="Save Changes"
          onClick={postUserConfig}
          variant="primary"
        ></ERPButton>
      </div>
      </>}
    >

    </ERPModal>
    </>
  )


};
