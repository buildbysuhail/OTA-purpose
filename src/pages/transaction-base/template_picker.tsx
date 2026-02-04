'use client'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { ChevronRight, X, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next';
import { APIClient } from '../../helpers/api-client';
import type { RootState } from "../../redux/store"
import Urls from '../../redux/urls';
import { TemplateState } from '../InvoiceDesigner/Designer/interfaces';
import { addTemplateToStore, fetchTemplateById, fetchTemplateFromApiById } from '../use-print';
import { isNullOrUndefinedOrEmpty } from '../../utilities/Utils';
import { Link, useNavigate } from 'react-router-dom';
import ERPButton from '../../components/ERPComponents/erp-button';
import { removeStorageString } from '../../utilities/storage-utils';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';


interface TemplatesProps {
  setIsOpen: () => void;
  voucherType: string;
  formType: string;
  customerType: string;
  onTemplateChoosed?: (template: any) => void;
}

export default function TemplatesView({ setIsOpen, onTemplateChoosed, voucherType, formType, customerType }: TemplatesProps) {

  const { t } = useTranslation("system");
  const navigate = useNavigate();
  const appSettings = useSelector((state: RootState) => state.ApplicationSettings);

  const [templates, setTemplate] = useState<[]>([])
  const [templateLoad, setTemplateLoad] = useState(false);
  const api = new APIClient();

  useEffect(() => {
    let isActive = true; // prevent state update after unmount

    const fetchTemplates = async () => {
      try {
        setTemplateLoad(true);

        const fetchFiltered = (formTypeVal: string, customerTypeVal: string) =>
          api.postAsync(`${Urls.templates}Filtered`, {
            template_group: voucherType,
            formType: formTypeVal,
            customerType: customerTypeVal,
          });

        // 1️⃣ First attempt: exact match
        let response = await fetchFiltered(formType??"", customerType??"");

        // 2️⃣ Fallback: empty tax type (if enabled)
        if (
          (!response || response.length === 0) &&
          appSettings?.printerSettings?.useEmptyTaxTypeTemplateIfMissing
        ) {
          response = await fetchFiltered("", "");
        }

        // 3️⃣ Final result handling
        if (isActive) {
          if (response && response.length > 0) {
            setTemplate(response);
          } else {
            console.warn("No templates found for the given criteria.");
            setTemplate([]); // keep state consistent
          }
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        if (isActive) {
          setTemplateLoad(false);
        }
      }
    };

    fetchTemplates();

    // ✅ cleanup
    return () => {
      isActive = false;
    };
  }, [
    voucherType,
    formType,
    customerType,
    appSettings?.printerSettings?.useEmptyTaxTypeTemplateIfMissing,
  ]);

  const loadTemplateId = useCallback(
    async (template: TemplateState<unknown> | null) => {
      setTemplateLoad(true)
      try {
        if (!template || isNullOrUndefinedOrEmpty(template.id)) return null;
        const _template = await fetchTemplateById(template.id, template.templateGroup ?? "", template?.customerType??"", template?.formType??"");
        if (!_template) {
          console.warn("Template not found or failed to parse.");
          return;
        }
        await addTemplateToStore(_template, template.id);

        // Pass FULL template to callback (not just metadata)
        if (onTemplateChoosed) {
          onTemplateChoosed(_template);  // Pass full template object
        }
        setIsOpen();
      } catch (error) {
        console.error(error);
      } finally {
        setTemplateLoad(false)
      }
    },
    []
  );



  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sticky top-0  ml-[5px] dark:!bg-dark-bg  bg-[#f9fafb] h-20 p-4 z-50">
        <h1 className=" font-medium text-xl dark:text-dark-text  capitalize">{t("templates")}</h1>
        <div className='flex gap-2'>
          <button
            onClick={() => {
              setIsOpen();
              navigate(`/templates?template_group=${voucherType}`);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm flex-shrink-0"
          >
            <PlusIcon className="w-4 h-4" />
            <span>{t('new')}</span>
          </button>

          <button
            className="px-3 py-1 rounded-lg dark:text-dark-text text-gray-500
                  dark:hover:text-dark-text hover:text-gray-700 shadow-lg hover:shadow-xl
                  transform hover:scale-105 transition-all duration-200
                  flex items-center "
            onClick={setIsOpen}
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 items-center p-4 relative'>
        {templateLoad ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : templates && templates.length > 0 ? (
          <>
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
                        onClick={() => loadTemplateId(temp)}
                      >
                        {"use this"}
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </>

        ) : (
          /* ✅ EMPTY STATE */
          <div className="col-span-full flex items-center justify-center h-[200px] italic">
            <span className="text-gray-500 dark:text-gray-400">
              ...No Template Found.&nbsp;
            </span>

            <span
              onClick={() => {
                setIsOpen();
                navigate(`/templates?template_group=${voucherType}`);
              }}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Create Template
            </span>
          </div>
        )}

      </div>

    </div>
  )
}

