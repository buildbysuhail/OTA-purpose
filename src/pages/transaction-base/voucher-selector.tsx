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
  voucherType: string;  
  onRowDblClick?: (e: any) => void;    
}
const api = new APIClient();
const VoucherSelector: React.FC<VoucherSelectorProps> = ({ voucherType, onRowDblClick }) => {
  const { t } = useTranslation();
  const [data,setData] = useState<{data: any, totalCount: number}>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getAsync(`${Urls.voucher_selector}${voucherType}`);
        setData(res);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [voucherType]);
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
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  onRowDblClick={onRowDblClick}
                  heightToAdjustOnWindows={300}
                  gridHeader={t("account_payable_aging_report")}
                  data={data}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  remoteOperations={{paging: false,filtering: false,  sorting: false}}
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

export default VoucherSelector;