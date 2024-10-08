import { Fragment } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { toggleRevertBillModifications } from "../../../redux/slices/popup-reducer";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../redux/urls";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";

const RevertBillModifications = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();

  const columns: DevGridColumn[] = [
    {
      dataField: "transactionMasterID",
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
      dataField: "transactionType",
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
      width: 180,
      cellRender: (cellElement: any) => (
        <ERPGridActions
          delete={{
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to revert this bill modification?",
            url: Urls?.revertBillModifications,
            key: cellElement?.data?.billModificationsId
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
                <ERPDevGrid
                  columns={columns}
                  gridHeader={t("revert_bill_modifications")}
                  dataUrl={Urls.revertBillModifications}
                  gridId="grd_revertBillModifications"
                  popupAction={toggleRevertBillModifications}
                  hideGridAddButton={true}
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
          dispatch(toggleRevertBillModifications({ isOpen: false }));
        }}
      />
    </Fragment>
  );
};

export default RevertBillModifications;