'use client';
import React, { useState, useEffect, useCallback } from 'react';
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

interface TemplatesProps {
  setIsOpen: () => void;
  voucherType: string;
  isInvTrans: boolean;
  transactionMasterID: number;
  transactionType: string
}

const api = new APIClient();

export default function TemplatesPreView({ setIsOpen, voucherType, isInvTrans,transactionMasterID,transactionType }: TemplatesProps) {
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
        {/* Template Preview Container */}
        <div
          className="shadow-lg border border-gray-200 overflow-hidden"
          style={{
            width: `${templateStyleProperties.previewWidth ?? 500}pt`,
            height: `${templateStyleProperties.previewHeight ?? 500}pt`,
          }}
        >
          {/* Template Content */}
          <div className="relative h-full w-full">
            <SharedTemplatePreview
              template={stableTemplateProps?.template}
              data={stableTemplateProps?.data}
              qrCodeImages={stableTemplateProps?.qrCodeImages}
            />
          </div>
        </div>

        {/* Drop Shadow Effect */}
        <div
          className="absolute -bottom-2 -right-2 bg-gray-400/20 dark:bg-gray-600/20 rounded-lg -z-10"
          style={{
            width: `${templateStyleProperties.previewWidth}pt`,
            height: `${templateStyleProperties.previewHeight}pt`,
            minHeight: '400px',
          }}
        />
      </div>
    </div>
  );
}
