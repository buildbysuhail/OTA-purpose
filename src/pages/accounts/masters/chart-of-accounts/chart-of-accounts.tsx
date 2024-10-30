import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { TreeList } from "devextreme-react";
import { Column, Selection } from "devextreme-react/cjs/tree-list";

const api = new APIClient();

interface ChartOfAccountsData {
  accountGroup: string;
  aliasName: string;
  code: string;
  isGroup: number;
  balance: string;
  parentID: number;
  createdUser: string;
  createdDate: string;
  refBranchID: string;
  purchaseLedgerID: string;
  receivableLedgerID: string;
  branchPayableLedgerID: string;
}

interface FormState {
  data: ChartOfAccountsData;
  validations: { [K in keyof ChartOfAccountsData]: string };
}

const initialChartOfAccountsData: FormState = {
  data: {
    accountGroup: "",
    aliasName: "",
    code: "",
    isGroup: 1,
    balance: "",
    parentID: 1,
    createdUser: "",
    createdDate: "",
    refBranchID: "",
    purchaseLedgerID: "",
    receivableLedgerID: "",
    branchPayableLedgerID: "",
  },
  validations: {
    accountGroup: "",
    aliasName: "",
    code: "",
    isGroup: "",
    balance: "",
    parentID: "",
    createdUser: "",
    createdDate: "",
    refBranchID: "",
    purchaseLedgerID: "",
    receivableLedgerID: "",
    branchPayableLedgerID: "",
  },
};

const ChartOfAccounts: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadAccountStructure();
  }, []);

  const loadAccountStructure = async () => {
    setLoading(true);
    const res: any = await api.getAsync(`${Urls.chart_of_accounts}`);
    setData(res);
    setLoading(false);
  };
  return (
    <div className="w-full flex justify-start">
      <Fragment>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box custom-box">
              <div className="box-body">
                {data ? (
                  <div className="grid grid-cols-1 gap-3">
                    <TreeList
                      id="id"
                      dataSource={data}
                      showRowLines={true}
                      showBorders={true}
                      columnAutoWidth={true}
                      // defaultExpandedRowKeys={expandedRowKeys}
                      // selectedRowKeys={selectedRowKeys}
                      keyExpr="id"
                      parentIdExpr="parentID"
                    // onSelectionChanged={onSelectionChanged}
                    >
                      <Selection recursive={true} mode="multiple" />
                      <Column dataField="accountGroup"
                        caption={t("chart_of_accounts")}
                        dataType="string"
                        allowSearch={true}
                        allowFiltering={true}
                      />
                    </TreeList>
                  </div>
                ) : (
                  <>
                    {
                      loading ? (
                        <div> loading...</div>
                      ) : (
                        <div> No data...</div>
                      )}
                  </>


                )}
              </div>
            </div>
          </div>
        </div>

      </Fragment>
    </div>
  );
});

export default ChartOfAccounts;