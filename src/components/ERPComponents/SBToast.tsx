import { toast, TypeOptions } from "react-toastify";

const autoClose = 3400;

const SBToast = {
  show(msg: string, type: TypeOptions = "default") {
    toast(msg, {
      position: "top-right",
      autoClose: type == "error" ? autoClose : 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type,
    });
  },
  showWith(msg: string, type: TypeOptions = "default") {
    toast(msg, {
      position: "top-right",
      autoClose: type == "error" ? autoClose : 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type,
    });
  },
};

export default SBToast;
