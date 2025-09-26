import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { FooterState, HeaderState } from "./interfaces";
import CustomDesignerButton from "./customDesignerButton";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid"

interface TempImageProps {
}

interface FooterDesignerProps {

    tempImages?: TempImageProps;
    footerState?: FooterState;
    headerState?: HeaderState;
}

const HeaderDesigner = ({}: FooterDesignerProps) => {
    const inputFile = useRef<HTMLInputElement>(null);
    const inputFooterFile = useRef<HTMLInputElement>(null);
    const [searchParams] = useSearchParams();
    const userSession = useSelector((state: RootState) => state?.UserSession);
    const userBranches = useAppSelector((state: RootState) => state.UserBranches);
    const templateGroup = searchParams?.get("template_group");
    const [maxHeight, setMaxHeight] = useState<number>(500);
    const { t } = useTranslation('system');
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
        let wh = window.innerHeight;
        setMaxHeight(wh);
    }, []);

    /* ######################################################################################### */
    const templateData = useSelector((state: RootState) => state?.Template) 
    const headerState = templateData?.activeTemplate?.headerState || {};
    const dispatch = useDispatch();

    return (
        // <ERPScrollArea
        //     className={`overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${maxHeight - 100}px] flex-col gap-1`}>
            <div className={"transition-all  flex flex-col gap-5 bg-white p-4"}>
                <div className="flex justify-between items-center  border-b  bg-[#80808012] p-2"> 
                  <h6 className="">{t("header")}</h6>

                </div>

               <div
        key={`ti_head`}
        className="
          group relative w-full  
          h-[250px] xs:h-[260px] sm:h-[280px] md:h-[300px] lg:h-[280px] 
          aspect-[4/5] bg-white rounded-md
          border border-slate-400 hover:border-slate-600 hover:shadow-xl 
          overflow-hidden 
        "
      >


        <div className="relative w-full h-[80%] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          <img
            src={headerState?.customElements?.thumbImage || "/placeholder.svg?height=300&width=240"}
            alt={"header thumbImage"}
            className="w-full h-full object-contine "
          />

        </div>

        <div className="px-4 py-2  bg-slate-50 border-t border-slate-400 rounded-b-md min-h-[20%] overflow-hidden">
                  <CustomDesignerButton 
                    Label="Add Header"
                    customFieldMaster={"headerState"}
                    dispatch={dispatch}
                    className=""
                    />
        </div>
      </div> 
            </div>
        // </ERPScrollArea>
    );
};

export default HeaderDesigner;
