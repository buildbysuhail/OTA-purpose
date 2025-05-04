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
import { toggleAccountGroupPopup, toggleAccountLedgerPopup } from "../../../../redux/slices/popup-reducer";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { AccountGroupManage } from "../account-groups/account-group-manage";
import { AccountLedgerManage } from "../account-ledgers/account-ledger-manage";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { handleResponse } from "../../../../utilities/HandleResponse";
const api = new APIClient();

const OptionsColumn = ({ data }: { data: any }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('masters');
  const toggleMenu = () => { setMenuVisible((prev) => !prev); };
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
        title: t("are_you_sure_you_want_to_delete"),
        onConfirm: async () => {
          const res = await api.delete(
            `${data.isGroup == 1 ? Urls.account_group : Urls.account_ledger}${data.id
            }`
          );
          handleResponse(res, () => { });
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
      {(data.isAddable || data.isEditable || data.isDeletable) && (
        <button className="dark:hover:bg-dark-hover-bg hover:bg-gray-100 p-1 rounded transition-colors" onClick={toggleMenu}>
          <MoreVertical size={18} className="dark:text-dark-text dark:hover:text-dark-hover-text text-gray-500" />
        </button>
      )}

      {menuVisible && (
        <div className="absolute top-0 right-0 mt-[1.6rem] w-40 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text bg-white border border-gray-300 rounded shadow-md z-50 transition-all duration-300 ease-in-out ">
          {data.isAddable && (
            <>
              <button className="block w-full px-4 py-2 text-left dark:hover:bg-dark-hover-bg hover:bg-gray-100" onClick={() => {
                dispatch(toggleAccountGroupPopup({ isOpen: true, key: null, data: { groupId: data.id } }));
              }}>
                {t("add_group")}
              </button>

              <button
                className="block w-full px-4 py-2 text-left dark:hover:bg-dark-hover-bg hover:bg-gray-100"
                onClick={() => { dispatch(toggleAccountLedgerPopup({ isOpen: true, key: null, data: { groupId: data.id } })); }}>
                {t("add_ledger")}
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
              }>
              {t("edit")}
            </button>
          )}

          {data.isDeletable && (
            <button
              className="block w-full px-4 py-2 text-left hover:bg-red-100 text-red-600"
              onClick={() => handleDelete(data)}>
              {t("delete")}
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
                  onChange={() => setShowbalance(!showbalance)}
                />
                <ERPButton
                  className="ml-10"
                  title={t("refresh")}
                  variant="primary"
                  onClick={loadAccountStructure}
                  disabled={loading}
                  loading={loading}
                />
              </div>

              {loading ? (
                <div>{t("loading")}</div>
              ) : data.length > 0 ? (
                <div className="overflow-x-auto w-full border-r border-[#dddddd]">
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
                    height={720}
                    scrolling={{ mode: "virtual", useNative: true }}
                    style={{ minWidth: "1200px", width: "100%" }}
                  >
                    <Selection mode="single" />

                    <Column
                      dataField="accountGroup"
                      caption={t("account_group")}
                    />

                    <Column
                      dataField="aliasName"
                      caption={t("alias_name")}
                      width={200}
                    />

                    {showbalance && (
                      <Column
                        dataField="balance"
                        caption={t("balance")}
                        width={150}
                      />
                    )}

                    <Column
                      dataField="createdUser"
                      caption={t("created_user")}
                      width={100}
                    />

                    <Column
                      dataField="createdDate"
                      caption={t("created_date")}
                      dataType="date"
                      width={100}
                    />

                    <Column
                      width={60}
                      cellRender={(rowData) => <OptionsColumn data={rowData.data} />}
                      caption=""
                    />
                  </TreeList>
                </div>
              ) : (
                <div>{t("no_data_available")}</div>
              )}

              <ERPModal
                isOpen={rootState.PopupData.accountGroup.isOpen || false}
                title={t("acc_group")}
                width={600}
                isForm={true}
                closeModal={() => {
                  dispatch(toggleAccountGroupPopup({ isOpen: false, key: null }));
                }}
                content={<AccountGroupManage />}
              />

              <ERPModal
                isOpen={rootState.PopupData.accountLedger.isOpen || false}
                title={t("acc_ledger")}
                width={700}
                isForm={true}
                closeModal={() => {
                  dispatch(toggleAccountLedgerPopup({ isOpen: false, key: null }));
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