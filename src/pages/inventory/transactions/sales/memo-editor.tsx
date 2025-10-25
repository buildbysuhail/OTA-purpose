import React, { useEffect, useState } from 'react';
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPTextArea from "../../../../components/ERPComponents/erp-textarea";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { formStateHandleFieldChangeKeysOnly } from '../reducer';

interface MemoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowIndex: number;
  t: (key: string) => string;
  data: string
}

const MemoEditorModal: React.FC<MemoEditorModalProps> = ({ isOpen, onClose, t, rowIndex, data }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const [memoText, setMemoText] = useState<string>("");

  useEffect(() => {
    if (formState.memoEditor.visible && formState.memoEditor.data != "") {
      const data = JSON.parse(formState.memoEditor.data);
      setMemoText(data.memo || "");
    }
  }, [formState.memoEditor]);

  const handleSet = () => {
    const slNo = formState.transaction.details[rowIndex].slNo;
    dispatch(
      formStateHandleFieldChangeKeysOnly({
        fields: {
          memoEditor: { visible: false, data: "", rowIndex: -1 },
          transaction: {
            details: [{ moreDetail: {memo: memoText}, slNo: slNo }]
          }
        },
        updateOnlyGivenDetailsColumns: true,
        rowIndex
      })
    );
  };

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("memo_editor")}
      width={600}
      height={400}
      content={
        <div className="w-full modal-content">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <ERPTextArea
                id="memo"
                label={t("memo")}
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                className="w-full h-64 text-sm"
                placeholder={t("enter_memo_here")}
              />
            </div>

            {/* Action Buttons */}
            <div className='flex items-center justify-end gap-2'>
              <ERPButton
                title={t('set')}
                onClick={handleSet}
                variant='primary'
              />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default MemoEditorModal;