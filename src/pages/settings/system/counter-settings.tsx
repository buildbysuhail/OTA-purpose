
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import Urls from "../../../redux/urls";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
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
//  const [loading, setLoading] = useState(true);
 const [isSaving, setIsSaving] = useState(false);
 const userSession = useAppSelector((state: RootState) => state.UserSession);
const navigate = useNavigate()

 useEffect(() => {
  loadCounterData();
}, []);

 const loadCounterData = async () => {
  try {
    const response = await api.getAsync(Urls.counter_settings_current_data); 
    setDefaultSystemCode(response.systemCode)
    setCounterData(response);
  } catch (error) {
    console.error("Error loading settings:", error);
  } finally {

  }
};

const handleRowClick = (e: any) => {
  const rowData = e.data;
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
  const { t } = useTranslation("system");
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField:"pCname",
      caption:t("pc_name"),
      dataType:"string",
      allowSorting:true,
      allowSearch:true,
      allowFiltering:true,
      minWidth:200,
     
    },
    {
      dataField:"systemCode",
      caption:t("system_code"),
      dataType:"string",
      allowSorting:true,
      allowSearch:true,
      allowFiltering:true,
      minWidth:200,
      allowEditing:true,
    },
    {
      dataField:"counterName",
      caption:t("counter"),
      dataType:"string",
      allowSorting:true,
      allowSearch:true,
      allowFiltering:true,
      minWidth:200,
      allowEditing:true,
    },
    {
      dataField:"lastLoggedDate",
      caption:t("last_logged_date"),
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
      <div className="grid grid-cols-12 gap-x-6 bg-[#ffffff]">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="p-4">
          <h1 className='text-2xl font-normal tracking-wide text-#3f3f46 dark:te'>{t("counter_settings")}</h1>
          <div className="grid grid-cols-1 gap-4 md:w-[550px] my-3">
                <ErpInput
                // labelDirection="horizontal"
                 className="w-full"
                  id="systemName"
                  label={t("system_name")}
                  placeholder={t("system_name")}
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
                 className="w-full"
                  label={t("system_code")}
                  placeholder={t("system_code")}
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
                 className="w-full"
                  id="counterID"
                  data={counterData}
                  label={t("counterID")}
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
                    title={t("save")}
                    variant="primary"
                    loading={isSaving}
                    disabled={isSaving}
                    type="button"
                    onClick={handleSubmit}
                    startIcon="ri-save-line"
                  />
                  <ERPButton
                    title={t("clear")}
                    variant="custom"
                    customVariant="bg-[#64748b] hover:bg-[#475569] text-white"
                    type="button"
                    disabled={isSaving}
                    startIcon="ri-format-clear"
                    onClick={handleClear}
                  />
                  <ERPButton
                    title={t("close")}
                    variant="custom"
                    disabled={isSaving}
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
                <strong>{t("this_system_code")}</strong>
                <span>{defaultSystemCode}</span>
            </div>
          </div>
        </div>
      </div>

    </Fragment>
  );
};
export default React.memo(CounterSettings);