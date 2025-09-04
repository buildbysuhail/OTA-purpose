
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TableColumn } from "../../../../Designer/interfaces";
import { DeepPartial } from "redux";
import ERPCheckbox from "../../../../../../components/ERPComponents/erp-checkbox";
import ErpInput from "../../../../../../components/ERPComponents/erp-input";
import ERPSubmitButton from "../../../../../../components/ERPComponents/erp-submit-button";
import { useDispatch } from "react-redux";
import { setTemplateTableState } from "../../../../../../redux/slices/templates/reducer";


interface TableManagerContentProps<T> {
  currentTableState: TableColumn<T>[];

}

interface TableManagerFooterProps {
  onSubmit: () => Promise<void>;
  onClose: () => Promise<void>;
}
function withGenericMemo<T>(component: (props: TableManagerContentProps<T>) => JSX.Element) {
  return React.memo(component) as (props: TableManagerContentProps<T>) => JSX.Element;
}
// AccountGroupOrderContent component
export const TableManagerContent = withGenericMemo(<T,>({ currentTableState}: TableManagerContentProps<T>) => {
    const dispatch = useDispatch();
    const { t } = useTranslation("masters");
  const handleChange = (field: keyof T, fields: Partial<TableColumn<T>>) => {
      dispatch(
        setTemplateTableState({
          key: field as string,
          fields,
          updateAll: false,
        })
      );
    };
  return (
    <>
    {  currentTableState && currentTableState.length > 0 && 
      currentTableState.map((item: TableColumn<T>, index: number) => {

        return (
           <div className=" px-1 py-3 flex  gap-1 items-center justify-center" key={`${String(item.field)}_${index}`}>
            <ERPCheckbox 
            id="tb_col_show"
            noLabel
            // label={t(item.label)}
            checked={item.show}
            onChange={(e) =>{
                debugger;
                handleChange(item.field as keyof T, { show: e.target.checked })
            }}     
           />
            <ErpInput
            disabled={item.show != true}
            type="number"
              id="tb_col_width"
              label={t("width")}
              className="w-20"
              value={item.width}
              onChange={(e) =>handleChange(item.field as keyof T, {width: e.target.value})}  
            />
            <ErpInput
            disabled={item.show != true}
            type="text"
              id="tb_col_label"
              label={String(item.field)}
              value={item.label}
              placeholder={t("col_name")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>handleChange(item.field as keyof T, { label: e.target.value })}  
            />
          </div>
        )
      })
    }
      
    </>
  );
  }
);

// TableManagerFooter component
export const TableManagerFooter: React.FC<TableManagerFooterProps> = React.memo(({ onSubmit,onClose }) => {
  const { t } = useTranslation("masters");
  return (
    <div className="flex gap-10 justify-between  border-t dark:!border-dark-border mt-0">
      <ERPSubmitButton type="button" variant="primary" onClick={onSubmit}>
        {t("save")}
      </ERPSubmitButton>

      <ERPSubmitButton
        type="reset"
        onClick={onClose}
        className="w-28 dark:text-dark-hover-text bg-[#e5e7eb] text-[#404040]">
        {t("cancel")}
      </ERPSubmitButton>
    </div>
  );
});
