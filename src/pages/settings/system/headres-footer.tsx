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
  
    const { isEdit, handleClear, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
      useFormManager<HeadersAndFootersInf>({
        url: Urls.headers_footers,
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
  
    const onClose = useCallback(() => {
      dispatch(
        toggleHeaderFooterPopup({ isOpen: false, key: null })
      );
    }, []);
  
    const { t } = useTranslation();
  
    return (
      <div className="w-full pt-4">
    <div className='flex flex-col sm:flex-row justify-start items-center gap-4'>
      <div className='flex flex-col gap-4'>
        <h4 className='font-medium text-gray-500'>Headers</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
        <ERPInput
          {...getFieldProps("heading1")}
          label="Header 1"
          placeholder="heading1"
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading1", data.heading1)}
          
        />
          <ERPInput
          {...getFieldProps("heading2")}
          label="Header 2"
          placeholder="heading2"
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading2", data.heading2)}
        />
          <ERPInput
          {...getFieldProps("heading3")}
          label="Header 3"
          placeholder="heading3"
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading3", data.heading3)}
        />
          <ERPInput
          {...getFieldProps("heading4")}
          label="Header 4"
          placeholder="heading4"
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading4", data.heading4)}
        />
          <ERPInput
          {...getFieldProps("heading5")}
          label="Header 5"
          placeholder="heading5"
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading5", data.heading5)}
        />
          <ERPInput
          {...getFieldProps("heading6")}
          label="Header 6"
          placeholder="heading6"
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading6", data.heading6)}
        />
          <ERPInput
          {...getFieldProps("heading7")}
          label="Header 7/Report1"
          placeholder="heading7"
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading7", data.heading7)}
        />
          <ERPInput
          {...getFieldProps("heading8")}
          label="Header 8/Report2"
          placeholder="header 8 "
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading8", data.heading8)}
        />
          <ERPInput
          {...getFieldProps("heading9")}
          label="Header  9/Report3"
          placeholder="heading9"
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading9", data.heading9)}
        />
          <ERPInput
          {...getFieldProps("heading10")}
          label="Header 10/Barcode Title"
          placeholder="heading10"
          required={false}
          onChangeData={(data: any) => handleFieldChange("heading10", data.heading10)}
        />
        </div>
    </div>
        <div className='flex flex-col gap-4'>
        <h4 className='font-medium text-gray-500'>Footer</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
        <ERPInput
          {...getFieldProps("footer1")}
          label="Footer 1"
          placeholder="footer1"
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer1", data.footer1)}
        />
         <ERPInput
          {...getFieldProps("footer2")}
          label="Footer 2"
          placeholder="footer2"
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer2", data.footer2)}
        />
         <ERPInput
          {...getFieldProps("footer3")}
          label="Footer 3"
          placeholder="footer3"
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer3", data.footer3)}
        />
         <ERPInput
          {...getFieldProps("footer4")}
          label="Footer 4"
          placeholder="footer4"
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer4", data.footer4)}
        />
         <ERPInput
          {...getFieldProps("footer5")}
          label="Footer 5"
          placeholder="footer5"
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer5", data.footer5)}
        />
         <ERPInput
          {...getFieldProps("footer6")}
          label="Footer 6"
          placeholder="footer6"
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer6", data.footer6)}
        />
         <ERPInput
          {...getFieldProps("footer7")}
          label="Footer 7"
          placeholder="footer7"
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer7", data.footer7)}
        />
         <ERPInput
          {...getFieldProps("footer8")}
          label="Footer 8"
          placeholder="footer8"
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer8", data.footer8)}
        />
         <ERPInput
          {...getFieldProps("footer9")}
          label="Footer 9"
          placeholder="footer9"
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer9", data.footer9)}
        />
         <ERPInput
          {...getFieldProps("footer10")}
          label="Footer 10"
          placeholder="footer10"
          required={false}
          onChangeData={(data: any) => handleFieldChange("footer10", data.footer10)}
        />
        </div>
      </div>
    </div> 
        <ERPFormButtons
          isEdit={isEdit}
          title="Save"
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={onClose}
          onClear={handleClear}
        />
      </div>
    );
  });

export default HeadersAndFooters
