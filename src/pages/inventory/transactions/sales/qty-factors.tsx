import React, { useCallback, useState, useRef, useEffect } from "react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { Edit, Trash2 } from "lucide-react";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { useDispatch, useSelector } from "react-redux";
import { formStateHandleFieldChangeKeysOnly } from "./reducer";
import { RootState } from "../../../../redux/store";
import { GridQtyFactors } from "./transaction-types";
import { toast } from "react-toastify";

interface QtyFactors {
  width: number;
  height: number;
  nos: number;
  multipleRows: boolean;
}

interface QtyFactorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowIndex: number;
  t: (key: string) => string;
  qtyDesc: string
}

const QtyFactorsModal: React.FC<QtyFactorsModalProps> = ({
  isOpen,
  onClose,
  t,
  rowIndex,
  qtyDesc,
}) => {
  const dispatch = useDispatch();
  const widthInputRef = useRef<HTMLInputElement>(null);


  const [qtyFactors, setQtyFactors] = useState<QtyFactors>({
    width: 0,
    height: 0,
    nos: 1,
    multipleRows: false,
  });

  const [gridData, setGridData] = useState<GridQtyFactors[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [isShowGrid, setIsShowGrid] = useState<boolean>(false);

  const handleQtyFactors = (
    field: keyof QtyFactors,
    value: number | boolean
  ) => {
    setQtyFactors((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

 useEffect(() => {
   
 if(qtyDesc){
    // const parts = qtyDesc.split('/ X |\/');
    const parts = qtyDesc.split(/\s*X\s*|\s*\/\s*/).map(p => p.trim());
        setQtyFactors((prev) => ({
      ...prev,
      width: Number(parts[0]),
      height: Number(parts[1]),
      nos: Number(parts[2])
    }));
    setIsEditMode(true)
  }
 }, [])
 
  const calculateTotal = (width: number, height: number, nos: number): number => {
    return width * height * nos;
  };

  useEffect(() => {
  if (isOpen) {
    setTimeout(() => {  
      if (widthInputRef.current) {
        widthInputRef.current.focus();
      }
    }, 500);
  }
}, [isOpen]);


  const resetForm = () => {
    setQtyFactors({
      width: 0,
      height: 0,
      nos: qtyFactors.nos,
      multipleRows: true,  //check it
    });
    setIsEditMode(false);
    setEditingRowId(null);

    setTimeout(() => {
      if (widthInputRef.current) {
        widthInputRef.current.focus();
      }
    }, 0);
  };

  const handleClick = () => {
    if (isEditMode && editingRowId !== null) {
      const updatedGridData = gridData.map((row) => {
        if (row.id === editingRowId) {
          const total = calculateTotal(qtyFactors.width, qtyFactors.height, qtyFactors.nos);
          return {
            ...row,
            width: qtyFactors.width,
            height: qtyFactors.height,
            nos: qtyFactors.nos,
            total: total,
          };
        }
        return row;
      });

      setGridData(updatedGridData);
      resetForm();
    } else {
      if (qtyFactors.width > 0 && qtyFactors.height > 0 && qtyFactors.nos > 0) {
        const total = calculateTotal(qtyFactors.width, qtyFactors.height, qtyFactors.nos);
        const newRow: GridQtyFactors = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          slNo: gridData.length + 1,
          width: qtyFactors.width,
          height: qtyFactors.height,
          nos: qtyFactors.nos,
          total: total,
        };
    if(!qtyFactors.multipleRows) {
            dispatch(formStateHandleFieldChangeKeysOnly({
            fields: { quantityFactorData: JSON.stringify({ rowIndex: rowIndex, data: [newRow] }) }
          }));
          return;
          }
        setGridData((prev) => {
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
      multipleRows: qtyFactors.multipleRows,
    });
    setIsEditMode(true);
    setEditingRowId(rowData.id);
  };

  const handleDelete = (rowData: GridQtyFactors) => {
    setGridData((prev) => {
      const newData = prev.filter((item) => item.id !== rowData.id);
      return newData.map((item, index) => ({ ...item, slNo: index + 1 }));
    });
    if (editingRowId === rowData.id) {
      resetForm();
    }
  };

  const formState = useSelector(
    (state: RootState) => state.InventoryTransaction
  );
  const handleApplyClick = useCallback(() => {
    if (gridData && gridData.length > 0) {
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            quantityFactorData: JSON.stringify({
              rowIndex: rowIndex,
              data: gridData,
            }),
          },
        })
      );
    } else {
      toast.warning("Please add at least one item before applying.");
    }
  }, [dispatch, rowIndex, gridData, formState.transaction.details]);

  const gridColumns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("si_no"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 45,
      alignment: "left",
    },
    {
      dataField: "width",
      caption: t("width"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 45,
    },
    {
      dataField: "height",
      caption: t("height"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 45,
    },
    {
      dataField: "nos",
      caption: t("nos"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 45,
    },
    {
      dataField: "total",
      caption: t("total"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 45,
    },
    {
      dataField: "x",
      caption: "X",
      dataType: "string",
      alignment: "right",
      width: 80,
      cellRender: (params: any) => {
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handleEditClick(params.data)}
              className="p-1 hover:bg-[#DBEAFE] !rounded"
              title={t("edit")}
            >
              <Edit size={16} className="text-[#2563EB]" />
            </button>
            <button
              onClick={() => handleDelete(params.data)}
              className="p-1 hover:bg-[#FEE2E2] !rounded"
              title={t("delete")}
            >
              <Trash2 size={16} className="text-[#DC2626]" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("qty_factors")}
      width={550}
      height={qtyFactors.multipleRows ? 680 : 150}
      
      content={
        <>
          <div className="flex items-end gap-2">
            <ERPInput
              ref={widthInputRef}
              id="width"
              type="number"
              label={t("width")}
              className="w-28"
              autoFocus={true}
              value={qtyFactors.width}
              onChange={(e) =>
                handleQtyFactors("width", parseFloat(e.target.value) || 0)
              }
            />
            <ERPInput
              id="height"
              type="number"
              label={t("height")}
              className="w-28"
              value={qtyFactors.height}
              onChange={(e) =>
                handleQtyFactors("height", parseFloat(e.target.value) || 0)
              }
            />
            <ERPInput
              id="nos"
              type="number"
              label={t("nos")}
              className="w-28"
              value={qtyFactors.nos}
              onChange={(e) =>
                handleQtyFactors("nos", parseFloat(e.target.value) || 0)
              }
            />
            <ERPCheckbox
              id="multipleRows"
              label={t("multiple_rows")}
              checked={qtyFactors.multipleRows}
              onChange={(e) =>
              {
                setIsShowGrid(e.target.checked)
                handleQtyFactors("multipleRows", e.target.checked)
              }  
              }
            />
            <ERPButton
              variant="primary"
              title={isEditMode ? t("update") : t("add")}
              onClick={handleClick}
            />
          </div>
          <div className="mt-2">{t("total")} : {qtyFactors.width*qtyFactors.height*qtyFactors.nos}</div>
          {isShowGrid?
          <div className="">
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
          <div className="flex items-center justify-end gap-2 mt-2">
            <ERPButton
              title={t("cancel")}
              variant="secondary"
              onClick={onClose}
            />
            <ERPButton
              title={t("apply")}
              onClick={() => {
                handleApplyClick();
              }}
              variant="primary"
            />
          </div>
          </div>
          :""}
        </>
      }
    />
  );
};

export default QtyFactorsModal;
