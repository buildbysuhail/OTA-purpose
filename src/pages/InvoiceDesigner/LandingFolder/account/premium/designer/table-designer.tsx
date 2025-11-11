import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ERPScrollArea } from "../../../../../../components/ERPComponents/erp-scrollbar";
import {
  removeTemplateTableColumn,
  setTemplateTableMasterState,
  setTemplateTableState,
  updateTemplateTableState,
} from "../../../../../../redux/slices/templates/reducer";
import {
  ItemTableMasterState,
  TableColumn,
  templateDesignerFormatOptions,
} from "../../../../Designer/interfaces";
import ERPCheckbox from "../../../../../../components/ERPComponents/erp-checkbox";
import ErpInput from "../../../../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../../../../components/ERPComponents/erp-step-input";
import ERPTab from "../../../../../../components/ERPComponents/erp-tab";
import { DeepPartial } from "redux";
import { RootState } from "../../../../../../redux/store";
import ERPButton from "../../../../../../components/ERPComponents/erp-button";
import ERPModal from "../../../../../../components/ERPComponents/erp-modal";
import { TableManagerContent } from "./tabble-col-manage";
import { TableColumnAddOrEdit } from "./tabble-column";
import { PrintDetailDto } from "../../../../../use-print-type";
import { generateUniqueKey, moveArrayElement } from "../../../../../../utilities/Utils";
import ERPDataCombobox from "../../../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../../../components/ERPComponents/erp-input";
import ERPSlider from "../../../../../../components/ERPComponents/erp-slider";
import { Trash } from "lucide-react";
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

const LabelsEditor = <T,>({
  tableState,
  currentTableState,
  onChange,
}: ItemTableLabelDesignerProps<T>) => {
  const { t } = useTranslation("system");
  const dispatch = useDispatch();
  const [openTableCol, setOpenTableCol] = useState({show: false, index: undefined, column: undefined} as {show: boolean, index?: number, column?: TableColumn<PrintDetailDto>});

 
 const dragItem = useRef<string | null>(null);
  const dragOverItem = useRef<string | null>(null);
   const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      dragItem.current = e.currentTarget.id;
    };
  
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragOverItem.current = e.currentTarget.id;
    };
  
    const handleDropping = (eFromDataGrid: boolean = false, startIndex?: number | null, endIndex?: number | null) => {
      
      const draggedDataField = dragItem.current ? dragItem.current : null;
      const targetDataField = dragOverItem.current ? dragOverItem.current: null;
      startIndex = startIndex != null ? startIndex : currentTableState?.findIndex((fld: any) => fld?.key === draggedDataField);
      endIndex = endIndex != null ? endIndex : currentTableState?.findIndex((fld: any) => fld?.key === targetDataField);
  
      if (startIndex !== -1 && endIndex !== -1) {
        const list = moveArrayElement(
              currentTableState,
              startIndex,
              endIndex
            );
            dispatch(updateTemplateTableState({fields: list}));
      }
  
      dragItem.current = null;
      dragOverItem.current = null;
    };
  
    const removeColumn = (item: TableColumn<T>) => {
      dispatch(removeTemplateTableColumn({ key: item.key }));
    };

  return (
    <>
      <div className="flex justify-end">
        <ERPButton
          title={t("new")}
          variant="primary"
          onClick={() => { setOpenTableCol((prev: any) => {return {
            ...prev,
            show: true, index: undefined, column: undefined
          }})}}
        />
        
      </div>
      {currentTableState &&
        currentTableState.length > 0 &&
        currentTableState
          .map((item: TableColumn<T>, index: number) => {
            return (
              <div
                className=" flex gap-2  cursor-move"
                key={`${index}_${String(item.field)}`}
                id={`${item.key}`}
                 draggable
                        onDragStart={handleDragStart}
                        onDragEnter={handleDragEnd}
                        onDragEnd={() => handleDropping(false)}
              >
                ⋮⋮
                <ERPCheckbox
                  id="tb_col_show"
                  noLabel
                  className=""
                  // label={t(item.label)}
                  checked={item.show}
                  onChange={(e) =>
                    onChange &&
                    onChange(item.field as keyof T, { show: e.target.checked })
                  }
                />
                <ErpInput
                  disabled={item.show != true}
                  type="number"
                  id="tb_col_width"
                  label={t("width")}
                  className="w-20"
                  value={item.width}
                  onChange={(e) =>
                    onChange &&
                    onChange(item.field as keyof T, { width: parseInt(e.target.value, 10) })
                  }
                />
                <ErpInput
                  disabled={item.show != true}
                  id="tb_col_label"
                  label={t(item.label)}
                  value={item.label}
                  onChange={(e) =>
                    onChange &&
                    onChange(item.field as keyof T, { label: e.target.value })
                  }
                />
                <ERPDataCombobox
                 disabled={item.show != true}
                  id="tb_col_format"
                  label={t("format")}
                  field={
                    {
                      labelKey:"label",
                      valueKey:"value"
                    }
                  }
                  options={templateDesignerFormatOptions}
                  value={item.format}
                  onChange={(e) =>
                  onChange &&
                  onChange(item.field as keyof T, { format: e.target.value })
                }
                />          

                  <div className="w-3 h-3 cursor-pointer self-center" title={t("remove")} onClick={()=>removeColumn(item)}>
                    <Trash />
                  </div>
              </div>
            );
          })}
      

      {openTableCol && openTableCol.show && (
        <ERPModal
          isForm={true}
          disableOutsideClickClose={false}
          isOpen={openTableCol.show}
          title="Choose TableColumns"
          closeModal={() => setOpenTableCol({show: false, index: undefined, column: undefined})}
          width={1000}
          height={700}
          content={
            <TableColumnAddOrEdit onClose={() =>{setOpenTableCol({show: false, index: undefined, column: undefined})}} column={openTableCol.column} index={openTableCol.index} />
          }
          // footer={<TableManagerFooter onSubmit={onSubmit}  onClose={onClose}/>}
        />
      )}
    </>
  );
};

const LayoutEditor = ({
  masterState,
  onChange,
}: ItemTableLayoutDesignerProps) => {
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group");
  const { t } = useTranslation("system");

  return (
    <div className="flex flex-col gap-2">
      <ERPCheckbox
        id="showTableRowBorder"
        label={t("table_row_border")}
        onChange={(e) =>
          onChange?.({ ...masterState, showTableRowBorder: e.target.checked })
        }
        checked={masterState?.showTableRowBorder}
      />

      {masterState?.showTableRowBorder && (
        <ErpInput
          id="tableRowBorderColor"
          label={t("border_color")}
          type="color"
          value={masterState?.tableRowBorderColor}
          onChange={(e) =>
            onChange?.({ ...masterState, tableRowBorderColor: e.target?.value })
          }
        />
      )}

      <ERPCheckbox
        id="showTableColBorder"
        label={t("table_col_border")}
        onChange={(e) =>
          onChange?.({ ...masterState, showTableColBorder: e.target.checked })
        }
        checked={masterState?.showTableColBorder}
      />

      {masterState?.showTableColBorder && (
        <ErpInput
          id="tableColBorderColor"
          label={t("border_color")}
          type="color"
          value={masterState?.tableColBorderColor}
          onChange={(e) =>
            onChange?.({ ...masterState, tableColBorderColor: e.target?.value })
          }
        />
      )}

      <h3>{t("table_header")}</h3>
      <ERPCheckbox
        id="headerRepeatOnPage"
        label={t("header_repeat_on_each_page")}
        onChange={(e) =>
          onChange?.({ ...masterState, headerRepeatOnPage: e.target.checked })
        }
        checked={masterState?.headerRepeatOnPage}
      />
        <ERPDataCombobox
            id="headerFontFamily"
            label={t("header_font_family")}
            field={{
              id: "headerFontFamily",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            data={masterState}
            defaultValue={masterState?.headerFontFamily?? "Roboto"}
            value={masterState?.headerFontFamily ?? "Roboto"}
            onChangeData={(data: any) => {
              onChange?.({ ...masterState, headerFontFamily: data.headerFontFamily})
            }}
            options={[
              { value: "Roboto", label: t("roboto") },
              { value: "RobotoMono", label: t("roboto_mono") },
              { value: "FiraSans", label: t("fira_sans") },
              { value: "Poppins", label: t("poppins") },
            ]}
          />
         <ERPDataCombobox
            id="arabicHeaderFontFamily"
            label={t("arbic_font_family")}
            field={{
              id: "arabicHeaderFontFamily",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            data={masterState}
            defaultValue={masterState?.arabicHeaderFontFamily?? "Amri"}
            value={masterState?.arabicHeaderFontFamily ?? "Amiri"}
            onChangeData={(data: any) => {
              onChange?.({ ...masterState, arabicHeaderFontFamily: data.arabicHeaderFontFamily})
            }}
            options={[
              { value: "NotoNaskhArabic", label: t("noto_naskh_arabic") },
              { value: "Amiri", label: t("amiri") },
            ]}
          />  

          <ERPDataCombobox
            id="headerFontStyle"
            label={t("font_style")}
            data={masterState}
            field={{
              id: "headerFontStyle",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            defaultValue={masterState?.headerFontStyle ?? "normal"}
            value={masterState?.headerFontStyle ?? "normal"}
            onChangeData={(data: any) => {
              onChange?.({ ...masterState, headerFontStyle: data.headerFontStyle })
            }}
            options={[
              { value: "normal", label: t("normal") },
              { value: "italic", label: t("italic") },
            ]}
          /> 
         <ERPStepInput
            value={masterState?.headerFontSize}
            onChange={(headerFontSize) =>
              onChange?.({ ...masterState, headerFontSize })
            }
            label={t("size_(8-28)")}
            id="headerFontSize"
            placeholder=" "
            defaultValue={10}
            min={5}
            max={28}
            step={1}
          />
        <div className="flex items-center space-x-3">
          <div className="basis-2/3 ">
              <ERPSlider
                id="headerFontWeightt"
                label={t("font_weight")}
                className="bg-slate-300"
                value={masterState?.headerFontWeight??400}
                onChange={(e) =>
                  onChange?.({ ...masterState, headerFontWeight: parseInt(e.target.value, 10) })
                }
                min={300}
                max={700}
                step={100}
              />
            </div>
            <div className="basis-1/3 translate-y-3">
              <ERPInput
                id="headerFontWeight"
                type="number"
                noLabel
                value={masterState?.headerFontWeight??400}
                data={masterState}
                onChange={(e) => {
                  const value = e.target.value;
                  const headerFontWeight = value === "" ? 0 : parseInt(value, 10);
                  onChange?.({
                    ...masterState,
                      headerFontWeight
                  });
                }}
                min={300}
                max={700}
                step={100}
              />
            </div>
          </div>        
      <ErpInput
        id="headerFontColor"
        label={t("font_color")}
        type="color"
        value={masterState?.headerFontColor}
        onChange={(e) => {
          onChange?.({ ...masterState, headerFontColor: e.target?.value });
        }}
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


      <h3>{t("item_row")}</h3>
        <ERPDataCombobox
            id="itemRowFontFamily"
            label={t("font_family")}
            field={{
              id: "itemRowFontFamily",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            data={masterState}
            defaultValue={masterState?.itemRowFontFamily?? "Roboto"}
            value={masterState?.itemRowFontFamily ?? "Roboto"}
            onChangeData={(data: any) => {
              onChange?.({ ...masterState, itemRowFontFamily: data.itemRowFontFamily})
            }}
            options={[
              { value: "Roboto", label: t("roboto") },
              { value: "RobotoMono", label: t("roboto_mono") },
              { value: "FiraSans", label: t("fira_sans") },
              { value: "Poppins", label: t("poppins") },
            ]}
          />
         <ERPDataCombobox
            id="arabicItemRowFontFamily"
            label={t("arbic_font_family")}
            field={{
              id: "arabicItemRowFontFamily",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            data={masterState}
            defaultValue={masterState?.arabicItemRowFontFamily?? "Amri"}
            value={masterState?.arabicItemRowFontFamily ?? "Amiri"}
            onChangeData={(data: any) => {
              onChange?.({ ...masterState, arabicItemRowFontFamily: data.arabicItemRowFontFamily})
            }}
            options={[
              { value: "NotoNaskhArabic", label: t("noto_naskh_arabic") },
              { value: "Amiri", label: t("amiri") },
            ]}
          />  

          <ERPDataCombobox
            id="itemRowFontStyle"
            label={t("font_style")}
            data={masterState}
            field={{
              id: "itemRowFontStyle",
              required: true,
              valueKey: "value",
              labelKey: "label",
            }}
            defaultValue={masterState?.itemRowFontStyle ?? "normal"}
            value={masterState?.itemRowFontStyle ?? "normal"}
            onChangeData={(data: any) => {
              onChange?.({ ...masterState, itemRowFontStyle: data.itemRowFontStyle })
            }}
            options={[
              { value: "normal", label: t("normal") },
              { value: "italic", label: t("italic") },
            ]}
          /> 
      <ERPStepInput
        value={masterState?.itemRowFontSize}
        onChange={(itemRowFontSize) =>
          onChange?.({ ...masterState, itemRowFontSize })
        }
        label={t("size_(8-28)")}
        id="itemRowFontSize"
        placeholder=" "
        defaultValue={10}
        min={5}
        max={28}
        step={1}
      />
        <div className="flex items-center space-x-3">
          <div className="basis-2/3 ">
              <ERPSlider
                id="itemRowFontWeight"
                label={t("font_weight")}
                className="bg-slate-300"
                value={masterState?.itemRowFontWeight??400}
                onChange={(e) =>
                  onChange?.({ ...masterState, itemRowFontWeight: parseInt(e.target.value, 10) })
                }
                min={300}
                max={700}
                step={100}
              />
            </div>
            <div className="basis-1/3 translate-y-3">
              <ERPInput
                id="itemRowFontWeight"
                type="number"
                noLabel
                value={masterState?.itemRowFontWeight??400}
                data={masterState}
                onChange={(e) => {
                  const value = e.target.value;
                  const itemRowFontWeight = value === "" ? 0 : parseInt(value, 10);
                  onChange?.({
                    ...masterState,
                      itemRowFontWeight
                  });
                }}
                min={300}
                max={700}
                step={100}
              />
            </div>
          </div> 
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

const TablePremiumDesigner = <T,>({
  tableState,
}: ItemTableDesignerProps<T>) => {
  // const TablePremiumDesigner = ({ }: ItemTableDesignerProps) => {
  const templateData = useSelector((state: RootState) => state?.Template);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  const { t } = useTranslation("system");
  const [maxHeight, setMaxHeight] = useState<number>(500);
  useEffect(() => {
    let wh = window.innerHeight;
    setMaxHeight(wh);
  }, []);

  return (
    <>
      <ERPScrollArea
        className={`overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${
          maxHeight - 100
        }px] flex-col gap-1`}
      >
        <div className="transition-all flex flex-col gap-1 p-4">
          <div className="">
            <ERPTab
              tabs={[t("labels"), t("layout")]}
              activeTab={activeTab}
              onClickTabAt={(index: number) => setActiveTab(index)}
            />
          </div>

          {activeTab === 0 && (
            <LabelsEditor<T>
              tableState={tableState}
              currentTableState={templateData.activeTemplate.tableState ?? []}
              onChange={(
                key: keyof T,
                tableState: DeepPartial<TableColumn<T>>
              ) =>
                dispatch(
                  setTemplateTableState({
                    key: key as string,
                    fields: tableState,
                  })
                )
              }
            />
          )}
          {activeTab === 1 && (
            <LayoutEditor
              masterState={templateData?.activeTemplate?.itemTableMasterState}
              onChange={(masterState: any) =>
                dispatch(setTemplateTableMasterState(masterState))
              }
            />
          )}
        </div>
      </ERPScrollArea>
    </>
  );
};

export default TablePremiumDesigner;
