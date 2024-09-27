import React, { useState } from 'react'
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { PopUpModalBankPos } from './adminstration-manage';

const BankPosSettings = () => {
    const [isOpenBankPos,setIsOpenBankPos] = useState<boolean>(true);
    return (
        <>
          <ERPModal
            isOpen={isOpenBankPos}
            title={"Bank POS Settings"}

            isForm={true}
            closeModal={() => {
              // setPostDataEmail(initialEmailData);
              setIsOpenBankPos(false);
            }}
            content={
              <PopUpModalBankPos
                setIsOpenBankPos={setIsOpenBankPos}
              />
            }
          />
   </>
    )
  
}

export default BankPosSettings
