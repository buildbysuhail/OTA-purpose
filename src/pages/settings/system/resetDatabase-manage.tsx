// import { useState } from "react";
// import ERPButton from "../../../components/ERPComponents/erp-button";
// import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
// import ERPInput from "../../../components/ERPComponents/erp-input";

// export const PopUpModalResetDatabase = ({setIsOpenRD}:any) => {
//     const initaialData = {
//         data:{fromDate:'',toDate:'',password:'',},
//         validations:{fromDate:'',toDate:'',password:'',}
//     }
//     const [resetDb,setResetDb]= useState(initaialData);
//     const [resetLoading, setResetLoading] = useState<boolean>(false);
//   ;
//     return (
//       <div className="w-full p-10">
       
//           <div className="grid grid-cols-1 gap-3">
//              <div className="flex gap-2 sm:gap-4 md:gap-8 ">
//                     <ERPDateInput
//                     id="romDate"
//                     field={{type: "date", id: "romDate", required: true }}
//                     label={"From"}
//                     data={resetDb?.data}
//                     handleChange={(id: any, value: any) =>
//                     {
                      
//                       setResetDb((prev: any) => ({
//                         ...prev,
//                         data: {
//                           ...prev.data,
//                           [id]: value
//                         }
//                       }));
//                     }
//                     }
//                     validation={resetDb.validations.fromDate}
//                   />
//                  <ERPDateInput
//                     id="toDate"
//                     field={{ type: "date", id: "toDate", required: true }}
//                     label={"To"}
//                     data={resetDb?.data}
//                     handleChange={(id: any, value: any) =>
//                     {
                      
//                       setResetDb((prev: any) => ({
//                         ...prev,
//                         data: {
//                           ...prev.data,
//                           [id]: value
//                         }
//                       }));
//                     }
//                     }
//                     validation={resetDb.validations.toDate}
//                   />
//              <ERPInput
//               id="password"
//               placeholder="Password"
//               required={true}
//               value={resetDb?.data?.password}
//               data={resetDb?.data}
//               onChangeData={(data: any) =>
//               {
//                 setResetDb((prevData: any) => ({
//                   ...prevData,
//                   data: data,
//                 }))
                
//               }
                
//               }
//             />
//             </div> 


//           </div>
     
         
        
//         <div className="w-full p-2 flex justify-end">
//           <ERPButton
//             type="reset"
          
//             title="Cancel"
//             variant="secondary"
//             onClick={() => {
//             setIsOpenRD(false);
//             //   setPostDataEmail({initialEmailData});
//             }}
//             // disabled={postCounterLoading}
//           ></ERPButton>
//           <ERPButton
//             type="button"
           
//             // disabled={postCounterLoading}
//             variant="primary"
//             // onClick={addCounter}
//             // loading={postCounterLoading}
//             title={"Reset"}
//           ></ERPButton>
//         </div>
//       </div>
//     );
//   };
  

import React, { useState } from "react";

 const PopUpModalResetDatabase= () => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    password: "",
    accountMaster: [
      {
      accountGroup: false,
      accountLedgers: false,
      currencies: false,
      partyCategory: false,
      customers: false,
      suppliers: false,
    }
    ],
    hrMaster: [
    {
      designation: false,
      employee: false,
      jobWorks: false,
      documents: false,
    }
    ],
    inventoryMaster: [
      {
      products: false,
      productGroup: false,
      brands: false,
      warehouse: false,
      taxCategory: false,
      }
    ],
    options: [
      {
      selectAll: false,
      updateStock: false,
      updateAccounts: false,
      maintainRecords: false,
      }
    ],
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (group: string, field: string) => (e: any) => {
    // setFormData({
    //   ...formData,
    //   [group]: {
    //     ...formData[group],
    //     [field]: e.target.checked,
    //   },
    // });
  };

  const handleOptionChange = (e: any) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      options: {
        ...formData.options,
        [name]: checked,
      },
    });
  };

  return (
    <div className="flex justify-center items-center  ">
      <div className=" p-6 ">
        <h1 className="text-center text-2xl font-bold text-blue-600 mb-4">
          Reset Database
        </h1>

        {/* Date Inputs and Password */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="dateFrom" className="block font-medium">
              Date From
            </label>
            <input
              type="date"
              name="dateFrom"
              id="dateFrom"
              value={formData.from}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="dateTo" className="block font-medium">
              Date To
            </label>
            <input
              type="date"
              name="dateTo"
              id="dateTo"
              value={formData.to}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Checkbox Groups */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Account Master */}
          <div>
            <h3 className="font-bold mb-2">Account Master</h3>
            {["Account Group", "Account Ledgers", "Currencies", "Party Category", "Customers", "Suppliers"].map(
              (label, index) => (
                <div key={index}>
                  <label>
                    <input
                      type="checkbox"
                      onChange={handleCheckboxChange("accountMaster", label.toLowerCase().replace(/\s+/g, ""))}
                    />{" "}
                    {label}
                  </label>
                </div>
              )
            )}
          </div>

          {/* HR Master */}
          <div>
            <h3 className="font-bold mb-2">HR Master</h3>
            {["Designation", "Employee", "Job Works", "Documents"].map((label, index) => (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    onChange={handleCheckboxChange("hrMaster", label.toLowerCase().replace(/\s+/g, ""))}
                  />{" "}
                  {label}
                </label>
              </div>
            ))}
          </div>

          {/* Inventory Master */}
          <div>
            <h3 className="font-bold mb-2">Inventory Master</h3>
            {[
              "Products",
              "Product Group",
              "Brands",
              "WareHouse",
              "Tax Category",
            ].map((label, index) => (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    onChange={handleCheckboxChange("inventoryMaster", label.toLowerCase().replace(/\s+/g, ""))}
                  />{" "}
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex space-x-4 mb-4">
          {["Select All", "Update Stock", "Update Accounts", "Maintain Records"].map((label, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  name={label.toLowerCase().replace(/\s+/g, "")}
                  // checked={formData.options[label.toLowerCase().replace(/\s+/g, "")]}
                  onChange={handleOptionChange}
                />{" "}
                {label}
              </label>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
            Reset
          </button>
          <button  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default  PopUpModalResetDatabase
                        