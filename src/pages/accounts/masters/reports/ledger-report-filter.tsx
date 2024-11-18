import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ImprovedERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import { LedgerType } from "../../../../enums/ledger-types";
import Urls from "../../../../redux/urls";
interface FormState {
  all: boolean;
  ledgerID: number;

}

const LedgerReportFilter = ({ getFieldProps, handleFieldChange, t }: any) => (
  
  <div>
    <ERPDateInput
      {...getFieldProps("fromDate")}
      label={t("From Date")}
      onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
    />
    <ERPDateInput
      {...getFieldProps("toDate")}
      label={t("To Date")}
      onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
    />
    </div>
  //    <ERPCheckbox
  //     {...getFieldProps("toDate")}
  //                 id="all"
  //                 // data={formState.ledgerID=-1}
  //                 label={t("all")}
  //                 checked={formState?.all}
  //                 onChangeData={(data) =>
  //                   handleFieldChange("all", data.all)
  //                 }
  //               />
  //                <ERPDataCombobox
  //               id="ledgerCode"
  //               data={formState.ledger_code}
  //               label={t("ledger_code")}
  //               field={{
  //                 id: "ledgerCode",
  //                 //required: true,
  //                 getListUrl: Urls.data_acc_ledgers,
  //                 params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
  //                 valueKey: "id",
  //                 labelKey: "name",
  //               }}
  //               onChangeData={(data) => handleFieldChange('relLedgerID', data.relLedgerID)}
  //             />

  //    <ERPCheckbox
  //                 id="ledgers"
  //                 data={formState}
  //                 label={t("ledgers")}
  //                 checked={formState?.ledger}
  //                 onChangeData={(data) =>
  //                   handleFieldChange("giftOnBilling", data.le)
  //                 }
  //               />
  //               <ERPDataCombobox
  //                 id="ledgerName"
  //                 data={formState.ledger_code}
  //                 label={t("ledger_code")}
  //                 field={{
  //                   id: "ledgerName",
  //                   //required: true,
  //                   getListUrl: Urls.data_acc_ledgers,
  //                   params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
  //                   valueKey: "id",
  //                   labelKey: "name",
  //                 }}
  //                 onChangeData={(data) => handleFieldChange('relLedgerID', data.relLedgerID)}
  //                 disabled={!formState?.ledger}
  //                 label=" "
  //               />
      
  // </div>
  
);
export default LedgerReportFilter;