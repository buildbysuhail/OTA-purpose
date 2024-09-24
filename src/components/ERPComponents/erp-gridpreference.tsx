import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import ERPInput from "./erp-input";
import { ArrowLongDownIcon, ArrowLongUpIcon, LockClosedIcon, MagnifyingGlassIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { capitalizeAndAddSpace, moveArrayElement, removeSpacesAndCapitalize } from "../../utilities/Utils";
import ERPSubmitButton from "./erp-submit-button";
import ERPModal from "./erp-modal";
import { json } from "react-router-dom";
import { ColumnPreference, DevGridColumn, GridPreference, initialGridPreference } from "../types/dev-grid-column";
import { getInitialPreference } from "../../utilities/dx-grid-preference-updater";
interface GridPreferenceChooserProps {
  gridId: string;
  columns: DevGridColumn[];
  onApplyPreferences: (pref: any) => void;
}


const GridPreferenceChooser: FC<GridPreferenceChooserProps> = ({
  gridId,
  columns,
  onApplyPreferences,
}) => {
  
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const [remodal, setReModal] = useState<any>();
  const [searchCols, setSearchCols] = useState<String>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  

  /* ########################################################################################### */

  const onChange = (e: any) => {
    debugger;
    onApplyPreferences(e);
  };
  const handleDragStart = (e: any) => {
    dragItem.current = e.target.id;
  };

  const handleDragEnd = (e: any) => {
    e.preventDefault();
    dragOverItem.current = e.currentTarget.id;
  };

  const handleDropping = (e: any) => {
    debugger;
    let startIndex = preferences.columnPreferences?.findIndex((fld: any) => fld?.dataField === dragItem.current);
    let endIndex = preferences.columnPreferences?.findIndex((fld: any) => fld?.dataField === dragOverItem.current);

    setPreferences((prevPreferences: any) => {
      return {
        ...prevPreferences,
        columnPreferences: (moveArrayElement(preferences.columnPreferences, startIndex, endIndex))
      };
    });
    dragItem.current = null;
    dragOverItem.current = null;
  };

  /* ########################################################################################### */
 

  /* ########################################################################################### */
  
  
  const [preferences, setPreferences] = useState<GridPreference>(initialGridPreference);
  
  useEffect(() => {
    setPreferences(getInitialPreference(gridId,columns));

  }, [gridId, columns, onApplyPreferences]);

  const getDefaultColumnPreference = (column: DevGridColumn, index: number): ColumnPreference => ({
    dataField: column.dataField??"",
    isLocked: column.isLocked??false,    
    caption: column.caption || capitalizeAndAddSpace(column.dataField??""),
    width: column.width || 100,
    alignment: column.alignment || 'left',
    visible: true,
    readOnly: false,
    fontBold: false,
    fontColor: '',
    fontSize: 0,
    displayOrder: index,
    showInPdf: column.showInPdf || false
  });

  const handlePreferenceChange = (
    key: string,
    value: any
  ) => {
    setPreferences((prevPreferences: any) => {
    return {
      ...prevPreferences,
      [key]: value
    };
  });
  };
  const handleColumnPreferenceChange = (
    dataField: string,
    key: string, // Ensure `key` is a valid property of `ColumnPreference`
    value: any
  ) => {
    debugger;
    setPreferences((prevPreferences: any) => {
      if (!prevPreferences) return prevPreferences;
  
      const updatedColumnPreferences = prevPreferences.columnPreferences.map(
        (column: ColumnPreference) => {
          if (column.dataField === dataField) {
            // Create a new column object with the updated value
            return {
              ...column,
              [key]: value
            };
          }
          return column; // Return the original column if no changes
        }
      );
  
      return {
        ...prevPreferences,
        columnPreferences: updatedColumnPreferences
      };
    });
  };

  const handleApplyPreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem(
      `gridPreferences_${gridId}`,
      JSON.stringify(preferences)
    );
    setIsOpen(false);
    debugger
    // Call the callback function to apply preferences
    onChange(preferences);
  };


  // ==================================================================
  const onClose = () => {};
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, field: string) => {
  //   const newValue = field === 'Visible' || field === 'ReadOnly' || field === 'FontBold' ? e.target.checked : e.target.value;
  //   setTableBody(prevState => {
  //     const updatedTableBody = [...prevState];
  //     updatedTableBody[rowIndex] = { ...updatedTableBody[rowIndex], [field]: newValue };
  //     return updatedTableBody;
  //   });
  // };

  return (
    <Fragment>
      <button onClick={()=>setIsOpen(true)} className='ti-btn rounded-[2px] '>
                        <i className="ri-apps-line"></i>
                    </button>
       <ERPModal
        isForm
        isOpen={isOpen}
        hasSubmit={false}
        closeTitle="Close"
        title={"Customize Columns"}
        width="max-w-[80rem]"
        closeModal={() => setIsOpen(false)}
        content={( <div className="px-1 py-3 flex flex-col gap-1">
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
            <div className="header-row bg-gray-100 px-4 py-2 font-bold text-sm grid grid-cols-5 gap-2 items-center">
            <span className="col-span-2">Column</span>
            <span>Width</span>
            <span>Read Only</span>
            <span>PDF</span>
          </div>
          {
          (preferences != undefined && preferences != null && preferences?.columnPreferences != undefined && preferences?.columnPreferences != null)  && preferences?.columnPreferences?.filter((item: any) => item.caption?.toLowerCase()
                .includes(searchCols.toLowerCase())
            )?.map((column: ColumnPreference) => {
              return (
                <div
                  key={column.dataField}
                  id={column.dataField}
                  className="px-1 py-1"
                  draggable
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnd}
                  onDragEnd={handleDropping}
                >
                  
                  <div className={`bg-[#F9F9FB] w-full px-1 rounded grid grid-cols-5 gap-2 !items-center`}>
                  <label className="col-span-2 items-center py-1 capitalize text-sm text-slate-800 cursor-move">
                  ⋮⋮
                  {column?.isLocked ? (
                    <div className="bg-[#F9F9FB] w-full px-1 rounded cursor-move">
                      <div className="flex gap-2 py-1 text-sm capitalize text-slate-800 items-center ">
                         <LockClosedIcon className=" h-3 w-3" />
                        <span className="cursor-pointer">{column?.caption}</span>
                      </div>
                    </div>
                  ) : (
                      
                        <>
                        <input
                          type="checkbox"
                          className="cursor-pointer  pl-2"
                          disabled={column?.isLocked}
                          onChange={(e) => {debugger; handleColumnPreferenceChange(column.dataField, 'visible' ,e.target.checked)}}
                          checked={column?.visible}
                        />
                        <span className="cursor-pointer pl-2">{column?.caption}</span>
                        </>
                        )}
                      </label>
                   
                        <input 
                          type="number"
                          value={column.width || ''}
                          onChange={(e) => handleColumnPreferenceChange(column.dataField, 'width', parseInt(e.target.value) || undefined)}
                          disabled={column.isLocked}
                          className="border rounded p-1 w-16 mh-[27px]"
                        />
                         <input 
            type="checkbox"
            className="cursor-pointer mh-[27px]"
            disabled={column.isLocked}
            checked={column.readOnly}
            onChange={(e) => handleColumnPreferenceChange(column.dataField, 'readOnly', e.target.checked)}
          />
          <input className="mh-[27px]"
            type="checkbox"
            checked={column.showInPdf}
            onChange={(e) => handleColumnPreferenceChange(column.dataField, 'showInPdf', e.target.checked)}
            disabled={column.isLocked}
          />
                      
                 
                </div>
                </div>
              );
              
              })
            }
              
          <div className="flex gap-10 justify-between py-3 border-t mt-5">
            <ERPSubmitButton type="button" onClick={handleApplyPreferences}>
              Save
            </ERPSubmitButton>
            <ERPSubmitButton type="reset" onClick={() => setIsOpen(false)} className=" w-28" varient="outline">
              Cancel
            </ERPSubmitButton>
          </div>
        </div>
        </div>
      )}
      />
      
     
    </Fragment>
  );
};

export default React.memo(GridPreferenceChooser);