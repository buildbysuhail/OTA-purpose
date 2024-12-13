
import React, { useState } from "react";
import {
    Tabs,
    Tab,
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    Button,
    Popover 
  } from "@mui/material";
import { useTranslation } from "react-i18next";
import ErpInput from "../../components/ERPComponents/erp-input";

import ERPButton from "../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import ERPSlider from "../../components/ERPComponents/erp-slider";
import { tableColumns } from "../InvoiceDesigner/Designer/interfaces";
import ERPFormButtons from "../../components/ERPComponents/erp-form-buttons";
export const AddColumnsManage: React.FC<{
    onSubmit: (columnData: tableColumns) => void;
  }> = React.memo(({ onSubmit }) => {
    const [ColumnData, setColumnData] = React.useState<tableColumns>({} as tableColumns); 
      
  const {t}=useTranslation("userManage");
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
        options={[
        { value: "General", label: "General" },
        { value: "Distribution", label: "Distribution" },
        { value: "Hypermarket", label: "Hypermarket" },
        { value: "Supermarket", label: "Supermarket" },
        { value: "Textiles", label: "Textiles" },
        { value: "Restaurant", label: "Restaurant" },
        { value: "Opticals", label: "Opticals" },
        ]}
    />
     <ERPSlider
        label={`Width (${ColumnData?.width})`}
        value={ColumnData?.width}
        onChange={(e) =>
            handleFieldChange("width", e.target.valueAsNumber )
        }
        min={0}
        max={500}
    />
     <ERPSlider
        label={`Height (${ColumnData?.height})`}
        value={ColumnData?.height}
        onChange={(e) =>
            handleFieldChange("height", e.target.valueAsNumber )
        }
        min={5}
        max={30}
    />
     <ERPSlider
        label={`Font Size (${ColumnData?.fontSize})`}
        value={ColumnData?.fontSize}
        onChange={(e) =>
            handleFieldChange("fontSize", e.target.valueAsNumber )
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
    <button
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
    </button>
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

      <ERPFormButtons
         onSubmit={handleSubmit}
      />
  </Box>
  );
});