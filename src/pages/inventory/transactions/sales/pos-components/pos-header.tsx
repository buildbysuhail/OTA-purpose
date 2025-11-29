import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionHeaderProps {
  formState: any;
  dispatch: any;
}

const PosHeader: React.FC<TransactionHeaderProps> = ({
  formState,
  dispatch,
}) => {
  const { t } = useTranslation("transaction");

  return (
    <div className="w-full h-fit flex flex-col gap-1 px-1">
      {/* Super Compact POS Header */}
      <div className="flex items-center border border-gray-700 bg-white text-black rounded-sm overflow-hidden h-[42px]">

        {/* Left Button */}
        <button className="w-[36px] h-full bg-primary text-white flex items-center justify-center">
          <ChevronLeft size={20} />
        </button>

        {/* Middle Section */}
        <div className="flex justify-between items-center w-full text-[10px] px-2 font-semibold leading-tight">

          {/* Date + Invoice */}
          <div className="flex flex-col">
            <span>{new Date().toLocaleDateString()}</span>
            <span className="text-primary font-bold">587596</span>
          </div>

          {/* User */}
          <div className="flex flex-col text-center">
            <span>{t("logged_user")}: Admin</span>
          </div>

          {/* Counter */}
          <div className="flex flex-col text-right">
            <span>{t("counter")}: SAMA PLASTIC</span>
            <span>{t("opened")}: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Right Button */}
        <button className="w-[36px] h-full bg-primary text-white flex items-center justify-center">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default PosHeader;
