import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Urls from "../../redux/urls";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPButton from "../../components/ERPComponents/erp-button";
import { useDispatch } from "react-redux";
import { ResponseModelWithValidation } from "../../base/response-model";
import "./profile.css";
import { APIClient } from "../../helpers/api-client";
import { getAction, postAction } from "../../redux/slices/app-thunks";
import { handleAxiosResponse } from "../../utilities/HandleAxiosResponse";
import { useLocation, useNavigate } from "react-router-dom";
import { handleResponse } from "../../utilities/HandleResponse";
import ERPModal from "../../components/ERPComponents/erp-modal";

interface WorkSpaceSettingsProps { }

const WorkspaceSettingsSecurity: FC<WorkSpaceSettingsProps> = (props) => {
  let api = new APIClient();
  const [password, setPassword] = useState<string>("");
  const [deleteWorkspacePopupOpen, setDeleteWorkspacePopupOpen] =
    useState<boolean>(false);
  const [deleteWorkspaceloading, setDeleteWorkspaceloading] =
    useState<boolean>(false);

  const [postDataDeleteWorkspace, setPostDataDeleteWorkspace] = useState<any>({
    data: { userName: "", password: "", newValue: "" },
    validations: { userName: "", password: "", newValue: "" },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const deleteWorkspacePopup = async () => {
    setDeleteWorkspacePopupOpen(true);
  };
  const location = useLocation();
  const path = location.pathname.split("/").pop(); // Extract the last part of the route
  const PopUpModalEmailChange = () => {
    return (
      <div className="w-full pt-4">
        <div className="grid grid-cols-1 gap-3">
          <ERPInput
            id="userName"
            type="text"
            placeholder="UserName"
            required={true}
            data={postDataDeleteWorkspace?.data}
            onChangeData={(data: any) => {
              setPostDataDeleteWorkspace((prevData: any) => ({
                ...prevData,
                data: data,
              }));
            }}
            value={postDataDeleteWorkspace?.data?.userName}
            validation={postDataDeleteWorkspace?.validations?.userName}
          />
          <ERPInput
            id="password"
            placeholder="Password"
            required={true}
            value={postDataDeleteWorkspace?.data?.password}
            data={postDataDeleteWorkspace?.data}
            onChangeData={(data: any) =>
              setPostDataDeleteWorkspace((prevData: any) => ({
                ...prevData,
                data: data,
              }))
            }
            validation={postDataDeleteWorkspace?.validations?.password}
          />
          <ERPInput
            id="newValue"
            type="text"
            placeholder="Workspace Name"
            required={true}
            data={postDataDeleteWorkspace?.data}
            onChangeData={(data: any) =>
              setPostDataDeleteWorkspace((prevData: any) => ({
                ...prevData,
                data: data,
              }))
            }
            value={postDataDeleteWorkspace?.data?.newValue}
            validation={postDataDeleteWorkspace?.validations?.newValue}
          />
        </div>
        <div className="w-full p-2 flex justify-end">
          <ERPButton
            type="reset"
            title="Cancel"
            variant="secondary"
            onClick={() => {
              setDeleteWorkspacePopupOpen(false);
              setPostDataDeleteWorkspace({});
            }}
            disabled={deleteWorkspaceloading}
          ></ERPButton>
          <ERPButton
            type="button"
            disabled={deleteWorkspaceloading}
            variant="primary"
            onClick={deleteWorkspace}
            loading={deleteWorkspaceloading}
            title={"Delete Workspace"
            }
          ></ERPButton>
        </div>
      </div>
    );
  };
  return (
    <Fragment>

      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div
              id="phone-number"
              className={`xxl:col-span-12 xl:col-span-12 ${path === "Password" ? "blink" : ""
                } col-span-12`}
            >
              <div className="box custom-box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    Delete Workspace{" "}
                    <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                      This will permanently remove all associated data from your
                      account.
                    </p>
                  </div>
                  <div></div>
                </div>
                <div className="box-body">
                  <div className="grid grid-cols-1 gap-3">
                    <ERPButton
                      title="Delete Workspace"
                      onClick={() => {
                        deleteWorkspacePopup({ isOpen: false });
                      }}
                      variant="primary"
                    ></ERPButton>
                  </div>
                  <ERPModal
                    isOpen={deleteWorkspacePopupOpen}
                    title={"Update Email"}
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
