import { FC, Fragment, useState } from "react";
import Urls from "../../redux/urls";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPButton from "../../components/ERPComponents/erp-button";
import { useDispatch } from "react-redux";
import { ResponseModelWithValidation } from "../../base/response-model";
import "./profile.css";
import { APIClient } from "../../helpers/api-client";
import { postAction } from "../../redux/slices/app-thunks";
import { useLocation, useNavigate } from "react-router-dom";
import { handleResponse } from "../../utilities/HandleResponse";
import ERPModal from "../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";

interface WorkSpaceSettingsProps { }
const WorkspaceSettingsSecurity: FC<WorkSpaceSettingsProps> = (props) => {
  let api = new APIClient();
  const [password, setPassword] = useState<string>("");
  const [deleteWorkspacePopupOpen, setDeleteWorkspacePopupOpen] = useState<boolean>(false);
  const [deleteWorkspaceloading, setDeleteWorkspaceloading] = useState<boolean>(false);
  const [postDataDeleteWorkspace, setPostDataDeleteWorkspace] = useState<any>({
    data: { userName: "", password: "", newValue: "" },
    validations: { userName: "", password: "", newValue: "" },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('main');

  const deleteWorkspace = async () => {
    setDeleteWorkspaceloading(true);
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      postAction({
        apiUrl: Urls.delete_workspace,
        data: postDataDeleteWorkspace.data,
      }) as any
    ).unwrap();
    setPostDataDeleteWorkspace((prevData: any) => ({
      ...prevData,
      validations: response.validations
    }));
    setDeleteWorkspaceloading(false);
    handleResponse(response, () => {
      navigate("/login");
    });
  };

  const deleteWorkspacePopup = async () => { setDeleteWorkspacePopupOpen(true); };
  const location = useLocation();
  const path = location.pathname.split("/").pop(); // Extract the last part of the route
  const PopUpModalEmailChange = () => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 gap-3">
          <ERPInput
            id="userName"
            type="text"
            placeholder={t("username")}
            required={true}
            data={postDataDeleteWorkspace?.data}
            onChangeData={(data: any) => { setPostDataDeleteWorkspace((prevData: any) => ({ ...prevData, data: data, })); }}
            value={postDataDeleteWorkspace?.data?.userName}
            validation={postDataDeleteWorkspace?.validations?.userName}
          />
          <ERPInput
            id="password"
            placeholder={t("password")}
            required={true}
            value={postDataDeleteWorkspace?.data?.password}
            data={postDataDeleteWorkspace?.data}
            onChangeData={(data: any) => setPostDataDeleteWorkspace((prevData: any) => ({ ...prevData, data: data, }))}
            validation={postDataDeleteWorkspace?.validations?.password}
          />
          <ERPInput
            id="newValue"
            type="text"
            placeholder={t("workspace_name")}
            required={true}
            data={postDataDeleteWorkspace?.data}
            onChangeData={(data: any) => setPostDataDeleteWorkspace((prevData: any) => ({ ...prevData, data: data, }))}
            value={postDataDeleteWorkspace?.data?.newValue}
            validation={postDataDeleteWorkspace?.validations?.newValue}
          />
        </div>

        <div className="w-full p-2 flex justify-end">
          <ERPButton
            type="reset"
            title={t("cancel")}
            variant="secondary"
            onClick={() => {
              setDeleteWorkspacePopupOpen(false);
              setPostDataDeleteWorkspace({});
            }}
            disabled={deleteWorkspaceloading}
          />
          <ERPButton
            type="button"
            disabled={deleteWorkspaceloading}
            variant="primary"
            onClick={deleteWorkspace}
            loading={deleteWorkspaceloading}
            title={t("delete_workspace")}
          />
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div id="phone-number" className={`xxl:col-span-12 xl:col-span-12 ${path === "Password" ? "blink" : ""} col-span-12`}>
              <div className="box custom-box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    {t("delete_workspace")}
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                      {t("account_deletion_warning")}
                    </p>
                  </div>
                </div>

                <div className="box-body">
                  <div className="grid grid-cols-1 gap-3">
                    <ERPButton
                      title={t("delete_workspace")}
                      onClick={() => { deleteWorkspacePopup(); }}
                      variant="primary"
                    />
                  </div>

                  <ERPModal
                    isOpen={deleteWorkspacePopupOpen}
                    title={t("update_email")}
                    isForm={true}
                    closeModal={() => {
                      setDeleteWorkspacePopupOpen(false);
                      setPostDataDeleteWorkspace({});
                    }}
                    content={PopUpModalEmailChange()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-6 xl:col-span-12  col-span-12"></div>
      </div>
    </Fragment>
  );
};
export default WorkspaceSettingsSecurity;