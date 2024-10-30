"use client"

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { DataGrid, TreeList } from "devextreme-react";
import { Column, Paging, RemoteOperations, Scrolling, Selection } from "devextreme-react/cjs/tree-list";

const api = new APIClient();

const ChartOfAccounts: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>([]);

  useEffect(() => {
    loadAccountStructure();
  }, []);

  const loadAccountStructure = async () => {
    setLoading(true);
    try {
      const res: any = await api.getAsync(`${Urls.chart_of_accounts}`);
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

  const onExpandedRowKeysChange = (expandedRowKeys: (string | number)[]) => {
    setExpandedRowKeys(expandedRowKeys);
  };

  return (
    <div className="w-full flex justify-start">
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              {loading ? (
                <div>Loading...</div>
              ) : data.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  <DataGrid
                    dataSource={data}
                    showRowLines={true}
                    showBorders={true}
                    columnAutoWidth={true}
                    // expandedRowKeys={expandedRowKeys}
                    // onExpandedRowKeysChange={onExpandedRowKeysChange}
                    keyExpr="id"
                    parentIdExpr="parentID"
                  >
                    <Paging pageSize={100}></Paging>
                  <Scrolling mode="standard" />
                  <RemoteOperations
                    filtering={false}
                    sorting={false}
                    paging={false}
                  ></RemoteOperations>
                    <Paging enabled={true} pageSize={30} />
                    <Selection mode="multiple" />
                    <Column
                      dataField="accountGroup"
                      caption={t("chart_of_accounts")}
                      dataType="string"
                      allowSearch={true}
                      allowFiltering={true}
                    />
                  </DataGrid>
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