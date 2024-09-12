import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { BuildingOfficeIcon, LinkIcon } from "@heroicons/react/24/outline";
import { handleResponse } from "../utilities/HandleResponse";
import { setBranch, userSession } from "../redux/slices/user-session/thunk";
import { useAppDispatch, useAppSelector } from "../utilities/hooks/useAppDispatch";
import { RootState } from "../redux/store";

const BranchSelector = ({}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<number>();

  const UserSession = useAppSelector((state: RootState) => state?.UserSession);

  /* ########################################################################################### */

  const changeHandler = async (item: any) => {
    const tenant = {
      user_company_id: item?.id,
      tenant: {
        id: item?.id,
        company: item?.company?.id,
        branch: item?.branch?.id,
      },
    } as any;

    const response = await dispatch(setBranch(tenant)).unwrap();
    handleResponse(response, () => {
      navigate("/")
    });

    setSelected(undefined);
  };


  /* ########################################################################################### */

  useEffect(() => {
    
  }, []);

  /* ########################################################################################### */

  return (
    <>
      {/* <div className="flex h-4 flex-col gap-3 sm:col-span-2">
        {comapanies?.loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
      </div> */}
     
      <div className="flex flex-col gap-3 sm:col-span-2">
        {UserSession?.branches?.map((item: any, index: number) => (
          <div
            key={`org-${index}`}
            onClick={() => {
              setSelected(index);
              changeHandler(item);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSelected(index);
                changeHandler(item);
              }
            }}
            tabIndex={0}
            className={`${
              item?.is_active ? "bg-gray-50" : "bg-white cursor-pointer hover:bg-gray-50"
            } px-4 py-3  rounded-lg flex justify-between border border-gray-200`}
          >
            <div className=" text-xs text-gray-700 flex flex-col">
              <a className=" text-base">
                {item?.company?.name} <span className="text-gray-500 text-xs">({item?.company?.code})</span>
              </a>
              <a className="capitalize text-gray-500 flex gap-2">
                {item?.branch?.is_default ? <BuildingOfficeIcon className="w-4 aspect-square" /> : <LinkIcon className="w-4 aspect-square" />}
                {item?.branch?.name}
                <span className=" lowercase"> • {item?.company?.email}</span>
              </a>
            </div>
            <div className="flex items-center">
              {item?.is_active ? (
                <div className="shrink-0 text-blue-500">
                  <CheckIcon className="h-6 w-6 text-gray-50" />
                </div>
              ) : (
                selected === index && <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-blue-600/20"></div>
              )}
            </div>
          </div>
        ))}
        {/* <div href="/create-organization?addNew"> */}
        {/* <div
          onClick={() => navigate("/create-organization?addNew")}
          className="flex cursor-pointer hover:bg-gray-50 rounded-md gap-2 border-accent items-center justify-center w-full h-[40px] border-dashed border"
        >
          <AddIcon className="h-5 w-5 text-gray-50" />
          <div className=" text-sm text-accent">{t("add-organization")}</div>
        </div> */}
      </div>
      {/* </div> */}
    </>
  );
};

export default BranchSelector;

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="rgba(37,99,235,1)" opacity="0.2" />
      <path d="M7 13l3 3 7-7" stroke="rgba(37,99,235,1)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AddIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-accent w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
