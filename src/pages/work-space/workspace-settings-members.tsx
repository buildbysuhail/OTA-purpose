import { FC, Fragment, useEffect, useRef, useState } from "react";
import Urls from "../../redux/urls";
import { useDispatch } from "react-redux";
import { ResponseModelWithValidation } from "../../base/response-model";
import "./profile.css";
import { APIClient } from "../../helpers/api-client";
import { Link, useLocation } from "react-router-dom";
import { handleResponse } from "../../utilities/HandleResponse";
import { DataGrid, Toolbar } from "devextreme-react";
import { Column, DataGridRef, FilterRow, Item, Paging, SearchPanel } from "devextreme-react/cjs/data-grid";
import CustomStore from "devextreme/data/custom_store";
import WorkspaceSettingsApis from "./workspace-settings-apis";
import ErpAvatar from "../../components/ERPComponents/erp-avatar";
import { postAction } from "../../redux/slices/app-thunks";
import ERPButton from "../../components/ERPComponents/erp-button";
import InviteModal from "./invite-modal";
import { useTranslation } from "react-i18next";

interface WorkspaceSettingsMembersProps { }
const WorkspaceSettingsMembers: FC<WorkspaceSettingsMembersProps> = (props) => {
  const [gridHeight, setGridHeight] = useState<number>(500);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const dataGridRef = useRef<DataGridRef>(null);

  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeight = wh - 180;
    setGridHeight(gridHeight);
  });

  function isNotEmpty(value: string | undefined | null) {
    return value !== undefined && value !== null && value !== "";
  }

  const store = new CustomStore({
    key: "Id",
    async load(loadOptions: any) {
      const paramNames = ["skip", "take", "requireTotalCount", "sort", "filter"];
      const queryString = paramNames
        .filter((paramName) => isNotEmpty(loadOptions[paramName]))
        .map((paramName) => `${paramName}=${JSON.stringify(loadOptions[paramName])}`)
        .join("&");

      try {
        const response = await WorkspaceSettingsApis.getMembers("");
        const result = response;
        return result !== undefined && result != null
          ? {
            data: result,
            totalCount: result.length,
          }
          : {
            data: [],
            totalCount: 0,
            summary: {},
            groupCount: 0,
          };
      } catch (err) {
        throw new Error("Data Loading Error");
      }
    },
  });

  let api = new APIClient();
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const { t } = useTranslation('main');
  const resetPassword = async () => {
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      postAction({
        apiUrl: Urls.updatePassword,
        data: { password: password },
      }) as any
    ).unwrap();

    handleResponse(response, () => {
      setPassword("");
    });
  };

  const handleInviteClick = () => {
    setIsInviteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsInviteModalOpen(false);
  };

  const handleInviteSuccess = () => {
    if (dataGridRef.current) {
      const instance = (dataGridRef.current as any).instance;
      instance?.refresh();
    }
  };

  const location = useLocation();
  const path = location.pathname.split("/").pop(); // Extract the last part of the route
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div
            id="phone-number"
            className={`xxl:col-span-12 xl:col-span-12 ${path === "Password" ? "blink" : ""} col-span-12`}>
            <div className="box custom-box">
              <div className="box-header justify-between">
                <div className="box-title">
                  {t("members")}
                  <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                    {t("workspace_members_management")}
                  </p>
                </div>

                <div>
                  <ERPButton
                    title={t("invite")}
                    variant="primary"
                    className="ml-auto"
                    onClick={handleInviteClick}
                  />
                </div>
              </div>

              <div className="box-body">
                <div className="grid grid-cols-1 gap-3">
                  <DataGrid
                    ref={dataGridRef}
                    height={gridHeight}
                    dataSource={store}
                    // "https://localhost:7213/api/Subscription/WorkSpace/GetMembers"
                    showBorders={true}
                    // remoteOperations={true}
                    showColumnLines={true}
                    showRowLines={true}
                    onRowPrepared={(e) => {
                      if (e.rowType === "data" && e.data.isActive) {
                        e.rowElement.style.backgroundColor = "#90ee90"; // Apply green background for active rows
                      }
                    }}
                  >
                    <Toolbar>
                      <Item location="before">
                        <div className="informer">
                          <div className="count">{121}</div>
                          <span>{t("total_count")}</span>
                        </div>
                      </Item>
                      <Item name="searchPanel" location="after"></Item>
                      <Item name="columnChooserButton" />
                    </Toolbar>
                    {/* <Scrolling mode="virtual" rowRenderingMode="virtual" /> */}
                    <Paging defaultPageSize={100} />
                    <SearchPanel
                      visible={true}
                      width={240}
                      placeholder={t("search...")}
                    />
                    <FilterRow visible={true} applyFilter="auto" />
                    {/* 
      <HeaderFilter visible={true} />
      <SearchPanel visible={true} width={240} placeholder={'Search...'} /> */}
                    {/* <Column dataField="branchName" caption={'branchName'} dataType="string" /> */}

                    <Column
                      allowSearch={true}
                      minWidth={250}
                      allowFiltering={true}
                      dataField="DisplayName"
                      caption={t("name")}
                      dataType="string"
                      cellRender={({ data }) => (
                        <div className="sm:flex items-start items-center">
                          <div>
                            <span className="avatar avatar-md avatar-rounded ">
                              <ErpAvatar
                                alt={data.DisplayName}
                                src={
                                  typeof data.UserImage === "string"
                                    ? data.UserImage
                                    : "#"
                                }
                                sx={{ width: 40, height: 40 }}
                              />
                            </span>
                          </div>
                          <div className="flex-grow p-2">
                            <div className="flex items-center !justify-between">
                              <h6 className="mb-1  text-[1rem]">
                                {data.DisplayName}
                              </h6>
                            </div>
                            {/* <p className="mb-1 opacity-[0.7]">
                          Chief Executive Officer (C.E.O)
                        </p> */}
                          </div>
                        </div>
                      )}
                    />
                    <Column
                      width={250}
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="Email"
                      caption={t("email")}
                      dataType="string"
                    />
                    <Column
                      width={150}
                      allowSearch={true}
                      allowFiltering={true}
                      dataField="LastActive"
                      caption={t("last_active")}
                      dataType="datetime"
                    />
                    <Column
                      width={100}
                      dataField="Active"
                      caption={t("status")}
                      cellRender={({ data }) =>
                        data.Active === true ? (
                          <span className="badge bg-success" id="status">
                            {t("active")}
                          </span>
                        ) : (
                          <span className="badge bg-danger" id="status">
                            {t("inactive")}
                          </span>
                        )
                      }
                      dataType="boolean"
                    />
                    <Column
                      allowFiltering={false}
                      allowHeaderFiltering={false}
                      width={100}
                      dataField="Active"
                      caption={t("action")}
                      cellRender={({ data }) => (
                        <div className="hs-dropdown ti-dropdown ms-2">
                          <button
                            aria-label="button"
                            type="button"
                            className="ti-btn ti-btn-secondary ti-btn-sm"
                            aria-expanded="false">
                            <i className="ti ti-dots-vertical"></i>
                          </button>

                          <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                            <li>  <Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block" to="#">
                              {t("deactivate_user")}
                            </Link>
                            </li>
                            <li>  <Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block" to="#"  >
                              {t("delete_user")}
                            </Link>
                            </li>
                            <li>  <Link className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block" to="#">
                              {t("edit_user")}
                            </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                      dataType="boolean"
                    />
                  </DataGrid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={handleModalClose}
        onSuccess={handleInviteSuccess}
      />
    </Fragment>
  );
};

export default WorkspaceSettingsMembers;
