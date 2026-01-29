import React, { Fragment, useEffect, useMemo } from "react";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleBenefitDeduction } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch, useAppSelector, } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../redux/store";
import { BenefitAndDeductionManage } from "./benefits-and-deduction-manage";
const BenefitDeduction = () => {
  const MemoizedBenefitDeduction = useMemo(() => React.memo(BenefitAndDeductionManage), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("hr");
  const rootState = useRootState();
  const _rootState = useAppSelector((state: RootState) => state.PopupData);
  const columns: DevGridColumn[] = [
    {
      dataField: "benefitDeductionID",
      caption: t("id"),
      dataType: "string",
      visible: false,
    },
    {
      dataField: "benefitDeductionName",
      caption: t("benefit_Deduction_Name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
    },
    {
      dataField: "benefitDeductType",
      caption: t("benefit_Deduct_Type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
    },
    {
      dataField: "isBasic",
      caption: t("is_basic"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "createdUser",
      caption: t("created_user"),
      dataType: "string",
      width: 150,
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "date",
      width: 100,
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_user"),
      dataType: "string",
      width: 150,
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "date",
      width: 100,
    },

    {
      dataField: "actions",
      caption: t("actions"),
      isLocked: true,
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: document?.dir === "rtl" ? "left" : "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "popup", action: () => toggleBenefitDeduction({ isOpen: true, key: cellElement?.data?.benefitDeductionID, reload: false, mode: "view" }), }}
          edit={{ type: "popup", action: () => toggleBenefitDeduction({ isOpen: true, key: cellElement?.data?.benefitDeductionID, reload: false, mode: "edit" }), }}
          delete={{
            onSuccess: () => { dispatch(toggleBenefitDeduction({ isOpen: false, key: null, reload: true, })); },
            confirmationRequired: true,
            confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
            url: Urls?.benefits_and_deductions,
            key: cellElement?.data?.benefitDeductionID,
          }}
        />
      ),
    },
  ];
  useEffect(() => { dispatch(toggleBenefitDeduction({ ...rootState, reload: true })); }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                gridHeader={t("benefits_and_deductions")}
                dataUrl={Urls.benefits_and_deductions}
                gridId="grd_benefits_and_deductions"
                popupAction={toggleBenefitDeduction}

                gridAddButtonType="popup"
                changeReload={(reload: any) => { dispatch(toggleBenefitDeduction({ ...rootState, reload: reload })) }}
                reload={rootState?.PopupData?.BenefitDiduction?.reload}
                gridAddButtonIcon="ri-add-line"
                pageSize={40}
              />
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.BenefitDiduction.isOpen || false}
        title={t("benefits_and_deductions")}
        width={600}
        height={250}
        isForm={true}
        closeModal={() => { dispatch(toggleBenefitDeduction({ isOpen: false, key: null, reload: false })); }}
        content={<MemoizedBenefitDeduction />}
      />
    </Fragment>
  );
};

export default React.memo(BenefitDeduction);