import React, { useState } from 'react';
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { Edit, Trash2 } from "lucide-react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";

interface QtyFactors {
  width: number;
  height: number;
  nos: number;
  multipleRows: boolean;
}

interface GridQtyFactors {
  id: string;
  slNo: number;
  width: number;
  height: number;
  nos: number;
  total: number;
}

interface QtyFactorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const QtyFactorsModal: React.FC<QtyFactorsModalProps> = ({ isOpen, onClose, t }) => {
  const [qtyFactors, setQtyFactors] = useState<QtyFactors>({
    width: 0,
    height: 0,
    nos: 0,
    multipleRows: false,
  });

  const [gridData, setGridData] = useState<GridQtyFactors[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const handleQtyFactors = (field: keyof QtyFactors, value: number | boolean) => {
    setQtyFactors(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = (width: number, height: number): number => {
    return width * height;
  };

  const resetForm = () => {
    setQtyFactors({
      width: 0,
      height: 0,
      nos: 0,
      multipleRows: false,
    });
    setIsEditMode(false);
    setEditingRowId(null);
  };

  const handleClick = () => {
    if (isEditMode && editingRowId !== null) {
      const updatedGridData = gridData.map(row => {
        if (row.id === editingRowId) {
          const total = calculateTotal(qtyFactors.width, qtyFactors.height);
          return {
            ...row,
            width: qtyFactors.width,
            height: qtyFactors.height,
            nos: qtyFactors.nos,
            total: total
          };
        }
        return row;
      });

      setGridData(updatedGridData);
      resetForm();
    } else {
      if (qtyFactors.width > 0 && qtyFactors.height > 0 && qtyFactors.nos > 0) {
        const total = calculateTotal(qtyFactors.width, qtyFactors.height);
        const newRow: GridQtyFactors = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          slNo: gridData.length + 1,
          width: qtyFactors.width,
          height: qtyFactors.height,
          nos: qtyFactors.nos,
          total: total
        };

        setGridData(prev => {
          const newData = [...prev, newRow];
          return newData;
        });
        resetForm();
      }
    }
  };

  const handleEditClick = (rowData: GridQtyFactors) => {
    setQtyFactors({
      width: rowData.width,
      height: rowData.height,
      nos: rowData.nos,
      multipleRows: qtyFactors.multipleRows
    });
    setIsEditMode(true);
    setEditingRowId(rowData.id);
  };

  const handleDelete = (rowData: GridQtyFactors) => {
    setGridData(prev => {
      const newData = prev.filter(item => item.id !== rowData.id);
      return newData.map((item, index) => ({ ...item, slNo: index + 1 }));
    });
    if (editingRowId === rowData.id) {
      resetForm();
    }
  };

  const gridColumns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("siNo"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 45
    },
    {
      dataField: "width",
      caption: t("width"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 45
    },
    {
      dataField: "height",
      caption: t("height"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 45
    },
    {
      dataField: "nos",
      caption: t("nos"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 45
    },
    {
      dataField: "total",
      caption: t("total"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 45
    },
    {
      dataField: "actions",
      caption: t("actions"),
      dataType: "string",
      allowSorting: false,
      allowSearch: false,
      allowFiltering: false,
      width: 80,
      cellRender: (params: any) => {
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handleEditClick(params.data)}
              className="p-1 hover:bg-[#DBEAFE] !rounded"
              title="Edit"
            >
              <Edit size={16} className="text-[#2563EB]" />
            </button>
            <button
              onClick={() => handleDelete(params.data)}
              className="p-1 hover:bg-[#FEE2E2] !rounded"
              title="Delete"
            >
              <Trash2 size={16} className="text-[#DC2626]" />
            </button>
          </div>
        )
      }
    },
  ];

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title="Qty Factors"
      width={600}
      height={600}
      content={
        <>
          <div className="flex items-end gap-2">
            <ERPInput
              id="width"
              type="number"
              label={t("width")}
              value={qtyFactors.width}
              onChange={(e) => handleQtyFactors('width', parseFloat(e.target.value) || 0)}
            />
            <ERPInput
              id="height"
              type="number"
              label={t("height")}
              value={qtyFactors.height}
              onChange={(e) => handleQtyFactors('height', parseFloat(e.target.value) || 0)}
            />
            <ERPInput
              id="nos"
              type="number"
              label={t("nos")}
              value={qtyFactors.nos}
              onChange={(e) => handleQtyFactors('nos', parseFloat(e.target.value) || 0)}
            />
            <ERPCheckbox
              id="multipleRows"
              label={t("multiple_rows")}
              checked={qtyFactors.multipleRows}
              onChange={(e) => handleQtyFactors('multipleRows', e.target.checked)}
            />
            <ERPButton
              variant="primary"
              title={isEditMode ? t("update") : t("add")}
              onClick={handleClick}
            />
          </div>
          <ErpDevGrid
            columns={gridColumns}
            data={gridData}
            gridId="qtyFactorsGrid"
            height={450}
            hideGridAddButton={true}
            columnHidingEnabled={true}
            hideDefaultExportButton={true}
            hideDefaultSearchPanel={true}
            allowSearching={false}
            allowExport={false}
            hideGridHeader={true}
            enablefilter={false}
            enableScrollButton={false}
            ShowGridPreferenceChooser={false}
            showPrintButton={false}
          />
        </>
      }
    />
  );
};

export default QtyFactorsModal;
