import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux';
import { useFormManager } from '../../../utilities/hooks/useFormManagerOptions';
import Urls from '../../../redux/urls';
import { toggleHeaderFooterPopup } from '../../../redux/slices/popup-reducer';
import { ActionType } from '../../../redux/types';
import { useTranslation } from 'react-i18next';
import { ERPFormButtons } from '../../../components/ERPComponents/erp-form-buttons';
import ERPInput from '../../../components/ERPComponents/erp-input';
interface HeadersAndFootersInf {
    branchID:number;
    headerFooterID:number;
    heading1: string;
    heading2: string;
    heading3: string;
    heading4: string;
    heading5: string;
    heading6: string;
    heading7: string;
    heading8: string;
    heading9: string;
    heading10: string;
    footer1:string;
    footer2:string;
    footer3:string;
    footer4:string;
    footer5:string;
    footer6:string;
    footer7:string;
    footer8:string;
    footer9:string;
    footer10:string; 
  }

const HeadersAndFooters : React.FC = React.memo(() => {
    const dispatch = useDispatch();
  
    const { isEdit, handleClear, handleSubmit, handleFieldChange, getFieldProps, isLoading,handleClose } =
      useFormManager<HeadersAndFootersInf>({
        url: Urls.headers_footers,
        onClose:useCallback(() => dispatch(toggleHeaderFooterPopup({ isOpen: false, key: null,})), [dispatch]),
        onSuccess: useCallback(
          () =>
            dispatch(
              toggleHeaderFooterPopup({ isOpen: false, key: null })
            ),
          [dispatch]
        ),
        method: ActionType.POST,
        useApiClient: true,
        loadDataRequired:true
      });
  

  
    const { t } = useTranslation();
  
    return (
      <div className="w-full pt-4">
    <div className='flex flex-col sm:flex-row justify-start items-center gap-4'>
      <div className='flex flex-col gap-4'>
        <h4 className='font-medium text-gray-500'>{t("headers")}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
        <ERPInput
          {...getFieldProps("heading1")}
          label={t("header_1")}
          placeholder={t("heading_1")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading1", data.heading1)}
          
        />
          <ERPInput
          {...getFieldProps("heading2")}
          label={t("header_2")}
          placeholder={t("heading_2")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading2", data.heading2)}
        />
          <ERPInput
          {...getFieldProps("heading3")}
          label={t("header_3")}
          placeholder={t("heading_3")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading3", data.heading3)}
        />
          <ERPInput
          {...getFieldProps("heading4")}
          label={t("header_4")}
          placeholder={t("heading_4")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading4", data.heading4)}
        />
          <ERPInput
          {...getFieldProps("heading5")}
          label={t("header_5")}
          placeholder={t("heading_5")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading5", data.heading5)}
        />
          <ERPInput
          {...getFieldProps("heading6")}
          label={t("header_6")}
          placeholder={t("heading_6")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading6", data.heading6)}
        />
          <ERPInput
          {...getFieldProps("heading7")}
          label={t("header_7/report_1")}
          placeholder={t("heading_7")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading7", data.heading7)}
        />
          <ERPInput
          {...getFieldProps("heading8")}
          label={t("header_8/report_2")}
          placeholder={t("header_8")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading8", data.heading8)}
        />
          <ERPInput
          {...getFieldProps("heading9")}
          label={t("header_9/report_3")}
          placeholder={t("heading_9")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading9", data.heading9)}
        />
          <ERPInput
          {...getFieldProps("heading10")}
          label={t("header_10/barcode_title")}
          placeholder={t("heading_10")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading10", data.heading10)}
        />
        </div>
    </div>
        <div className='flex flex-col gap-4'>
        <h4 className='font-medium text-gray-500'>{t("footer")}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
        <ERPInput
          {...getFieldProps("footer1")}
          label={t("footer_1")}
          placeholder={t("footer_1")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer1", data.footer1)}
        />
         <ERPInput
          {...getFieldProps("footer2")}
          label={t("footer_2")}
          placeholder={t("footer_2")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer2", data.footer2)}
        />
         <ERPInput
          {...getFieldProps("footer3")}
          label={t("footer_3")}
          placeholder={t("footer_3")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer3", data.footer3)}
        />
         <ERPInput
          {...getFieldProps("footer4")}
          label={t("footer_4")}
          placeholder={t("footer_4")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer4", data.footer4)}
        />
         <ERPInput
          {...getFieldProps("footer5")}
          label={t("footer_5")}
          placeholder={t("footer_5")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer5", data.footer5)}
        />
         <ERPInput
          {...getFieldProps("footer6")}
          label={t("footer_6")}
          placeholder={t("footer_6")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer6", data.footer6)}
        />
         <ERPInput
          {...getFieldProps("footer7")}
          label={t("footer_7")}
          placeholder={t("footer_7")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer7", data.footer7)}
        />
         <ERPInput
          {...getFieldProps("footer8")}
          label={t("footer_8")}
          placeholder={t("footer_8")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer8", data.footer8)}
        />
         <ERPInput
          {...getFieldProps("footer9")}
          label={t("footer_9")}
          placeholder={t("footer_9")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer9", data.footer9)}
        />
         <ERPInput
          {...getFieldProps("footer10")}
          label={t("footer_10")}
          placeholder={t("footer_10")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer10", data.footer10)}
        />
        </div>
      </div>
    </div> 
        <ERPFormButtons
          isEdit={isEdit}
          title={t("save")}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          onClear={handleClear}
        />
      </div>
    );
  });

export default HeadersAndFooters
