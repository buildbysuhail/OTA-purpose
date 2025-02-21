import { Fragment, useCallback, useEffect, useState } from "react";
import Urls from "../../../redux/urls";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { useTranslation } from "react-i18next";
import { DataGrid } from "devextreme-react";
import { APIClient } from "../../../helpers/api-client";
import "./exchange-rates.css";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { handleResponse } from "../../../utilities/HandleResponse";

const isNotEmpty = (value: any) =>
  value !== undefined && value !== null && value !== "";
const api = new APIClient();
interface AuthorizationSettingsProps {
  isMaximized?: boolean;
  modalHeight?: any
}
const AuthorizationSettings = ({ modalHeight, isMaximized }: AuthorizationSettingsProps) => {
  const { t } = useTranslation("system");
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const initial = {
    employeeID: 0,
    password: "",
    confirmPassword: "",
    validations: { employeeID: "", password: "", confirmPassword: "" },
  };

  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  const [postData, setPostData] = useState<{
    employeeID: number;
    password: string;
    confirmPassword: string;
    validations: {
      employeeID: string;
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
    setStore(result?.data);
  };

  const handleSubmit = async () => {
    setPostDataLoading(true);
    const result: any = await api.post(
      `${Urls.authorization_settings}`,
      postData
    );
    handleResponse(result,
      () => {
        load();
        onClear();
      }
      , () => {
        setPostData((previous: any) => ({
          ...previous, // Use the spread operator with three dots
          validations: result.validations,
        }))
      });
  }

  const onSelectionChanged = useCallback((e: any) => {
    const data = e.data;
    if (data != undefined && data != null) {
      setPostData((previous: any) => ({
        ...previous, // Use the spread operator with three dots
        employeeID: data.employeeID,
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
  }, []);

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = isMaximized ? modalHeight - 280 : modalHeight - 350;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);

  const columns: DevGridColumn[] = [
    {
      dataField: "employeeID",
      caption: t("employee_id"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "employeeName",
      caption: t("employee"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
    {
      dataField: "password",
      caption: t("password"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "discountType",
      caption: t("discount_type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "discountPercentage",
      caption: t("discount_percentage"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
            <ERPDataCombobox
              data={postData}
              id="employeeID"
              field={{
                id: "employeeID",
                required: true,
                getListUrl: Urls.data_employees,
                valueKey: "id",
                labelKey: "name",
              }}
              validation={postData.validations.employeeID}
              onChangeData={(data: any) => { setPostData((previous: any) => ({ ...previous, employeeID: data.employeeID, })); }}
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
              onChangeData={(data: any) => { setPostData((previous: any) => ({ ...previous, password: data.password, })); }}
            />
            <ERPInput
              id="confirmPassword"
              data={postData}
              value={postData.confirmPassword}
              label={t("confirm_password")}
              placeholder={t("confirm_password")}
              required={true}
              onChangeData={(data: any) => { setPostData((previous: any) => ({ ...previous, confirmPassword: data.confirmPassword, })); }}
            />
          </div>

          <div className="grid grid-cols-2 my-2 gap-3 ">
            <ERPButton
              loading={postDataLoading}
              onClick={handleSubmit}
              title={t("save")}
              variant="primary"
            />
            <ERPButton
              onClick={onClear}
              title={t("clear")}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <DataGrid
              columns={columns}
              dataSource={store}
              onRowClick={(e) => onSelectionChanged(e)}
              height={gridHeight.windows}
              key="authorizationID"
              showBorders={true}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AuthorizationSettings;
