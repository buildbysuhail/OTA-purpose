import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../../redux/urls";
import { ActionType } from "../../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../../redux/slices/popup-reducer";

interface DailySummary {

  from: Date
}
const DailySummary = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [filter, setFilter] =useState<DailySummary>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "cType",
      caption: t('c_type'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible:false,
      width: 300,
    },
    {
      dataField: "description",
      caption: t("description"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    
    },
    {
      dataField: "amount",
      caption:  t("amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  showSerialNo={true}
                  gridHeader={t("daily_summary_report")}
                  dataUrl= {Urls.acc_reports_daily_summary}
                  method={ActionType.POST}
                  postData={filter}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  remoteOperations={{filtering:false,paging:false,sorting:false}}
                  hideGridAddButton={true}
                  reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </Fragment>
  );
};

export default DailySummary;