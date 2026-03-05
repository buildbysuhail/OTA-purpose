import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from "devextreme-react";
import {
  Column,
  Paging,
  RemoteOperations,
  Scrolling,
} from "devextreme-react/data-grid";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPSubmitButton from "../../../../components/ERPComponents/erp-submit-button";
import { formStateHandleFieldChangeKeysOnly } from "../reducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { Trash2 } from "lucide-react";
import Urls from "../../../../redux/urls";

interface FlavoursItem {
  flavours: string;
  qty: number;
  id: number;
}

interface ImfProps {
  isOpen: boolean;
  data: string;
  productId: number | null;
  onClose: () => void;
  rowIndex: number;
  t: (key: string) => string;
}

const Flavours: React.FC<ImfProps> = ({
  isOpen,
  productId,
  onClose,
  rowIndex,
  t,
}) => {
  const [flavourData, setFlavourData] = useState<FlavoursItem[]>([]);
  const [quantity, setQuantity] = useState<number>(0);

  const [flavoursFactors, setFlavoursFactors] = useState<FlavoursItem>({
    flavours: "",
    qty: 0,
    id: 0,
  });

  const dataGridRef = useRef<any>(null);

  const dispatch = useDispatch();
  const formState = useSelector(
    (state: RootState) => state.InventoryTransaction
  );

  const handleFieldChange = <K extends keyof FlavoursItem>(
    field: K,
    value: FlavoursItem[K]
  ) => {
    setFlavoursFactors((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddClick = () => {
    if (!flavoursFactors.flavours || flavoursFactors.qty <= 0) return;

    const newRow: FlavoursItem = {
      id: Date.now(),
      flavours: flavoursFactors.flavours,
      qty: flavoursFactors.qty,
    };

    setFlavourData((prev) => [...prev, newRow]);

    setFlavoursFactors({
      flavours: "",
      qty: 0,
      id: 0,
    });
  };

  const handleDelete = (rowData: FlavoursItem) => {
    setFlavourData((prev) => prev.filter((item) => item.id !== rowData.id));
  };

  useEffect(() => {
    const total = flavourData.reduce((sum, row) => sum + row.qty, 0);
    setQuantity(total);
  }, [flavourData]);

  const handleApplyAll = () => {
  try {
    let description = "";
    let qty = 0;

    flavourData.forEach((row) => {
      description += `${row.flavours} - ${row.qty},`;
      qty += Number(row.qty);
    });

    dispatch(
      formStateHandleFieldChangeKeysOnly({
        fields: {
          flavoursDescriptionData: JSON.stringify({
            rowIndex: rowIndex,
            productDescription: description.replace(/,$/, ""),
            qty: qty,
          }),
        },
      })
    );

    onClose();
  } catch (error) {
    console.error("Flavour Apply Error:", error);
  }
};

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("flavours")}
      width={500}
      height={500}
      disableOutsideClickClose={false}
      content={
        <>
          {/* Input Row */}
          <div className="flex flex-row gap-3 px-4 items-end">
            <ERPDataCombobox
              id="flavour"
              field={{
                id: "flavour",
                getListUrl: `${Urls.product_flavours}${productId}`,
                valueKey: "flavor",
                labelKey: "flavor",
              }}
              onChange={(data: any) => {
                if (!data) return;
                handleFieldChange(
                  "flavours",
                  data.flavor || data.value || data.label
                );
              }}
              label={t("flavour")}
              className="w-60"
              autoFocus
            />

            <ERPInput
              id="qty"
              type="number"
              placeholder={t("qty")}
              required
              onChange={(e: any) =>
                handleFieldChange("qty", Number(e.target.value) || 0)
              }
              width={80}
              value={flavoursFactors.qty}
            />

            <ERPButton
              type="button"
              className="primary h-[38px]"
              onClick={handleAddClick}
              title={t("add")}
            />
          </div>

          {/* Total */}
          <div className="px-4 pt-2 font-semibold">
            {t("total")} : {quantity}
          </div>

          {/* Grid */}
          <div className="w-full flex flex-col gap-4 px-4 py-2">
            <DataGrid
              ref={dataGridRef}
              keyExpr="id"
              dataSource={flavourData}
              className="custom-data-grid-dark-only"
              focusedRowEnabled={false}
              showBorders
              columnAutoWidth
              rowAlternationEnabled
              repaintChangesOnly
              height={300}
            >
              <Column dataField="flavours" caption={t("flavour")} width={250} />

              <Column dataField="qty" caption={t("qty")} width={150} />

              <Column
                caption={t("action")}
                width={70}
                cellRender={(cellData: any) => (
                  <button
                    onClick={() => handleDelete(cellData.data)}
                    className="p-1 text-red-600 hover:text-red-800"
                  ><Trash2 size={16} /></button>
                )}
              />

              <Paging pageSize={100} />
              <Scrolling mode="standard" />
              <RemoteOperations
                filtering={false}
                sorting={false}
                paging={false}
              />
            </DataGrid>
          </div>
        </>
      }
      footer={
        <div className="flex justify-end">
          <ERPSubmitButton
            type="button"
            className="max-w-[115px]"
            variant="primary"
            onClick={handleApplyAll}
          >
            {t("apply_all")}
          </ERPSubmitButton>
        </div>
      }
    />
  );
};

export default Flavours;