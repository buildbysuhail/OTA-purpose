import React, { useState } from 'react'
import ERPModal from '../../../components/ERPComponents/erp-modal';
import { PopUpModalResetDatabase } from './resetDatabse-manage';

const ResetDatabase = () => {
    const [isOpenRD,setIsOpenRD] = useState<boolean>(true);
    return (
             <>
                <ERPModal
                 isOpen={isOpenRD}
                 title={"Reset DB"}
                 width='max-w-[80rem]'
                 isForm={true}
                 closeModal={() => {
                   // setPostDataEmail(initialEmailData);
                   setIsOpenRD(false);
                 }}
                  content={
                   <PopUpModalResetDatabase
                     setIsOpenRD={setIsOpenRD}
                   />
                 }
               />
            </>
    )
  
}

export default ResetDatabase
