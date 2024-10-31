"use client"

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import {  TreeList } from "devextreme-react";
import { Column, Paging, RemoteOperations, Scrolling, Selection } from "devextreme-react/cjs/tree-list";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
const api = new APIClient();
const ChartOfAccounts: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
    const [showbalance, setShowbalance] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>([]);

  useEffect(() => {
    loadAccountStructure();
  }, []);

  const loadAccountStructure = async () => {
    setLoading(true);
    try {
      const res: any = await api.getAsync(`${Urls.chart_of_accounts}${showbalance}`);
      const flattenedData = flattenHierarchy(res.data);
      setData(flattenedData);
    } catch (error) {
      console.error("Error loading account structure:", error);
    }
    setLoading(false);
  };

  const flattenHierarchy = (items: any[], parentId: number | null = null, level: number = 0): any[] => {
    return items.reduce((acc: any[], item: any) => {
      const flatItem = { ...item, level };
      if (parentId !== null) {
        flatItem.parentID = parentId;
      }
      acc.push(flatItem);
      if (item.children && item.children.length > 0) {
        acc.push(...flattenHierarchy(item.children, item.id, level + 1));
      }
      return acc;
    }, []);
  };

  return (
    <div className="w-full flex justify-start">
      <div className="grid grid-cols-12 gap-x-6">
       
      
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
       
          <div className="box custom-box">
         
            <div className="box-body">
               <div className="w-full flex justify-start items-center">
       <ERPCheckbox
                    id="showBalace"
                     checked={showbalance}
                    // data={setShowbalance}
                    label={t("show_balance")}
                     onChange={(e) => setShowbalance(!showbalance)}
                  />

                <ERPButton
                 className="ml-10"
                  title="Refresh"
                  variant="primary"
                  onClick={loadAccountStructure}
                />
        </div>
            
              {loading ? (
                <div>Loading...</div>
              ) : data.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                 <div className="flex items-start justify-between">  <TreeList
                   id="data"
    dataSource={data}
    showRowLines={true}
    showBorders={true}
autoExpandAll={true}
    // columnAutoWidth={true}
    keyExpr="keyField"
    parentIdExpr="parentID"
    height={720} // Set a fixed height here
    scrolling={{ mode: 'virtual' }} // Specify virtual scrolling mode
  >
    <Selection mode="single" />
    <Column dataField="accountGroup" caption="Account Group"/>
    <Column dataField="aliasName" caption="Alias Name" />
 <Column dataField="balance" caption="Balance" />
 <Column dataField="createdUser" caption="Created User" />
 <Column dataField="createdDate" caption="Created Date" dataType="date"  />
 
    {/* <Column dataField="code" /> */}
  </TreeList>
 
                 
            
            </div>

                </div>
              ) : (
                <div>No data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChartOfAccounts;