import { FC, Fragment, useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { handleResponse } from '../../utilities/HandleResponse';
import Urls from '../../redux/urls';
import { APIClient } from '../../helpers/api-client';
import { DataGridRef } from 'devextreme-react/cjs/data-grid';
import { postAction } from '../../redux/slices/app-thunks';
import ERPButton from '../../components/ERPComponents/erp-button';
import InviteModal from './invite-modal';
 // Import the new component
import { useTranslation } from 'react-i18next';
import MembersDataGrid from './members-dataGrid';
import dxDataGrid from 'devextreme/ui/data_grid';


interface WorkspaceSettingsMembersProps {}

const WorkspaceSettingsMembers: FC<WorkspaceSettingsMembersProps> = (props) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const dataGridRef = useRef<DataGridRef>(null);
  const dispatch = useDispatch();
  const { t } = useTranslation('main');

  const handleInviteClick = useCallback(() => {
    setIsInviteModalOpen(true);
  }, []);

  const handleModalClose = () => {
    setIsInviteModalOpen(false);
  };

  // const handleInviteSuccess = () => {
  //   if (dataGridRef.current) {
  //     const instance = dataGridRef.current.instance;
  //     instance?.refresh();
  //   }
  // };

  const handleInviteSuccess = () => {
    if (dataGridRef.current) {
      const instance = (dataGridRef.current as any).instance as dxDataGrid;
      console.log('Refreshing DataGrid');
      instance?.refresh();
    }
  };
  const api = new APIClient();
  const [password, setPassword] = useState<string>('');

  const resetPassword = async () => {
    const response = await dispatch(
      postAction({
        apiUrl: Urls.updatePassword,
        data: { password: password },
      }) as any
    ).unwrap();
    handleResponse(response, () => {
      setPassword('');
    });
  };

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header  justify-between">
              <div className="box-title">
                {t('members')}
                <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                  {t('workspace_members_management')}
                </p>
              </div>
              <div>
                <ERPButton
                  title={t('invite')}
                  variant="primary"
                  className="ml-auto"
                  onClick={handleInviteClick}
                />
              </div>
            </div>
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <MembersDataGrid ref={dataGridRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={handleModalClose}
        onSuccess={handleInviteSuccess}
      />
    </Fragment>
  );
};

export default WorkspaceSettingsMembers;