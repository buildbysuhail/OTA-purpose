import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleGroupCategory} from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { GroupCategoryManage } from "./group-category-manage";


const GroupCategory = () => {
  
const MemoizedGroupCategoryManage = useMemo(() => React.memo(GroupCategoryManage), []);
  const { t } = useTranslation();
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
        width: 50,
      },
      {
        dataField: "id",
        caption: t("id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 50,
      }, 
      {
        dataField: "categoryCode",
        caption: "Category Code",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,

      },
      {
        dataField: "categoryName",
        caption: "Category Name",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth:200
      },
      {
        dataField: "shortName",
        caption: "Short Name",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth:200

      },
      {
        dataField: "remarks",
        caption: t("remarks"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "createdUser",
        caption: "Created User",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth:200

      },
      {
        dataField: "createdDate",
        caption: "Created Date",
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width:150

      },
      {
        dataField: "modifiedUser",
        caption: "Modified User",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth:200

      },
      {
        dataField: "modifiedDate",
        caption: "Modified Date",
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width:150

      },
      {
        dataField: "isCommon",
        caption: "Is Common",
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width:100

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
            <ERPGridActions
              view={{ type: "popup", action: () => toggleGroupCategory({ isOpen: true, key: cellElement?.data?.id }) }}
              edit={{ type: "popup", action: () => toggleGroupCategory({ isOpen: true, key: cellElement?.data?.id }) }}
              delete={{
                confirmationRequired: true,
                confirmationMessage: "Are you sure you want to delete this item?",
                url:Urls?.section,key:cellElement?.data?.id
              }}
            />
          )
        },
      },
    ],
    []
  );

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader="Group Category"
                  dataUrl={Urls.group_category}
                  gridId="grd_group_category"
                  popupAction={toggleGroupCategory}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.groupCategory?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData?.groupCategory.isOpen || false}
        title="Group Category"
        width="w-full max-w-[900px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleGroupCategory({ isOpen: false }));
        }}
        content={<MemoizedGroupCategoryManage/>}
       
      />
      
    </Fragment>
  );
};

export default React.memo(GroupCategory);
