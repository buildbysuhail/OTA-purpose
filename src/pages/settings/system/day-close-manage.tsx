import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import {
  toggleDayClosePopup,
} from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";

import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import SystemSettingsApi from "./system-apis";

const DayCloseManage = () => {
  const dispatch = useDispatch();
  const onClose = useCallback(async () => {
    dispatch(toggleDayClosePopup(false));
  }, []);

  const initialData = {
    data: {
      closedDate: "",
      isSale: false,
      isPurchase: false,
      isAccounts: false,
      passWord: "",
    },
    validations: {
      closedDate: "",
      isSale: "",
      isPurchase: "",
      isAccounts: "",
      passWord: "",
      isAgree:""
    },
  };
  const [postData, setPostData] = useState(initialData);
  const [isAgree, setIsAgree] = useState(false);
  const [postDataLoading, setPostDataLoading] = useState<boolean>(false);

  const onSubmit = useCallback(async () => {
   
if(isAgree){
   setPostDataLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await  SystemSettingsApi.addDayColsInfo(postData?.data);

    setPostDataLoading(false);

    handleResponse(
      response,
      () => {
        dispatch(toggleDayClosePopup(false));
      },
      () => {
        setPostData((prevData: any) => ({
          ...prevData,
          validations: response.validations,
        }));
      }
    );
  } else {
    setPostData((prevData: any) => ({
      ...prevData,
      validations: {
        ...prevData.validations,
        isAgree: "You must agree to close the transactions till the date mentioned.",
      },
    }));
  }
  }, [isAgree,postData?.data]);

  return (
    <>
      <div className="w-full pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ERPDateInput
            id="closedDate"
            field={{ type: "date", id: "closedDate", required: true }}
            label={"To Date"}
            data={postData?.data}
            handleChange={(id: any, value: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  [id]: value,
                },
              }));
            }}
            validation={postData.validations.closedDate}
          />
          <ERPInput
            id="passWord"
            label="passWord"
            placeholder="passWord"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prevData: any) => ({
                ...prevData,
                data: data,
              }));
            }}
            value={postData?.data?.passWord}
            validation={postData?.validations?.passWord}
          />
        </div>
        <div className="flex justify-around items-center mt-4 ">
            <div className="flex items-center">
            <input
              type="checkbox"
              name="isSale"
              className="ti-form-checkbox"
              id="isSale"
              checked={postData?.data.isSale}
              onChange={(e) => {
                setPostData((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    isSale: e.target.checked,
                  },
                }));
              }}
            />
            <label
              htmlFor="switcher-dark-theme"
              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
            >
              Sales
            </label>
            </div>

            <div className="flex items-center">
            <input
              type="checkbox"
              name="isPurchase"
              className="ti-form-checkbox"
              id="isPurchase"
              checked={postData?.data.isPurchase}
              onChange={(e) => {
                setPostData((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    isPurchase: e.target.checked,
                  },
                }));
              }}
            />
            <label
              htmlFor="switcher-dark-theme"
              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
            >
              Purchase
            </label>
            </div>

            <div className="flex items-center">
            <input
              type="checkbox"
              name="isAccounts"
              className="ti-form-checkbox"
              id="isAccounts"
              checked={postData?.data.isAccounts}
              onChange={(e) => {
                setPostData((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    isAccounts: e.target.checked,
                  },
                }));
              }}
            />
            <label
              htmlFor="switcher-dark-theme"
              className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
            >
              Accounts
            </label>
            </div>
          </div>

          <div className="flex justify-start items-center mt-4">
          <input
            type="checkbox"
            name="isAgree"
            className="ti-form-checkbox"
            id="isAgree"
            checked={isAgree}
            onChange={(e) => {
             setIsAgree(e.target.checked);
            }}
          />
          <label
            htmlFor="switcher-dark-theme"
            className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
          >
            I agree to close the transactions till date mentioned    <br />
            (Add/Edit/Delete will be blocked for all the Inventory and Account Transaction)
          </label>
        </div>
        {/* Show validation message for isDelete */}
        {postData?.validations?.isAgree && (
          <span className="text-[#dc2626] text-sm">
            {postData.validations.isAgree}
          </span>
        )}
        {/* Buttons */}
        <div className="w-full p-2 flex justify-center md:justify-end space-x-4">
          <ERPButton
            type="reset"
            title="Cancel"
            variant="secondary"
            onClick={onClose}
          ></ERPButton>
          <ERPButton
            type="button"
            disabled={postDataLoading}
            variant="primary"
            onClick={onSubmit}
            loading={postDataLoading}
            title={"Submit"}
          ></ERPButton>
        </div>
      </div>
    </>
  );
};

export default DayCloseManage;
