import React, { Fragment, useEffect, useState } from 'react'

const ERPGridpreference = ({ onClose }:any) => {
    // const [gridHeight, setGridHeight] = useState<number>(500);
   
    // useEffect(() => {
    //   let wh = window.innerHeight;
    //   let gridHeight = wh - 180;
    //   setGridHeight(gridHeight);
    // }, []);
  return (
    <Fragment>
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-sm shadow-lg w-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">DataGrid Preference</h2>
          <button onClick={onClose} className="text-red-500">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box custom-box">
            <div className="table w-full ...">
  <div className="table-header-group ...">
    <div className="table-row">
      <div className="table-cell text-left ...">Song</div>
      <div className="table-cell text-left ...">Artist</div>
      <div className="table-cell text-left ...">Year</div>
    </div>
  </div>
  <div className="table-row-group">
    <div className="table-row">
      <div className="table-cell ...">The Sliding Mr. Bones (Next Stop, Pottersville)</div>
      <div className="table-cell ...">Malcolm Lockyer</div>
      <div className="table-cell ...">1961</div>
    </div>
    <div className="table-row">
      <div className="table-cell ...">Witchy Woman</div>
      <div className="table-cell ...">The Eagles</div>
      <div className="table-cell ...">1972</div>
    </div>
    <div className="table-row">
      <div className="table-cell ...">Shining Star</div>
      <div className="table-cell ...">Earth, Wind, and Fire</div>
      <div className="table-cell ...">1975</div>
    </div>
  </div>
</div>
              {/* Add your preference content here */}
            </div>
          </div>
        </div>
      </div>
    </div>
    </Fragment>
  )
}

export default ERPGridpreference
