import React, { useCallback, useState, useRef, useEffect } from "react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { useDispatch, useSelector } from "react-redux";
import { formStateHandleFieldChangeKeysOnly } from "../reducer";
import { RootState } from "../../../../redux/store";
import { GridQtyFactors, GridQtyFactorsM } from "../transaction-types";
import { toast } from "react-toastify";

interface QtyFactorsM {
  mann: number;
  kg: number;
  nos: number;
}

interface MQtyFactorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowIndex: number;
  t: (key: string) => string;
  qtyDesc: string;
}

const MQtyFactorsModal: React.FC<MQtyFactorsModalProps> = ({
  isOpen,
  onClose,
  t,
  rowIndex,
  qtyDesc,
}) => {
  const dispatch = useDispatch();
  const widthInputRef = useRef<HTMLInputElement>(null);
  const [qtyFactorsM, setQtyFactorsM] = useState<QtyFactorsM>({
    mann: 0,
    kg: 0,
    nos: 1,
  });

  const [gridData, setGridData] = useState<GridQtyFactors[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const handleQtyFactors = (
    field: keyof QtyFactorsM,
    value: number | boolean
  ) => {
    setQtyFactorsM((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  useEffect(() => {
    if (qtyDesc) {
      // const parts = qtyDesc.split('/ X |\/');
      const parts = qtyDesc.split(/\s*X\s*|\s*\/\s*/).map((p) => p.trim());
      setQtyFactorsM((prev) => ({
        ...prev,
        mann: Number(parts[0]),
        kg: Number(parts[1]),
        nos: Number(parts[2]),
      }));
      setIsEditMode(true);
    }
  }, []);

  const calculateTotal = (
    mannValue: number,
    kgValue: number,
    nosValue: number
  ): number => {
    if (!nosValue || nosValue === 0) return 0; // For preventing divided by zero
    const totalValue = (kgValue / nosValue) * mannValue;
    return totalValue;
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
    setQtyFactorsM({
      mann: 0,
      kg: 0,
      nos: qtyFactorsM.nos,
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
 if (qtyFactorsM.mann > 0 && qtyFactorsM.kg > 0 && qtyFactorsM.nos > 0) {
        const total = calculateTotal(
          qtyFactorsM.mann,
          qtyFactorsM.kg,
          qtyFactorsM.nos
        );
        const newRow: GridQtyFactorsM = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          slNo: gridData.length + 1,
          mann: qtyFactorsM.mann,
          kg: qtyFactorsM.kg,
          nos: qtyFactorsM.nos,
          total: total,
        };
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: {
              quantityFactorDataM: JSON.stringify({
                rowIndex: rowIndex,
                data: [newRow],
              }),
            },
          })
        );
        return;
      }
  };


  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("qty_factors")}
      width={450}
      height={150}
      content={
        <>
          <div className="flex items-end gap-2">
            <ERPInput
              ref={widthInputRef}
              id="mann"
              type="number"
              label={t("mann")}
              className="w-28"
              autoFocus={true}
              value={qtyFactorsM.mann}
              onChange={(e) =>
                handleQtyFactors("mann", parseFloat(e.target.value) || 0)
              }
            />
            <ERPInput
              id="kg"
              type="number"
              label={t("kg")}
              className="w-28"
              value={qtyFactorsM.kg}
              onChange={(e) =>
                handleQtyFactors("kg", parseFloat(e.target.value) || 0)
              }
            />
            <ERPInput
              id="nos"
              type="number"
              label={t("nos")}
              className="w-28"
              value={qtyFactorsM.nos}
              onChange={(e) =>
                handleQtyFactors("nos", parseFloat(e.target.value) || 0)
              }
            />
            <ERPButton
              variant="primary"
              title={t("add")}
              onClick={handleClick}
            />
          </div>
          <div className="mt-2">
            {t("total")} :{" "}
            {qtyFactorsM.nos > 0
              ? (qtyFactorsM.kg / qtyFactorsM.nos) * qtyFactorsM.mann
              : 0}
          </div>
        </>
      }
    />
  );
};

export default MQtyFactorsModal;
