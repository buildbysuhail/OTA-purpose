import { useSearchParams } from "react-router-dom";
import { useRef, useState } from "react";
import { BarcodeState } from "./interfaces";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface LabelDesignerProps {
  onChange: (state: BarcodeState) => void;
  barcodeState?: BarcodeState;
}

const LabelDesigner = ({ onChange, barcodeState }: LabelDesignerProps) => {
  const [searchParams] = useSearchParams();
  const [currentTab, setTab] = useState<"barcode_details" | "common_settings" | "other_settings" | "">("barcode_details");


  return (
    <div className="flex h-full overflow-auto flex-col gap-5 p-4">
      <div className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
        onClick={() => setTab(currentTab === "barcode_details" ? "" : "barcode_details")}>
        Common Settings<ChevronDownIcon className={`h-5  ${currentTab === "barcode_details" ? "" : "-rotate-90"} transition-all`} />
      </div>
      
    </div>
  );
};

export default LabelDesigner;
