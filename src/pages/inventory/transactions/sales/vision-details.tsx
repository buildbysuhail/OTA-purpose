import React, { useEffect, useState } from "react";
import { APIClient } from "../../../../helpers/api-client";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import DataGrid, {
  Column,
  Editing,
  KeyboardNavigation,
  Paging,
  RemoteOperations,
  Scrolling,
} from "devextreme-react/cjs/data-grid";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

interface visionDetailsProps {
  closeModal: () => void;
  t: any;
  formState: any;
}

const api = new APIClient();
const visionDetails: React.FC<visionDetailsProps> = ({
  closeModal,
  t,
  formState,
}) => {
  const applicationSettings = useSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const partyID = formState.ledgerData.partyID;
  const IsOptical =
    applicationSettings.mainSettings.maintainBusinessType === "Opticals"
      ? true
      : false;
  useEffect(() => {
    const loadVisionDetails = async () => {
      try {
        debugger;
        if (IsOptical) {
          const response = await api.getAsync( `${Urls.inv_transaction_base}${formState.transactionType}/SelectOpticsDetails/${partyID}`);

          if (!response || response.length === 0) {
            setVisionData(defaultVisionRows);
            return;
          }
          setRemarks(response[0].remarks ?? "");
          const mappedApiRows = response.map((row: any) => ({
            id: row.id,
            CType: row.cType?.trim(),
            RE_SPH: row.rE_SPH,
            RE_CYL: row.rE_CYL,
            RE_AXIS: row.rE_AXIS,
            RE_VN: row.rE_Vn,
            LE_SPH: row.lE_SPH,
            LE_CYL: row.lE_CYL,
            LE_AXIS: row.lE_AXIS,
            LE_VN: row.lE_Vn,
          }));

          const mergedRows = defaultVisionRows.map((defaultRow) => {
            const apiRow = mappedApiRows.find(
              (r: any) => r.CType === defaultRow.CType
            );
            return apiRow ? apiRow : defaultRow;
          });

          setVisionData(mergedRows);
        } else {
          const measurements = await api.getAsync(`${Urls.inv_transaction_base}${formState.transactionType}/Data/MeasurementChart`);

          if (!measurements || measurements.length === 0) {
            ERPAlert.show({
              title: t("measurements_not_found"),
              text: t("please_add_measurements"),
              icon: "info",
              showCancelButton: false,
            });
            closeModal();
            return;
          } else {
            const response = await api.getAsync(`${Urls.inv_transaction_base}${formState.transactionType}/SelectOpticsDetails/${partyID}`);
            if (!response || response.length === 0) {
              const measurementRows = measurements.map((row: any) => ({
                id: 0,
                CType: row.name,
                RE_SPH: "",
                RE_CYL: "",
                RE_AXIS: "",
                RE_VN: "",
                LE_SPH: "",
                LE_CYL: "",
                LE_AXIS: "",
                LE_VN: "",
              }));

              setVisionData(measurementRows);
              return;
            } else {
              setRemarks(response[0].remarks ?? "");
              const mappedApiRows = response.map((row: any) => ({
                id: row.id,
                CType: row.cType?.trim(),
                RE_SPH: row.rE_SPH,
                RE_CYL: row.rE_CYL,
                RE_AXIS: row.rE_AXIS,
                RE_VN: "",
                LE_SPH: "",
                LE_CYL: "",
                LE_AXIS: "",
                LE_VN: "",
              }));

              const mergedRows = defaultVisionRows.map((defaultRow, index) => {
                return mappedApiRows[index]
                  ? { ...defaultRow, ...mappedApiRows[index] }
                  : defaultRow;
              });

              setVisionData(mergedRows);
            }
          }
        }
      } catch (error) {
        console.error("Error loading vision details:", error);
        setVisionData(defaultVisionRows);
      }
    };

    loadVisionDetails();
  }, []);

  const gridColumns: DevGridColumn[] = [
    {
      dataField: "CType",
      caption: t("..."),
      width: 100,
    },
    {
      dataField: "RE_SPH",
      caption: IsOptical ? t("sph") : t("Inches"),
      width: IsOptical ? 50 : 140,
    },
    {
      dataField: "RE_CYL",
      caption: IsOptical ? t("cyl") : t("CM"),
      width: IsOptical ? 50 : 140,
    },
    {
      dataField: "RE_AXIS",
      caption: IsOptical ? t("axis") : t("MM"),
      width: IsOptical ? 50 : 140,
    },

    ...(IsOptical
      ? [
          {
            dataField: "RE_VN",
            caption: t("VN"),
            width: 50,
          },
          {
            dataField: "LE_SPH",
            caption: t("SPH"),
            width: 50,
          },
          {
            dataField: "LE_CYL",
            caption: t("CYL"),
            width: 50,
          },
          {
            dataField: "LE_AXIS",
            caption: t("Axis"),
            width: 50,
          },
          {
            dataField: "LE_VN",
            caption: t("VN"),
            width: 50,
          },
        ]
      : []),
  ];

  const defaultVisionRows = [
    {
      id: 0,
      CType: IsOptical ? "DV" : "",
      RE_SPH: "",
      RE_CYL: "",
      RE_AXIS: "",
      RE_VN: "",
      LE_SPH: "",
      LE_CYL: "",
      LE_AXIS: "",
      LE_VN: "",
    },
    {
      id: 0,
      CType: IsOptical ? "ADD" : "",
      RE_SPH: "",
      RE_CYL: "",
      RE_AXIS: "",
      RE_VN: "",
      LE_SPH: "",
      LE_CYL: "",
      LE_AXIS: "",
      LE_VN: "",
    },
    {
      id: 0,
      CType: IsOptical ? "CL" : "",
      RE_SPH: "",
      RE_CYL: "",
      RE_AXIS: "",
      RE_VN: "",
      LE_SPH: "",
      LE_CYL: "",
      LE_AXIS: "",
      LE_VN: "",
    },
  ];

  const [visionData, setVisionData] = useState(defaultVisionRows);
  const [remark, setRemarks] = useState("");
  const handleEditorPreparing = (e: any) => {
    if (e.parentType === "dataRow") {
      const originalOnValueChanged = e.editorOptions.onValueChanged;

      e.editorOptions.onValueChanged = (args: any) => {
        const field = e.dataField;
        const row = e.row.data;

        setVisionData((prev: any[]) =>
          prev.map((r) =>
            r.CType === row.CType ? { ...r, [field]: args.value } : r
          )
        );

        if (originalOnValueChanged) {
          originalOnValueChanged(args);
        }
      };
    }
  };

  const handleSaveClick = async () => {
    try {
      const payload = visionData.map((row: any) => ({
        id: row.id ?? 0,
        branchID: formState.transaction.master.branchID ?? 1,
        partyID: partyID,
        cType: row.CType,
        rE_SPH: row.RE_SPH,
        rE_CYL: row.RE_CYL,
        rE_AXIS: row.RE_AXIS,
        rE_Vn: row.RE_VN,
        lE_SPH: row.LE_SPH,
        lE_CYL: row.LE_CYL,
        lE_AXIS: row.LE_AXIS,
        lE_Vn: row.LE_VN,
        remarks: remark ?? "",
      }));

      const response = await api.postAsync(
        `${Urls.inv_transaction_base}${formState.transactionType}/UpsertOpticsdetails`,
        payload
      );
      if (response.isOk === true) {
        ERPAlert.show({
          title: t("details_added_successfully"),
          text: t(""),
          icon: "success",
          showCancelButton: false,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex items-end gap-2 justify-center font-bold text-md">
        {formState.transaction.master.partyName}
      </div>
      {IsOptical && (
        <div className="flex items-end justify-around font-semibold text-lg text-blue-800">
          <div>{t("RE")}</div>
          <div>{t("LE")}</div>
        </div>
      )}

      <div className="mt-2">
        <DataGrid
          keyExpr="CType"
          dataSource={visionData}
          showBorders={true}
          columnAutoWidth={true}
          rowAlternationEnabled={true}
          repaintChangesOnly={true}
          height={280}
          onEditorPreparing={handleEditorPreparing}
        >
          <Editing
            mode="cell"
            allowUpdating={true}
            allowAdding={false}
            selectTextOnEditStart={true}
          />

          <KeyboardNavigation
            editOnKeyPress={true}
            enterKeyAction="moveFocus"
            enterKeyDirection="row"
          />

          {gridColumns.map((col) => (
            <Column
              key={col.dataField}
              dataField={col.dataField}
              caption={col.caption}
              dataType={col.dataType}
              width={col.width}
              allowEditing={col.dataField !== "CType"}
            />
          ))}

          <Paging pageSize={100} />
          <Scrolling mode="standard" useNative={true} showScrollbar="always" />
          <RemoteOperations filtering={false} sorting={false} paging={false} />
        </DataGrid>
      </div>
      <div className="flex justify-center items-center gap-3">
        <ERPInput
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="remarks"
          label={t("Remarks")}
          type="text"
          className="p-2 w-96 !mb-4"
          placeholder={t("enter_remarks")}
          value={remark}
          onChange={(e: any) => setRemarks(e.target.value)}
        />

        <ERPButton
          title={t("Save")}
          variant="primary"
          onClick={() => handleSaveClick()}
        />
      </div>
    </>
  );
};

export default visionDetails;
