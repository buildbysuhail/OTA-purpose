import { Fragment, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { useRootState } from "../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../components/types/dev-grid-column";
import ErpDevGrid from "../../components/ERPComponents/erp-dev-grid";
import Urls from "../../redux/urls";
import { ActionType } from "../../redux/types";
import { toggleCostCentrePopup } from "../../redux/slices/popup-reducer";
import { APIClient } from "../../helpers/api-client";

interface VoucherSelectorProps {
  data: any;  
  onRowDblClick?: (e: any) => void; 
  isMaximized?: boolean;
  modalHeight?: any;   
}
const api = new APIClient();
const VoucherSelector: React.FC<VoucherSelectorProps> = ({ data, onRowDblClick, isMaximized, modalHeight, }) => {
  const { t } = useTranslation();
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = modalHeight - 200;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);
  const columns: DevGridColumn[] = [
    {
      dataField: "formType",
      caption: t('form_type'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "lastPrefix",
      caption: t("last_prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "lastVNo",
      caption: t('last_vNo'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "isDefault",
      caption: t("is_default"),
      dataType: "boolean",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
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
                  onRowDblClick={onRowDblClick}
                  heightToAdjustOnWindowsInModal={gridHeight.windows}
                  gridHeader={t("account_payable_aging_report")}
                  data={data}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  remoteOperations={{paging: false,filtering: false,  sorting: false}}
                  hideGridAddButton={true}
                  reload={true}
                  showTotalCount={false}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </Fragment>
  );
};

export default VoucherSelector;