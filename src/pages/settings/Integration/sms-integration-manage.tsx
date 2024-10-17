import React, { useCallback, useState } from "react";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { toggleAccountGroupPopup } from "../../../redux/slices/popup-reducer";
import {
  initialSMSIntegration,
  SMSIntegrationData,
} from "./sms-integration-type";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import { useTranslation } from "react-i18next";

const SMSIntegration: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [accountSid, setAccountSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const rootState = useRootState();
  const dispatch = useDispatch();
  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    handleClear,
    isLoading,
    formState,
  } = useFormManager<SMSIntegrationData>({
    url: Urls.account_group,
    onSuccess: useCallback(
      () =>
        dispatch(
          toggleAccountGroupPopup({ isOpen: false, key: null, reload: true })
        ),
      [dispatch]
    ),
    key: rootState.PopupData.accountGroup.key,
    useApiClient: true,
    initialData: initialSMSIntegration,
  });

  const onClose = useCallback(() => {
    dispatch(toggleAccountGroupPopup({ isOpen: false, key: null }));
  }, []);

  const TwilioConnectPopup: React.FC = () => {
    if (!isPopupOpen) return null;

    return (
      
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <span className="text-xl font-semibold">twilio</span>
            </div>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">
              Don't have an account?
            </h2>
            <p className="mb-2">
              Create an account now to connect Polosys Books with Twilio.
            </p>
            <a
              href="https://www.twilio.com/try-twilio"
              className="text-[#2589BD] hover:underline block mb-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to Twilio
            </a>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-center">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <h2 className="text-lg font-semibold mb-3">
              Have an account already?
            </h2>
            <p className="mb-4">
              Enter the following details to connect Polosys Books with your
              Twilio account.
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <ERPInput
                  {...getFieldProps("accGroupName")}
                  label="Account SID"
                  placeholder="Account SID*"
                  required={true}
                  onChangeData={(data: any) => {
                    handleFieldChange("accGroupName", data);
                  }}
                />
              </div>
              <div className="mb-4">
                <ERPInput
                  {...getFieldProps("accGroupName")}
                  label="Auth Token"
                  placeholder="Auth Token*"
                  required={true}
                  onChangeData={(data: any) => {
                    handleFieldChange("accGroupName", data);
                  }}
                />
              </div>
              <div className="mb-6">
                <ERPInput
                  {...getFieldProps("accGroupName")}
                  label="Phone Number or Sender ID"
                  placeholder="Phone Number or Sender ID*"
                  required={true}
                  onChangeData={(data: any) => {
                    handleFieldChange("accGroupName", data);
                  }}
                />
              </div>
              <ERPFormButtons
                title="Connect with Twilio"
                onClear={handleClear}
                isEdit={isEdit}
                isLoading={isLoading}
                onCancel={onClose}
                onSubmit={handleSubmit}
              />
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        SMS Integrations
      </h1>

      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          {/* <img src="/api/placeholder/40/40" alt="Twilio logo" className="mr-4 rounded" /> */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700">twilio</h2>
            <p className="text-sm text-gray-600">
              Set up Twilio and send automated SMS notifications to your
              customers about transactions, payments and reminders.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="rounded-sm px-4 py-2 bg-blue text-white rounded hover:bg-blue-600 transition-colors"
        >
          Connect
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Benefits</h3>
        <ul className="list-disc pl-5 text-gray-600">
          <li className="pb-3">
            Notify customers instantly about transactions, payments and
            reminders via SMS.
          </li>
          <li className="pb-3">
            Configure SMS notifications at customer and contact person level.
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Before you can connect Twilio with Polosys Books, you must
        </h3>
        <ul className="list-disc pl-5 text-gray-600">
          <li className="pb-3">
            Create a Twilio account.{" "}
            <a
              href="https://www.twilio.com/try-twilio"
              className="text-[#2589BD] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sign up Now
            </a>
          </li>
          <li className="pb-3">
            Go to Console in Twilio and get your Account SID and Auth Token.
          </li>
          <li className="pb-3">
            Have an active phone number that works with Twilio.{" "}
            <a
              href="https://support.twilio.com/hc/en-us/articles/223135367-Phone-Number-types-Twilio-offers-and-how-they-work"
              className="text-[#2589BD] hover:underline flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more
              {/* <ExternalLink size={14} className="ml-1" /> */}
              <i className="ri-external-link-line"></i>
            </a>
          </li>
        </ul>
      </div>

      <TwilioConnectPopup />
    </div>
  );
};

export default SMSIntegration;
