import React, { forwardRef, useState, useEffect, useCallback, useMemo } from 'react';
import { DataGrid, DataGridRef, Toolbar, Item, Paging, SearchPanel, FilterRow, Column } from 'devextreme-react/cjs/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import WorkspaceSettingsApis from './workspace-settings-apis';
import ErpAvatar from '../../components/ERPComponents/erp-avatar';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

const MembersDataGrid = React.memo(forwardRef<DataGridRef>((props, ref) => {
  const [gridHeight, setGridHeight] = useState<number>(500);
  const { t } = useTranslation('main');

  // Set grid height based on window size
  useEffect(() => {
    const wh = window.innerHeight;
    const gridHeight = wh - 180;
    setGridHeight(gridHeight);
  }, []);

  // Memoize the CustomStore to ensure it’s not recreated unnecessarily
  const store = useMemo(() => new CustomStore({
    key: 'userName',
    async load(loadOptions: any) {
      const paramNames = ['skip', 'take', 'requireTotalCount', 'sort', 'filter'];
      const queryString = paramNames
        .filter((paramName) => loadOptions[paramName] !== undefined && loadOptions[paramName] !== null && loadOptions[paramName] !== '')
        .map((paramName) => `${paramName}=${JSON.stringify(loadOptions[paramName])}`)
        .join('&');

      try {
        const response = await WorkspaceSettingsApis.getMembers('');
        const result = response;
        return result !== undefined && result != null
          ? {
              data: result.data,
              totalCount: result.totalCount,
            }
          : {
              data: [],
              totalCount: 0,
              summary: {},
              groupCount: 0,
            };
      } catch (err) {
        throw new Error('Data Loading Error');
      }
    },
  }), []);

  // Memoize the onRowPrepared function to maintain a stable reference
  const onRowPrepared = useCallback((e:any) => {
    if (e.rowType === 'data' && e.data.isActive) {
      e.rowElement.style.backgroundColor = '#90ee90';
    }
  }, []);

  return (
    <DataGrid
      ref={ref}
      height={gridHeight}
      dataSource={store}
      remoteOperations={{ filtering: true, paging: true, sorting: true }}
      showBorders={true}
      showColumnLines={true}
      showRowLines={true}
      onRowPrepared={onRowPrepared}
    >
      <Toolbar>
        <Item location="before">
          <div className="informer">
            <div className="count">{121}</div>
            <span>{t('total_count')}</span>
          </div>
        </Item>
        <Item name="searchPanel" location="after" />
        <Item name="columnChooserButton" />
      </Toolbar>
      <Paging defaultPageSize={100} />
      <SearchPanel visible={true} width={240} placeholder={t('search...')} />
      <FilterRow visible={true} applyFilter="auto" />
      <Column
        allowSearch={true}
        minWidth={250}
        allowFiltering={true}
        dataField="displayName"
        caption={t('name')}
        dataType="string"
        cellRender={({ data }) => (
          <div className="sm:flex items-start items-center">
            <div>
              <span className="avatar avatar-md avatar-rounded">
                <ErpAvatar
                  alt={data.displayName}
                  src={typeof data.UserImage === 'string' ? data.userImage : '#'}
                  sx={{ width: 40, height: 40 }}
                />
              </span>
            </div>
            <div className="flex-grow p-2">
              <div className="flex items-center !justify-between">
                <h6 className="mb-1 text-[1rem]">{data.displayName}</h6>
              </div>
            </div>
          </div>
        )}
      />
      <Column
        dataField="email"
        caption="Email"
        dataType="string"
        allowSearch={true}
        allowFiltering={true}
        cellRender={({ data }) => (
          <div className="flex items-center gap-2">
            {data.isEmailVerified ? (
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#3057d8] ring-2">
                <Check className="w-2 h-2 text-[#ffffff]" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 ring-2 ring-gray-300 hover:scale-110 transition-transform"></div>
            )}
            <span className="font-medium">{data.email}</span>
          </div>
        )}
      />
      <Column
        dataField="phoneNumber"
        caption="Phone"
        dataType="string"
        allowSearch={true}
        allowFiltering={true}
        cellRender={({ data }) => (
          <div className="flex items-center gap-2">
            {data.isPhoneVerified ? (
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#3057d8] ring-2">
                <Check className="w-2 h-2 text-[#ffffff]" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 ring-2 ring-gray-300 hover:scale-110 transition-transform"></div>
            )}
            <span className="font-medium">{data.phoneNumber}</span>
          </div>
        )}
      />
      <Column
        width={100}
        dataField="active"
        caption={t('status')}
        cellRender={({ data }) =>
          data.active === true ? (
            <span className="badge bg-success" id="status">{t('active')}</span>
          ) : (
            <span className="badge bg-danger" id="status">{t('inactive')}</span>
          )
        }
        dataType="boolean"
      />
      {/* Add your Action column here if needed */}
    </DataGrid>
  );
}));

export default MembersDataGrid;