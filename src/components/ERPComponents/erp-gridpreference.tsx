import { Width } from 'devextreme-react/cjs/chart'
import React, { Fragment, useEffect, useState } from 'react'
import Themeprimarycolor, {
  ColorPicker,
  hexToRgb,
} from "../../components/common/switcher/switcherdata/switcherdata";

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
   
  
  // ==================================================================
   

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
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className=" bg-white p-6 rounded-sm shadow-lg w-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">DataGrid Preference</h2>
          <button onClick={onClose} className="text-red-500">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* textpreference form */}
        <div className='flex flex-col mb-4'>
        <div className='flex justify-start items-center gap-4 mb-4'>
        <div>
        <label htmlFor="headerText" className="text-sm font-extralight mr-1">Font</label>
        <select
        id="headerText"
        className="border border-gray-400 rounded-sm text-xs  py-0 h-7 focus:outline-none focus:ring focus:border-blue-500"
       >
        <option value="Arial">Arial</option>
       <option value="Times New Roman">Times New Roman</option>
       <option value="Helvetica">Helvetica</option>
       <option value="Courier New">Courier New</option>
       <option value="Georgia">Georgia</option>
      </select>
      </div>
        <div>
        <label htmlFor="width" className="text-sm font-extralight mr-1">Font Size</label>
        <input
          type="number"
          id="width"
          className="border border-gray-400 rounded-sm w-16 h-7 text-xs focus:outline-none focus:ring focus:border-blue-500 "
          // placeholder="Enter width"
        />
        </div>
        <div>
        <label htmlFor="fontColor" className="text-sm font-extralight mr-1">Bold</label>
        
          <input
            type="checkbox"
            id="boldText"
            className="form-checkbox h-4 w-4 ml-2 text-blue-500"
          />
        </div>  
       </div>
       <div className='flex justify-start items-start gap-4 '>
        <div>
        <label htmlFor="fontSize" className="text-sm font-extralight mr-1">RowHeight</label>
        <input
          type="number"
          id="fontSize"
          className="border border-gray-400 rounded-sm w-16 h-7 text-xs focus:outline-none focus:ring focus:border-blue-500 "
         
        />
        </div>
        <div className="grid grid-cols-3 gap-4">
                    <div className='flex justify-start justify-items-start'>
                        <label htmlFor="fontSize" className="text-sm font-extralight mr-1">Alternative Colour</label>
                         
                         <div className="pickr-container-primary">
                              <div className="pickr">
                                <button
                                  className="pcr-button "
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


                        <div className='flex justify-start justify-items-startr'>
                        <label htmlFor="fontSize" className="text-sm font-extralight mr-1">Back Colour Head</label>
                         <div className="pickr-container-primary ">
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

                        <div className='flex justify-start justify-items-start'>
                        <label htmlFor="fontSize" className="text-sm font-extralight mr-1">Fore Colour Head</label>
                         <div className="pickr-container-primary ">
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

                        <div className='flex justify-start justify-items-start'>
                        <label htmlFor="fontSize" className="text-sm  font-extralight mr-1">Grid Line Colour</label>
                         <div className="pickr-container-primary ">
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

                        <div className='flex justify-start justify-items-start'>
                        <label htmlFor="fontSize" className="text-sm font-extralight mr-1">Back Colour</label>
                         <div className="pickr-container-primary ">
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

                        <div className='flex justify-start justify-items-start'>
                        <label htmlFor="fontSize" className="text-sm font-extralight mr-1">Fore Colour</label>
                         <div className="pickr-container-primary ">
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
              </div>
      </div>
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


              



              // const [theme, setTheme] = useState<Theme>({
              //   direction: "ltr",
              //   mode: "light",
              //   navLayout: null,
              //   navigationMenuStyle: null,
              //   sidemenuLayoutStyles: null,
              //   pageStyle: null,    
              // headerStyle: 'color',
              // menuStyle: 'dark',
              //   menuPosition: null,
              //   headerPosition: "",
              //   colorPrimaryRgb: "rgb(25,118,210,1)",
              // });