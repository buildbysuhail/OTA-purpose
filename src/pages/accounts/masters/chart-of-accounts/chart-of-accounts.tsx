"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { TreeList } from "devextreme-react";
import { Column, Selection } from "devextreme-react/cjs/tree-list";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { MoreVertical } from "lucide-react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import {
  toggleAccountGroupPopup,
  toggleAccountLedgerPopup,
} from "../../../../redux/slices/popup-reducer";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { AccountGroupManage } from "../account-groups/account-group-manage";
import { AccountLedgerManage } from "../account-ledgers/account-ledger-manage";
import ERPToast from "../../../../components/ERPComponents/erp-toast";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { handleResponse } from "../../../../utilities/HandleResponse";
const api = new APIClient();

const OptionsColumn = ({ data }: { data: any }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const closeMenu = () => setMenuVisible(false);

  const handleOutsideClick = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      closeMenu();
    }
  };

  useEffect(() => {
    if (menuVisible) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [menuVisible]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDelete = async (data: any) => {
    setIsDeleting(true);
    try {
      ERPAlert.show({
        icon: "warning",
        title: "Are you sure you want to delete",
        onConfirm: async () => {
          const res = await api.delete(
            `${data.isGroup == 1 ? Urls.account_group : Urls.account_ledger}${
              data.id
            }`
          );
          handleResponse(res, () => {});
        },
      });
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div ref={menuRef} className="absolute">
      {(data.isAddable || data.isEditable || data.isDeletable ) && (
      <button
        className="dark:hover:bg-dark-hover-bg hover:bg-gray-100 p-1 rounded transition-colors"
        onClick={toggleMenu}
      >
        <MoreVertical size={18} className="dark:text-dark-text dark:hover:text-dark-hover-text text-gray-500" />
      </button>
      )}

      {menuVisible && (
        <div className="absolute top-0 right-0 mt-[1.6rem] w-40 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text bg-white border border-gray-300 rounded shadow-md z-50 transition-all duration-300 ease-in-out ">
          {data.isAddable && (
            <>
              <button
                className="block w-full px-4 py-2 text-left dark:hover:bg-dark-hover-bg hover:bg-gray-100"
                onClick={(e) => {
                  dispatch(
                    toggleAccountGroupPopup({ isOpen: true, key: null, data:{groupId: data.id} })
                  );
                  console.log("popup open");
                }}
              >
                Add Group
              </button>

              <button
                className="block w-full px-4 py-2 text-left dark:hover:bg-dark-hover-bg hover:bg-gray-100"
                onClick={(e) => {
                  dispatch(
                    toggleAccountLedgerPopup({ isOpen: true, key: null, data:{groupId: data.id} })
                  );
                  console.log("popup open");
                }}
              >
                Add Ledger
              </button>
            </>
          )}
          {data.isEditable && (
            <button
              className="block w-full px-4 py-2 text-left dark:hover:bg-dark-hover-bg hover:bg-gray-100"
              onClick={() =>
                data.isGroup
                  ? dispatch(
                      toggleAccountGroupPopup({ isOpen: true, key: data.id })
                    )
                  : dispatch(
                      toggleAccountLedgerPopup({ isOpen: true, key: data.id })
                    )
              }
            >
              Edit
            </button>
          )}

          {data.isDeletable && (
            <button
              className="block w-full px-4 py-2 text-left hover:bg-red-100 text-red-600"
              onClick={() => handleDelete(data)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const ChartOfAccounts: React.FC = React.memo(() => {
  const { t } = useTranslation("masters");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showbalance, setShowbalance] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>(
    []
  );
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  useEffect(() => {
    loadAccountStructure();
  }, []);
  const loadAccountStructure = async () => {
    setLoading(true);
    try {
      const res: any = await api.getAsync(
        `${Urls.chart_of_accounts}${showbalance}`
      );
      const flattenedData = flattenHierarchy(res.data);
      setData(flattenedData);
    } catch (error) {
      console.error("Error loading account structure:", error);
    }
    setLoading(false);
  };

  const flattenHierarchy = (
    items: any[],
    parentId: number | null = null,
    level: number = 0
  ): any[] => {
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
              <div className="w-full flex justify-start items-center gap-3 mb-3">
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
                  <div className="flex items-start justify-between relative">
                    {" "}
                    <TreeList
                      id="data"
                      dataSource={data}
                      showRowLines={true}
                      showBorders={true}
                      // searchPanel={true}
                      autoExpandAll={true}
                      // columnAutoWidth={true}
                      keyExpr="keyField"
                      parentIdExpr="parentID"
                      height={720} // Set a fixed height here
                      scrolling={{ mode: "virtual" }} // Specify virtual scrolling mode
                    >
                      <Selection mode="single" />
                      <Column
                        dataField="accountGroup"
                        caption="Account Group"
                      />
                      <Column dataField="aliasName" caption="Alias Name" width={200}/>
                      { showbalance &&
                      <Column dataField="balance" caption="Balance" width={150} />
}
                      <Column dataField="createdUser" caption="Created User" width={100} />
                      <Column
                        dataField="createdDate"
                        caption="Created Date"
                        dataType="date"
                        width={100}
                      />
                      <Column
                        width={60}
                        cellRender={(rowData) => (
                          <OptionsColumn data={rowData.data} />
                        )}
                        caption=""
                      />
                      {/* <Column dataField="code" /> */}
                    </TreeList>
                  </div>
                </div>
              ) : (
                <div>No data available</div>
              )}

              <ERPModal
                isOpen={rootState.PopupData.accountGroup.isOpen || false}
                title={t("acc_group")}
                width="w-full max-w-[600px]"
                isForm={true}
                closeModal={() => {
                  dispatch(
                    toggleAccountGroupPopup({ isOpen: false, key: null })
                  );
                }}
                content={<AccountGroupManage />}
              />
              <ERPModal
                isOpen={rootState.PopupData.accountLedger.isOpen || false}
                title={t("acc_ledger")}
                width="w-full max-w-[700px]"
                isForm={true}
                closeModal={() => {
                  dispatch(
                    toggleAccountLedgerPopup({ isOpen: false, key: null })
                  );
                }}
                content={<AccountLedgerManage />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChartOfAccounts;
function loadAccountStructure() {
  throw new Error("Function not implemented.");
}
