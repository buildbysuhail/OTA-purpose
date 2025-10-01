import { Fragment, useCallback, useEffect, useRef, useState } from "react";
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
  modalHeight?: any;
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
  const [gridHeight, setGridHeight] = useState<number>(500);

  // Refs for measuring sibling elements
  const formRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Function to calculate DataGrid height
  const calculateGridHeight = useCallback(() => {
    if (!modalHeight || !formRef.current || !buttonsRef.current) return 500;

    // Get heights of sibling elements
    const formHeight = formRef.current.getBoundingClientRect().height;
    const buttonsHeight = buttonsRef.current.getBoundingClientRect().height;

    // Estimate additional margins/paddings and modal borders
    const extraPadding = 40; // Adjust based on CSS (e.g., gap, padding, borders)
    const modalHeaderFooter = isMaximized ? 80 : 100; // Adjust for header/footer

    // Calculate available height
    const calculatedHeight = modalHeight - formHeight - buttonsHeight - extraPadding - modalHeaderFooter;

    // Ensure a minimum height and prevent negative values
    const minHeight = 200;
    return Math.max(minHeight, calculatedHeight);
  }, [modalHeight, isMaximized]);

  // Update grid height on mount and when modalHeight or isMaximized changes
  useEffect(() => {
    const updateHeight = () => {
      const newHeight = calculateGridHeight();
      setGridHeight(newHeight);
    };

    updateHeight();

    // Handle window resize
    const handleResize = () => {
      updateHeight();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateGridHeight]);

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
        }));
      });
    setPostDataLoading(false);
  };

  const onSelectionChanged = useCallback((e: any) => {
    const data = e.data;
    if (data != undefined && data != null) {
      setPostData((previous: any) => ({
        ...previous,
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
          <div ref={formRef} className="flex items-center gap-2">
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
              className="w-[360px]"
              validation={postData.validations.employeeID}
              onChangeData={(data: any) => { setPostData((previous: any) => ({ ...previous, employeeID: data.employeeID, })); }}
              label={t("employee")}
            />
            <ERPInput
              id="password"
              data={postData}
              value={postData.password}
              label={t("password")}
              placeholder={t("password")}
              required={true}
              className='max-w-36'
              onChangeData={(data: any) => { setPostData((previous: any) => ({ ...previous, password: data.password, })); }}
            />
            <ERPInput
              id="confirmPassword"
              data={postData}
              value={postData.confirmPassword}
              label={t("confirm_password")}
              placeholder={t("confirm_password")}
              required={true}
              className='max-w-36'
              onChangeData={(data: any) => { setPostData((previous: any) => ({ ...previous, confirmPassword: data.confirmPassword, })); }}
            />
          </div>

          <div ref={buttonsRef} className="flex items-center justify-end gap-2 my-2">
            <ERPButton
              loading={postDataLoading}
              onClick={handleSubmit}
              title={t("save")}
              variant="primary"
            />
            <ERPButton
              onClick={onClear}
              title={t("clear")}
              variant="secondary"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <DataGrid
              columns={columns}
              dataSource={store}
              onRowClick={(e) => onSelectionChanged(e)}
              height={gridHeight}
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