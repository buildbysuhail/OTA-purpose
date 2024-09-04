import { toast, TypeOptions } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const autoClose = 3400;

const ERPToast = {
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

export default ERPToast;
