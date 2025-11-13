'use client'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { ChevronRight, X, CheckCircle2, AlertTriangle} from 'lucide-react'
import { useTranslation } from 'react-i18next';
import { APIClient } from '../../helpers/api-client';
import Urls from '../../redux/urls';
import { TemplateState } from '../InvoiceDesigner/Designer/interfaces';
import { addTemplateToStore, fetchTemplateById, fetchTemplateFromApiById } from '../use-print';
import { isNullOrUndefinedOrEmpty } from '../../utilities/Utils';
import { useNavigate } from 'react-router-dom';
import ERPButton from '../../components/ERPComponents/erp-button';
import { removeStorageString } from '../../utilities/storage-utils';

interface TemplatesProps {
  setIsOpen: () => void; 
  voucherType: string;
  formType:string;
  customerType:string;
  onTemplateChoosed?: (template: any) => void;
}

export default function TemplatesView ({ setIsOpen, onTemplateChoosed, voucherType,formType,customerType}: TemplatesProps) {
const { t } = useTranslation("system");
const navigate = useNavigate();
const [templates, setTemplate] =useState<[]>([])
const [templateLoad, setTemplateLoad] = useState(false);
 const api = new APIClient();
useEffect(() => {
  const fetchTemplates = async () => {
    try {
      setTemplateLoad(true)
     
      const payload = {
      template_group: voucherType,
      formType: formType,
      customerType: customerType
      }
      let response = await api.postAsync(`${Urls.templates}Filtered`,payload);
      if (!response || response.length === 0) {
     response =   await api.postAsync(`${Urls.templates}Filtered`,{
          template_group: voucherType,
          formType: "",
          customerType: ""
        });
      }
      setTemplate(response);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
    finally {
      
      setTemplateLoad(false)
    }
  };

  fetchTemplates();
}, [voucherType]); // Add dependency if value can change

const loadTemplateId = useCallback(
  async (template: TemplateState<unknown> | null) => {
    try {
      if (!template || isNullOrUndefinedOrEmpty(template.id)) return null;
      debugger;
      const _template =await fetchTemplateById(template.id, template.templateGroup??"", template.customerType, template.formType);
      if (!_template) {
        console.warn("Template not found or failed to parse.");
        return;
      }
debugger;
     await addTemplateToStore(_template, template.id);

     if (onTemplateChoosed && _template.id) {
  onTemplateChoosed({
    id: template?.id,
    group: template?.templateGroup,
    formType: template?.formType,
    customerType: template?.customerType,
  });
}
      setIsOpen();
    } catch (error) {
      console.error(error);
    }
  },
  []
);



  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sticky top-0  ml-[5px] dark:!bg-dark-bg  bg-[#f9fafb] h-20 p-4 z-50">
       <h1 className=" font-medium text-xl dark:text-dark-text  capitalize">{t("templates")}</h1>
                         {/* <div className="flex gap-2 px-2 sm:px-4">
                    <ERPButton
                      title={t("cancel")}
                      onClick={() => goToPreviousPage()}
                      className="flex-1 rounded-none !m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg text-sm sm:text-base"
                      localInputBox={formState?.userConfig?.inputBoxStyle}
                    />
                    <ConfettiWrapper onOriginalClick={save}>
                      <ERPButton
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        ref={btnSaveRef}
                        title={formState.transaction.master.voucherType === "LPO" ? t("generate_lpo") : t("save")}
                        jumpTarget="save"
                        variant="primary"
                        className="flex-1 rounded-none !m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg text-sm sm:text-base"
                        disabled={formState.formElements.pnlMasters?.disabled || formState.transaction.details == null || formState.transaction.details.length == 0 || formState.transactionLoading}
                      />
              
                    </ConfettiWrapper>
                  </div> */}
       <div className='flex gap-2'>
                            {/* <ERPButton
                      title={t("add_new")}
                      onClick={()=>navigate(`/invoice_designer/new?template_group=${voucherType}`)}
                      className=" rounded-none  !m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
                 
                    /> */}
        {/* <button className="dark:text-dark-text text-gray-500 dark:hover:text-dark-text  hover:text-gray-700" onClick={()=>navigate("/templates")} >
         {t("add_new")} 
        </button> */}
        <button className="dark:text-dark-text text-gray-500 dark:hover:text-dark-text  hover:text-gray-700" onClick={setIsOpen} >
          <X className="h-5 w-5" />
        </button>
       </div>

      </div>

       <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 items-center p-4 relative'>
             {templateLoad  ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) :(<>
              {templates?.map((temp: any) => {
                  return (
                    <div
                      key={`ti_${temp?.id}`}
                      tabIndex={0}
                      // onClick={() => { }}
                      className=" relative dark:border-dark-border hover:ring-0 hover:shadow-xl cursor-pointer 100px  w-auto min-w-[140px]  aspect-[2.3/3] border border-accent/30 rounded"
                    >
                      <div className="relative group">
                        <img
                          src={temp?.thumbImage}
                          style={{ objectFit: 'scale-down' }} 
                          alt=""
                          className=" antialiased border-0 bg-gray-50 object-top object-cover w-full aspect-[2/2] "
                        />
                   
                      </div>
                      <div className="px-2 py-3">
                    
                        <div className="flex text-xs dark:text-dark-text justify-around mt-1">
                            <h1 className="font-medium dark:text-dark-text text-xs text-center capitalize break-words truncate" title={temp?.templateName}>
                            {temp?.templateName}

                            </h1>
                            <button className="ti-btn dark:hover:bg-dark-hover-bg hover:bg-primary  dark:border-dark-border dark:!bg-dark-bg-card bg-gray-400 dark:text-dark-text dark:hover:text-dark-text hover:text-white  !text-[10px] !px-2 !py-1 rounded" 
                            onClick={()=>loadTemplateId(temp)}
                            >
                              {"use this"}
                            </button>
 
                        </div>
                      </div>
                    </div>
                  );
                })}                   
                    </>

                    )}

        </div>
              
    </div>
  )
}

