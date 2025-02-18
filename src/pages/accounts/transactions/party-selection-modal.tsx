import React, { Fragment, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { toggleAccountGroupPopup } from "../../../redux/slices/popup-reducer";
import { RootState } from "../../../redux/store";
import Urls from "../../../redux/urls";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";

const PartySelection = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('transaction');
  const rootState = useRootState();
  const _rootState = useAppSelector((state: RootState) => state.PopupData);
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "siNo",
        caption: t("SiNo"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 70,
        isLocked: true,
        showInPdf: true,
      },
      {
        dataField: "partyName",
        caption: t("party_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf: true,
      },
      {
        dataField: "taxNo",
        caption: t("tax_no"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
    ],
    []
  );
  useEffect(() => {
    dispatch(toggleAccountGroupPopup({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                dataUrl={Urls.account_group}
                gridId="party_selection_modal"
                gridAddButtonType="popup"
                reload={rootState?.PopupData?.accountGroup?.reload}
                gridAddButtonIcon="ri-add-line"
                pageSize={40}
                allowSearching={false}
                allowExport={false}
                hideGridAddButton={true}
                enableScrollButton={false}
                ShowGridPreferenceChooser={false}
                showPrintButton={false}
                hideDefaultExportButton={true}
                hideDefaultSearchPanel={true}
                hideGridHeader={true}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default React.memo(PartySelection);
