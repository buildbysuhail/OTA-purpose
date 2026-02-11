'use client';
import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { ChevronRight, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PlusIcon, TrashIcon, PencilIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
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
import { PrintData } from '../use-print-type';

export type TemplatesPreViewHandle = {
  getPrintData: () => {
    template: TemplateState<unknown>;
    printData?: PrintData
  } | null;
  // openTemplateChooser: () => {}
};
type TemplatesProps = {
  voucherType?: string;
  isInvTrans?: boolean;
  printPreviwPopupInfo: popupDataProps;
  transactionType?: string;
  lastChooseTemp: any;
  isInLedgerReport?: boolean;
};
//  
const TemplatesPreView = forwardRef<TemplatesPreViewHandle, TemplatesProps>(
  ({ voucherType, isInvTrans = false, printPreviwPopupInfo, transactionType, lastChooseTemp, isInLedgerReport = false }, ref) => {

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
      lastChoosedTemplate: lastChooseTemp,
      isInLedgerReport: isInLedgerReport
    });
    const previewWidth = templateStyleProperties.previewWidth ?? 500;
    const previewHeight = templateStyleProperties.previewHeight ?? 500; // Can be number or "auto"
    const isAutoHeight = templateStyleProperties.isAutoHeight ?? false;


    useImperativeHandle(ref, () => ({
      getPrintData: () => {
        if (!stableTemplateProps?.printData || !stableTemplateProps?.template) return null;

        return {
          template: stableTemplateProps?.template,
          printData: stableTemplateProps.printData,
        };
      },
      // openTemplateChooser: () =>
      //   dispatch(
      //     toggleTemplateChooserModal({ isOpen: true, templateGroup: formState.transaction.master?.voucherType, customerType: formState.transaction.master?.customerType, formType: formState.transaction.master?.voucherForm })
      //   )

    }));

    if (loading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-blue-400"></div>
        </div>
      );
    }

    if (!stableTemplateProps?.template) {
      return (
        <div className="absolute inset-0 flex items-center justify-center italic">
          <span className="text-gray-500 dark:text-gray-400">
            ...No Template Found.&nbsp;
          </span>
          <Link


            to={
              stableTemplateProps?.printData && stableTemplateProps?.printData?.kind === "voucher"
                ? `/templates?template_group=${voucherType}` +
                `&form_type=${stableTemplateProps?.printData?.data?.master?.voucherForm}` +
                `&customer_type=${stableTemplateProps?.printData?.data?.master.customerType}`
                : `/templates?template_group=${voucherType}`
            }
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Create Template
          </Link>
        </div>
      );
    }
    return (
      <div className="flex justify-center">
        <div className="relative">
          <div
            className="shadow-lg border border-gray-200 overflow-hidden"
            style={{

              width: `${previewWidth}pt`,
              height: isAutoHeight ? 'auto' : `${previewHeight}pt`,
              minHeight: isAutoHeight ? '200pt' : undefined,
              transformOrigin: 'top left',
            }}
          >
            <div className={`relative w-full ${isAutoHeight ? 'flex flex-col' : 'h-full'}`}>
              <SharedTemplatePreview
                template={stableTemplateProps?.template}
                printData={stableTemplateProps?.printData}
                qrCodeImages={stableTemplateProps?.qrCodeImages}
                isTemplateDesigner={false}
                isInvTrans={isInvTrans}
                isInLedgerReport={isInLedgerReport}
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