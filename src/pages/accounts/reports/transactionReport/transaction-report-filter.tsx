import { useEffect, useState } from "react";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import TransactionReportfilterCheckboxes from "./transaction-report-filter-forms-checkboxes";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import React from "react";

const TransactionReportFilter = React.memo(({
  getFieldProps,
  handleFieldChange,
  _formState,
  getFormState,
}: any) => {
  const applicationSettings = useSelector(
    (state: RootState) => state.ApplicationSettings
  );

  const { t } = useTranslation("accountsReport");
  const api = new APIClient();
  const [allTransactions, setAllTransactions] = useState<any>();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const res: any[] = await api.getAsync(Urls.data_vouchertype);
    const updatedVouchers = res?.map((tr) => ({
      ...tr, // Spread existing properties
      checked: false, // Add new `checked` property
    }));
    setAllTransactions(updatedVouchers);
  };

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <ERPDateInput
            {...getFieldProps("dateFrom")}
            label={t("from")}
            className="max-w-[150px]"
            onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
          />

          <ERPDateInput
            {...getFieldProps("dateTo")}
            label={t("to")}
            className="max-w-[150px]"
            onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
          />
        </div>

        {
          applicationSettings.mainSettings?.allowSalesRouteArea === true && (
            <ERPDataCombobox
              {...getFieldProps("salesRouteID")}
              label={t("sales_route")}
              className="w-full sm:w-auto sm:max-w-[325px]"
              field={{
                id: "salesRouteID",
                getListUrl: Urls.data_salesRoute,
                valueKey: "id",
                labelKey: "name",
              }}
              onSelectItem={(data) =>
                handleFieldChange({
                  salesRouteID: data.value,
                  salesRouteName: data.name,
                })
              }
            />
          )
        }
      </div>

      {/* <div className="relative"> */}
      {/* <label className="block text-sm font-medium text-gray-700 p-3 sticky top-0 bg-white z-10">
            </label> */}
      <div className="overflow-auto border dark:!border-dark-border border-gray-400 rounded w-full max-w-full h-auto max-h-[350px] dark-scrollbar">
        <div className="grid grid-flow-col auto-cols-max gap-4 p-4 text-left">
          {
            allTransactions && allTransactions.length > 0 && (
              <TransactionReportfilterCheckboxes
                onDataChange={(frmState: {
                  vTypes: string;
                  drCr: string;
                  allChecked: boolean;
                  isDr: boolean;
                  isCr: boolean;
                  dateFrom: Date;
                  dateTo: Date;
                  salesRouteID: number;
                  salesRouteName: string;
                }) => {
                  let updates = frmState;
                  let drCrData = ""
                  // if (frmState.allChecked) {
                  //   updates["vTypes"] = "All";
                  //   updates["isDr"] = frmState?.isDr;
                  //   updates["isCr"] = frmState?.isCr;
                  // } else {
                  //   // const sds = allTransactions
                  //   //   ?.filter((xx: any) => xx.checked === true)
                  //   //   ?.map((tr: any) => tr.id)
                  //   //   ?.join(',');
                  //   // updates["vTypes"] = sds || '';
                  // }
                  if (frmState.isDr && frmState.isCr) {
                    drCrData = "drCr";
                  } else if (frmState.isDr) {
                    drCrData = "dr";
                  } else if (frmState.isCr) {
                    drCrData = "cr";
                  } else {
                    drCrData = "drCr";
                  }
                 const newUpdates = (({ dateFrom, dateTo, salesRouteID, salesRouteName, ...rest }) => ({
                  ...rest,
                  drCr: drCrData,}))(updates);
                 handleFieldChange(newUpdates);
                }}
                getFormState={getFormState}
                allTransactions={allTransactions}
                setAllTransactions={setAllTransactions}
              />
            )
          }
        </div>
      </div>
    </div>
  );
});
export default TransactionReportFilter;
export const TransactionReportFilterInitialState = {
  dateFrom: new Date(),
  dateTo: new Date(),
  vTypes: "All",
  drCr: "drCr",
  salesRouteID: -1,
  isDr: true,
  isCr: true,
  isChecked: false,
  allTransactions: -1,
};
