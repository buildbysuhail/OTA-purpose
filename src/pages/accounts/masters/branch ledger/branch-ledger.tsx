import React, { Fragment, useMemo } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleBranchLedgerPopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { BranchLedgerManage } from "./branch-ledger-manage";

const BranchLedger = () => {

  const MemoizedBranchLedgerManage = useMemo(() => React.memo(BranchLedgerManage), []);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();

  const columns: DevGridColumn[] = [
    {
      dataField: "branchLedgerID",
      caption: t("branch_ledger_id"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
      visible: false,
    },
    {
      dataField: "purchaseLedgerID",
      caption: t("purchase_ledger_id"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
      visible: false,
    },
    {
      dataField: "refBranchName",
      caption: t("ref_branch_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "purchaseLedger",
      caption: t("purchase_ledger"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    {
      dataField: "refBranchID",
      caption: t("ref_branch_id"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
      visible: false,
    },
    {
      dataField: "payableLedger",
      caption: t("payable_ledger"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    {
      dataField: "receivableLedger",
      caption: t("receivable_ledger"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
    },
    {
      dataField: "payableLedgerID",
      caption: t("payable_ledger_id"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
      visible: false,
    },
    {
      dataField: "receivableLedgerID",
      caption: t("receivable_ledger_id"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 220,
      visible: false,
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
          view={{ type: "popup", action: () => toggleBranchLedgerPopup({ isOpen: true, key: cellElement?.data?.branchLedgerID }) }}
          edit={{ type: "popup", action: () => toggleBranchLedgerPopup({ isOpen: true, key: cellElement?.data?.branchLedgerID }) }}
          delete={{
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
              url:Urls?.branch_ledger,key:cellElement?.data?.branchLedgerID
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
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("branch_ledger")}
                  dataUrl={Urls.branch_ledger}
                  gridId="grd_branch_ledger"
                  popupAction={toggleBranchLedgerPopup}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.branchLedger?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.branchLedger.isOpen || false}
        title={t("branch_ledger")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleBranchLedgerPopup({ isOpen: false, key: null }));
        }}
        content={<MemoizedBranchLedgerManage />}
      />
    </Fragment>
  );
};

export default React.memo(BranchLedger);

