'use client';
import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
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
import { addTemplateToStore, fetchTemplateFromApiById } from '../use-print';
import { isNullOrUndefinedOrEmpty } from '../../utilities/Utils';
import { useTemplateDesigner } from '../InvoiceDesigner/LandingFolder/useTemplateDesigner';
import SharedTemplatePreview from '../InvoiceDesigner/DesignPreview/shared';

export type TemplatesPreViewHandle = {
  getPrintData: () => {
    template: any;
    printData?:any
  } | null;
};
type TemplatesProps = {
  voucherType: string;
  isInvTrans?: boolean;
  transactionMasterID: number;
  transactionType: string;
};

const TemplatesPreView = forwardRef<TemplatesPreViewHandle, TemplatesProps>(
  ({ voucherType, isInvTrans = false, transactionMasterID, transactionType }, ref) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const {
      stableTemplateProps,
      loading,
      templateStyleProperties
    } = useTemplateDesigner({
      manuvalTemplateFeatch: true,
      isInvTrans: isInvTrans,
      MasterIDParam: transactionMasterID,
      transactionType: transactionType,
    });

    useImperativeHandle(ref, () => ({
      getPrintData: () => {
        if (!stableTemplateProps?.data || !stableTemplateProps?.template) return null;
        
        return {
          template: stableTemplateProps.template,
          data: stableTemplateProps.data,
        };
      }
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
                template={stableTemplateProps?.template}
                data={stableTemplateProps?.data}
                qrCodeImages={stableTemplateProps?.qrCodeImages}
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