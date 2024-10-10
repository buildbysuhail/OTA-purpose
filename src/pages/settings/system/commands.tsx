import { useCallback, useEffect, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { toggleCommandsPopup, } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { DataGrid } from "devextreme-react";
import { useTranslation } from "react-i18next";
import {
  Column,
  Scrolling,
  RemoteOperations,
} from "devextreme-react/data-grid";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import { handleResponse } from "../../../utilities/HandleResponse";
import { ResponseModel } from "../../../base/response-model";

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
const api = new APIClient();
const CommandsManage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const onClose = useCallback(async () => {
    dispatch(toggleCommandsPopup({ isOpen: false }));
  }, []);

  const queryParams = new URLSearchParams(location.search);
  const [key, setKey] = useState<any>(queryParams.get("key"));
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false); const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });
  const [userData, setUserData] = useState([]);
  const [store, setStore] = useState<any>([]);

  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile = wh - 200; // Assuming 200px is the height to minus for mobile
    let gridHeightWindows = wh - 320; // Assuming 100px is the height to minus for windows
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [])
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleSelect = () => {
    console.log("Select button clicked");
  };

  const handleExecute = async () => {
    try {
      setLoading(true);
      const response: ResponseModel<any> = await api.post(Urls.sql_commands, query);
      handleResponse(response
        , () => {
          if (response.isOk) {
            if (response.item.isSelect) {
              setStore(response.item.data);
            }
            else {
              setStore([]);
            }

            if (response.message != null && response.message != "") {

            }
          }
          else {

          }
        },
        () => {

        })

    } catch (error) {
      console.error('Execute failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1">
        <div className="flex gap-5 items-start mb-4">
          <textarea
            className="w-2/3 h-24 border border-gray-300 rounded-md p-2 "
            value={query}
            onChange={handleQueryChange}
            placeholder="..."
          />
          <div className="flex flex-col justify-center gap-4 items-center w-1/3 ">
            <div className="flex gap-4">
              <ERPButton
                type="reset"
                title={t("close")}
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              ></ERPButton>
              <ERPButton
                type="reset"
                title={t("submit")}
                variant="primary"
                onClick={handleExecute}
              ></ERPButton>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="box custom-box">
          <div className="box-body">
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <DataGrid
                dataSource={store}
                height={gridHeight.windows}
                showBorders={true}
                showRowLines={true}
                columnAutoWidth={true}
                paging={{ pageSize: 30 }}
              >
                <Scrolling mode="virtual" />
                <RemoteOperations
                  filtering={false}
                  sorting={false}
                  paging={false}
                />
              </DataGrid>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandsManage;