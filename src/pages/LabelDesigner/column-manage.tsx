
import React, { useEffect, useState } from "react";
import {
    Box,
    InputLabel,
 } from "@mui/material";
import { useTranslation } from "react-i18next";
import ErpInput from "../../components/ERPComponents/erp-input";
import { Trash2 } from 'lucide-react';
import ERPButton from "../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import ERPSlider from "../../components/ERPComponents/erp-slider";
import { tableColumns } from "../InvoiceDesigner/Designer/interfaces";
import ERPFormButtons from "../../components/ERPComponents/erp-form-buttons";
import ERPCheckbox from "../../components/ERPComponents/erp-checkbox";
import { AccountMasterDetails, AccountMasterFields } from "./fields";
interface AddColumnsManageProps {
    onSubmit: (columnData: tableColumns) => void;
    onDelete?: () => void;
    initialData?: tableColumns;
  }   
  export const AddColumnsManage: React.FC<AddColumnsManageProps> = React.memo(({onSubmit, onDelete, initialData}) => {
    const [ColumnData, setColumnData] = React.useState<tableColumns>({} as tableColumns); 
      
  const {t}=useTranslation("userManage");
  useEffect(() => {
    if (initialData) {
      setColumnData(initialData);
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit(ColumnData);
  };
  const handleFieldChange = (field: any, value: any) => {
    setColumnData((prev) => ({
      ...prev,
      [field]: value, 
    }));
  };
  return (
    <Box 
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      justifyContent: "flex-start",
      p: 1,
    }}
  >
       {onDelete && (
          <ERPButton
            onClick={onDelete}
            variant="secondary"
            startIcon={<Trash2 className="w-4 h-4" />}
            title="Delete Column"
          />
        )}
    <ErpInput
        id="caption"
        label="Caption"
        data={ColumnData}
        value={ColumnData?.caption}
        onChangeData={(data) =>
            handleFieldChange("caption", data.caption  )
        }
    />
     <ERPDataCombobox
        field={{
        id: "field",
        valueKey: "value",
        labelKey: "label",
        }}
        id="field"
        label="Field"
        data={ColumnData}
        onChangeData={(data) =>
            handleFieldChange("field", data.field )
        }
        options={AccountMasterDetails?.map((field, index) => ({
        value: field,
        label: field,
        }))}
    />
     <ERPSlider
        label={`Width (${ColumnData?.width})`}
        value={ColumnData?.width}
        onChange={(e) =>
            handleFieldChange("width", e.target?.valueAsNumber )
        }
        min={0}
        max={500}
    />

     <ERPSlider
        label={`Font Size (${ColumnData?.fontSize})`}
        value={ColumnData?.fontSize}
        onChange={(e) =>
            handleFieldChange("fontSize", e.target?.valueAsNumber )
        }
        min={5}
        max={30}
    />
    <ERPDataCombobox
        id="font"
        data={ColumnData}
        label="Font"
        field={{
            id: "font",
            valueKey: "value",
            labelKey: "label",
        }}
        options={[
            { value: "Roboto", label: "Roboto" },
            { value: "RobotoMono", label: "RobotoMono" },
            { value: "FiraSans", label: "FiraSans" },
        ]}
        onChangeData={(data) =>
        handleFieldChange("font", data.font )
        }
    />
      <Box>
        <InputLabel
        sx={{
            textTransform: "capitalize",
            marginBottom: "0.25rem",
            display: "block",
            fontSize: "0.75rem",
            color: "rgb(17, 24, 39)",
            textAlign: "left",
            direction: "rtl",
        }}
        >
        Text Align
        </InputLabel>

        <div className="flex justify-between space-x-2">
        <button
            className={`ti-btn ${ColumnData.textAlign ===
            "left"
            ? "ti-btn-primary-full"
            : "bg-slate-100 hover:bg-slate-200 text-black"
            } px-4 py-2 w-full`}
            onClick={() =>
            handleFieldChange("textAlign", "left")
            }
        >
            Left
        </button>
        <button
            className={`ti-btn ${ColumnData.textAlign ===
            "center"
            ? "ti-btn-primary-full"
            : "bg-slate-100 hover:bg-slate-200 text-black"
            } px-4 py-2 w-full`}
            onClick={() =>
            handleFieldChange(
                "textAlign",
                "center"
            )
            }
        >
            Center
        </button>
        <button
            className={`ti-btn ${ColumnData.textAlign ===
            "right"
            ? "ti-btn-primary-full"
            : "bg-slate-100 hover:bg-slate-200 text-black"
            } px-4 py-2 w-full`}
            onClick={() =>
            handleFieldChange(
                "textAlign",
                "right"
            )
            }
        >
            Right
        </button>
        </div>
    </Box>
   <Box>
    <InputLabel
    sx={{
        textTransform: "capitalize",
        marginBottom: "0.25rem",
        display: "block",
        fontSize: "0.75rem",
        color: "rgb(17, 24, 39)",
        textAlign: "left",
        direction: "rtl",
    }}
    >
    Font Style
    </InputLabel>
    <div className="flex justify-between space-x-1">
    {/* <button
        className={`ti-btn ${ColumnData.fontStyle ===
        "bold"
        ? "ti-btn-primary-full"
        : "bg-slate-100 hover:bg-slate-200 text-black"
        } px-4 py-2 w-full`}
        onClick={() =>
        handleFieldChange("fontStyle", "bold")
        }
    >
        Bold
    </button> */}
    <button
        className={`ti-btn ${ColumnData.fontStyle  ===
        "normal"
        ? "ti-btn-primary-full"
        : "bg-slate-100 hover:bg-slate-200 text-black"
        } px-4 py-2 w-full`}
        onClick={() =>
        handleFieldChange(
            "fontStyle",
            "normal"
        )
        }
    >
        Normal
    </button>
    <button
        className={`ti-btn ${ColumnData.fontStyle ===
        "italic"
        ? "ti-btn-primary-full"
        : "bg-slate-100 hover:bg-slate-200 text-black"
        } px-4 py-2 w-full`}
        onClick={() =>
        handleFieldChange(
            "fontStyle",
            "italic"
        )
        }
    >
        Italic
    </button>
    </div>
  </Box>
  <ErpInput
        id="textColor"
        label="Text Color"
        type="color"
        value={ColumnData?.textColor}
        data={ColumnData}
        onChangeData={(data) =>
            handleFieldChange("textColor", data.textColor  )
        }
    />
    <ErpInput
        id="bgColor"
        label="Background Color"
        type="color"
        value={ColumnData?.bgColor}
        data={ColumnData}
        onChangeData={(data) =>
            handleFieldChange("bgColor", data.bgColor  )
        }
    />
    <ERPCheckbox
        id="isRepeat"
        label="Repeat On Each Page"
        data={ColumnData}
        checked={ColumnData?.isRepeat ?? true}
        onChangeData={(data) =>
            handleFieldChange("isRepeat", data.isRepeat  )
        }
        />
      <ERPFormButtons
         onSubmit={handleSubmit}
         
      />
  </Box>
  );
});