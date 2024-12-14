import React, { Fragment, useEffect, useMemo, useState } from "react";

import Urls from "../../../redux/urls";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleCounterPopup } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { useTranslation } from "react-i18next";
import { CounterManage } from "./counters-manage";


const Counters = () => {
const MemoizedCounterManage = useMemo(() => React.memo(CounterManage), []);
  const { t } = useTranslation("system");
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo( () => [
      {
        dataField: "siNo",
        caption: t("SiNo"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 70,
        isLocked:true,
        showInPdf:true,
      },
      {
        dataField: "counter",
        caption: t("counter"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        showInPdf:true,
      },
      {
        dataField: "descriptions",
        caption: t("descriptions"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 170,
        visible:false,
      },
      {
        dataField: "maintainShift",
        caption: t("maintain_shift"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        showInPdf:true,
      },
      {
        dataField: "createdUser",
        caption: t("created_user"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 170,
        visible:false
      },
      {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 160,
        visible:false
      },
      {
        dataField: "modifiedUser",
        caption: t("modified_user"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 170,
        visible:false
      },
      {
        dataField: "modifiedDate",
        caption: t("modified_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 160,
        visible:false
      },
      {
        dataField: "cashLedgerID",
        caption: t("cash_ledger_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
        visible:false,
      },
      {
        dataField: "ledgerName",
        caption: t("ledger_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 170,
        showInPdf:true,
      },
      {
        dataField: "vrPrefix",
        caption: t("voucher_prefix"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        showInPdf:true,
      },
      {
        dataField: "actions",
        caption: t("actions"),
        isLocked:true,
        allowSearch: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        cellRender: (cellElement: any) => {
          return (
            <ERPGridActions
              view={{ type: "popup", action: () => toggleCounterPopup({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
              edit={{ type: "popup", action: () => toggleCounterPopup({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
              delete={{
                onSuccess: () => {
                  dispatch(
                    toggleCounterPopup({
                      isOpen: false,
                      key: null,
                      reload: true,
                    })
                  );
                },
                confirmationRequired: true,
                confirmationMessage: "Are you sure you want to delete this item?",
                url:Urls?.Counter,key:cellElement?.data?.id
              }}
            />
          )
        },
      },
    ],
    []
  );
  useEffect(() => {
    dispatch(toggleCounterPopup({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid
                  columns={columns}
                  gridHeader={t("counter")}
                  dataUrl={Urls.Counter}
                  gridId="grd_counter"
                  popupAction={toggleCounterPopup}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => {
                    dispatch(
                      toggleCounterPopup({ ...rootState, reload: reload })
                    );
                  }}
                  reload={rootState?.PopupData?.counter?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ERPDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.counter.isOpen || false}
        title={t("counter")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleCounterPopup({ isOpen: false }));
        }}
        content={<MemoizedCounterManage/>}
       
      />
      
    </Fragment>
  );
};

export default React.memo(Counters);
