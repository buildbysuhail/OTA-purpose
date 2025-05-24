import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Urls from "../../../redux/urls";
import { toggleUserTypePrivilegePopup } from "../../../redux/slices/popup-reducer";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../helpers/api-client";
import { initialUserTypePrivilegeManageData, UserRightData, UserTypePrivilegeManageData } from "./rights-interface";
import { TreeList, Selection, Column, TreeListTypes } from "devextreme-react/tree-list";
import { UserRight, userRights } from "./data";
import dxTreeList from "devextreme/ui/tree_list";
import { UserAction } from "../../../helpers/user-right-helper";
import { RootState } from "../../../redux/store";

type PrimitiveFormField = string | number | boolean | Date | null | undefined;
type ArrayFormField = PrimitiveFormField[];
type ObjectFormField = { [key: string]: FormField };
type FormField = PrimitiveFormField | ArrayFormField | ObjectFormField;

interface FormDataStructure {
  [key: string]: FormField;
}
interface Validations {
  [key: string]: string;
}
interface FormState {
  data: FormDataStructure;
  validations: Validations;
}
interface DynamicFormProps {
  initialData: FormState;
  onSubmit: (data: FormDataStructure) => void;
  onCancel: () => void;
}
interface UserTypePrivilegeManageProps {
  isMaximized?: boolean;
  modalHeight?: any
}
const api = new APIClient();
const UserTypePrivilegeManage: React.FC = React.memo(({ modalHeight, isMaximized }: UserTypePrivilegeManageProps) => {
  const expandedRowKeys = [1, 2, 10];
  const [postData, setPostData] = useState<UserTypePrivilegeManageData>(initialUserTypePrivilegeManageData);
  const gridRef = useRef<dxTreeList>(null);
  const [postDataLoading, setPostUserTypeLoading] = useState<boolean>(false);
  const [cloning, setCloning] = useState<boolean>(false);
  const [inherit_rights_from_usertype, set_inherit_rights_from_usertype] = useState<boolean>(false);
  const [userTypeForClone, setUserTypeForClone] = useState<string>("");
  const [userRightTypes, setUserRightTypes] = useState<any>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [recursive, setRecursive] = useState(false);
  const [selectionMode, setSelectionMode] = useState("all");
  const [treeHeight, setTreeHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = modalHeight - 180;
    setTreeHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);

  const getImmediateParentsOfEndNodes = (rights: UserRight[]): UserRight[] => {
    // Step 1: Find all ids that do not act as a `headId`, indicating they are end-level nodes
    let sdsd = rights.filter(
      (right) => !rights.some((child) => child.headId === right.id)
    );
    let sds = sdsd.map((endNode) => endNode.headId);
    const endNodeIds = new Set(
      sds // Get the `headId` of each end-level node (immediate parent id)
    );
    // Step 2: Filter rights to get only the nodes with ids in `endNodeIds`
    return rights.filter((right) => endNodeIds.has(right.id));
  };
  // const handleSelectAll = () => {
  //   const allKeys = userRights.map(item => item.id);
  //   setSelectedRowKeys(allKeys);
  // };
  // const handleClearSelection = () => {
  //   setSelectedRowKeys([]);
  // };
  const handleSelectSpecific = (permission: string, checked: boolean) => {
    // Map of permissions to user rights IDs
    const permissionMap: Record<string, number[]> = {
      A: userRights
        .filter((item) => item.formCode === "A")
        .map((item) => item.id),
      P: userRights
        .filter((item) => item.formCode === "P")
        .map((item) => item.id),
      E: userRights
        .filter((item) => item.formCode === "E")
        .map((item) => item.id),
      X: userRights
        .filter((item) => item.formCode === "X")
        .map((item) => item.id),
      D: userRights
        .filter((item) => item.formCode === "D")
        .map((item) => item.id),
      S: userRights
        .filter((item) => item.formCode === "S")
        .map((item) => item.id),
      // 'S': userRights.filter(item => item.formCode === 'S').map(item => item.id),
    };
    const selectedPermissionIds = permissionMap[permission] || [];
    // Ensure that prevKeys is an array before proceeding
    setSelectedRowKeys((prevKeys: number[]) => {
      if (!Array.isArray(prevKeys)) {
        // Fallback if prevKeys is not an array, return empty array
        return checked ? selectedPermissionIds : [];
      }
      if (checked) {
        // If checked, add new permission IDs
        const arr = Array.from(
          new Set([...prevKeys, ...selectedPermissionIds])
        );
        return arr;
      } else {
        // If unchecked, remove permission IDs
        const arr = prevKeys.filter(
          (id) => !selectedPermissionIds.includes(id)
        );
        return arr;
      }
    });
  };

  // const calculateInitialSelectedKeys = (
  //   userRightTypes: UserRightData[],
  //   userRights: UserRight[]
  // ) => {
  //   const immediateParentsOfEndNodes =
  //     getImmediateParentsOfEndNodes(userRights);
  //   return userRightTypes
  //     ?.map((item: UserRightData) => {
  //       const matchingParent = immediateParentsOfEndNodes.find(
  //         (parent) => parent.formCode === item.formCode
  //       );
  //       
  //       if (matchingParent && typeof item.userRights === "string") {
  //         const rightsIds = Array.from(item.userRights).map(
  //           (permission: string) => {
  //             const permissionRight = userRights.find(
  //               (right) =>
  //                 right.headId === matchingParent.id &&
  //                 right.formCode === permission
  //             );
  //             return permissionRight ? permissionRight.id : null;
  //           }
  //         );
  //         // Filter out null values and return
  //         return rightsIds.filter((id): id is number => id !== null); // Type predicate to filter null
  //       }
  //       return [];
  //     })
  //     .flat(); // Flatten the array
  // };
  const calculateInitialSelectedKeys = (
    userRightTypes: UserRightData[],
    userRights: UserRight[]
  ) => {
    const immediateParentsOfEndNodes =
      getImmediateParentsOfEndNodes(userRights);

    // Helper function to collect all ancestor IDs up to the root node
    const getAncestorIds = (parentId: number): number[] => {
      const ancestorIds: number[] = [];
      let currentParentId = parentId;
      while (currentParentId) {
        const parent = userRights.find((node) => node.id === currentParentId);
        if (parent) {
          // Move to the next parent up the hierarchy
          if (!ancestorIds.includes(parent.id)) {
            ancestorIds.push(parent.id);
            currentParentId = parent.headId;
          }
        } else {
          break; // Stop if no more ancestors are found
        }
      }
      return ancestorIds;
    };

    return userRightTypes
      ?.map((item: UserRightData) => {
        const matchingParent = immediateParentsOfEndNodes.find(
          (parent) => parent.formCode === item.formCode
        );
        if (matchingParent && typeof item.userRights === "string") {
          const rightsIds = Array.from(item.userRights).map(
            (permission: string) => {
              const permissionRight = userRights.find(
                (right) =>
                  right.headId === matchingParent.id &&
                  right.formCode === permission
              );
              return permissionRight ? permissionRight.id : null;
            }
          );
          // Include matchingParent.id if it's not already in rightsIds
          if (!rightsIds.includes(matchingParent.id)) {
            rightsIds.push(matchingParent.id);
          }
          // Add all ancestors of the matching parent up to the root node
          const ancestorIds = getAncestorIds(matchingParent.headId);
          rightsIds.push(...ancestorIds);
          // Filter out null values and return
          return rightsIds.filter((id): id is number => id !== null); // Type predicate to filter null
        }
        return [];
      })
      .flat(); // Flatten the array
  };
  const getSelectedKeys = () => {
    return gridRef.current
      ?.instance()
      ?.getSelectedRowsData(selectionMode)
      ?.map((x) => x.id) ?? []
  }
  const selectedKeys =
    gridRef.current
      ?.instance()
      ?.getSelectedRowsData(selectionMode)
      ?.map((x) => x.id) ?? [];
  useEffect(() => {
    // Calculate initial selected keys and set state
    const initialSelectedKeys = calculateInitialSelectedKeys(
      userRightTypes,
      userRights
    );
    setSelectedRowKeys(initialSelectedKeys); // This should now be number[]
  }, [userRightTypes, userRights]);

  const onSelectionChanged = useCallback(
    (e: TreeListTypes.SelectionChangedEvent) => {
      const selectedData =
        e.component?.getSelectedRowsData(selectionMode)?.map((x) => x.id) ?? [];
      setSelectedRowKeys(selectedData);
      if (e.currentSelectedRowKeys.length == 1) {
        const key = e.currentSelectedRowKeys[0];
        const parent = userRights.find((x) => x.id == key)?.headId;
        if (
          parent != undefined
        ) {
          attachParentToSelected(parent, selectedData);
        }
      }
    },
    []
  );

  const attachParentToSelected = (id: number, selectedData: any[]): any[] => {
    selectedData.push(id);
    const parent = userRights.find((x) => x.id == id)?.headId;
    if (
      parent != undefined
    ) {
      const sd = attachParentToSelected(parent, selectedData);
      return sd
    } else {
      return selectedData;
    }
  };

  const dispatch = useDispatch();
  const hasAnyMissingParent = (node: any): boolean => {
    const keys = getSelectedKeys();
    if (keys.find(x => x == node.id) == undefined) {
      return true;
    }
    const parentNode = userRights.find(x => x.id == node.headId);
    if (parentNode != undefined) {
      const hasMissing = hasAnyMissingParent(parentNode);
      return hasMissing;
    }
    else {
      return false
    }
  }

  const generatePostData = async (): Promise<
    {
      userTypeCode: string;
      formCode: string;
      userRights: string;
      treeNodeIndex: number;
    }[]
  > => {
    const dataForPost: {
      userTypeCode: string;
      formCode: string;
      userRights: string;
      treeNodeIndex: number;
    }[] = [];
    const immediateParentsOfEndNodes =
      getImmediateParentsOfEndNodes(userRights);
    // Map to aggregate data by formCode
    const groupedDataMap = new Map<
      string,
      { userTypeCode: string; userRights: string; treeNodeIndex: number }
    >();

    immediateParentsOfEndNodes.forEach((parent) => {
      const childNodes = userRights.filter(
        (child) => child.headId === parent.id
      );
      const hasMissing = hasAnyMissingParent(parent);
      const keys = getSelectedKeys();
      let parentUserRights = keys.find(x => x == parent.id) != undefined && !hasMissing ? "S" : "";
      let hasSelectedRights = false;
      if (parentUserRights == "S") {
        childNodes.forEach((child) => {
          if (keys.includes(child.id)) {
            hasSelectedRights = true;
            parentUserRights += child.formCode;
          }
        });
      }

      if (hasSelectedRights) {
        const formCode = parent.formCode;
        if (groupedDataMap.has(formCode)) {
          // Append rights to the existing entry
          groupedDataMap.get(formCode)!.userRights = parentUserRights;
        } else {
          // Create a new entry in the map
          groupedDataMap.set(formCode, {
            userTypeCode: postData?.data?.userType,
            userRights: parentUserRights,
            treeNodeIndex: parent.treeNode,
          });
        }

        let currentParentId = parent.headId;
        while (currentParentId) {
          const grandParent = userRights.find(
            (right) => right.id === currentParentId
          );
          if (grandParent) {
            const grandParentFormCode = grandParent.formCode;
            if (!groupedDataMap.has(grandParentFormCode)) {
              groupedDataMap.set(grandParentFormCode, {
                userTypeCode: postData?.data?.userType,
                userRights: "S",
                treeNodeIndex: grandParent.treeNode,
              });
            }
            currentParentId = grandParent.headId;
          } else {
            break;
          }
        }
      }
    });

    // Convert map entries into the final output format
    groupedDataMap.forEach((value, formCode) => {
      dataForPost.push({
        userTypeCode: value.userTypeCode,
        formCode: formCode,
        userRights: value.userRights,
        treeNodeIndex: value.treeNodeIndex,
      });
    });
    return dataForPost;
  };

  useEffect(() => {
    if (postData.data.userType) {
      loadUserType();
    }
  }, [postData?.data?.userType]);

  const loadUserType = async () => {
    const res: any[] = await api.getAsync(
      `${Urls.user_rights}${postData.data.userType}`
    );
    setUserRightTypes(res);
  };
  const handleSubmit = useCallback(async () => {
    setPostUserTypeLoading(true);

    if (!userRightTypes) {
      setUserRightTypes([]);
    }
    generatePostData()
      .then(async (dataForPost) => {
        if (dataForPost) {
          const response = await api.postAsync(
            `${Urls.user_rights}${postData.data.userType}`,
            dataForPost
          );
          setPostUserTypeLoading(false);
          handleResponse(
            response,
            () => {
              // Handle success, e.g., dispatch(toggleUserTypePrivilegePopup({ isOpen: false }));
            },
            () => {
              setPostData((prevData: any) => ({
                ...prevData,
                validations: response.validations,
              }));
            }
          );
        }
        setPostUserTypeLoading(false);
      })
      .catch((error) => {
        setPostUserTypeLoading(false);
        console.error("Error during data generation or API call:", error);
        setPostUserTypeLoading(false);
        // Handle error as needed
      });
  }, [postData?.data]);
  const handleClone = useCallback(async () => {
    setCloning(true);
    const res: any[] = await api.getAsync(
      `${Urls.user_rights}${userTypeForClone}`
    );
    if (res) {
      // Calculate initial selected keys and set state
      const initialSelectedKeys = calculateInitialSelectedKeys(res, userRights);
      setSelectedRowKeys(initialSelectedKeys); // This should now be number[]
    }
    setCloning(false);
  }, [userTypeForClone]);
  const onClose = useCallback(() => {
    dispatch(
      toggleUserTypePrivilegePopup({ isOpen: false, key: null, reload: false })
    );
  }, []);
  const { t } = useTranslation("userManage");
  const [userRightsData, setUserRightsData] = useState<UserRight[]>();
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  useEffect(() => {
    const planRights = clientSession.planFormCodes?.split(",")
    const allowedActions = Object.values(UserAction) as string[];
    
    const updated =  userRights.filter(item => planRights?.includes(item.formCode) ||  allowedActions.includes(item.formCode));
    setUserRightsData(updated);
  }, [userRights]);
  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="w-full md:basis-1/2 dark:bg-dark-bg dark:border-dark-border bg-slate-50 md:border-r border-slate-400 overflow-x-auto">
        <TreeList
          height={treeHeight.windows}
          ref={gridRef}
          id="userRights"
          dataSource={userRightsData}
          showRowLines={true}
          showBorders={true}
          columnAutoWidth={true}
          defaultExpandedRowKeys={expandedRowKeys}
          selectedRowKeys={selectedRowKeys}
          keyExpr="id"
          parentIdExpr="headId"
          onSelectionChanged={onSelectionChanged}>
          <Selection recursive={false} mode="multiple" />
          <Column dataField="fullName" caption="" />
        </TreeList>
      </div>

      <div className="w-full md:basis-1/2 flex flex-col px-4 md:px-24 py-4 md:py-10">
        {/* User Type Combobox */}
        <ERPDataCombobox
          id="userType"
          field={{
            id: "userType",
            required: true,
            getListUrl: Urls.data_user_types, // Adjust URL as needed
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("user_type")}
          onChangeData={(data: any) => { setPostData((prev: any) => ({ ...prev, data: data, })); }}
          validation={postData.validations.userType}
          data={postData?.data}
          defaultData={postData?.data}
        // value={
        //   postData != undefined &&
        //     postData?.data != undefined &&
        //     postData?.data?.userType != undefined
        //     ? postData?.data?.userType
        //     : 0
        // }
        />
        {/* Checkbox options */}
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-3 py-4 mb-5 text-left">
          <ERPCheckbox
            id="showAllAdd"
            label={t("select_all_add")}
            data={postData.data}
            checked={postData.data.showAllAdd}
            onChangeData={(data) => { setPostData((prev: any) => ({ ...prev, data: { ...prev.data, showAllAdd: !prev.data.showAllAdd, }, })); handleSelectSpecific("A", data.showAllAdd); }}
            validation={postData.validations.showAllAdd}
          />

          <ERPCheckbox
            id="showAllPrint"
            label={t("select_all_print")}
            data={postData.data}
            checked={postData.data.showAllPrint}
            onChangeData={(data) => { setPostData((prev: any) => ({ ...prev, data: { ...prev.data, showAllPrint: !prev.data.showAllPrint, }, })); handleSelectSpecific("P", data.showAllPrint); }}
            validation={postData.validations.showAllPrint}
          />

          <ERPCheckbox
            id="showAllEdit"
            label={t("select_all_edit")}
            data={postData.data}
            checked={postData.data.showAllEdit}
            onChangeData={(data) => { setPostData((prev: any) => ({ ...prev, data: { ...prev.data, showAllEdit: !prev.data.showAllEdit, }, })); handleSelectSpecific("E", data.showAllEdit); }}
            validation={postData.validations.showAllEdit}
          />

          <ERPCheckbox
            id="showAllExport"
            label={t("select_all_export")}
            data={postData.data}
            checked={postData.data.showAllExport}
            onChangeData={(data) => { setPostData((prev: any) => ({ ...prev, data: { ...prev.data, showAllExport: !prev.data.showAllExport, }, })); handleSelectSpecific("X", data.showAllExport); }}
            validation={postData.validations.showAllExport}
          />

          <ERPCheckbox
            id="showAllDelete"
            label={t("select_all_delete")}
            data={postData.data}
            checked={postData.data.showAllDelete}
            onChangeData={(data) => { setPostData((prev: any) => ({ ...prev, data: { ...prev.data, showAllDelete: !prev.data.showAllDelete, }, })); handleSelectSpecific("D", data.showAllDelete); }}
            validation={postData.validations.showAllDelete}
          />

          {/* <ERPCheckbox
            id="showAll"
            label={t("show_all")}
            data={postData.data}
            checked={postData.data.showAll}
            onChangeData={(data) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  showAll: !prev.data.showAll,
                },
              }));
              handleSelectSpecific('S', data.showAll);
            }}
            validation={postData.validations.showAll}
          /> */}
        </div>

        <ERPCheckbox
          id="chkbc_inherit"
          label={t("inherit_rights_from_usertype")}
          data={postData.data}
          checked={inherit_rights_from_usertype}
          onChangeData={(data) => { set_inherit_rights_from_usertype(!inherit_rights_from_usertype); }}
          className="text-left"
          validation={postData.validations.userRightType}
        />
        {
          inherit_rights_from_usertype == true && (
            <div className="flex flex-col gap-3 border border-gray-400 border-dotted rounded-md p-4 md:p-8">
              <ERPDataCombobox
                id="userTypeForClone"
                field={{
                  id: "userTypeForClone",
                  required: true,
                  getListUrl: Urls.data_user_types, // Adjust URL as needed
                  valueKey: "id",
                  labelKey: "name",
                }}
                label={t("user_type")}
                onChangeData={(data: any) => { setUserTypeForClone(data.userTypeForClone); }}
                validation={postData.validations.userType2}
                data={{ userTypeForClone: userTypeForClone }}
              />
              <ERPButton
                title={t("load_rights")}
                variant="secondary"
                disabled={
                  postDataLoading ||
                  postData.data.userType == undefined ||
                  postData.data.userType == null ||
                  postData.data.userType == "" ||
                  userTypeForClone == undefined ||
                  userTypeForClone == null ||
                  userTypeForClone == ""
                }
                loading={postDataLoading}
                onClick={handleClone}
              />
            </div>
          )
        }
        {/* Form Buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <ERPButton
            title={t("save")}
            variant="primary"
            disabled={
              postDataLoading ||
              postData.data.userType == undefined ||
              postData.data.userType == null ||
              postData.data.userType == ""
            }
            loading={postDataLoading}
            onClick={handleSubmit}
          />
          <ERPButton
            title={t("close")}
            variant="secondary"
            disabled={postDataLoading}
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
});
export default UserTypePrivilegeManage;
