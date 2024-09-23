import { Width } from 'devextreme-react/cjs/chart'
import React, { FC, Fragment, useEffect, useState } from 'react'
import Themeprimarycolor, {
  ColorPicker,
  hexToRgb,
} from "../../components/common/switcher/switcherdata/switcherdata";
import { DataGrid } from 'devextreme-react';
import { Column } from 'devextreme-react/cjs/data-grid';
import { Checkbox, Select } from '@headlessui/react';
import ERPInput from './erp-input';
import ERPButton from './erp-button';
interface GridPreferenceChooserProps {
  gridId: string;
  columns: any;
  onApplyPreferences: any

}
interface Preferences {
  [dataField: string]: ColumnPreference;
}
interface ColumnPreference {
  visible: boolean;
  width: number;
  showInPdf: boolean;
  alignment: 'left' | 'center' | 'right';
}
const GridPreferenceChooser: FC<GridPreferenceChooserProps> = ({ gridId, columns, onApplyPreferences }) => {
  const [preferences, setPreferences] = useState({});
  useEffect(() => {
    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem(`gridPreferences_${gridId}`);
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    } else {
      // Initialize preferences if not saved
      const initialPreferences = columns?.reduce((acc: any, column: any) => {
        acc[column.dataField] = {
          visible: true,
          width: column.width || 100,
          showInPdf: true,
          fontColor: 'black',
        };
        return acc;
      }, {});
      setPreferences(initialPreferences);
    }
  }, [gridId, columns]);

  const handlePreferenceChange = (dataField: string, key: keyof ColumnPreference, value: any) => {
    setPreferences((prev: Preferences) => ({
      ...prev,
      [dataField]: {
        ...prev[dataField],
        [key]: value,
      },
    }));
  };

  const handleApplyPreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem(`gridPreferences_${gridId}`, JSON.stringify(preferences));
    // Call the callback function to apply preferences
    onApplyPreferences(preferences);
  };


   const tableHeaders= ['HeaderText',"Width",'Align','Visible','ReadOnly','FontBold','FontColour','FontSize','DisplayOrder']

  //  ===========demo data for chosser===========================
  // const [tableBody, setTableBody] = useState([
  //   {
  //     HeaderText: 'userTypeName',
  //     Width:100,
  //     Align:'left',
  //     Visible:true,
  //     ReadOnly:false,
  //     FontBold:false,
  //     FontColour:'#000000',
  //     FontSize:0,
  //     DisplayOrder:1
  //   },
  //   {
  //     HeaderText: 'userCode',
  //     Width:60,
  //     Align:'left',
  //     Visible:true,
  //     ReadOnly:true,
  //     FontBold:false,
  //     FontColour:'#000000',
  //     FontSize:0,
  //     DisplayOrder:2
  //   },
  //   {
  //     HeaderText: 'remark',
  //     Width:45,
  //     Align:'left',
  //     Visible:true,
  //     ReadOnly:true,
  //     FontBold:false,
  //     FontColour:'#000000',
  //     FontSize:0,
  //     DisplayOrder:3
  //   },
  //   {
  //     HeaderText: 'action',
  //     Width:45,
  //     Align:'left',
  //     Visible:false,
  //     ReadOnly:true,
  //     FontBold:false,
  //     FontColour:'#000000',
  //     FontSize:0,
  //     DisplayOrder:4
  //   },
  // ]
  // )
   
  
  // ==================================================================
  const preferencesArray = Object.entries(preferences).map(([dataField, pref]) => ({
    dataField,
    ...(pref as ColumnPreference),
  }));
const onClose = () => {

}
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
    <div className=" fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className=" container bg-white p-6 rounded-sm shadow-lg lg:w-auto lg:max-w-none">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">DataGrid Preference</h2>
          <button onClick={onClose} className="text-red-500">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* textpreference form */}
        <div className='grid  justify-start sm:gap-3 lg:gap-y-0 lg:gap-x-3 justify-items-start content-start items-center sm:grid-cols-3 md:grid-cols-4 m-0 p-0 box-border lg:grid-cols-5 mb-4' >
        
        <div className='flex justify-start items-center m-0 p-0 box-border'>
        <label htmlFor="headerText" className="text-xs font-medium mr-1">Font</label>
        <select
        id="headerText"
        className="appearance-none border border-gray-400 rounded text-[11px] leading-3  py-0 pr-5 pl-2 bg-slate-50 shadow-sm h-6 focus:outline-none focus:ring focus:border-blue-500"
       >
        <option value="Arial">Arial</option>
       <option value="Times New Roman">Times New Roman</option>
       <option value="Helvetica">Helvetica</option>
       <option value="Courier New">Courier New</option>
       <option value="Georgia">Georgia</option>
      </select>
      </div>
        <div className='flex justify-start items-center m-0 p-0 box-border'>
        <label htmlFor="number" className="text-xs font-medium mr-1">Font Size</label>
        <input
          type="number"
          id="number"
          className="border border-gray-400 rounded w-16 h-6 text-[11px] leading-3 bg-slate-50 shadow-sm focus:outline-none focus:ring focus:border-blue-500 "
          // placeholder="Enter width"
        />
        </div>
        <div className='flex justify-start items-center m-0 p-0 box-border'>
        <label htmlFor="fontColor" className="text-xs font-medium mr-1">Bold</label>
        
          <input
            type="checkbox"
            id="boldText"
            className="form-checkbox h-4 w-4  rounded text-blue-500"
          />
        </div>  
      
       
        <div className='flex justify-start items-center m-0 p-0 box-border'>
        <label htmlFor="fontSize" className="text-xs font-medium mr-1">RowHeight</label>
        <input
          type="number"
          id="fontSize"
          className="border border-gray-400 rounded w-16 h-6 text-[11px] leading-3 bg-slate-50 shadow-sm focus:outline-none focus:ring focus:border-blue-500"
         
        />
        </div>
        {/* <div className="grid grid-cols-3 gap-y-0"> */}
                    <div className='flex justify-start items-center m-0 p-0 box-border'>
                        <label htmlFor="fontSize" className="text-xs font-medium m-0">Alternative Colour</label>
                         
                         <div className="pickr-container-primary  scale-[0.6] hover:scale-[0.7] translate-y-1"  >
                              <div className="pickr "  >
                                <button
                                 
                                  className="pcr-button " //dynamic  background color
                                 
                                  onClick={(ele: any) => {
                                    if (ele.target.querySelector("input")) {
                                      ele.target.querySelector("input").click();
                                    }
                                  }}
                                >
                                
                                  <div className="Themeprimarycolor theme-container-primary pickr-container-primary ">
                                    <ColorPicker
                                      onChange={(e: any) => {
                                       
                                        const rgb = hexToRgb(e.target.value);
                                     
                                        if (rgb !== null) {
                                          const { r, g, b } = rgb;
                                          setGridPreference((state:any) => ({
                                            
                                            ...state,
                                            alternativeColour:  `rgb(${r} ${g} ${b})`,
                                          }));
                                        
                                         
                                        }
                                        
                                      }}
                                      value={"#ffff"}
                                    />
                                  </div>
                                </button>
                              </div>
                            </div>
                          
                        </div>


                        <div className='flex justify-start items-center m-0 p-0 box-border'>
                        <label htmlFor="fontSize" className="text-xs font-medium mr-0">BackHeadColour</label>

                         <div className="pickr-container-primary scale-[0.6] hover:scale-[0.7] translate-y-1">
                              <div className="pickr">
                                <button
                                  className="pcr-button"
                                  onClick={(ele: any) => {
                                    if (ele.target.querySelector("input")) {
                                      ele.target.querySelector("input").click();
                                    }
                                  }}
                                >
                                  <div className="Themeprimarycolor theme-container-primary pickr-container-primary">
                                    <ColorPicker
                                      onChange={(e: any) => {
                                        const rgb = hexToRgb(e.target.value);

                                        if (rgb !== null) {
                                          const { r, g, b } = rgb;
                                         
                                          // setTheme((prevTheme) => ({
                                          //   ...prevTheme,
                                          //   colorPrimaryRgb: `${r},  ${g},  ${b}`,
                                          // }));
                                          // localStorage.setItem("dynamiccolor", `${r}, ${g} ,${b}`);
                                        }
                                      }}
                                      value={"#FFFFFF"}
                                    />
                                  </div>
                                </button>
                              </div>
                            </div>
                        </div>

                        <div className='flex justify-start items-center m-0 p-0 box-border'>
                        <label htmlFor="fontSize" className="text-xs font-medium mr-0">Fore Colour Head</label>
                         <div className="pickr-container-primary scale-[0.6] hover:scale-[0.7] translate-y-1">
                              <div className="pickr">
                                <button
                                  className="pcr-button"
                                  onClick={(ele: any) => {
                                    if (ele.target.querySelector("input")) {
                                      ele.target.querySelector("input").click();
                                    }
                                  }}
                                >
                                  <div className="Themeprimarycolor theme-container-primary pickr-container-primary">
                                    <ColorPicker
                                      onChange={(e: any) => {
                                        const rgb = hexToRgb(e.target.value);

                                        if (rgb !== null) {
                                          const { r, g, b } = rgb;
                                         
                                          // setTheme((prevTheme) => ({
                                          //   ...prevTheme,
                                          //   colorPrimaryRgb: `${r},  ${g},  ${b}`,
                                          // }));
                                          // localStorage.setItem("dynamiccolor", `${r}, ${g} ,${b}`);
                                        }
                                      }}
                                      value={"#FFFFFF"}
                                    />
                                  </div>
                                </button>
                              </div>
                            </div>
                        </div>

                        <div className='flex justify-start items-center m-0 p-0 box-border'>
                        <label htmlFor="fontSize" className="text-xs  font-medium mr-0">Grid Line Colour</label>
                         <div className="pickr-container-primary scale-[0.6] hover:scale-[0.7] translate-y-1">
                              <div className="pickr">
                                <button
                                  className="pcr-button"
                                  onClick={(ele: any) => {
                                    if (ele.target.querySelector("input")) {
                                      ele.target.querySelector("input").click();
                                    }
                                  }}
                                >
                                  <div className="Themeprimarycolor theme-container-primary pickr-container-primary">
                                    <ColorPicker
                                      onChange={(e: any) => {
                                        const rgb = hexToRgb(e.target.value);

                                        if (rgb !== null) {
                                          const { r, g, b } = rgb;
                                         
                                          // setTheme((prevTheme) => ({
                                          //   ...prevTheme,
                                          //   colorPrimaryRgb: `${r},  ${g},  ${b}`,
                                          // }));
                                          // localStorage.setItem("dynamiccolor", `${r}, ${g} ,${b}`);
                                        }
                                      }}
                                      value={"#FFFFFF"}
                                    />
                                  </div>
                                </button>
                              </div>
                            </div>
                        </div>

                        <div className='flex justify-start items-center m-0 p-0 box-border'>
                        <label htmlFor="fontSize" className="text-xs font-medium mr-0">Back Colour</label>
                         <div className="pickr-container-primary scale-[0.6] hover:scale-[0.7] translate-y-1">
                              <div className="pickr">
                                <button
                                  className="pcr-button"
                                  onClick={(ele: any) => {
                                    if (ele.target.querySelector("input")) {
                                      ele.target.querySelector("input").click();
                                    }
                                  }}
                                >
                                  <div className="Themeprimarycolor theme-container-primary pickr-container-primary">
                                    <ColorPicker
                                      onChange={(e: any) => {
                                        const rgb = hexToRgb(e.target.value);

                                        if (rgb !== null) {
                                          const { r, g, b } = rgb;
                                         
                                          // setTheme((prevTheme) => ({
                                          //   ...prevTheme,
                                          //   colorPrimaryRgb: `${r},  ${g},  ${b}`,
                                          // }));
                                          // localStorage.setItem("dynamiccolor", `${r}, ${g} ,${b}`);
                                        }
                                      }}
                                      value={"#FFFFFF"}
                                    />
                                  </div>
                                </button>
                              </div>
                            </div>
                        </div>

                        <div className='flex justify-start items-center m-0 p-0 box-border'>
                        <label htmlFor="fontSize" className="text-xs font-medium mr-0">Fore Colour</label>
                         <div className="pickr-container-primary scale-[0.6] hover:scale-[0.7] translate-y-1 ">
                              <div className="pickr">
                                <button
                                  className="pcr-button"
                                  onClick={(ele: any) => {
                                    if (ele.target.querySelector("input")) {
                                      ele.target.querySelector("input").click();
                                    }
                                  }}
                                >
                                  <div className="Themeprimarycolor theme-container-primary pickr-container-primary">
                                    <ColorPicker
                                      onChange={(e: any) => {
                                        const rgb = hexToRgb(e.target.value);

                                        if (rgb !== null) {
                                          const { r, g, b } = rgb;
                                         
                                          // setTheme((prevTheme) => ({
                                          //   ...prevTheme,
                                          //   colorPrimaryRgb: `${r},  ${g},  ${b}`,
                                          // }));
                                          // localStorage.setItem("dynamiccolor", `${r}, ${g} ,${b}`);
                                        }
                                      }}
                                      value={"#FFFFFF"}
                                    />
                                  </div>
                                </button>
                              </div>
                            </div>
                        </div>

 
              {/* </div> */}
     
     </div>


        <div className=" overflow-x-auto">
      <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Grid Preferences</h2>
      <DataGrid
         dataSource={preferencesArray}
        showBorders={true}
        columnAutoWidth={true}
      >
        <Column dataField="dataField" caption="Column" />
        <Column
          dataField="visible"
          caption="Visible"
          cellRender={({ data }) => (
            <Checkbox
              checked={data.visible}
              onChange={(checked) => handlePreferenceChange(data.dataField, 'visible', checked)}
            />
          )}
        />
        <Column
          dataField="width"
          caption="Width"
          cellRender={({ data }) => (
            <ERPInput
              id="width"
              type="number"
              value={data.width}
              onChange={(e) => handlePreferenceChange(data.dataField, 'width', parseInt(e.target.value, 10))}
              className="w-20"
            />
          )}
        />
        <Column
          dataField="showInPdf"
          caption="Show in PDF"
          cellRender={({ data }) => (
            <Checkbox
              checked={data.showInPdf}
              onChange={(checked) => handlePreferenceChange(data.dataField, 'showInPdf', checked)}
            />
          )}
        />
       
      </DataGrid>
      <ERPButton onClick={handleApplyPreferences} className="mt-4" title='Apply Preferences'>
        
      </ERPButton>
    </div>
    </div>

    <div className="flex space-x-2 mt-4 justify-end items-center">
  <button className=" text-white text-[10px] font-semibold py-1 px-3 rounded-[4px] 
  transition ease-in-out delay-150 bg-sky-500 hover:-translate-y-0.5 hover:scale-110 hover:bg-[#1e40af] duration-300 ">
    Apply
  </button>
  
  <button className="bg-gray-100 hover:bg-slate-200 border border-gray-400 rounded-sm text-black text-[10px] font-semibold py-1 px-2 shadow-sm ">
    Reset
  </button>
  
  <button onClick={onClose}
  className="bg-gray-100 hover:bg-slate-200 border border-gray-400 rounded-sm text-black text-[10px] font-semibold py-1 px-2 shadow-sm ">
    Close
  </button>
</div>


      </div>
    </div>
    </Fragment>
  )
}

export default GridPreferenceChooser


{/* <tbody>
                {tableBody.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-sky-100':'bg-gray-50'}>
                    <td className="px-2 border border-gray-400 ">{row.HeaderText}</td>
                    <td className="px-2 border border-gray-400">{row.Width}</td>
                    <td className="px-2 border border-gray-400">{row.Align}</td>
                    <td className="px-2 border border-gray-400 text-center">
        <input
          type="checkbox"
          checked={row.Visible}
          readOnly
          className="form-checkbox h-3 w-3  text-blue-500 "
        />
      </td>
      <td className="px-2 border border-gray-400 text-center">
        <input
          type="checkbox"
          checked={row.ReadOnly}
          readOnly
          className="form-checkbox h-3 w-3  text-blue-500"
        />
      </td>
      <td className="px-2 border border-gray-400 text-center">
        <input
          type="checkbox"
          checked={row.FontBold}
          readOnly
          className="form-checkbox h-3 w-3  text-blue-500"
        />
      </td>
                    <td className="px-2 border border-gray-400">{row.FontColour}</td>
                    <td className="px-2 border border-gray-400">{row.FontSize}</td>
                    <td className="px-2 border border-gray-400">{row.DisplayOrder}</td>
                  </tr>
                ))}
              </tbody> */}


              // if (rgb !== null) {
              //   const { r, g, b } = rgb;
              //   switcherdata.primaryColorCustom(
              //     updateAppState,
              //     appState,
              //     `${r},  ${g},  ${b}`
              //   );
              //   setTheme((prevTheme) => ({
              //     ...prevTheme,
              //     colorPrimaryRgb: `${r},  ${g},  ${b}`,
              //   }));
              //   // localStorage.setItem("dynamiccolor", `${r}, ${g} ,${b}`);
              // }    



             