
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import Urls from "../../../redux/urls";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { toggleUserPopup } from "../../../redux/slices/popup-reducer";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ErpInput from "../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { APIClient } from "../../../helpers/api-client";
import { RootState } from "../../../redux/store";
import { handleResponse } from "../../../utilities/HandleResponse";
interface CounterData {
  pCname:string
  systemCode:string
  counterID:number
}
const api = new APIClient();
const CounterSettings = () => {
  const initData:CounterData = {
    pCname:"",
    systemCode:"",
    counterID:0,
  }
 const[counterData,setCounterData]=useState<CounterData>(initData)
 const [loading, setLoading] = useState(true);
 const [isSaving, setIsSaving] = useState(false);
 const userSession = useAppSelector((state: RootState) => state.UserSession);



 useEffect(() => {
  loadCounterData();
}, []);

 const loadCounterData = async () => {
  setLoading(true);
  try {
    const response = await api.getAsync(Urls.counter_settings_current_data);  
    setCounterData(response);
  } catch (error) {
    console.error("Error loading settings:", error);
  } finally {
    setLoading(false);
  }
};

const handleRowClick = (e: any) => {
  const rowData = e.data;
  console.log("Clicked row data:", rowData);
  setCounterData({
    pCname: rowData.pCname,
    systemCode: rowData.systemCode,
    counterID: rowData.counterID,
  });
};


const handleSubmit = async () => {
  setIsSaving(true);
  try {
    const response = await api.put(Urls.counter_settings_current_data,counterData);  
    handleResponse(response)
  } catch (error) {
    console.error("Error loading settings:", error);
  } finally {
    setIsSaving(false);
  }
};
  const dispatch = useAppDispatch();
  const { t } = useTranslation("userManage");
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
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6 ">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="p-4">
            
           <div className="flex justify-start my-3 ">
           <div className="grid grid-cols-1 gap-3">
                <ErpInput
                labelDirection="horizontal"
                  id="systemName"
                  label="System Name"
                  placeholder="System Name"
                  data={counterData}
                  value={counterData.pCname}
                  onChange={(e) => {
                    setCounterData((prevTheme) => ({
                      ...prevTheme,
                      pCname: e.target.value,
                    }));
                  }}
                />
                <ErpInput
                  labelDirection="horizontal"
                  id="systemCode"
                  label="System Code"
                  placeholder="System Code"
                  data={counterData}
                  value={counterData.systemCode}
                  onChange={(e) => {
                    setCounterData((prevTheme) => ({
                      ...prevTheme,
                      systemCode: e.target.value,
                    }));
                  }}
                />
             
                <ERPDataCombobox
                 labelDirection="horizontal"
                  id="counterID"
                  data={counterData}
                  label="counterID"
                  field={{
                    id: "counterID",
                    getListUrl: Urls.data_counters,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChange={(e) => {
                    setCounterData((prevTheme) => ({
                      ...prevTheme,
                      counterID: e?.value ?? null,
                    }));
                  }}
                
                />
              </div>
           </div>
         

            <div className="flex self-end space-x-5 ">
                  <ERPButton
                    title="Save"
                    variant="primary"
                    type="button"
                    onClick={handleSubmit}
                    startIcon="ri-save-line"
                  />
                  <ERPButton
                    title="Clear"
                    variant="custom"
                    customVariant="bg-[#64748b] hover:bg-[#475569] text-white"
                    type="button"
                    startIcon="ri-format-clear"
                  />
                  <ERPButton
                    title="Close"
                    variant="custom"
                    customVariant="bg-[#64748b] hover:bg-[#475569] text-white"
                    type="button"
                    startIcon="ri-file-close-line"
                  />
                </div> 
         
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                dataUrl={Urls.counter_settings}
                gridId="grid_counter_settings"
                hideGridAddButton={true}
                hideDefaultExportButton={true}
                onRowClick={handleRowClick}
                heightToAdjustOnWindows = {350}
                reload={rootState?.PopupData?.user?.reload}    
                pageSize={40}
              ></ErpDevGrid>
            </div>
            <div className="flex justify-center items-center mt-4 p-4 bg-gray-100 rounded-md max-w-60">
                <strong className="mr-3">Thi System Code:</strong>
                {/* <span className="">{store.reduce((total, item) => total + (item.AmountToAssign || 0), 0)}</span> */}
            </div>
          </div>
        </div>
      </div>

    </Fragment>
  );
};
export default React.memo(CounterSettings);