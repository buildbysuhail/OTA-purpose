import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Urls from "../../../redux/urls";

import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleCurrencyExchangePopup } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { CurrencyExchangeManage } from "./exchange-rates-manage";
import { useTranslation } from "react-i18next";
import { DataGrid } from "devextreme-react";
import { Toolbar, Item, Editing, DataGridTypes } from "devextreme-react/cjs/data-grid";
import { APIClient } from "../../../helpers/api-client";
import CustomStore from "devextreme/data/custom_store";
import "./exchange-rates.css";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
const isNotEmpty = (value: any) =>
  value !== undefined && value !== null && value !== "";
const api = new APIClient();

const AuthorizationSettings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const initial = {
    employeeId: 0,
    password: "",
    confirmPassword: "",
    validations: { employeeId: 0, password: "", confirmPassword: "" },
  };
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  const [postData, setPostData] = useState<{
    employeeId: number;
    password: string;
    confirmPassword: string;
    validations: {
      employeeId: number;
      password: string;
      confirmPassword: string;
    };
  }>(initial);
  const [store, setStore] = useState<any>([]);
  const [postDataLoading, setPostDataLoading] = useState(false);
  function isNotEmpty(value: string | undefined | null) {
    return value !== undefined && value !== null && value !== "";
  }
  const load = async (baseCurrency?: number) => {
    const result: any = await api.getAsync(
      `${Urls.authorization_settings}${baseCurrency ? baseCurrency : ""}`
    );
    debugger;
    setStore(result?.data);
  };
  const handleSubmit = async () => {
    setPostDataLoading(true);
    const result: any = await api.post(
      `${Urls.authorization_settings}`,
      postData
    );
    if (result != undefined && result != null && result.isOk == true) {
      load();
    } else {
      onClear();
    }

    setStore(result?.data);
    setPostDataLoading(false);
  };
  const onSelectionChanged = useCallback(({ selectedRowsData }: DataGridTypes.SelectionChangedEvent) => {
    const data = selectedRowsData[0];
    if (data != undefined && data != null) {
      setPostData((previous: any) => ({
        ...previous, // Use the spread operator with three dots
        employeeId: data.employeeId,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }));
    } else {
      onClear();
    }
  }, []);
  
  const onClear = async () => {
    setPostDataLoading(false);
    setPostData(initial);
  };
  useEffect(() => {
    try {
      load();
    } catch (error) {
      setStore([]);
    }
    let wh = window.innerHeight;
    let gridHeightMobile = wh - 200; // Assuming 200px is the height to minus for mobile
    let gridHeightWindows = wh - 600; // Assuming 100px is the height to minus for windows
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);

  const columns: DevGridColumn[] = [
    {
      dataField: "Employee",
      caption: t("employee"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "Password",
      caption: t("password"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "Discount Type",
      caption: t("discount_type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "Discount Percentage",
      caption: t("discount_percentage"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
                <ERPDataCombobox
                  data={postData}
                  value={postData.employeeId}
                  id="employeeId"
                  field={{
                    id: "employeeID",
                    required: true,
                    getListUrl: Urls.data_employees,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  onChangeData={(data: any) => {
                    setPostData((previous: any) => ({
                      ...previous, // Use the spread operator with three dots
                      employeeId: data.employeeId,
                    }));
                  }}
                  label={t("employee")}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
                <ERPInput
                  id="password"
                  data={postData}
                  value={postData.password}
                  label={t("password")}
                  placeholder={t("password")}
                  required={true}
                  onChangeData={(data: any) => {
                    setPostData((previous: any) => ({
                      ...previous, // Use the spread operator with three dots
                      password: data.password,
                    }));
                  }}
                />
                <ERPInput
                  id="confirmPassword"
                  data={postData}
                  value={postData.confirmPassword}
                  label={t("confirm_password")}
                  placeholder={t("confirm_password")}
                  required={true}
                  onChangeData={(data: any) => {
                    setPostData((previous: any) => ({
                      ...previous, // Use the spread operator with three dots
                      confirmPassword: data.confirmPassword,
                    }));
                  }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
                <ERPButton
                  loading={postDataLoading}
                  onClick={handleSubmit}
                  title={t("save")}
                />
                <ERPButton
                  loading={postDataLoading}
                  onClick={onClear}
                  title={t("clear")}
                />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <DataGrid
                columns={columns}
                  dataSource={store}
                  onSelectionChanged={onSelectionChanged}
                  height={gridHeight.windows}
                  key="exchRateID"
                  showBorders={true}
                ></DataGrid>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AuthorizationSettings;
