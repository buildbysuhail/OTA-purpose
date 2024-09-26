import React, { useState } from 'react'
import ERPModal from '../../../components/ERPComponents/erp-modal';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPFileUploadButton from '../../../components/ERPComponents/erp-file-upload-button';

const ImportExport = () => {
    const [isOpenImportExport,setIsOpenImportExport] = useState<boolean>(true);
  
  return (
    <>
       <ERPModal
                isOpen={isOpenImportExport}
                title={"Import Excel"}
                width='w-full max-w-[600px]'
                isForm={true}
                closeModal={() => {
                  // setPostDataEmail(initialEmailData);
                  setIsOpenImportExport(false);
                }}
                 content={
                  <PopUpModalImportExport
                    setIsOpenImportExport={setIsOpenImportExport}
                  />
                }
              />
    </>
  )
}

const PopUpModalImportExport = ({setIsOpenImportExport}:any) => {
    interface Import {
      data: {
        filePath: string;
        product:boolean;
        parties:boolean
      };
      validations: {
        filePath: string;
        product:string;
        parties:string
      };
    }
    
    
      const [importData, setImportData] = useState<Import>({
        data: {
            filePath: "",
            product:false,
            parties:false,
        },
        validations: {
            filePath: "",
            product:"",
            parties:"",
        },
      });
      const [isLoading,setIsLoading]=useState<boolean>(false)
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const filePath = e.target.files[0].name;
          setImportData((prevState) => ({
            ...prevState,
            data: {
              ...prevState.data,
              filePath,
            },
          
          }));
        }
      };
    return (
      <div className="w-full pt-4">
      
          <div className="grid grid-cols-1 gap-3">
          <div>
        <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700">
          File Path
        </label>
        <input
          type="file"
          id="fileInput"
          className="mt-1 w-full border border-gray-300 p-2 rounded-md"
          onChange={handleFileChange}
        />
        {/* {importData.validations.filePath && (
          <p className="text-red-500 text-sm mt-1">{importData.validations.filePath}</p>
        )} */}
      </div>
             <div className='flex justify-around items-center my-2'>       
            <div className="">
            <input
              id="product"
              type="checkbox"
              className="mr-2"
              checked={importData?.data?.product}
              required
              onChange={(e) => {
                setImportData((prevData: any) => ({
             ...prevData,
               data: {
              ...prevData.data,
              product: e.target.checked, 
             },
              }));
             }}
            />
            <label htmlFor="product" className="text-gray-700">
              Products
            </label>
          </div>  

           <div className="">
           <input
              id="parties"
              type="checkbox"
              className="mr-2"
              checked={importData?.data?.parties}
              required
              onChange={(e) => {
                setImportData((prevData: any) => ({
             ...prevData,
               data: {
              ...prevData.data,
             parties: e.target.checked, 
             },
              }));
             }}
            />
            <label htmlFor="parties" className="text-gray-700">
             Parties
            </label>
          </div> 
          </div>
        <div className="w-full p-2 flex justify-center">
        <ERPButton
              type="reset"
              title="Cancel"
              variant="secondary"
              onClick={() => {
                
                setIsOpenImportExport(false);
                // setPostDataEmail({initialEmailData});
              }}
              disabled={isLoading}
        ></ERPButton>
         
          <ERPButton
            type="button"
            disabled={isLoading}
            variant="primary"
            startIcon="ri-upload-2-line"
            // onClick={postFormEmail}
            loading={isLoading}
            title="Import"
          ></ERPButton>
        </div>
      </div>
    </div>
    );
  };

export default ImportExport
