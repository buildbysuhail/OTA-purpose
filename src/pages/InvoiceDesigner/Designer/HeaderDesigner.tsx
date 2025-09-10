import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { TemplateReducerState } from "../../../redux/reducers/TemplateReducer";
import { FooterState, HeaderState } from "./interfaces";
import { ERPScrollArea } from "../../../components/ERPComponents/erp-scrollbar";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPSlider from "../../../components/ERPComponents/erp-slider";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import ErpDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { handleSetTemplateBackgroundImageFooter, handleSetTemplateBackgroundImageHeader, setTemplateFooterState, setTemplateHeaderState } from "../../../redux/slices/templates/reducer";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { toggleCustomDesignerPopup } from "../../../redux/slices/popup-reducer";
import CustomDesignerButton from "./customDesignerButton";
import useLogo from "../utils/useLogo";


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
    const footerState = templateData?.activeTemplate?.footerState || {};
    const dispatch = useDispatch();
    const handleChange = (type: "header" | "footer", key: keyof HeaderState  | keyof FooterState, value: string | number | boolean) => {
        if (type === "header") {
            dispatch(setTemplateHeaderState({ ...headerState, [key]: value }));
        } else {
            dispatch(setTemplateFooterState({ ...footerState, [key]: value }));
        }
    }
    const Logo = useLogo()
    return (
        // <ERPScrollArea
        //     className={`overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${maxHeight - 100}px] flex-col gap-1`}>
            <div className={"transition-all  flex flex-col gap-5 bg-white p-4"}>
                <div className="flex justify-between items-center  border-b  bg-[#80808012] p-2"> 
                  <h6 className="">{t("header")}</h6>
                   <CustomDesignerButton 
                    LabelBefore="Add Before Header"
                    LabelAfter="Add After Header"
                    customFieldMaster={"headerState"}
                    dispatch={dispatch}
                    t={t}
                    className=""
                    />
                </div>

               
            </div>
        // </ERPScrollArea>
    );
};

export default HeaderDesigner;
