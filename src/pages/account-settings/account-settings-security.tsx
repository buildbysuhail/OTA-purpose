import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Urls from "../../redux/urls";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPButton from "../../components/ERPComponents/erp-button";
import { useDispatch } from "react-redux";
import { ResponseModelWithValidation } from "../../base/response-model";
import "./profile.css";
import { APIClient } from "../../helpers/api-client";
import { getAction, postAction } from "../../redux/app-actions";
import { handleAxiosResponse } from "../../utilities/HandleAxiosResponse";
import { useLocation } from "react-router-dom";
import { handleResponse } from "../../utilities/HandleResponse";
import ERPModal from "../../components/ERPComponents/erp-modal";

interface AccountSettingsProps {}

const AccountSettingsSecurity: FC<AccountSettingsProps> = (props) => {
  let api = new APIClient();
  const [password, setPassword] = useState<string>("");
  const [deleteWorkspacePopupOpen, setDeleteWorkspacePopupOpen] = useState<boolean>(false);
 
  const [postDataDeleteWorkspace, setPostDataDeleteWorkspace] = useState<any>({
    data: { userName: "", password: "", workspaceName: "" },
    validations: { userName: "", password: "", workspaceName: "" }
  });
  const dispatch = useDispatch();

  const deleteWorkspace = async () => {    
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      postAction({apiUrl: Urls.dele})).unwrap();    
    handleResponse(response, () => {
      setPassword("");
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
        {postDataEmail && postDataEmail.tokenSend != true ? (
          <div className="grid grid-cols-1 gap-3">
            <ERPInput
              id="userName"
              type="email"
              placeholder="Current Email"
              required={true}
              data={postDataEmail?.data}
              onChangeData={(data: any) => {
                setPostDataEmail((prevData: any) => ({
                  ...prevData,
                  data: data,
                }));
              }}
              value={postDataEmail?.data?.userName}
            />
            <ERPInput
              id="password"
              placeholder="Password"
              required={true}
              value={postDataEmail?.data?.password}
              data={postDataEmail?.data}
              onChangeData={(data: any) =>
                setPostDataEmail((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
              }
            />
            <ERPInput
              id="newValue"
              type="email"
              placeholder="New Email"
              required={true}
              data={postDataEmail?.data}
              onChangeData={(data: any) =>
                setPostDataEmail((prevData: any) => ({
                  ...prevData,
                  data: data,
                }))
              }
              value={postDataEmail?.data?.newValue}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <p>
              Pls Enter the verification code you received to your email{" "}
              {postDataEmail?.data.newValue}
            </p>
            <ERPInput
              id="otp"
              placeholder="Pleas Enter Verification Code"
              required={true}
              value={postDataEmailTokenVerify?.otp}
              data={postDataEmailTokenVerify}
              onChangeData={(data: any) =>
              {
                
                setPostDataEmailTokenVerify(
                  data
                )
              }
              }
            />
          </div>
        )}
        <div className="w-full p-2 flex justify-end">
          <ERPButton
            type="reset"
            title="Cancel"
            variant="secondary"
            onClick={() => {
              setIsOpenEmailChange(false);
              setPostDataEmail({});
            }}
            disabled={emailLoading}
          ></ERPButton>
          <ERPButton
            type="button"
            disabled={emailLoading}
            variant="primary"
            onClick={postFormEmail}
            loading={emailLoading}
            title={
              postDataEmail && postDataEmail.tokenSend != true
                ? "Update"
                : "Verify"
            }
          ></ERPButton>
        </div>
      </div>
    );
  };
  return (
    <Fragment>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div></div>
      </div>
      <div className="grid grid-cols-12 gap-x-6">
      <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
        <div className="grid grid-cols-12 gap-x-6">
          <div
            id="phone-number"
            className={`xxl:col-span-12 xl:col-span-12 ${
              path === "Password" ? "blink" : ""
            } col-span-12`}
          >
            <div className="box custom-box">
              <div className="box-header justify-between">
                <div className="box-title">
                Delete Workspace{" "}
                  <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                  This will permanently remove all associated data from your account.
                  </p>
                </div>
                <div></div>
              </div>
              <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                    <ERPButton
                      title="Delete Workspace"
                      onClick={() => {
                        deleteWorkspacePopup();
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
                  setPostDataEmail({});
                }}
                content={PopUpModalEmailChange()}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
        <div className="xxl:col-span-6 xl:col-span-12  col-span-12">

        </div>
      </div>
      
    </Fragment>
  );
};

export default AccountSettingsSecurity;
