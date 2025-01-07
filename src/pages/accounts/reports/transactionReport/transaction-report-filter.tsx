import { useEffect, useState } from "react";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import TransactionReportfilterCheckboxes from "./transaction-report-filter-forms-checkboxes";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const TransactionReportFilter = ({ getFieldProps, handleFieldChange, _formState, getFormState }: any) => {
  
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
    <div className="grid grid-cols-1 gap-4">
      {/* <div className="flex items-center gap-4"> */}
      <ERPDateInput
        {...getFieldProps("dateFrom")}
        label={t("from")}
        onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
      />
      <ERPDateInput
        {...getFieldProps("dateTo")}
        label={t("to")}
        onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
      />
      {/* </div> */}
      {applicationSettings.mainSettings?.allowSalesRouteArea == true &&
      <ERPDataCombobox
        {...getFieldProps("salesRouteID")}
        label={t("sales_route")}
        field={{
          id: "salesRouteID",
          getListUrl: Urls.data_salesRoute,
          valueKey: "id",
          labelKey: "name",
        }}
        onSelectItem={(data) => handleFieldChange({salesRouteID:data.value,salesRouteName:data.name})}
      />}
      {JSON.stringify(getFormState())}

      {/* <div className="relative"> */}
      {/* <label className="block text-sm font-medium text-gray-700 p-3 sticky top-0 bg-white z-10">
            </label> */}
      <div className="overflow-x-auto border border-gray-400 rounded w-auto max-w-[1000px] h-auto max-h-[260px]">
        <div className="grid grid-flow-col auto-cols-max gap-4 p-4">
          {allTransactions && allTransactions.length > 0 && (
            <TransactionReportfilterCheckboxes onDataChange={(frmState: { vTypes: string, drCr: string, allChecked: boolean, isDr: boolean, isCr: boolean }) => {
              debugger;
              let updates = frmState;
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
                updates["drCr"] = "drCr";
              } else if (frmState.isDr) {
                updates["drCr"] = "dr";
              } else if (frmState.isCr) {
                updates["drCr"] = "cr";
              } else {
                updates["drCr"] = "drCr";
              }
              // Call handleFieldChange once with all updates
              
              handleFieldChange(updates);
            }}
            getFormState={getFormState}
              allTransactions={allTransactions}
              setAllTransactions={setAllTransactions}
            />
          )}
        </div>
      </div>
    </div>
    // </div>
  );
};
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
