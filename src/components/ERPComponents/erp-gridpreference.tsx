import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import ERPInput from "./erp-input";
import { ArrowLongDownIcon, ArrowLongUpIcon, LockClosedIcon, MagnifyingGlassIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { capitalizeAndAddSpace, moveArrayElement, removeSpacesAndCapitalize } from "../../utilities/Utils";
import ERPSubmitButton from "./erp-submit-button";
import ERPModal from "./erp-modal";
interface GridPreferenceChooserProps {
  gridId: string;
  columns: DevGridColumn[];
  onApplyPreferences: any;
}
const initialColumnPreference: ColumnPreference = {
  dataField: '',
  isLocked: false,
  caption: "Column Header",        // string: the text to display in the header
  width: 150,                         // number: column width in pixels
  alignment: 'left',                      // 'left' | 'center' | 'right': text alignment
  visible: true,                      // boolean: whether the column is visible
  readOnly: false,                    // boolean: whether the column is read-only
  fontBold: false,                    // boolean: whether the font is bold
  fontColor: "#000000",               // string: font color in hex
  fontSize: 12,   
  showInPdf: true,                    // number: font size
  displayOrder: 1                     // number: the order in which the column appears
};
interface Preferences {
  [dataField: string]: ColumnPreference;
}
interface ColumnPreference {
  caption: string;
  isLocked: boolean;
  dataField: string;
  width: number;
  alignment: 'left' | 'center' | 'right';
  visible: boolean;
  readOnly: boolean;
  fontBold: boolean;
  fontColor: string;
  fontSize: number;
  showInPdf: boolean;
  displayOrder: number;
}
interface GridPreference {
  font: string;
  fontSize: number;
  bold: boolean;
  rowHeigh: number;
  alternativeColor: string;
  backgroundHeadColor: string;
  foreHeadColor: string;
  gridLine: string;
  backgroundColor: string;
  foreColor: string;
  columnPreferences: Array<ColumnPreference>;
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

  // const updateData = () => {
  //   setReModal(
  //     columns
  //       ?.filter((col) => {
  //         return fields?.find((h: any) => keyConverter(h.key) === col?.id)?.label?.toLowerCase();
  //         // .includes(searchCols.toLowerCase());
  //       })
  //       ?.map((column) => ({ id: column.id, getCanHide: column.getCanHide(), checked: column.getIsVisible() }))
  //   );
  // };

  // useEffect(() => {
  //   updateData();
  // }, [searchCols, visibilityValues]);
  /* ########################################################################################### */

  const handleDragStart = (e: any) => {
    dragItem.current = e.target.id;
  };

  const handleDragEnd = (e: any) => {
    e.preventDefault();
    dragOverItem.current = e.currentTarget.id;
  };

  const handleDropping = (e: any) => {
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
  const handleSaveCustomization = () => {
    if (preferences) {
      preferences.columnPreferences = preferences?.columnPreferences;
    }
    setIsOpen(false);
  };

  /* ########################################################################################### */
  const initialGridPreference: GridPreference = {
    font: "",
    fontSize: 10,
    bold: false,
    rowHeigh: 5,
    alternativeColor: "rgb(25,118,210,1)",
    backgroundHeadColor: "rgb(25,118,210,1)",
    foreHeadColor: "rgb(25,118,210,1)",
    gridLine: "rgb(25,118,210,1)",
    backgroundColor: "rgb(25,118,210,1)",
    foreColor: "rgb(25,118,210,1)",
    columnPreferences: []
  };
  
  const [preferences, setPreferences] = useState<GridPreference>(initialGridPreference);
  useEffect(() => {
    debugger;
    const savedPreferences = localStorage.getItem(`gridPreferences_${gridId}`);
    if (savedPreferences) {
      const parsedPreferences = JSON.parse(savedPreferences) as GridPreference;
      const mergedPreferences = new Array<ColumnPreference>();
       columns ? columns?.forEach((column: DevGridColumn, index: number) => {
        let columnPreference = parsedPreferences.columnPreferences?.find(c => c.dataField == column.dataField) || getDefaultColumnPreference(column, index)
        columnPreference.dataField = column.dataField?? removeSpacesAndCapitalize(column.caption??"");
        mergedPreferences.push(columnPreference)
      }):new Array<ColumnPreference>();
      setPreferences((prevPreferences: any) => {
        return {
          ...prevPreferences,
          ...parsedPreferences,
          columnPreferences: mergedPreferences
        };
      });
    } else {
      const initialPreferences = new Array<ColumnPreference>();
      columns? columns?.forEach((column: DevGridColumn, index: number) => {
        let columnPreference = getDefaultColumnPreference(column, index);
        columnPreference.dataField = column.dataField?? removeSpacesAndCapitalize(column.caption??"");
        initialPreferences.push(columnPreference);
      }): new Array<ColumnPreference>();
      
      setPreferences((prevPreferences: any) => {
        const updatedPreferences = {
          ...prevPreferences,
          columnPreferences: initialPreferences
        };
        console.log('updatedPreferences');
        console.log(updatedPreferences);
        
        
        return updatedPreferences;
      });
    }
    console.log('preferences');    
    console.log(preferences);
    
  }, [gridId, columns]);
  useEffect(() => {
    console.log('Updated preferences:', preferences);
  }, [preferences]);
  
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
    // Call the callback function to apply preferences
    onApplyPreferences(preferences);
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
      <button onClick={()=>setIsOpen(true)} className='ti-btn-primary-full rounded-[2px] '>
                        <i className="ri-arrow-right-s-fill  "></i>
                    </button>
       <ERPModal
        isForm
        isOpen={isOpen}
        hasSubmit={false}
        closeTitle="Close"
        title={"Customize Columns"}
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
          {
          (preferences != undefined && preferences != null && preferences?.columnPreferences != undefined && preferences?.columnPreferences != null)  && preferences?.columnPreferences?.filter((item: any) => item.label?.toLowerCase()
                .includes(searchCols.toLowerCase())
            )
          ?.map((column: ColumnPreference) => {
              return (
                <div
                  key={column.dataField}
                  id={column.dataField}
                  className="px-1"
                  draggable
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnd}
                  onDragEnd={handleDropping}
                >
                  {column?.isLocked ? (
                    <div className="bg-[#F9F9FB] w-full px-1 rounded cursor-move">
                      <div className="flex gap-2 py-1 text-sm capitalize text-slate-800 items-center ">
                        ⋮⋮
                        <LockClosedIcon className=" h-3 w-3" />
                        <span className="cursor-pointer">{column?.caption}</span>
                      </div>
                    </div>
                  ) : (
                    <div className={`bg-[#F9F9FB] w-full px-1 rounded `}>
                      <label className="flex gap-2 items-center py-1 capitalize text-sm text-slate-800 cursor-move">
                        ⋮⋮
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          disabled={!column?.isLocked}
                          onChange={(e) => handleColumnPreferenceChange(column.dataField, 'visible' ,e.target.checked)}
                          checked={column?.visible}
                          // {...{
                          //   type: "checkbox",
                          //   // checked: column.getIsVisible(),
                          //   // onChange: column.getToggleVisibilityHandler(),
                          //   // disabled: !column.getCanHide(),
                          // }}
                        />
                        <span className="cursor-pointer">{column?.caption}</span>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          <div className="flex gap-10 justify-between py-3 border-t mt-5">
            <ERPSubmitButton type="button" onClick={handleSaveCustomization}>
              Save
            </ERPSubmitButton>
            <ERPSubmitButton type="reset" onClick={() => setIsOpen(false)} className=" w-28" varient="outline">
              Cancel
            </ERPSubmitButton>
          </div>
        </div>)}
      />
     
    </Fragment>
  );
};

export default GridPreferenceChooser;