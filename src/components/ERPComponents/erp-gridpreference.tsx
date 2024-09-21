import { BackgroundColor, Width } from 'devextreme-react/cjs/chart'
import React, { Fragment, useEffect, useState ,useRef} from 'react'
import Themeprimarycolor, {
  ColorPicker,
  hexToRgb,
} from "../../components/common/switcher/switcherdata/switcherdata";
import * as switcherdata from "../../components/common/switcher/switcherdata/switcherdata";
import { useAppState } from "../../utilities/hooks/useAppState";
const ERPGridpreference = ({ onClose }:any) => {
 
   const tableHeaders= ['HeaderText',"Width",'Align','Visible','ReadOnly','FontBold','FontColour','FontSize','DisplayOrder']

  //  ===========demo data for chosser===========================
  const [tableBody, setTableBody] = useState([
    {
      HeaderText: 'userTypeName',
      Width:100,
      Align:'left',
      Visible:true,
      ReadOnly:false,
      FontBold:false,
      FontColour:'#000000',
      FontSize:0,
      DisplayOrder:1
    },
    {
      HeaderText: 'userCode',
      Width:60,
      Align:'left',
      Visible:true,
      ReadOnly:true,
      FontBold:false,
      FontColour:'#000000',
      FontSize:0,
      DisplayOrder:2
    },
    {
      HeaderText: 'remark',
      Width:45,
      Align:'left',
      Visible:true,
      ReadOnly:true,
      FontBold:false,
      FontColour:'#000000',
      FontSize:0,
      DisplayOrder:3
    },
    {
      HeaderText: 'action',
      Width:45,
      Align:'left',
      Visible:false,
      ReadOnly:true,
      FontBold:false,
      FontColour:'#000000',
      FontSize:0,
      DisplayOrder:4
    },
  ]
  )
  const { appState, updateAppState } = useAppState();
   const [gridPreference, setGridPreference] = useState<any>({
                font: "",
                fontSize: 10,
                bold: false,
                rowHeigth: 5,
                alternativeColour:"rgb(25,118,210,1)",
                bagroundHeadColour:"rgb(25,118,210,1)",    
                foreHeadColour: "rgb(25,118,210,1)",
                gridLine:"rgb(25,118,210,1)",
                bagroundColour:  "rgb(25,118,210,1)",
                foreColour:  "rgb(25,118,210,1)",
                
              });
  // ==================================================================
   

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, field: string) => {
    const newValue = field === 'Visible' || field === 'ReadOnly' || field === 'FontBold' ? e.target.checked : e.target.value;
    setTableBody(prevState => {
      const updatedTableBody = [...prevState];
      updatedTableBody[rowIndex] = { ...updatedTableBody[rowIndex], [field]: newValue };
      return updatedTableBody;
    });
  };

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
                                  style={{
                                    backgroundColor: gridPreference.alternativeColour + ' !important',
                                  }}
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
      <table className="min-w-full table-auto border-collapse overscroll-auto ">
        <thead >
        <tr className="bg-gray-50 ">
            {tableHeaders.map((header, index) => (
              <th key={index} className="px-2 border border-gray-400">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
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
              </tbody>
      </table>
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

export default ERPGridpreference


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



             