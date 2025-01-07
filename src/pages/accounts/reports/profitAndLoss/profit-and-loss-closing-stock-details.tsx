import { FC } from "react";
import { Fragment } from "react/jsx-runtime";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";

interface ProfitAndLossClosingStockProps {
  postData: any;
  groupName?: string;
}

const ProfitAndLossClosingStockDetails: FC<ProfitAndLossClosingStockProps> = ({ postData, groupName }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "voucherType",
      caption: t('voucher_type'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.voucherType === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {cellElement.data.voucherType}
        </span>
      ),
    },
    {
      dataField: "totalValue",
      caption: t("total_value"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.voucherType === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {cellElement.data.totalValue}
        </span>
      ),
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={groupName}
                  dataUrl={Urls.acc_reports_closing_stock_details}
                  postData={postData}
                  hideGridAddButton={true}
                  enablefilter={false}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  gridId="grd_profit_and_loss_closing_stock_detailed"
                  // popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  // gridAddButtonType="popup"
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
export default ProfitAndLossClosingStockDetails;