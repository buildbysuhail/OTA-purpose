import React, { Fragment, useMemo } from "react";
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
  const { t } = useTranslation();
  const rootState = useRootState();

  const handleDelete = async (data: any) => {
    
    const res = await api.post(Urls.revertBillModifications, {
      invTransactionMasterID: data.data.invTransactionMasterID,
      remarks: data.data.remarks,
      tType: data.data.tType,
    });
    handleResponse(res);
  };
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "invTransactionMasterID",
        caption: "Transaction Master ID",
        dataType: "number",
        allowSorting: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "transactionDate",
        caption: "Transaction Date",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "VchNo",
        caption: "Voucher Number",
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "voucherType",
        caption: "Voucher Type",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "voucherForm",
        caption: "Voucher Form",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "remarks",
        caption: "Remarks",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "tType",
        caption: "Transaction Type",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "description",
        caption: "Description",
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
              <i
                className="ri-delete-bin-5-line delete-icon cursor-pointer"
                onClick={() => handleDelete(cellElement)}
              ></i>
            </div>
          );
        },
      },
    ],
    [t]
  );

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid
                  columns={columns}
                  gridHeader={t("revert_bill_modifications")}
                  dataUrl={Urls.revertBillModifications}
                  gridId="grd_revertBillModifications"
                  popupAction={toggleRevertBillModifications}
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
          dispatch(toggleRevertBillModifications({ isOpen: false, key: null }));
        }}
      />
    </Fragment>
  );
};

export default React.memo(RevertBillModifications);
