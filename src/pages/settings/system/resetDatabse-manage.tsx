import { useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPInput from "../../../components/ERPComponents/erp-input";

export const PopUpModalResetDatabase = ({setIsOpenRD}:any) => {
    const initaialData = {
        data:{fromDate:'',toDate:'',password:'',},
        validations:{fromDate:'',toDate:'',password:'',}
    }
    const [resetDb,setResetDb]= useState(initaialData);
    const [resetLoading, setResetLoading] = useState<boolean>(false);
  ;
    return (
      <div className="w-full p-10">
       
          <div className="grid grid-cols-1 gap-3">
             <div className="flex gap-2 sm:gap-4 md:gap-8 ">
                    <ERPDateInput
                    id="romDate"
                    field={{type: "date", id: "romDate", required: true }}
                    label={"From"}
                    data={resetDb?.data}
                    handleChange={(id: any, value: any) =>
                    {
                      
                      setResetDb((prev: any) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          [id]: value
                        }
                      }));
                    }
                    }
                    validation={resetDb.validations.fromDate}
                  />
                 <ERPDateInput
                    id="toDate"
                    field={{ type: "date", id: "toDate", required: true }}
                    label={"To"}
                    data={resetDb?.data}
                    handleChange={(id: any, value: any) =>
                    {
                      
                      setResetDb((prev: any) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          [id]: value
                        }
                      }));
                    }
                    }
                    validation={resetDb.validations.toDate}
                  />
             <ERPInput
              id="password"
              placeholder="Password"
              required={true}
              value={resetDb?.data?.password}
              data={resetDb?.data}
              onChangeData={(data: any) =>
              {
                setResetDb((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
                
              }
                
              }
            />
            </div> 


          </div>
     
         
        
        <div className="w-full p-2 flex justify-end">
          <ERPButton
            type="reset"
          
            title="Cancel"
            variant="secondary"
            onClick={() => {
            setIsOpenRD(false);
            //   setPostDataEmail({initialEmailData});
            }}
            // disabled={postCounterLoading}
          ></ERPButton>
          <ERPButton
            type="button"
           
            // disabled={postCounterLoading}
            variant="primary"
            // onClick={addCounter}
            // loading={postCounterLoading}
            title={"Reset"}
          ></ERPButton>
        </div>
      </div>
    );
  };
  

                                //   <div className="flex items-center">
                                            //                             <input
                                            //                               type="radio"
                                            //                               name="theme-style"
                                            //                               className="ti-form-radio"
                                            //                               id="switcher-dark-theme"
                                            //                               defaultChecked={theme.mode === "dark"}
                                            //                               onChange={(e) => {
                                            //                                 if (e.target.checked == true) {
                                            //                                   switcherdata.Dark(updateAppState, appState);
                                            //                                   setTheme((prevTheme) => ({
                                            //                                     ...prevTheme,
                                            //                                     mode: "dark",
                                            //                                   }));
                                            //                                 }
                                            //                                 console.log(theme);
                                            //                               }}
                                            //                               // onClick={() => { handleThemeChange("mode", "dark")}}
                                            //                             />
                                            //                             <label
                                //                               htmlFor="switcher-dark-theme"
                                //                               className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
                                //                             >
                                //                               Dark
                                //                             </label>
                                //                           </div>