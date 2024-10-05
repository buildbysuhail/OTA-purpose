import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleBankPosPopup } from "../../../redux/slices/popup-reducer";
import { useTranslation } from "react-i18next";
import { BankPoseData } from "../Administration/administration-types";

const Barcodeprint: React.FC = React.memo(() => {
  const rootState = useRootState();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<BankPoseData>({
      url: Urls.BankPosSettings,
      onSuccess: useCallback(
        () => dispatch(toggleBankPosPopup({ isOpen: false, key: null })),
        [dispatch]
      ),
      key: rootState.PopupData.reminder.key,
    });

  const onClose = useCallback(() => {
    dispatch(toggleBankPosPopup({ isOpen: false, key: null }));
  }, []);

  return (

    <div className="p-4 bg-white border border-gray-300 rounded-md shadow-md max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex space-x-2 mb-2 md:mb-0">
          <button className="px-2 py-1 bg-blue text-white rounded">
            Print
          </button>
          <button className="px-2 py-1 bg-red text-white rounded">
            Clear
          </button>
          <button className="px-2 py-1 bg-yellow text-white rounded">
            Remove Line
          </button>
          <button className="px-2 py-1 bg-green text-white rounded">
            Close
          </button>
          <button className="px-2 py-1 bg-blue text-white rounded">
            Print Tag
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label>Barcode Form</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              className="border border-gray-300 rounded p-1 flex-1"
            />
            <span>To</span>
            <input
              type="text"
              className="border border-gray-300 rounded p-1 flex-1"
            />
          </div>
          <label>BarCode Comma Separated</label>
          <input
            type="text"
            className="border border-gray-300 rounded p-1 w-full mb-2"
          />
          <div className="flex items-center space-x-2">
            <input type="checkbox" />
            <span>Preview</span>
            <button className="px-2 py-1 bg-gray-300 rounded">Show</button>
          </div>
        </div>
        <div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input type="radio" name="type" />
              <span>Sales</span>
              <input
                type="text"
                className="border border-gray-300 rounded p-1 flex-1"
                placeholder="VPrefix"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" name="type" />
              <span>Purchase</span>
              <select className="border border-gray-300 rounded p-1 flex-1">
                <option>Form Type</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" name="type" />
              <span>BTO</span>
              <input
                type="text"
                className="border border-gray-300 rounded p-1 flex-1"
                placeholder="Bill No"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" name="type" />
              <span>BTI</span>
              <input
                type="text"
                className="border border-gray-300 rounded p-1 flex-1"
                placeholder="0"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" name="type" />
              <span>OS</span>
              <button className="px-2 py-1 bg-gray-300 rounded">Show</button>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" name="type" />
              <span>Other</span>
              <input
                type="text"
                className="border border-gray-300 rounded p-1 flex-1"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              className="border border-gray-300 rounded p-1"
              placeholder="Pack.Date"
            />
            <input
              type="text"
              className="border border-gray-300 rounded p-1"
              placeholder="Note 3"
            />
            <input
              type="text"
              className="border border-gray-300 rounded p-1"
              placeholder="Exp.Desc"
            />
            <input
              type="text"
              className="border border-gray-300 rounded p-1"
              placeholder="Note 4"
            />
            <input
              type="text"
              className="border border-gray-300 rounded p-1"
              placeholder="Note 1"
            />
            <input
              type="text"
              className="border border-gray-300 rounded p-1"
              placeholder="Note 2"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center space-x-2 mb-4">
        <label>Label Design</label>
        <input
          type="text"
          className="border border-gray-300 rounded p-1"
          placeholder="BARCODE.lba"
        />
        <label>Start Row</label>
        <input
          type="text"
          className="border border-gray-300 rounded p-1"
          placeholder="0"
        />
        <label>End Row</label>
        <input
          type="text"
          className="border border-gray-300 rounded p-1"
          placeholder="0"
        />
        <div className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>In Search</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center space-x-2 mb-4">
        <div className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>Preview</span>
        </div>
        <button className="px-2 py-1 bg-blue-500 text-white rounded">
          Print
        </button>
        <label>Label Design</label>
        <select className="border border-gray-300 rounded p-1">
          <option>Barcode Label1.repx</option>
        </select>
        <label>Printer</label>
        <select className="border border-gray-300 rounded p-1">
          <option></option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Bar Code</th>
              <th className="border border-gray-300 p-2">Product</th>
              <th className="border border-gray-300 p-2">Copies</th>
              <th className="border border-gray-300 p-2">Unit</th>
              <th className="border border-gray-300 p-2">Brand</th>
              <th className="border border-gray-300 p-2">Cost</th>
              <th className="border border-gray-300 p-2">SalesPrice</th>
              <th className="border border-gray-300 p-2">MRP</th>
              <th className="border border-gray-300 p-2">BarcodePrinted</th>
              <th className="border border-gray-300 p-2">X</th>
              <th className="border border-gray-300 p-2">MSP</th>
              <th className="border border-gray-300 p-2">MBarc</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2 text-blue-500 cursor-pointer">
                  X
                </td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2 text-blue-500 cursor-pointer">
                  X
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
export default Barcodeprint;
