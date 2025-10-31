import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { initialTableColumn, TableColumn } from "../../../../Designer/interfaces";
import { addTemplateTableColumn, editTemplateTableColumn } from "../../../../../../redux/slices/templates/reducer";
import { PrintDetailDto } from "../../../../../use-print-type";
import ErpInput from "../../../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../../../../components/ERPComponents/erp-data-combobox";
import { modelToListFromObject } from "../../../../../../utilities/Utils";
import { initialPrintDetailDto } from "../../../../../use-print-type-data";

interface TableManagerContentProps {
  index?: number;
  column?: TableColumn<PrintDetailDto>;
  onClose: any;
}

export const TableColumnAddOrEdit: React.FC<TableManagerContentProps> = React.memo(
  ({ index, column, onClose }) => {
    
    const dispatch = useDispatch();
    const { t } = useTranslation("masters");
    const [_column, setColumn] = useState<TableColumn<PrintDetailDto>>(column || initialTableColumn);
    const [options, setOptions] = useState<any>([]);
    useEffect(() => {
      const list =modelToListFromObject<PrintDetailDto>(initialPrintDetailDto)
      setOptions(list)
    }, [])
    
    const onSave = () => {
      if (!column) {
        dispatch(addTemplateTableColumn({ index, column: _column }));
      } else {
        dispatch(editTemplateTableColumn({ index, column: _column }));
      }
      onClose();
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
        </div>

        <div className="flex gap-10 justify-between border-t dark:!border-dark-border mt-0">
          <ERPButton type="button" variant="primary" onClick={onSave}>
            {t("save")}
          </ERPButton>

          <ERPButton
            type="reset"
            onClick={onCancel}
            className="w-28 dark:text-dark-hover-text bg-[#e5e7eb] text-[#404040]"
          >
            {t("cancel")}
          </ERPButton>
        </div>
      </>
    );
  }
);
