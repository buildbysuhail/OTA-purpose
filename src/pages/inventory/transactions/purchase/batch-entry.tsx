import React, { useEffect, useState } from 'react';
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { formStateHandleFieldChangeKeysOnly } from './reducer';

interface BatchEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowIndex: number;
  t: (key: string) => string;
  data: string
}

interface InventoryDetail {
  batchNo: string;
  expDate: Date | null;
  mfdDate: Date | null;
  expDays: string;
  mrp: string;
  unitID2?: number | string | null;
  unit2Qty?: string;
  unit2SalesRate?: string;
  unit2MRP?: string;
  unit2MBarcode?: string;
  unit2StickerQty?: number;
  unit2?: string;
  unitID3?: number | string | null;
  unit3Qty?: string;
  unit3SalesRate?: string;
  unit3MRP?: string;
  unit3MBarcode?: string;
  unit3StickerQty?: number;
  unit3?: string;
}

const BatchEntryModal: React.FC<BatchEntryModalProps> = ({ isOpen, onClose, t, rowIndex, data }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  useEffect(() => {

    if (formState.batchEntryData.visible && formState.batchEntryData.data != "") {
      const data = JSON.parse(formState.batchEntryData.data)
      setBatchData(data);
    }

  }, [formState.batchEntryData])
  const handleSet = () => {

    const slNo = formState.transaction.details[rowIndex].slNo;
    dispatch(
      formStateHandleFieldChangeKeysOnly({

        fields: {
          batchEntryData: { visible: false, data: "", rowIndex: -1 }, transaction: {
            details: [{ ...batchData, slNo: slNo }]
          }
        }
        , updateOnlyGivenDetailsColumns: true, rowIndex
      }))

  };
  const [batchData, setBatchData] = useState<InventoryDetail & {
    batchEnabled: boolean;
    unit2Enabled: boolean;
    unit3Enabled: boolean;
  }>({
    batchEnabled: false,
    batchNo: "",
    expDate: null,
    mfdDate: null,
    expDays: "",
    mrp: "",
    unit2Enabled: false,
    unitID2: null,
    unit2Qty: "",
    unit2SalesRate: "",
    unit2MRP: "",
    unit2MBarcode: "",
    unit2StickerQty: 0,
    unit2: "",
    unit3Enabled: false,
    unitID3: null,
    unit3Qty: "",
    unit3SalesRate: "",
    unit3MRP: "",
    unit3MBarcode: "",
    unit3StickerQty: 0,
    unit3: "",
  });

  const handleFieldChange = (field: string, value: any) => {
    setBatchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("batch_entry")}
      width={800}
      height={350}
      content={
        <div className="w-full modal-content">
          <div className="flex flex-col gap-1">
            <div className="flex items-stretch justify-stretch gap-2">
              <div className="w-[250px]">
                <div className="font-bold text-sm mb-2 bg-gray-200 px-2 py-1">
                  <ERPCheckbox
                    id='batchEnabled'
                    label={t("batch")}
                    checked={batchData.batchEnabled !== false}
                    onChange={(e) => handleFieldChange('batchEnabled', e.target.checked)}
                  />
                </div>
                <div className={`flex flex-col gap-2 border border-dashed p-2 border-black rounded-md h-[170px] ${batchData.batchEnabled === false ? "opacity-50 pointer-events-none" : ""}`}>
                  {/* Batch No */}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-20 text-xs mb-1 sm:mb-0">
                      {t("batch_no")} :
                    </label>
                    <ERPInput
                      id="batchNo"
                      value={batchData.batchNo}
                      className="flex-1 h-6 text-xs w-full"
                      noLabel={true}
                      onChange={(e) => handleFieldChange('batchNo', e.target.value)}
                      disabled={!batchData.batchEnabled}
                    />
                  </div>
                  {/* Exp Days */}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-20 text-xs mb-1 sm:mb-0">
                      {t("exp_days")} :
                    </label>
                    <ERPInput
                      id="expDays"
                      value={batchData.expDays || ""}
                      className="w-full sm:w-24 h-6 text-xs"
                      noLabel={true}
                      onChange={(e) => handleFieldChange('expDays', e.target.value)}
                      disabled={!batchData.batchEnabled}
                    />
                  </div>
                  {/* Exp Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-20 text-xs mb-1 sm:mb-0">
                      {t("exp_date")} :
                    </label>
                    <ERPDateInput
                      id="expDate"
                      noLabel={true}
                      value={batchData.expDate}
                      className="flex-1 h-6 text-xs w-full"
                      onChange={(e) => handleFieldChange('expDate', e.target.value)}
                      disabled={!batchData.batchEnabled}
                    />
                  </div>
                  {/* Mfd Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-20 text-xs mb-1 sm:mb-0">
                      {t("mfd_date")} :
                    </label>
                    <ERPDateInput
                      id="mfdDate"
                      noLabel={true}
                      value={batchData.mfdDate}
                      className="flex-1 h-6 text-xs w-full"
                      onChange={(e) => handleFieldChange('mfdDate', e.target.value)}
                      disabled={!batchData.batchEnabled}
                    />
                  </div>
                  {/* MRP */}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-20 text-xs mb-1 sm:mb-0">
                      {t("mrp")} :
                    </label>
                    <ERPInput
                      id="mrp"
                      value={batchData.mrp || ""}
                      className="w-full sm:w-24 h-6 text-xs"
                      noLabel={true}
                      onChange={(e) => handleFieldChange('mrp', e.target.value)}
                      disabled={!batchData.batchEnabled}
                    />
                  </div>
                </div>
              </div>

              <div className="w-[250px]">
                {/* Unit 2 Section */}
                <div className="mb-2">
                  <div className="font-bold text-sm mb-2 bg-gray-200 px-2 py-1">
                    <div className="flex items-center gap-2">
                      <ERPCheckbox
                        id="unit2Enabled"
                        label={t("unit_2")}
                        checked={batchData.unit2Enabled || false}
                        onChange={(e) => handleFieldChange('unit2Enabled', e.target.checked)}
                      />
                    </div>
                  </div>
                  <div className={`flex flex-col gap-2 border border-dashed p-2 border-black rounded-md h-[170px] ${!batchData.unit2Enabled ? "opacity-50 pointer-events-none" : ""}`}>
                    {/* Unit 2 Dropdown */}
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <label className="w-full sm:w-24 text-xs mb-1 sm:mb-0">
                        {t("unit_2")} :
                      </label>
                      <ERPDataCombobox
                        id="unitID2"
                        noLabel={true}
                        value={batchData.unitID2}
                        className="flex-1 h-6 text-xs w-full"
                        field={{
                          id: "unitID2",
                          valueKey: "id",
                          labelKey: "name",
                          getListUrl: Urls.data_units
                        }}
                        onSelectItem={(data) => {
                          handleFieldChange('unitID2', data.value);
                          handleFieldChange('unit2', data.text);
                        }}
                        disabled={!batchData.unit2Enabled}
                      />
                    </div>
                    {/* Unit 2 Qty */}
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <label className="w-full sm:w-24 text-xs mb-1 sm:mb-0">
                        {t("packing_qty")} :
                      </label>
                      <ERPInput
                        id="unit2Qty"
                        value={batchData.unit2Qty || ""}
                        className="w-full sm:w-24 h-6 text-xs"
                        noLabel={true}
                        onChange={(e) => handleFieldChange('unit2Qty', e.target.value)}
                        disabled={!batchData.unit2Enabled}
                      />
                    </div>
                    {/* Unit 2 Sales Rate */}
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <label className="w-full sm:w-24 text-xs mb-1 sm:mb-0">
                        {t("sales_price")} :
                      </label>
                      <ERPInput
                        id="unit2SalesRate"
                        value={batchData.unit2SalesRate || ""}
                        className="w-full sm:w-24 h-6 text-xs"
                        noLabel={true}
                        onChange={(e) => handleFieldChange('unit2SalesRate', e.target.value)}
                        disabled={!batchData.unit2Enabled}
                      />
                    </div>
                    {/* Unit 2 MRP */}
                    {/* <div className="flex flex-col sm:flex-row sm:items-center">
                      <label className="w-full sm:w-24 text-xs mb-1 sm:mb-0">
                        {t("mrp")} :
                      </label>
                      <ERPInput
                        id="unit2MRP"
                        value={batchData.unit2MRP || ""}
                        className="w-full sm:w-24 h-6 text-xs"
                        noLabel={true}
                        onChange={(e) => handleFieldChange('unit2MRP', e.target.value)}
                        disabled={true}
                      />
                    </div> */}
                    {/* Unit 2 MBarcode */}
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <label className="w-full sm:w-24 text-xs mb-1 sm:mb-0">
                        {t("unit_mbarcode")} :
                      </label>
                      <ERPInput
                        id="unit2MBarcode"
                        value={batchData.unit2MBarcode || ""}
                        className="flex-1 h-6 text-xs w-full"
                        noLabel={true}
                        onChange={(e) => handleFieldChange('unit2MBarcode', e.target.value)}
                        disabled={!batchData.unit2Enabled}
                      />
                    </div>
                    {/* Unit 2 Sticker Qty */}
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <label className="w-full sm:w-24 text-xs mb-1 sm:mb-0">
                        {t("sticker")} :
                      </label>
                      <ERPInput
                        id="unit2StickerQty"
                        value={batchData.unit2StickerQty || ""}
                        className="w-full sm:w-24 h-6 text-xs"
                        noLabel={true}
                        onChange={(e) => handleFieldChange('unit2StickerQty', parseInt(e.target.value) || 0)}
                        disabled={!batchData.unit2Enabled}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Unit 3 Section */}
              <div className="w-[250px]">
                <div className="font-bold text-sm mb-2 bg-gray-200 px-2 py-1">
                  <div className="flex items-center gap-2">
                    <ERPCheckbox
                      id="unit3Enabled"
                      label={t("unit_3")}
                      checked={batchData.unit3Enabled || false}
                      onChange={(e) => handleFieldChange('unit3Enabled', e.target.checked)}
                    />
                  </div>
                </div>
                <div className={`flex flex-col gap-2 border border-dashed p-2 border-black rounded-md h-[170px] ${!batchData.unit3Enabled ? "opacity-50 pointer-events-none" : ""}`}>
                  {/* Unit 3 Dropdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-24 text-xs mb-1 sm:mb-0">
                      {t("unit_3")} :
                    </label>
                    <ERPDataCombobox
                      id="unitID3"
                      noLabel={true}
                      value={batchData.unitID3}
                      className="flex-1 h-6 text-xs w-full"
                      field={{
                        id: "unitID3",
                        valueKey: "id",
                        labelKey: "name",
                        getListUrl: Urls.data_units
                      }}
                      onSelectItem={(data) => {
                        handleFieldChange('unitID3', data.value);
                        handleFieldChange('unit3', data.text);
                      }}
                      disabled={!batchData.unit3Enabled}
                    />
                  </div>
                  {/* Unit 3 Qty */}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-24 text-xs mb-1 sm:mb-0">
                      {t("packing_qty")} :
                    </label>
                    <ERPInput
                      id="unit3Qty"
                      value={batchData.unit3Qty || ""}
                      className="w-full sm:w-24 h-6 text-xs"
                      noLabel={true}
                      onChange={(e) => handleFieldChange('unit3Qty', e.target.value)}
                      disabled={!batchData.unit3Enabled}
                    />
                  </div>
                  {/* Unit 3 Sales Rate */}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-24 text-xs mb-1 sm:mb-0">
                      {t("sales_price")} :
                    </label>
                    <ERPInput
                      id="unit3SalesRate"
                      value={batchData.unit3SalesRate || ""}
                      className="w-full sm:w-24 h-6 text-xs"
                      noLabel={true}
                      onChange={(e) => handleFieldChange('unit3SalesRate', e.target.value)}
                      disabled={!batchData.unit3Enabled}
                    />
                  </div>
                  {/* Unit 3 MRP */}
                  {/* <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-24 text-xs mb-1 sm:mb-0">
                      {t("mrp")} :
                    </label>
                    <ERPInput
                      id="unit3MRP"
                      value={batchData.unit3MRP || ""}
                      className="w-full sm:w-24 h-6 text-xs"
                      noLabel={true}
                      onChange={(e) => handleFieldChange('unit3MRP', e.target.value)}
                      disabled={true}
                    />
                  </div> */}
                  {/* Unit 3 MBarcode */}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-24 text-xs mb-1 sm:mb-0">
                      {t("unit_mbarcode")} :
                    </label>
                    <ERPInput
                      id="unit3MBarcode"
                      value={batchData.unit3MBarcode || ""}
                      className="flex-1 h-6 text-xs w-full"
                      noLabel={true}
                      onChange={(e) => handleFieldChange('unit3MBarcode', e.target.value)}
                      disabled={!batchData.unit3Enabled}
                    />
                  </div>
                  {/* Unit 3 Sticker Qty */}
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-24 text-xs mb-1 sm:mb-0">
                      {t("sticker")} :
                    </label>
                    <ERPInput
                      id="unit3StickerQty"
                      value={batchData.unit3StickerQty || ""}
                      className="w-full sm:w-24 h-6 text-xs"
                      noLabel={true}
                      onChange={(e) => handleFieldChange('unit3StickerQty', parseInt(e.target.value) || 0)}
                      disabled={!batchData.unit3Enabled}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className='flex items-center justify-end gap-2 mt-2'>
              <ERPButton
                title={t('set')}
                onClick={handleSet}
                variant='primary'
              />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default BatchEntryModal;
