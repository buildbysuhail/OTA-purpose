import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface SBTooltipProps {
  message?: string;
}

const ERPTooltip = ({ message }: SBTooltipProps) => {
  return (
    <div className=" relative group ">
      <InformationCircleIcon className="h-5 relative stroke-slate-400" />
      {message && (
        <div className=" left-9 -top-[6px] absolute w-[350px] h-auto z-30">
          <div className=" w-fit transition-opacity duration-500 transform-gpu hidden group-hover:block group-hover:opacity-100 opacity-0 relative shadow-md text-white bg-black/80 p-1 px-2 rounded-md ">
            <div className="absolute -left-[14px] top-[10px] -rotate-90 h-0 w-0 border-x-8 border-x-transparent border-b-[12px] border-b-black/80"></div>
            <div className="p-2">
              <a className="text-xs w-full">{message}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ERPTooltip;
