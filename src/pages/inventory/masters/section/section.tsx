import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleProductGroup, toggleSection } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { SectionManage } from "./section-manage";


const Section = () => {
  
const MemoizedSectionManage = useMemo(() => React.memo(SectionManage), []);
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
        dataField: "sectionCode",
        caption: t("section_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "sectionName",
        caption: t("section_name"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth:200
      },
      {
        dataField: "shortName",
        caption: t("short_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width:100

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
        caption: t("created_user"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,


      },
      {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width:200

      },
      {
        dataField: "modifiedUser",
        caption: t("modified_user"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,

      },
      {
        dataField: "modifiedDate",
        caption: t("modified_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width:200

      },
      {
        dataField: "isCommon",
        caption: t("is_common"),
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
              view={{ type: "popup", action: () => toggleSection({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
              edit={{ type: "popup", action: () => toggleSection({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
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
                  gridHeader="Section"
                  dataUrl={Urls.section}
                  gridId="grd_section"
                  popupAction={toggleSection}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.section?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.section.isOpen || false}
        title="Section"
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleSection({ isOpen: false }));
        }}
        content={<MemoizedSectionManage/>}
       
      />
      
    </Fragment>
  );
};

export default React.memo(Section);
