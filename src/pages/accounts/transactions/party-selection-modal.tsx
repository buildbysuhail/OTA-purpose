import React, { Fragment, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { toggleAccountGroupPopup } from "../../../redux/slices/popup-reducer";
import { RootState } from "../../../redux/store";
import Urls from "../../../redux/urls";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { ActionType } from "../../../redux/types";
import { accFormStateHandleFieldChange, accFormStateRowHandleFieldChange } from "./reducer";

interface PartySelectionProps {
  focusTaxNoField: () => void;
}

interface RowDblClickEvent {
  data: {
    partyName: string;
    taxNo: string;
  };
}

const PartySelection: React.FC<PartySelectionProps> = ({ focusTaxNoField }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('transaction');

  const formState = useAppSelector((state: RootState) => state.AccTransaction);

  const onRowDblClick = useCallback(async (_event: RowDblClickEvent) => {
    debugger;
    dispatch(accFormStateHandleFieldChange({ fields: { showPartySelection: false } }));
    dispatch(
      accFormStateRowHandleFieldChange({
        fields: {
          partyName: _event.data.partyName,
          taxNo: _event.data.taxNo,
        },
      })
    );
    focusTaxNoField();
  },[]);

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "partyName",
        caption: t("party_name"),
        dataType: "string",
        allowSorting: true,
        width: 400,
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
        width: 200,
      },
    ],
    [t]
  );


  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                dataUrl={Urls.acc_transaction_parties_tax_on_expense}
                postData={{ PartyName: formState.row.partyName ?? "" }}
                method={ActionType.POST}
                gridId="party_selection_modal"
                gridAddButtonType="popup"
                gridAddButtonIcon="ri-add-line"
                onRowDblClick={onRowDblClick}
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
