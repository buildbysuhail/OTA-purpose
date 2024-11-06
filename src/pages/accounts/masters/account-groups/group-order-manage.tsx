import React, { useCallback, useEffect, useRef, useState } from "react";
import ERPSubmitButton from "../../../../components/ERPComponents/erp-submit-button";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { toggleGroupOrder } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { moveArrayElement } from "../../../../utilities/Utils";
import { handleResponse } from "../../../../utilities/HandleResponse";

export interface GroupOrder {
    groupName: string;
    groupHead: string;
    arabicName: string;
}
const api = new APIClient();

interface AccountGroupOrderContentProps {
  formData: GroupOrder[];
  setFormData: React.Dispatch<React.SetStateAction<GroupOrder[]>>;
  
}
interface AccountGroupOrderFooterProps {
  onSubmit: () => Promise<void>;
}
// AccountGroupOrderContent component
export const AccountGroupOrderContent: React.FC<AccountGroupOrderContentProps> = React.memo(({ formData, setFormData }) => {
  const [searchCols, setSearchCols] = useState<String>("");
  // const [formData, setFormData] = useState<GroupOrder[]>([]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.getAsync(Urls.acc_group_order);
      if (Array.isArray(response)) {
        setFormData(response);
      } else {
        console.error("Expected an array response but got:", response);
        setFormData([]); 
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };
  
  const handleDragStart = (e: any) => {
    debugger;
    dragItem.current = e.target.id;
  };

  const handleDragEnd = (e: any) => {
    debugger;
    e.preventDefault();
    dragOverItem.current = e.currentTarget.id;
  };

  const handleDropping = (e: any) => {

    debugger;
    let startIndex = formData?.findIndex((fld: any) => fld?.groupName === dragItem.current);
    let endIndex = formData?.findIndex((fld: any) => fld?.groupName === dragOverItem.current);

    setFormData(moveArrayElement(formData, startIndex, endIndex));
    dragItem.current = null;
    dragOverItem.current = null;
  };
 
  // const onSubmit = async () => {
  //   try {
  //     const response = await api.post(Urls.acc_group_order, formData) 
  //     handleResponse(response);
  //   } catch (error) {
  //     console.error('Error saving settings:', error);
  //   }
  // };

  return (
    <>
      <div className="px-1 py-3 flex flex-col gap-1">
        <ERPInput
          noLabel
          className="mb-3"
          id="search_cols"
          value={searchCols}
          placeholder="Search"
          onChange={(e: any) => setSearchCols(e?.target?.value)}
          prefix={<MagnifyingGlassIcon className="w-4 h-4" />}
        />
        <div className="grid-preference-form">
          <div className="header-row bg-gray-100 px-4 py-2 font-bold text-sm grid grid-cols-3 gap-2 items-center">
            <span>Group Name </span>
            <span>Group Head </span>
            <span>Arabic Name </span>
          </div>
          {formData.length > 0 &&
            formData?.map((column, index) => {
              return (
                <div
                  key={index}
                  id={`${column.groupName}`}
                  className="px-1 py-1"
                  draggable
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnd}
                  onDragEnd={handleDropping}
                >
                  <div
                    className={`bg-[#F9F9FB] w-full px-1 rounded grid grid-cols-3 !items-center pl-4`}
                  >
                    <label className="items-center py-1 capitalize text-sm text-slate-800 cursor-move">
                      ⋮⋮
                      <span className="cursor-pointer pl-2">
                        {column?.groupName}
                      </span>
                    </label>

                    <label className="items-center py-1 capitalize text-sm text-slate-800 cursor-move">
                      <span className="cursor-pointer pl-2">
                        {column?.groupHead}
                      </span>
                    </label>

                    <label className="items-center py-1 capitalize text-sm text-slate-800 cursor-move">
                      <span className="cursor-pointer pl-2">
                        {column?.arabicName}
                      </span>
                    </label>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
});

// AccountGroupOrderFooter component
export const AccountGroupOrderFooter: React.FC<AccountGroupOrderFooterProps> = React.memo(({ onSubmit }) => {
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(toggleGroupOrder({ isOpen: false, key: null }));
  }, [dispatch]);

  return (
    <div className="flex gap-10 justify-between py-3 border-t mt-5">
      <ERPSubmitButton type="button" variant="primary"  onClick={onSubmit}>
        Save
      </ERPSubmitButton>
      <ERPSubmitButton
        type="reset"
        onClick={onClose}
        className="w-28 bg-[#e5e7eb] text-[#404040]"
      >
        Cancel
      </ERPSubmitButton>
    </div>
  );
});
