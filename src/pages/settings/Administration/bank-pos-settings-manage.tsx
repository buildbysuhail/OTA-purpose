import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import { toggleBankPosPopup } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import AdministrationSettingsApis from "./administration-settings-apis";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";

const BankPosSettingsManage = () => {
  const dispatch = useDispatch();
  const onClose = useCallback(async () => {
    dispatch(toggleBankPosPopup(false));
  }, []);

  const initialData = {
    data: {
      machineBrand: "",
      model: "",
      comPort: "",
      geldeaWsPort: "",
      gediaService: "",
    },
    validations: {
      machineBrand: "",
      model: "",
      comPort: "",
      geldeaWsPort: "",
      gediaService: "",
    },
  };
  const [postData, setPostData] = useState(initialData);
  const [postDataLoading, setPostDataLoading] = useState<boolean>(false);

  const addBankPos = useCallback(async () => {
    setPostDataLoading(true);

    const response: ResponseModelWithValidation<any, any> =
      await AdministrationSettingsApis.addBankPosInfo(postData?.data);

    setPostDataLoading(false);

    handleResponse(
      response,
      () => {
        dispatch(toggleBankPosPopup(false));
      },
      () => {
        setPostData((prevData: any) => ({
          ...prevData,
          validations: response.validations,
        }));
      }
    );
  }, [postData?.data]);

  return (
    <>
      <div className="w-full pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ERPDataCombobox
            id="machineBrand"
            field={{
              id: "machineBrand",
              required: true,
              getListUrl: Urls.data_countries,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            //   validation={postData.validations.machineBrand}
            data={postData?.data}
            defaultData={postData?.data}
            value={
              postData != undefined &&
              postData?.data != undefined &&
              postData?.data?.machineBrand != undefined
                ? postData?.data?.machineBrand
                : 0
            }
            label="Machine Brand"
          />

          <ERPDataCombobox
            id="model"
            field={{
              id: "model",
              required: true,
              getListUrl: Urls.data_countries,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            //   validation={postData.validations.model}
            data={postData?.data}
            defaultData={postData?.data}
            value={
              postData != undefined &&
              postData?.data != undefined &&
              postData?.data?.model != undefined
                ? postData?.data?.model
                : 0
            }
            label="Model"
          />

          <ERPDataCombobox
            id="comPort"
            field={{
              id: "comPort",
              required: true,
              getListUrl: Urls.data_countries,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
            //   validation={postData.validations.comPort}
            data={postData?.data}
            defaultData={postData?.data}
            value={
              postData != undefined &&
              postData?.data != undefined &&
              postData?.data?.comPort != undefined
                ? postData?.data?.comPort
                : 0
            }
            label="Com Port"
          />
          <ERPInput
            id="geldeaWsPort"
            label="Geldea Ws Port"
            placeholder="Geldea Ws Port"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prevData: any) => ({
                ...prevData,
                data: data,
              }));
            }}
            value={postData?.data?.geldeaWsPort}
            //   validation={postData?.validations?.geldeaWsPort}
          />
          <ERPInput
            id="gediaService"
            label="Gedia Service"
            placeholder="gediaService"
            required={true}
            data={postData?.data}
            onChangeData={(data: any) => {
              setPostData((prevData: any) => ({
                ...prevData,
                data: data,
              }));
            }}
            value={postData?.data?.gediaService}
            //   validation={postData?.validations?.gediaService}
          />
        </div>
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
            onClick={addBankPos}
            loading={postDataLoading}
            title={"Submit"}
          ></ERPButton>
        </div>
      </div>
    </>
  );
};

export default BankPosSettingsManage;
