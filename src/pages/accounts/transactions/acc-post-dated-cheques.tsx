import React, { useMemo } from "react";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ErpInput from "../../../components/ERPComponents/erp-input";

const PostDatedCheques = () => {
    const dispatch = useAppDispatch();
    const rootState = useRootState();
    const columns: DevGridColumn[] = useMemo(() => [
      {
        dataField:"pCname",
        caption:"PC Name",
        dataType:"string",
        allowSorting:true,
        allowSearch:true,
        allowFiltering:true,
        minWidth:200,
       
      },
      {
        dataField:"systemCode",
        caption:"System Code",
        dataType:"string",
        allowSorting:true,
        allowSearch:true,
        allowFiltering:true,
        minWidth:200,
        allowEditing:true,
      },
      {
        dataField:"counterName",
        caption:"Counter",
        dataType:"string",
        allowSorting:true,
        allowSearch:true,
        allowFiltering:true,
        minWidth:200,
        allowEditing:true,
      },
      {
        dataField:"lastLoggedDate",
        caption:"Last Logged Date",
        dataType:"date",
        allowSorting:true,
        allowSearch:true,
        allowFiltering:true,
        width:150,
        allowEditing:true,
        visible:false
      },
    
    ], []);
  return (
    <div className="space-y-6 p-4">
      <h1 className="box-title !text-xl !font-medium">Post Dated Cheques</h1>
      <div className="bg-[#fafafa] p-4 ">
        <div className="flex flex-col justify-start lg:flex-row lg:justify-around gap-5 items-center">
          <div className="border rounded-sm shadow-sm p-4 my-3 basis-1/2">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center justify-evenly">
                <ERPRadio
                  id="radioButton"
                  name="radioButton"
                  // data={demo}
                  // checked={demo.radioButton}
                  // onChange={(e) => {
                  //     setDemo((prevTheme) => ({
                  //     ...prevTheme,
                  //     radioButton: !demo.radioButton
                  //     }));
                  // }}
                  label="Payment"
                />
                <ERPRadio
                  id="radioButton"
                  name="radioButton"
                  // data={demo}
                  // checked={demo.radioButton}
                  // onChange={(e) => {
                  //     setDemo((prevTheme) => ({
                  //     ...prevTheme,
                  //     radioButton: !demo.radioButton
                  //     }));
                  // }}
                  label="Receipt"
                />
              </div>
              <div className="flex space-x-4">
                <ERPButton
                  title="Set All Date"
                  // onClick={resetThemeChange}
                  type="reset"
                ></ERPButton>
                <ERPButton
                  title="To Excel"
                  // onClick={saveThemeChange}
                  startIcon="ri-file-excel-2-line"
                  variant="primary"
                ></ERPButton>
              </div>
              <ERPDateInput
                id="dateBox"
                label="ChequeFormDate"
                // onChange={(e) => {
                //   setDemo((prevTheme) => ({
                //     ...prevTheme,
                //     dateBox: e.target.value,
                //   }));
                // }}
                // value={demo.dateBox}
              />
              <ERPDateInput
                id="dateBox"
                label="To Date"
                // onChange={(e) => {
                //   setDemo((prevTheme) => ({
                //     ...prevTheme,
                //     dateBox: e.target.value,
                //   }));
                // }}
                // value={demo.dateBox}
              />
            </div>
         
            <div className="flex items-center justify-start space-x-4 my-2">
              <ERPCheckbox
                id="radioButton"
                name="radioButton"
             
                // data={demo}
                // checked={demo.checkBox}
                // onChange={(e) => {
                //   setDemo((prevTheme) => ({
                //     ...prevTheme,
                //     checkBox: !demo.checkBox,
                //   }));
                // }}
                label="Bank"
              />
                <ERPDataCombobox
                className="w-full"
                  id="counterID"
                //   data={counterData}
                 noLabel
                //   field={{
                //     id: "counterID",
                //     getListUrl: Urls.data_counters,
                //     valueKey: "id",
                //     labelKey: "name",
                //   }}
                //   onChange={(e) => {
                //     setCounterData((prevTheme) => ({
                //       ...prevTheme,
                //       counterID: e?.value ?? null,
                //     }));
                //   }}
                
                />
            </div>
        
           
          </div>

          {/* <div className="my-3"></div> */}
          <div className="border rounded-sm shadow-sm p-4  my-3 basis-1/2 py-11" >
          <h1 className=" box-title  !text-xl !font-medium  text-center">Set as Bank Date</h1>
            <div className="grid grid-cols-1  gap-5 my-3">
            <div className="flex items-center justify-center space-x-10 ">
                <ERPRadio
                  id="radioButton"
                  name="radioButton"
                  // data={demo}
                  // checked={demo.radioButton}
                  // onChange={(e) => {
                  //     setDemo((prevTheme) => ({
                  //     ...prevTheme,
                  //     radioButton: !demo.radioButton
                  //     }));
                  // }}
                  label="Today's Date"
                />
                <ERPRadio
                  id="radioButton"
                  name="radioButton"
                  // data={demo}
                  // checked={demo.radioButton}
                  // onChange={(e) => {
                  //     setDemo((prevTheme) => ({
                  //     ...prevTheme,
                  //     radioButton: !demo.radioButton
                  //     }));
                  // }}
                  label="Cheque Date"
                />
              </div>

              <div className="flex items-center justify-center space-x-5">
               <ERPButton
                  title="Show"
                  // onClick={resetThemeChange}
                  startIcon="ri-slideshow-2-line"
                  variant="secondary"
                ></ERPButton>
                <ERPButton
                  title="Save"
                  // onClick={saveThemeChange}
                  startIcon="ri-save-line"
                  variant="primary"
                ></ERPButton>
                  <ERPButton
                  title="Close"
                  // onClick={saveThemeChange}
                  startIcon="ri-file-close-line"
                  variant="secondary"
                ></ERPButton>
            </div>
            </div>

       
          </div>
        </div>

         <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                // dataUrl={Urls.counter_settings}
                gridId="grid_post-dated_cheques"
                hideGridAddButton={true}
                hideDefaultExportButton={true}
                heightToAdjustOnWindows = {500}
                // reload={reload}    
                pageSize={40}
              ></ErpDevGrid>
        </div>
        <div className="flex justify-between items-center ">
        <div className="flex items-center space-x-10 border border-dotted border-gray-400 rounded-sm py-4 px-2">
                <ERPRadio
                  id="radioButton"
                  name="radioButton"
                  // data={demo}
                  // checked={demo.radioButton}
                  // onChange={(e) => {
                  //     setDemo((prevTheme) => ({
                  //     ...prevTheme,
                  //     radioButton: !demo.radioButton
                  //     }));
                  // }}
                  label="Bank Change"
                />
                <ERPRadio
                  id="radioButton"
                  name="radioButton"
                  // data={demo}
                  // checked={demo.radioButton}
                  // onChange={(e) => {
                  //     setDemo((prevTheme) => ({
                  //     ...prevTheme,
                  //     radioButton: !demo.radioButton
                  //     }));
                  // }}
                  label="Bank Commission"
                />
        </div>

        <ErpInput
        id="inputBox"
        label="TOTAL"
        labelDirection="horizontal"
        // onChange={(e) => {
        // setDemo((prevTheme) => ({
        //     ...prevTheme,             
        //     inputBox: e.target.value  
        // }));
        // }}
        // value={demo.inputBox}
        />
        
        </div>
      </div>
    </div>
  );
};

export default PostDatedCheques;
