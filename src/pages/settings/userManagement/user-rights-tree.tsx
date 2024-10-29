'use client'

import React, { useCallback, useState, useEffect } from 'react';
import {
  TreeList, Selection, Column, TreeListTypes,
} from 'devextreme-react/tree-list';
import { employees } from './data.js';

const expandedRowKeys = [1, 2, 10];

interface UserTypeTreeProps {
  userTypeCode: string;
}

const UserTypeTree: React.FC<UserTypeTreeProps> = ({ userTypeCode }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [apiData, setApiData] = useState<any>(null);

  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      // Replace this with your actual API call
      const response = await fetch('https://api.example.com/user-rights');
      const data = await response.json();
      setApiData(data);
    };

    fetchData();
  }, [userTypeCode]);

  useEffect(() => {
    if (apiData) {
      const initialSelectedKeys = processApiData(apiData);
      setSelectedRowKeys(initialSelectedKeys);
    }
  }, [apiData]);

  const processApiData = (data: any) => {
    const selectedKeys: number[] = [];

    // Process the API data to determine which rows should be selected
    Object.entries(data.userRights).forEach(([key, value]: [string, any]) => {
      const rights = value as string;
      if (rights.includes('S') || rights.includes('E') || rights.includes('D') || 
          rights.includes('X') || rights.includes('P') || rights.includes('V')) {
        const employee = employees.find(emp => emp.fullName.toLowerCase() === key.toLowerCase());
        if (employee) {
          selectedKeys.push(employee.id);
          
          // Select child nodes based on specific rights
          if (rights.includes('S')) selectedKeys.push(employee.id * 10 + 1);
          if (rights.includes('E')) selectedKeys.push(employee.id * 10 + 2);
          if (rights.includes('D')) selectedKeys.push(employee.id * 10 + 3);
          if (rights.includes('P')) selectedKeys.push(employee.id * 10 + 4);
        }
      }
    });

    return selectedKeys;
  };

  const onSelectionChanged = useCallback((e: TreeListTypes.SelectionChangedEvent) => {
    setSelectedRowKeys(e.selectedRowKeys as number[]);
  }, []);

  return (
    <div style={{ height: '620px', overflowY: 'scroll', overflowX: 'hidden' }}>
      <TreeList
        id="employees"
        dataSource={employees}
        showRowLines={true}
        showBorders={true}
        columnAutoWidth={true}
        defaultExpandedRowKeys={expandedRowKeys}
        selectedRowKeys={selectedRowKeys}
        keyExpr="id"
        parentIdExpr="headId"
        onSelectionChanged={onSelectionChanged}
      >
        <Selection recursive={true} mode="multiple" />
        <Column dataField="fullName" />
      </TreeList>
    </div>
  );
};

export default UserTypeTree;