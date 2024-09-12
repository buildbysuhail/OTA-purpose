import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SBToast from "../../../../components/SBComponets/SBToast";

const SettingsCard = ({ data }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="w-auto bg-gray-50 rounded-lg p-5 border flex flex-grow ">
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 items-center">
          <data.icon className="w-4 aspect-square stroke-gray-600" />
          <p className="text-sm font-medium">{data?.header}</p>
        </div>
        <div className={`grid grid-cols-${data?.items?.length} gap-24`}>
          {data?.items?.map((item: any, idx: number) => {
            return (
              <div className="flex flex-col gap-3" key={`QQEO39_${idx}`}>
                {item?.routes?.map((route: any, routeIdx: number) => {
                  return (
                    <p
                      className="text-xs cursor-pointer hover:italic hover:text-accent transition-all ease-in-out"
                      onClick={() => {
                        // dispatch({ type: "minimize", minimize: false });
                        route?.path ? navigate(route?.path) : SBToast.showWith("This Feature is under development. Please try later!", "warning");
                      }}
                      key={`JPKNE84_${routeIdx}`}
                    >
                      {route?.title}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
