'use client'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { ChevronRight, X, CheckCircle2, AlertTriangle} from 'lucide-react'
import { useTranslation } from 'react-i18next';
import { PlusIcon, TrashIcon, PencilIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { useAppSelector } from '../../utilities/hooks/useAppDispatch';
import { APIClient } from '../../helpers/api-client';
import Urls from '../../redux/urls';
import { useDispatch, useSelector } from 'react-redux';
import { accFormStateHandleFieldChange } from '../accounts/transactions/reducer';
import { handleResponse } from '../../utilities/HandleResponse';
import { TemplateState } from '../InvoiceDesigner/Designer/interfaces';
import { addTemplateToStore, fetchTemplateFromApiById } from '../use-print';
import { isNullOrUndefinedOrEmpty } from '../../utilities/Utils';

interface TemplatesProps {
  setIsOpen: () => void; 
  voucherType: string;
}
const api = new APIClient();
export default function TemplatesView ({ setIsOpen, voucherType}: TemplatesProps) {
const { t } = useTranslation("system");
const [templates, setTemplate] =useState<[]>([])
const [templateLoad, setTemplateLoad] = useState(false);

useEffect(() => {
  const fetchTemplates = async () => {
    try {
      setTemplateLoad(true)
      const api = new APIClient();
      const response = await api.getAsync(
        `${Urls.templates}?template_group=${voucherType}`
      );
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

      const _template = await fetchTemplateFromApiById(template.id);
      if (!_template) {
        console.warn("Template not found or failed to parse.");
        return;
      }

      addTemplateToStore(_template);
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
        <button className="dark:text-dark-text text-gray-500 dark:hover:text-dark-text  hover:text-gray-700" onClick={setIsOpen} >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 items-center p-4'>
        {/* {loading && (
                  <>
                    <div className="md:w-[140px] lg:w-[200px] aspect-[2.3/3] shimmer bg-gray-200 rounded text-xs flex justify-center items-center h-full"></div>
                  </>
                )} */}
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
        </div>
              
    </div>
  )
}

