import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPDateInput  from "../../../../components/ERPComponents/erp-date-input";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import PartySummaryCollection from "./party-summary-collection";
import PartySummaryLedger from "./party-summary-ledger";
import moment from "moment";
export interface PartySummaryFilter {
  filter: {
    from: any;
    to: Date;
  };
}
const PartySummaryMaster = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<PartySummaryFilter>({filter: {
    from: moment().utc().toISOString(),
    to: new Date(),
  }});

  debugger;
  const [activeTab, setActiveTab] = useState("address");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
            <ERPDateInput
                                  id="from"
                                  value={filter.filter.from}
                                  customSize='sm'
                                  data={filter.filter}
                                  label="supervisor_password"
                                  onChangeData={(data: any) => setFilter((prev: any) => ({
                                    ...prev,
                                    filter: {
                                      ...prev.filter,
                                      from: data.from
                                    }
                                  }))}
                              />
              <div className="grid grid-cols-1 gap-3">
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Address" value="address" />
                  <Tab label="Bank" value="bank" />
                  <Tab label="Details" value="details" />
                  <Tab label="More" value="more" />
                  {/* <Tab label="Project/Job" value="project_job" /> */}
                  {/* {userSession.countryId != Countries.India &&
                    applicationSettings?.branchSettings?.maintainKSA_EInvoice ==
                    true && <Tab label="Other" value="other_details" />} */}
                </Tabs>
                <div className="pt-4">
                  {activeTab === "address" && (
                    <PartySummaryCollection filter={filter.filter}></PartySummaryCollection>
                  )}
                  {activeTab === "bank" && (
                    <PartySummaryLedger></PartySummaryLedger>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PartySummaryMaster;
