import { useState, useRef } from "react";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { APIClient } from "../../../../../helpers/api-client";
import Urls from "../../../../../redux/urls";
import ERPAlert from "../../../../../components/ERPComponents/erp-sweet-alert";
import { useTranslation } from "react-i18next";
import { encryptData } from "../../../../../utilities/Utils";

const api = new APIClient();

let openAuthModal:| ((action: string) => Promise<boolean>)| null = null;

export const EditAuthorization = (action:string): Promise<boolean> => {
  return openAuthModal ? openAuthModal(action) : Promise.resolve(false);
};

export const AuthorizationModal = () => {
  const { t } = useTranslation("transaction");
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const actionRef = useRef<string>("");

  openAuthModal = (action: string) => {
    actionRef.current = action;
    setPassword("");
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const close = (result: boolean) => {
    setOpen(false);
    resolverRef.current?.(result);
  };

  const getEncryptedPassword = async (password: string)=>{
    return password;
  }

  const handleApply = async () => {
    const encryptedPassword = await encryptData(password)
    if (password === "") {
      ERPAlert.show({
        icon: "info",
        title: t("authorization_required"),
        showCancelButton: true,
        text: t(""),
        confirmButtonText: t("ok"),
      });
      return false;
    }

    try {
       // Api call is currently not ready, make update after the api correct
      const result = await api.postAsync(`${Urls.authorization_settings}`,{ password: encryptedPassword, action: actionRef.current, formCode: "" });

      if (result?.isOk === true) {
        close(true);
      } else {
        ERPAlert.show({
          title: t("authorization_failed"),
          text: t(""),
          icon: "error",
          showCancelButton: true,
        });
        setPassword("");
      }
    } catch (error) {
      ERPAlert.show({
        title: t("error"),
        text: t("authorization_failed"),
        icon: "error",
        showCancelButton: true,
      });
    }
  };


  if (!open) return null;

  return (
    <ERPModal
      isOpen={open}
      closeModal={() => close(false)}
      title={t("authorizations")}
      width={400}
      height={220}
      content={
        <div className="flex flex-col gap-4 p-4">
          <ERPInput
            id="auth-password"
            type="password"
            autoFocus
            inputClassName="w-20"
            label={t("authentication_password")}
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />

          <div className="flex justify-center gap-2">
            <ERPButton
              title={t("cancel")}
              variant="secondary"
              className="w-32"
              onClick={() => close(false)}
            />
            <ERPButton
              title={t("apply")}
              variant="primary"
              className="w-32"
              onClick={handleApply}
            />
          </div>
        </div>
      }
    />
  );
};
