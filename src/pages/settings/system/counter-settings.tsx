import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import Urls from "../../../redux/urls";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ErpInput from "../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { APIClient } from "../../../helpers/api-client";
import { RootState } from "../../../redux/store";
import { handleResponse } from "../../../utilities/HandleResponse";
import { useNavigate } from "react-router-dom";

interface CounterData {
  systemName: string;
  systemCode: string;
  counterId: number | null;
 
}
const api = new APIClient();
interface CounterSettingsProps {
  token?: string;
  isFromLogin?:boolean
  onSuccess?: () => void;
  isMaximized?: boolean;
  modalHeight?: any
}

const CounterSettings: React.FC<CounterSettingsProps> = ({ token, isFromLogin, onSuccess,isMaximized,modalHeight}) => {
  const initData: CounterData = {
    systemName: "",
    systemCode: "",
    counterId: null,
  };
  const [counterData, setCounterData] = useState<CounterData>(initData);
  const [defaultSystemCode, setDefaultSystemCode] = useState("");
  const [reload, setReload] = useState(false);
  //  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const navigate = useNavigate();
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile =isFromLogin ? modalHeight - 100: wh - 50;
    let gridHeightWindows =isFromLogin ?  modalHeight - 540 : wh - 480;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);
  useEffect(() => {
    loadCounterData();
    setReload(true);
  }, []);

  const loadCounterData = async () => {
    try {
      const response = await api.getAsync(
        Urls.counter_settings_current_data,
        undefined,
        undefined,
        token
      );
      setDefaultSystemCode(response.systemCode);
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
      counterId: rowData.counterId,
    });
  };

  const handleSubmit = async () => {
    setReload(false);
    setIsSaving(true);
    try {
      const response = await api.put(Urls.counter_settings, counterData, token);
      handleResponse(
        response,
        () => {
          setReload(true);
          if(isFromLogin && onSuccess) onSuccess();
        },
        () => {}
      );
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    setCounterData({
      systemName: "",
      systemCode: "",
      counterId: null,
    });
  };

  const dispatch = useAppDispatch();
  const { t } = useTranslation("system");
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "pCname",
        caption: t("pc_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField: "systemCode",
        caption: t("system_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 200,
        allowEditing: true,
      },
      {
        dataField: "counterName",
        caption: t("counter"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
        allowEditing: true,
      },
      {
        dataField: "lastLoggedDate",
        caption: t("last_logged_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        allowEditing: true,
        visible: false,
      },
    ],
    []
  );
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6 dark:bg-dark-bg bg-[#ffffff]">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
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
                    systemName: e.target?.value,
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
                    systemCode: e.target?.value,
                  }));
                }}
              />
              <ERPDataCombobox
                //  labelDirection="horizontal"
                className="w-full"
                id="counterId"
                data={counterData}
                value={counterData?.counterId}
                label={t("counterID")}
                field={{
                  id: "counterId",
                  getListUrl: Urls.data_counters,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChange={(e) => {
                  setCounterData((prevTheme) => ({
                    ...prevTheme,
                    counterId: e?.value ?? null,
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
                {token == undefined ||
                  (token == "" && (
                    <ERPButton
                      title={t("close")}
                      variant="custom"
                      disabled={isSaving}
                      customVariant="bg-[#64748b] hover:bg-[#475569] text-white"
                      type="button"
                      startIcon="ri-file-close-line"
                      onClick={() => navigate("/settings")}
                    />
                  ))}
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
                heightToAdjustOnWindowsInModal={gridHeight.windows}
                reload={reload}
                pageSize={40}
                allowSearching
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
