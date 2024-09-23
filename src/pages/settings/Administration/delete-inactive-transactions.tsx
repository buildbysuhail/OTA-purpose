import React, { useState } from 'react'
import ERPModal from "../../../components/ERPComponents/erp-modal";
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPDateInput from '../../../components/ERPComponents/erp-date-input';

const DeleteInactiveTransactions = () => {

 const [isOpenDeleteInactive,setIsOpenDeleteInactive] = useState<boolean>(true);

  return (
  <>
   <ERPModal
                isOpen={isOpenDeleteInactive}
                title={"Delete In Active Transactions"}

                isForm={true}
                closeModal={() => {
                  // setPostDataEmail(initialEmailData);
                  setIsOpenDeleteInactive(false);
                }}
                 content={
                  <PopUpModalDeleteInactiveTransactions
                    setIsOpenDeleteInactive={setIsOpenDeleteInactive}
                  />
                }
              />
  </>
  )
}

const PopUpModalDeleteInactiveTransactions = ({setIsOpenDeleteInactive}:any) => {
  interface DateInfo {
    data: {
      date: string;
    };
    validations: {
      date: string | null;
    };
  }
  
  
    const [dateInfo, setDateInfo] = React.useState<DateInfo>({
      data: {
        date: "",
      },
      validations: {
        date: null,
      },
    });
  
    const handleChange = (id: string, value: any) => {
      setDateInfo((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [id]: value,
        },
      }));
    };
  
    const handleDelete = () => {
      console.log("Deleting inactive transactions...");
      // Implement your delete logic here
    };
  return (
    <div className="w-full pt-4">
    
        <div className="grid grid-cols-1 gap-3">
          <ERPDateInput
                    id="dob"
                    field={{ type: "date", id: "dob", required: true }}
                    label={"Till Date"}
                    data={dateInfo?.data}
                    handleChange={(id: any, value: any) =>
                    {
                      
                      setDateInfo((prev: any) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          [id]: value
                        }
                      }));
                    }
                    }
                    // validation={basicInfo.validations.dob}
                  />
          <div className="flex items-center mb-4">
          <input
            id="agreement"
            type="checkbox"
            className="mr-2"
            required
          />
          <label htmlFor="agreement" className="text-gray-700">
            I Agree to remove all inactive transactions till the selected date
          </label>
        </div>   
      <div className="w-full p-2 flex justify-center">
      <ERPButton
            type="reset"
            title="Cancel"
            variant="secondary"
            onClick={() => {
              
              setIsOpenDeleteInactive(false);
              // setPostDataEmail({initialEmailData});
            }}
            // disabled={emailLoading}
      ></ERPButton>
       
        <ERPButton
          type="button"
          // disabled={emailLoading}
          variant="primary"
          // onClick={postFormEmail}
          // loading={emailLoading}
          title="Delete"
        ></ERPButton>
      </div>
    </div>
  </div>
  );
};
export default DeleteInactiveTransactions

