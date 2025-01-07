import React, { Fragment, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { toggleRevertBillModifications } from "../../../redux/slices/popup-reducer";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import Urls from "../../../redux/urls";
import { APIClient } from "../../../helpers/api-client";
import { handleResponse } from "../../../utilities/HandleResponse";

export interface RevertBillModificationData {
  invTransactionMasterID: number;
  remarks: string;
  tType: string;
}
interface DeleteData {
  invTransactionMasterID: number;
  remarks: string;
  tType: string;
}
export const initialRevertBillModificationData = {
  data: {
    invTransactionMasterID: 0,
    remarks: "",
    tType: "",
  },
  validations: {
    invTransactionMasterID: "",
    remarks: "",
    tType: "",
  },
};
const api = new APIClient();
const RevertBillModifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("system");
  const rootState = useRootState();
  const handleDelete = async (data: any) => {
    const res = await api.post(Urls.revertBillModifications, {
      invTransactionMasterID: data.data.invTransactionMasterID,
      remarks: '',
      tType: data.data.tType,
    });
    handleResponse(res);
  };
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "invTransactionMasterID",
        caption: t("transaction_master_ID"),
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "transactionDate",
        caption: t("transaction_date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "VchNo",
        caption: t("voucher_number"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "voucherType",
        caption: t("voucher_type"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "voucherForm",
        caption: t("voucher_form"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "remarks",
        caption: t("remarks"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "tType",
        caption: t("transaction_type"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "description",
        caption: t("description"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth: 150,
      },
      {
        dataField: "actions",
        caption: t("actions"),
        allowSearch: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        cellRender: (cellElement: any) => {
          return (
            <div className="chart-cell">
              <i className="ri-delete-bin-5-line delete-icon cursor-pointer" onClick={() => handleDelete(cellElement)}></i>
            </div>
          );
        },
      },
    ],
    [t]
  );
  useEffect(() => {
    dispatch(toggleRevertBillModifications({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid
                  columns={columns}
                  gridHeader={t("revert_bill_modifications")}
                  dataUrl={Urls.revertBillModifications}
                  gridId="grd_revertBillModifications"
                  popupAction={toggleRevertBillModifications}
                  changeReload={(reload: any) => {
                    dispatch(
                      toggleRevertBillModifications({ ...rootState, reload: reload })
                    );
                  }}
                  hideGridAddButton={true}
                  reload={rootState?.PopupData?.revertBillModifications?.reload}
                  gridAddButtonIcon="ri-history-line"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.revertBillModifications.isOpen || false}
        title={t("revert_bill_modifications")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleRevertBillModifications({ isOpen: false, key: null,reload: false }));
        }}
      />
    </Fragment>
  );
};
export default React.memo(RevertBillModifications);