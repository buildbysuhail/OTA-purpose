import { XMarkIcon } from "@heroicons/react/24/outline";

interface ERPCloseBt {
  onClick?: () => void;
  type?: "submit" | "reset" | "button" | undefined;
}

const ERPCloseBt = ({ type, onClick }: ERPCloseBt) => {
  return (
    <button type={type} className=" w-6 bg-slate-100 aspect-square rounded-md flex justify-center items-center cursor-pointer" onClick={onClick}>
      <XMarkIcon className=" text-black w-5" />
    </button>
  );
};

export default ERPCloseBt;
