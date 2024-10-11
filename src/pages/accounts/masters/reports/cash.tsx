import { Fragment } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";

const Cash = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "costCentreID",
      caption: t('cost_centre_id'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    {
      dataField: "costCentreName",
      caption: t('cost_centre_name'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    {
      dataField: "shortName",
      caption: t("short_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 220,
    },
    {
      dataField: "actions",
      caption: t("actions"),
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 180,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "popup", action: () => toggleCostCentrePopup({ isOpen: false, key: cellInfo?.data?.id }) }}
          edit={{ type: "popup", action: () => toggleCostCentrePopup({ isOpen: false, key: cellInfo?.data?.id }) }}
          delete={{
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
            // action: () => handleDelete(cellInfo?.data?.id),
          }}
        />
      ),
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
                  gridHeader={t("cost_centre")}
                  dataUrl={Urls.cost_center}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.costCentre?.reload}
                  gridAddButtonIcon=""
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </Fragment>
  );
};

export default Cash;