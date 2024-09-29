import { useEffect, useState } from "react";
import EventEmitter from "../../utilities/EventEmitter";
import ERPAlertDialog from "./erp-alert-dialog";

export interface ButtonType {
  text: string;
  type?: "default" | "primary" | "danger";
}
export const showAlert = (
  title: string,
  message: string,
  buttons: Array<ButtonType | string>,
  onClickButtonAt: (index: number) => void,
  subText?: any,
  children?: any,
  icon?: any
) => {
  EventEmitter.emit("showAlert", { title, message, subText, children, buttons, onClickButtonAt, icon });
};

export const hideAlert = () => {
  EventEmitter.emit("hideAlert");
};

interface AlertParams {
  title: string;
  message: string;
  subText?: any;
  buttons?: Array<ButtonType | string>;
  onClickButtonAt?: (index: number) => void;
  children?: any;
  icon?: any;
}

interface FormState {
  show: boolean;
  title: string;
  message: string;
  subText?: any;
  buttons?: Array<ButtonType | string>;
  onClickButtonAt?: (index: number) => void;
  children?: any;
  icon?: any;
}

export const SBAlertContainer = () => {
  const [alert, setAlert] = useState<FormState>({ show: false, title: "", message: "", subText: "", buttons: [], children: null, icon: null });

  useEffect(() => {
    EventEmitter.on("showAlert", ({ title, message, subText, buttons, onClickButtonAt, children, icon }: AlertParams) => {
      setAlert({ show: true, title, message, subText, buttons, onClickButtonAt, children, icon });
    });
    EventEmitter.on("hideAlert", () => {
      setAlert({ show: false, title: "", message: "", subText: "", buttons: [], onClickButtonAt: undefined, children: undefined, icon: undefined });
    });
    () => {
      EventEmitter.removeAllListener();
    };
  }, []);

  const closeModel = () => {
    setAlert({ show: false, title: "", message: "", subText: "", buttons: [], onClickButtonAt: undefined, children: undefined, icon: undefined });
  };

  return (
    <ERPAlertDialog
      onClickButtonAt={(index: any) => {
        alert.onClickButtonAt?.(index);
        closeModel();
      }}
      title={alert.title}
      message={alert.message}
      subText={alert?.subText}
      children={alert?.children}
      buttons={alert.buttons}
      closeModal={closeModel}
      isOpen={alert.show}
      icon={alert?.icon}
    />
  );
};
