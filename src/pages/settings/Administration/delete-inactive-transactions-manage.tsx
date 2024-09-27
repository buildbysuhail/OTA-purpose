import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import { toggleDeleteInactiveTransactionPopup } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import AdministrationSettingsApis from "./administration-settings-apis";

const DeleteInactiveTransactionManage = () => {
  const dispatch = useDispatch();
  const onClose = useCallback(async () => {
    dispatch(toggleDeleteInactiveTransactionPopup(false));
  }, []);
  const initialData = {
    data: { date: "", isDelete: false },
    validations: { date: "", isDelete: "" },
  };
  const [postData, setPostData] = useState(initialData);
  const [postDataLoading, setPostDataLoading] = useState<boolean>(false);

  const deleteAll = useCallback(async () => {
    if (postData?.data.isDelete) {
      setPostDataLoading(true);
      const dataToSend = { date:postData?.data?.date };
      const response: ResponseModelWithValidation<any, any> =
        await AdministrationSettingsApis.addDeleteInactiveTransaction(
          dataToSend
        );
      setPostDataLoading(false);
      handleResponse(
        response,
        () => {
          dispatch(toggleDeleteInactiveTransactionPopup(false));
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
          isDelete: "You must agree to delete all inactive transactions.",
        },
      }));
    }
  }, [postData?.data]);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <ERPDateInput
          id="date"
          field={{ type: "date", id: "date", required: true }}
          label={"Till Date"}
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
          validation={postData.validations.date}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isDelete"
            className="ti-form-checkbox"
            id="isDelete"
            checked={postData?.data.isDelete}
            onChange={(e) => {
              setPostData((prev) => ({
                ...prev,
                data: {
                  ...prev.data,
                  isDelete: e.target.checked,
                },
              }));
            }}
          />
          <label
            htmlFor="switcher-dark-theme"
            className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
          >
            I agree to delete all inactive transactions till the selected date
          </label>
        </div>
        {/* Show validation message for isDelete */}
        {postData?.validations?.isDelete && (
          <span className="text-[#dc2626] text-sm">
            {postData.validations.isDelete}
          </span>
        )}
      </div>
      <div className="w-full p-2 flex justify-end">
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
          onClick={deleteAll}
          loading={postDataLoading}
          title={"DeleteAll"}
        ></ERPButton>
      </div>
    </div>
  );
};

export default DeleteInactiveTransactionManage;
