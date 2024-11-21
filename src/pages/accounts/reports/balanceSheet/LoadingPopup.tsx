import React from "react";
import "./Loader.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoadingPopup: React.FC<{ loading: boolean }> = ({ loading }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };
  return (
    // <div
    //   className={` fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white ${
    //     loading ? "block" : "hidden"
    //   }`}
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="loader"></div>
      <div>
        <div
          className="flex items-center space-x-1 p-2 border rounded-lg cursor-pointer mt-3 bg-[#dc2626] hover:bg-[#f87171]"
          onClick={handleClick}
        >
          {/* <ArrowLeft className="w-5 h-5 me-1" /> */}
          <span className="text-white ">cancel</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPopup;
