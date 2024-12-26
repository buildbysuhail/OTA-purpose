'use client'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { ChevronRight, X, CheckCircle2, AlertTriangle} from 'lucide-react'
import { useTranslation } from 'react-i18next';
import { PlusIcon, TrashIcon, PencilIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import { useAppSelector } from '../../../utilities/hooks/useAppDispatch';
import { APIClient } from '../../../helpers/api-client';
import Urls from '../../../redux/urls';
import { useDispatch } from 'react-redux';
import { accFormStateHandleFieldChange } from './reducer';
import { handleResponse } from '../../../utilities/HandleResponse';
import { TemplateState } from '../../InvoiceDesigner/Designer/interfaces';

interface TemplatesProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>; 
}
const api = new APIClient();
export default function TemplatesView ({ setIsOpen}: TemplatesProps) {
const { t } = useTranslation("system");
const navigate = useNavigate();
const dispatch = useDispatch();
const templates = useAppSelector((x:RootState) =>x.AccTransaction?.templates)

const loadTemplateId = useCallback(async(template: TemplateState) => {
    try {
    const response = await api.getAsync(`${Urls.crm_templates}${template.id}`);
        dispatch(accFormStateHandleFieldChange({fields:{template:response}}));
        setIsOpen(false)
    }
    catch (error) {
        console.log(error, "acc-transaction template select error");
    }
    }, [])


  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sticky top-0  ml-[5px]  bg-[#f9fafb] h-20 p-4 z-50">
       <h1 className=" font-medium text-xl capitalize">{t("templates")}</h1>
        <button className="text-gray-500 hover:text-gray-700" onClick={() => { setIsOpen(false)}} >
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
                      onClick={() => { }}
                      className=" relative hover:ring-0 hover:shadow-xl cursor-pointer 100px  w-auto min-w-[140px]  aspect-[2.3/3] border border-accent/30 rounded"
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
                    
                        <div className="flex text-xs justify-around mt-1">
                            <h1 className="font-medium text-xs text-center capitalize break-words truncate" title={temp?.templateName}>
                            {temp?.templateName}

                            </h1>
                            <button className="ti-btn hover:bg-primary bg-gray-400 hover:text-white  !text-[10px] !px-2 !py-1 rounded" 
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

