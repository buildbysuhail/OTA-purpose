import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useTranslation } from "react-i18next";
import { FooterState, HeaderState } from "./interfaces";
import CustomDesignerButton from "./customDesignerButton";

interface TempImageProps { }

interface FooterDesignerProps {
  tempImages?: TempImageProps;
  footerState?: FooterState;
  headerState?: HeaderState;
}

const FooterDesigner = ({ }: FooterDesignerProps) => {
  const { t } = useTranslation('system');
  /* ######################################################################################### */
  const templateData = useSelector((state: RootState) => state?.Template)
  const footerState = templateData?.activeTemplate?.footerState || {};
  const dispatch = useDispatch();

  return (
    // <ERPScrollArea
    //     className={`overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${maxHeight - 100}px] flex-col gap-1`}>
    <div className={"transition-all  flex flex-col gap-5 bg-white dark:bg-dark-bg-card p-4"}>
      <div className="flex justify-between items-center  border-b dark:border-dark-border  bg-[#80808012] dark:bg-dark-bg-card p-2">
        <h6 className="dark:!text-dark-text">{t("footer")}</h6>
      </div>

      <div key={`ti_foot`} className="group relative w-full h-[250px] xs:h-[260px] sm:h-[280px] md:h-[300px] lg:h-[280px] aspect-[4/5] bg-white dark:bg-dark-bg-card rounded-md border border-slate-400 dark:border-dark-border hover:border-slate-600 dark:hover:border-gray-400 hover:shadow-xl overflow-hidden">
        <div className="relative w-full h-[80%] bg-gradient-to-br from-slate-50 dark:from-slate-800 to-slate-100 dark:to-slate-700 overflow-hidden">
          <img src={footerState?.customElements?.thumbImage || "/placeholder.svg?height=300&width=240"} alt={"footer thumbImage"} className="w-full h-full object-contain " />
        </div>
        <div className="px-4 py-2  bg-slate-50 dark:bg-dark-bg-card border-t border-slate-400 dark:border-dark-border rounded-b-md min-h-[20%] overflow-hidden">
          <CustomDesignerButton
            Label={t("add_footer")}
            customFieldMaster={"footerState"}
            dispatch={dispatch}
            className=""
          />
        </div>
      </div>
    </div>
    // </ERPScrollArea>
  );
};

export default FooterDesigner;