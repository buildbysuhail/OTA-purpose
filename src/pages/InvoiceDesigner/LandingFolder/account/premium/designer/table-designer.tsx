import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { TemplateReducerState } from "../../../../../../redux/reducers/TemplateReducer";
import { useDispatch, useSelector } from "react-redux";
import { ERPScrollArea } from "../../../../../../components/ERPComponents/erp-scrollbar";
import {  setTemplateTableMasterState, setTemplateTableState, setTemplateTotalState } from "../../../../../../redux/slices/templates/reducer";
import { ItemTableMasterState, TableColumn, TemplateState } from "../../../../Designer/interfaces";
import ERPCheckbox from "../../../../../../components/ERPComponents/erp-checkbox";
import ErpInput from "../../../../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../../../../components/ERPComponents/erp-step-input";
import ERPTab from "../../../../../../components/ERPComponents/erp-tab";
import { DeepPartial } from "redux";
import { TransactionDetail } from "../../../../../inventory/transactions/purchase/transaction-types";
import { RootState } from "../../../../../../redux/store";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import ERPButton from "../../../../../../components/ERPComponents/erp-button";
import ERPModal from "../../../../../../components/ERPComponents/erp-modal";
import { TableManagerContent, TableManagerFooter } from "./tabble-col-manage";

interface ItemTableDesignerProps<T> {
  tableState: TableColumn<T>[];
}
interface ItemTableLabelDesignerProps<T> {
  tableState: TableColumn<T>[];
  currentTableState: TableColumn<T>[];
  onChange?: (key: keyof T, tableState: DeepPartial<TableColumn<T>>) => void;
}
interface ItemTableLayoutDesignerProps {
  masterState?: ItemTableMasterState;
  onChange?: (state: ItemTableMasterState) => void;
}

const LabelsEditor = <T,>({ tableState, currentTableState,  onChange}: ItemTableLabelDesignerProps<T>) => {
  const { t } = useTranslation('system');
  const dispatch = useDispatch();
  const [openTableCol,setOpenTableCol] = useState(false);

  useEffect(() => {
    const updatedCurrentTableState = currentTableState.map(currentItem => {
      // Find matching item in tableState by field variable
      const matchingTableItem = tableState.find(tableItem => 
        tableItem.field === currentItem.field
      );
      
      // If matching item exists in tableState, keep the current item
      // Otherwise, it will be filtered out
      return matchingTableItem ? currentItem : null;
    }).filter(Boolean); // Remove null items
    
    // Add items from tableState that don't exist in currentTableState
    const fieldsInCurrent = new Set(currentTableState.map(item => item.field));
    const itemsToAdd = tableState.filter(tableItem => 
      !fieldsInCurrent.has(tableItem.field)
    );
    
    // Combine filtered current items with new items from tableState
    const finalTableState = [...updatedCurrentTableState, ...itemsToAdd];
    
    // Only update if there are actual changes
    if (JSON.stringify(finalTableState) !== JSON.stringify(currentTableState)) {
      dispatch(setTemplateTableState({fields:{}, key:"", templateState:finalTableState as any, updateAll: true}));
    }
  }, [tableState, currentTableState, onChange]);

  
  const onClose = async () => setOpenTableCol(false);
   const onSubmit = async () => {
    setOpenTableCol(false);
   }
  
  return (
    <>
       <div className="flex justify-end">
          <ERPButton
            title={t("new")}
            variant="primary"
            onClick={()=>setOpenTableCol(true)}
        />
      </div>
    {  currentTableState && currentTableState.length > 0 && 
     currentTableState.filter((col)=>col.show).map((item: TableColumn<T>, index: number) => {

        return (
           <div className=" flex gap-2" key={`${index}_${String(item.field)}`}>
            <ERPCheckbox
            
        id="tb_col_show"
        noLabel
        // label={t(item.label)}
        checked={item.show}
        onChange={(e) => onChange && onChange(item.field as keyof T,{show: e.target.checked})}
      />
            <ErpInput
            disabled={item.show != true}
            type="number"
              id="tb_col_width"
              label={t("width")}
              className="w-20"
              value={item.width}
              onChange={(e) => onChange && onChange(item.field as keyof T,{width: e.target.value})}
            />
            <ErpInput
            disabled={item.show != true}
              id="tb_col_label"
              label={t(item.label)}
              value={item.label}
              onChange={(e) => onChange && onChange(item.field as keyof T,{label: e.target.value})}
            />
          </div>
        )
      })
    }
      <ERPModal
        isForm={true}
        disableOutsideClickClose={false}
        isOpen={openTableCol}
        title="Choose TableColumns"
        closeModal={() => setOpenTableCol(false)}
        width={1000}
        height={700}
        content={<TableManagerContent<T> currentTableState={currentTableState} />}
        // footer={<TableManagerFooter onSubmit={onSubmit}  onClose={onClose}/>}
      />  
    </>
  );
};


const LayoutEditor = ({ masterState, onChange }: ItemTableLayoutDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const { t } = useTranslation('system');

  return (
    <div className="flex flex-col gap-4">
      <ERPCheckbox
        id="showTableRowBorder"
        label={t("table_row_border")}
        onChange={(e) => onChange?.({ ...masterState, showTableRowBorder: e.target.checked })}
        checked={masterState?.showTableRowBorder}
      />

      {masterState?.showTableRowBorder && (
        <ErpInput
          id="tableRowBorderColor"
          label={t("border_color")}
          type="color"
          value={masterState?.tableRowBorderColor}
          onChange={(e) => onChange?.({ ...masterState, tableRowBorderColor: e.target?.value })}
        />
      )}

      <ERPCheckbox
        id="showTableColBorder"
        label={t("table_col_border")}
        onChange={(e) => onChange?.({ ...masterState, showTableColBorder: e.target.checked })}
        checked={masterState?.showTableColBorder}
      />

      {masterState?.showTableColBorder && (
        <ErpInput
          id="tableColBorderColor"
          label={t("border_color")}
          type="color"
          value={masterState?.tableColBorderColor}
          onChange={(e) => onChange?.({ ...masterState, tableColBorderColor: e.target?.value })}
        />
      )}

      <h3>{t("table_header")}</h3>
      <ERPCheckbox
        id="headerRepeatOnPage"
        label={t("header_repeat_on_each_page")}
        onChange={(e) => onChange?.({ ...masterState, headerRepeatOnPage: e.target.checked })}
        checked={masterState?.headerRepeatOnPage}
      />
      <ERPStepInput
        value={masterState?.headerFontSize}
        onChange={(headerFontSize) => onChange?.({ ...masterState, headerFontSize })}
        label={t("size_(8-28)")}
        id="headerFontSize"
        placeholder=" "
        defaultValue={10}
        min={8}
        max={28}
        step={1}
      />

      <ERPCheckbox
        id="showTableHeaderBg"
        label={t("background")}
        onChange={(e) => {
          onChange?.({ ...masterState, showTableHeaderBg: e.target.checked });
        }}
        checked={masterState?.showTableHeaderBg}
      />

      {masterState?.showTableHeaderBg && (
        <ErpInput
          id="tableHeaderBgColor"
          label={t("background_color")}
          type="color"
          value={masterState?.tableHeaderBgColor}
          onChange={(e) => {
            onChange?.({ ...masterState, tableHeaderBgColor: e.target?.value });
          }}
        />
      )}

      <ErpInput
        id="headerFontColor"
        label={t("font_color")}
        type="color"
        value={masterState?.headerFontColor}
        onChange={(e) => {
          onChange?.({ ...masterState, headerFontColor: e.target?.value });
        }}
      />

      <h3>{t("item_row")}</h3>

      <ERPStepInput
        value={masterState?.itemRowFontSize}
        onChange={(itemRowFontSize) => onChange?.({ ...masterState, itemRowFontSize })}
        label={t("size_(8-28)")}
        id="itemRowFontSize"
        placeholder=" "
        defaultValue={10}
        min={8}
        max={28}
        step={1}
      />

      <ErpInput
        id="itemRowFontColor"
        label={t("font_color")}
        type="color"
        value={masterState?.itemRowFontColor}
        onChange={(e) => {
          onChange?.({ ...masterState, itemRowFontColor: e.target?.value });
        }}
      />

      <ERPCheckbox
        id="showRowBg"
        label={t("background")}
        onChange={(e) => {
          onChange?.({ ...masterState, showRowBg: e.target.checked });
        }}
        checked={masterState?.showRowBg}
      />

      {masterState?.showRowBg && (
        <ErpInput
          id="itemRowBgColor"
          label={t("background_color")}
          type="color"
          value={masterState?.itemRowBgColor}
          onChange={(e) => {
            onChange?.({ ...masterState, itemRowBgColor: e.target?.value });
          }}
        />
      )}
    </div>
  );
};

const TablePremiumDesigner = <T,>({ tableState}: ItemTableDesignerProps<T>) => {
// const TablePremiumDesigner = ({ }: ItemTableDesignerProps) => {
    const templateData = useSelector((state: RootState) => state?.Template);
    const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  const { t } = useTranslation('system')
  const [maxHeight, setMaxHeight] = useState<number>(500);
    useEffect(() => {
      let wh = window.innerHeight;
      setMaxHeight(wh);
    }, []);

  return (
    <>
      <ERPScrollArea className={`overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${maxHeight - 100}px] flex-col gap-1`}>
       <div className="transition-all flex flex-col gap-1 p-4">
         <div className="">
            <ERPTab tabs={[t("labels"), t("layout")]} activeTab={activeTab} onClickTabAt={(index:number) => setActiveTab(index)} />
          </div>


      {activeTab === 0 && <LabelsEditor<T> tableState={tableState} currentTableState={templateData.activeTemplate.tableState??[]} onChange={(key: keyof T, tableState: DeepPartial<TableColumn<T>>) => dispatch(setTemplateTableState({key:key as string, fields: tableState}))} />}
      {activeTab === 1 && <LayoutEditor masterState={templateData?.activeTemplate?.itemTableMasterState } onChange={(masterState: any) => dispatch(setTemplateTableMasterState(masterState))} />}
    </div>
    </ERPScrollArea>
  
    </>
  );
};

export default TablePremiumDesigner;


