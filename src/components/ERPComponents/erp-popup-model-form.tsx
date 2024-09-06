import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";
import EventEmitter from "../../utilities/EventEmitter";
import { AppState } from "../../redux/slices/app/types";
import { useAppDynamicSelector, useAppSelector } from "../../utilities/hooks/useAppDispatch";
import { RootState } from "../../redux/store";
import { ActionType, ApiState, ApiStateWithValidation } from "../../redux/types";
import { getThunkAndSlice, getThunkAndSliceWithValidation } from "../../redux/slices/dynamicThunkAndSlice";
import { SetDefaultFields } from "../../utilities/Utils";
import { handleResponse } from "../../utilities/HandleResponse";
import SBModelForm from "../common/polosys/sb-model-form";
import { ResponseModelWithValidation } from "../../base/response-model";

const showForm = (title: string, endpointUrl: string, formFields: Array<any>, onSubmit?: () => void, postUrl?: string) => {
  EventEmitter.emit("show", { title, endpointUrl, formFields, onSubmit, postUrl });
};

export default showForm;

export const hideForm = () => {
  EventEmitter.emit("hide");
};

// type POPEvent = "show" | "close";
interface FormParams {
  formFields: Array<any>;
  title: string;
  endpointUrl: string;
  postUrl?: string;
}

interface FormState {
  show: boolean;
  formFields: Array<any>;
  title: string;
  endpointUrl: string;
  postUrl?: string;
}

export const PopModelContainer = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [sendData, setSendData] = useState<any>();
  const [contactPerson, setContactPerson] = useState<any>([]);
  const [peopleAddresses, setPeopleAddresses] = useState<any>([]);

  const [form, setForm] = useState<FormState>({ show: false, formFields: [], title: "", endpointUrl: "" });

  const { thunk } = getThunkAndSlice<any>(form.endpointUrl,ActionType.GET,false,{});
  
  const apiData = useAppDynamicSelector<ApiState<any>>(form.endpointUrl, ActionType.GET);
  

  /* ########################################################################################### */

  useEffect(() => {
    EventEmitter.on("show", ({ formFields, title, endpointUrl, postUrl }: FormParams) =>
      setForm({ show: true, formFields, title, endpointUrl, postUrl })
    );
    EventEmitter.on("hide", () => setForm({ show: false, formFields: [], title: "", endpointUrl: "" }));
    () => {
      EventEmitter.removeAllListener();
    };
  }, []);

  console.log(`PopModelForm,  : form_data_value`, form);

  useEffect(() => {
  }, []);

  /* ########################################################################################### */
  const { thunk: getFormDataThunk, slice: formDataSlice } =
    getThunkAndSliceWithValidation<any, any>(
      form.endpointUrl,ActionType.GET,false,{},
      true
    );
  const formData: ApiStateWithValidation<any, any> = useAppDynamicSelector(
    form.endpointUrl,ActionType.GET,false
  );
  
  const { thunk: postFormThunk } =
    getThunkAndSlice<any>(
      form.postUrl ?? form?.endpointUrl,
      ActionType.POST,
      false,
      {}
    );
  const updatedFormData: any = useAppDynamicSelector(
    form.postUrl ?? form?.endpointUrl,
    ActionType.POST
  );
  const onSubmitForm = async () => {
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      postFormThunk(sendData)
    ).unwrap();
  };

  /* ########################################################################################### */

  const closeModel = () => {
    setForm({ show: false, formFields: [], title: "", endpointUrl: "" });
    setSendData(undefined);
    setPeopleAddresses([]);
    setContactPerson([]);
  };

  /* ########################################################################################### */

  return (
    <SBModelForm
      formFields={form.formFields}
      show={form.show}
      onClose={closeModel}
      title={form.title}
      data={sendData}
      onChangeData={(data: any) => setSendData((prevData: any) => ({ ...prevData, ...data }))}
      onSubmit={onSubmitForm}
      loading={apiData?.loading}
      endpointUrl={form?.endpointUrl}
    >
      {(form.endpointUrl === "/peoples/customers/" ||
        form.endpointUrl === "/peoples/vendors/" ||
        form?.postUrl === "/peoples/customers/" ||
        form.postUrl === "/peoples/vendors/") && (
        <div className="px-5 pb-3">
          {/* <ERPCustomerAdditionalDetails
            data={sendData}
            defaultData={""}
            people={form?.endpointUrl == "/peoples/customers/" ? "customer" : "vendor"}
            peopleAddresses={peopleAddresses}
            setPeopleAddresses={setPeopleAddresses}
            onChangeData={(data: any) => setSendData((prevData: any) => ({ ...prevData, ...data }))}
            setContactPerson={setContactPerson}
            contactPerson={contactPerson}
          /> */}
        </div>
      )}
    </SBModelForm>
  );
};
