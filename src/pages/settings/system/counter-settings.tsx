
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
import { useNavigate } from "react-router-dom";

interface CounterData {
  systemName:string
  systemCode:string
  counterID:number|null
}
const api = new APIClient();
const CounterSettings = () => {
  const initData:CounterData = {
    systemName:"",
    systemCode:"",
    counterID:null,
  }
 const[counterData,setCounterData]=useState<CounterData>(initData)
 const [defaultSystemCode, setDefaultSystemCode] = useState("");
 const [reload,setReload]=useState(false)
 const [loading, setLoading] = useState(true);
 const [isSaving, setIsSaving] = useState(false);
 const userSession = useAppSelector((state: RootState) => state.UserSession);
const navigate = useNavigate()

 useEffect(() => {
  loadCounterData();
}, []);

 const loadCounterData = async () => {
  setLoading(true);
  try {
    const response = await api.getAsync(Urls.counter_settings_current_data); 
    setDefaultSystemCode(response.systemCode)
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
    systemName: rowData.pCname,
    systemCode: rowData.systemCode,
    counterID: rowData.counterID,
  });
};


const handleSubmit = async () => {
  setReload(false)
  setIsSaving(true);
  try {
    const response = await api.put(Urls.counter_settings_current_data,counterData);  
    handleResponse(response,()=>{setReload(true)},() => { })
  } catch (error) {
    console.error("Error loading settings:", error);
  } finally {
    setIsSaving(false);
  }
};

const handleClear = async ()=>{
  setCounterData({
    systemName: "",
    systemCode: "",
    counterID: null,
  }); 
}

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
          <h1 className='text-2xl font-normal tracking-wide text-#3f3f46 dark:te'>Counter Settings</h1>
          <div className="grid grid-cols-1 space-y-4 md:w-[550px] mb-3">
                <ErpInput
                // labelDirection="horizontal"
                className=""
                  id="systemName"
                  label="System Name"
                  placeholder="System Name"
                  data={counterData}
                  value={counterData.systemName}
                  onChange={(e) => {
                    setCounterData((prevTheme) => ({
                      ...prevTheme,
                      systemName: e.target.value,
                    }));
                  }}
                />
                <ErpInput
                  // labelDirection="horizontal"
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
                //  labelDirection="horizontal"
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
              <div className="flex items-center justify-center space-x-4">
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
                    onClick={handleClear}
                  />
                  <ERPButton
                    title="Close"
                    variant="custom"
                    customVariant="bg-[#64748b] hover:bg-[#475569] text-white"
                    type="button"
                    startIcon="ri-file-close-line"
                    onClick={()=>  navigate("/settings") }
                  />
              </div>
          </div>
     
         
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                dataUrl={Urls.counter_settings}
                gridId="grid_counter_settings"
                hideGridAddButton={true}
                hideDefaultExportButton={true}
                onRowClick={handleRowClick}
                heightToAdjustOnWindows = {500}
                reload={reload}    
                pageSize={40}
              ></ErpDevGrid>
            </div>
            <div className="flex justify-center items-center mt-2 space-x-2">
                <strong className="">This System Code :</strong>
                <span className="">{defaultSystemCode}</span>
            </div>
          </div>
        </div>
      </div>

    </Fragment>
  );
};
export default React.memo(CounterSettings);