import { Fragment } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { toggleParties } from "../../../../redux/slices/popup-reducer";
import { PartiesManage } from "./parties-manage";


const Parties = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "currencyCode",
      caption: t("currency_code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "currencyName",
      caption: t("currency_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "currencySymbol",
      caption: t("currency_symbol"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "subUnit",
      caption: t("sub_unit"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "subUnitSymbol",
      caption: t("sub_unit_symbol"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "countryName",
      caption: t("country_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "countryId",
      caption: t("country_ID"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },

    {
      dataField: "actions",
      caption: t("actions"),
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "popup", action: () => toggleParties({ isOpen: true, key: cellElement?.data?.currencyId }) }}
          edit={{ type: "popup", action: () => toggleParties({ isOpen: true, key: cellElement?.data?.currencyId }) }}
          delete={{
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
            url: Urls?.parties, key: cellElement?.data?.currencyId
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
                  gridHeader={t("parties")}
                  dataUrl={Urls.parties}
                  gridId="grd_parties"
                  popupAction={toggleParties}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.parties?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.parties.isOpen || false}
        title={t("currency")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleParties({ isOpen: false, key: null }));
        }}
        content={<PartiesManage />}
      />
    </Fragment>
  );
};

export default Parties
