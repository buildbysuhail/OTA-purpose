import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { initialTableColumn, TableColumn, templateDesignerFormatOptions } from "../../../../Designer/interfaces";
import { addTemplateTableColumn,  } from "../../../../../../redux/slices/templates/reducer";
import { PrintDetailDto } from "../../../../../use-print-type";
import ErpInput from "../../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../../../../components/ERPComponents/erp-data-combobox";
import { modelToListFromObject } from "../../../../../../utilities/Utils";
import { initialPrintDetailDto } from "../../../../../use-print-type-data";
import { RootState } from "../../../../../../redux/store";
import ERPToast from "../../../../../../components/ERPComponents/erp-toast";

interface TableManagerContentProps {
  onClose: any;
}

export const TableColumnAddOrEdit: React.FC<TableManagerContentProps> = React.memo(
  ({onClose }) => {
     const lastMessage  = useSelector((state: RootState) => state.Template?.lastActionMessage);
    const dispatch = useDispatch();
    const { t } = useTranslation("masters");
    const [_column, setColumn] = useState<TableColumn<PrintDetailDto>>( initialTableColumn);
    const [options, setOptions] = useState<any>([]);
    useEffect(() => {
      const list =modelToListFromObject<PrintDetailDto>(initialPrintDetailDto)
      setOptions(list)
    }, [])
useEffect(() => {
  if (lastMessage === "COLUMN_FIELD_ALREADY_EXISTS") {
    ERPToast.showWith("This column already exists in table!", "warning")
    return; // do NOT close the form
  }

  if (lastMessage === "COLUMN_ADDED") {
    onClose(); // close only when added successfully
  }
}, [lastMessage]);

    const onSave = () => {
        dispatch(addTemplateTableColumn({ column: _column }));
    };

    const onCancel = () => {
      onClose();
    };

    return (
      <>
        <div className="px-1 py-3 flex gap-1 items-center justify-center">
          <ERPDataCombobox
            id="unit"
            label="Unit"
            field={
              {
                labelKey:"label",
                valueKey:"id"
              }
            }
            options={options}
            value={_column.field}
            onChange={(e) =>{  setColumn(prev => ({ ...prev, field: e.value, label: e.label }))}}
          />
          <ErpInput
            type="number"
            id="tb_col_width"
            label={t("width")}
            className="w-20"
            value={_column.width}
            onChange={(e) => setColumn(prev => ({ ...prev, width: e.target.value as any }))}
          />
          <ErpInput
            type="text"
            id="tb_col_label"
            label={String(_column.field)}
            value={_column.label}
            placeholder={t("col_name")}
            onChange={(e) => setColumn(prev => ({ ...prev, label: e.target.value }))}
          />
          <ERPDataCombobox
            id="format"
            label={t("format")}
            field={
              {
                labelKey:"label",
                valueKey:"value"
              }
            }
            options={templateDesignerFormatOptions}
            value={_column.format}
            initialValue={"NONE"}
            onChange={(e) =>{  setColumn(prev => ({ ...prev, format: e.value}))}}
          />          
        </div>

        <div className="flex  border-t justify-end  px-4">
          <ERPButton
            type="button"
            variant="primary"
            onClick={onSave}
            title={t("save")}
          />
           <ERPButton
            type="button"
            className="secondary"
            onClick={onCancel}
            title={t("cancel")}
            // className="w-28 dark:text-dark-hover-text bg-[#e5e7eb] text-[#404040]"
          />
        </div>
      </>
    );
  }
);
