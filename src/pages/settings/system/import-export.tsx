import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import { toggleImportExportPopup } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";

const ImportExportManage = () => {
  const dispatch = useDispatch();
  const onClose = useCallback(async () => {
    dispatch(toggleImportExportPopup(false));
  }, []);
  const initialData = {
    data: {
      filePath: "",
      product: false,
      parties: false,
    },
    validations: {
      filePath: "",
      product: "",
      parties: "",
    },
  };
  const [postData, setPostData] = useState(initialData);
  const [postDataLoading, setPostDataLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filePath = e.target.files[0].name;
      setPostData((prevState) => ({
        ...prevState,
        data: {
          ...prevState.data,
          filePath,
        },
      }));
    }
  };

  const Import = useCallback(async () => {

      setPostDataLoading(true);
      window.alert(JSON.stringify(postData.data, null, 2));
      // const response: ResponseModelWithValidation<any, any> =
      //   await AdministrationSettingsApis.addDeleteInactiveTransaction(postData?.data);
      setPostDataLoading(false);
      // handleResponse(
      //   response,
      //   () => {
      //     dispatch(toggleDeleteInactiveTransactionPopup(false));
      //   },
      //   () => {
      //     setPostData((prevData: any) => ({
      //       ...prevData,
      //       validations: response.validations,
      //     }));
      //   }
      // );

  }, [postData?.data]);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label
            htmlFor="fileInput"
            className="block text-sm font-medium text-gray-700"
          >
            File Path
          </label>
          <input
            type="file"
            id="fileInput"
            className="mt-1 w-full border border-gray-300 p-2 rounded-md"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex justify-around items-center my-2">
          <div className="">
            <input
              id="product"
              type="checkbox"
              className="mr-2"
              checked={postData?.data?.product}
              required
              onChange={(e) => {
                setPostData((prevData: any) => ({
                  ...prevData,
                  data: {
                    ...prevData.data,
                    product: e.target.checked,
                  },
                }));
              }}
            />
            <label htmlFor="product" className="text-gray-700">
              Products
            </label>
          </div>

          <div className="">
            <input
              id="parties"
              type="checkbox"
              className="mr-2"
              checked={postData?.data?.parties}
              required
              onChange={(e) => {
                setPostData((prevData: any) => ({
                  ...prevData,
                  data: {
                    ...prevData.data,
                    parties: e.target.checked,
                  },
                }));
              }}
            />
            <label htmlFor="parties" className="text-gray-700">
              Parties
            </label>
          </div>
        </div>
      </div>
      <div className="w-full p-2 flex justify-end">
        <ERPButton
          type="reset"
          title="Cancel"
          variant="secondary"
          onClick={onClose}
          disabled={postDataLoading}
        ></ERPButton>
        <ERPButton
          type="button"
          disabled={postDataLoading}
          variant="primary"
          onClick={Import}
          loading={postDataLoading}
          title={"Import"}
        ></ERPButton>
      </div>
    </div>
  );
};

export default ImportExportManage;
