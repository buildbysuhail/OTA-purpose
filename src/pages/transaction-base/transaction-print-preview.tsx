'use client';
import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { ChevronRight, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PlusIcon, TrashIcon, PencilIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { APIClient } from '../../helpers/api-client';
import Urls from '../../redux/urls';
import { accFormStateHandleFieldChange } from '../accounts/transactions/reducer';
import { handleResponse } from '../../utilities/HandleResponse';
import { TemplateState } from '../InvoiceDesigner/Designer/interfaces';
import { addTemplateToStore, fetchTemplateById, fetchTemplateFromApiById } from '../use-print';
import { isNullOrUndefinedOrEmpty } from '../../utilities/Utils';
import { useTemplateDesigner } from '../InvoiceDesigner/LandingFolder/useTemplateDesigner';
import SharedTemplatePreview from '../InvoiceDesigner/DesignPreview/shared';
import { formStateHandleFieldChange } from '../inventory/transactions/reducer';
import { popupDataProps, toggleTemplateChooserModal } from '../../redux/slices/popup-reducer';
import { useAppSelector } from '../../utilities/hooks/useAppDispatch';

export type TemplatesPreViewHandle = {
  getPrintData: () => {
    template: any;
    printData?: any
  } | null;
  openTemplateChooser: () => {}
};
type TemplatesProps = {
  voucherType: string;
  isInvTrans?: boolean;
  printPreviwPopupInfo: popupDataProps;
  transactionType: string;
  lastChooseTemp: any;
};
// 
const TemplatesPreView = forwardRef<TemplatesPreViewHandle, TemplatesProps>(
  ({ voucherType, isInvTrans = false, printPreviwPopupInfo, transactionType, lastChooseTemp }, ref) => {
    const [activeTemplate, setActiveTemplate] = useState<TemplateState<unknown>>(printPreviwPopupInfo.template)
    const prevTemplateIdRef = useRef<number | null>(null);
    const dispatch = useDispatch();
    const formState = useAppSelector(
      (state: RootState) => state.InventoryTransaction
    );
    const { t } = useTranslation();
    const {
      stableTemplateProps,
      loading,
      templateStyleProperties
    } = useTemplateDesigner({
      manuvalTemplateFeatch: true,
      isInvTrans: isInvTrans,
      MasterIDParam: printPreviwPopupInfo.masterId ?? 0,
      transactionType: transactionType,

    });

    useEffect(() => {
      if (prevTemplateIdRef.current === null) {
        prevTemplateIdRef.current = lastChooseTemp?.id;
        return;
      }
      if (lastChooseTemp?.id !== prevTemplateIdRef.current) {
        prevTemplateIdRef.current = lastChooseTemp?.id; // update ref

        if (lastChooseTemp?.id) {
          const fetchNewTemplate = async () => {
            const tem = await fetchTemplateById(lastChooseTemp?.id, lastChooseTemp?.group ?? "", lastChooseTemp?.customerType, lastChooseTemp?.formType);
            if (tem) setActiveTemplate(tem);
          };
          fetchNewTemplate();
        }
      }
    }, [lastChooseTemp]);

    useImperativeHandle(ref, () => ({
      getPrintData: () => {
        if (!stableTemplateProps?.data || !activeTemplate) return null;

        return {
          template: activeTemplate,
          data: stableTemplateProps.data,
        };
      },
      openTemplateChooser: () =>
        dispatch(
          toggleTemplateChooserModal({ isOpen: true, templateGroup: formState.transaction.master?.voucherType, customerType: formState.transaction.master?.customerType, formType: formState.transaction.master?.voucherForm })
        )
    }));

    if (loading) {
      return (
        <div className="flex justify-center items-center h-full text-gray-500">
          {t('loading_template')}...
        </div>
      );
    }

    return (
      <div className="flex justify-center">
        <div className="relative">
          <div
            className="shadow-lg border border-gray-200 overflow-hidden"
            style={{
              width: `${templateStyleProperties.previewWidth ?? 500}pt`,
              height: `${templateStyleProperties.previewHeight ?? 500}pt`,
            }}
          >
            <div className="relative h-full w-full">
              <SharedTemplatePreview
                template={activeTemplate}
                data={stableTemplateProps?.data}
                qrCodeImages={stableTemplateProps?.qrCodeImages}
                isTemplateDesigner={false}
                isInvTrans={isInvTrans}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TemplatesPreView.displayName = 'TemplatesPreView';

export default TemplatesPreView;