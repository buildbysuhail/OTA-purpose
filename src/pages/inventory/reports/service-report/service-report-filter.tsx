import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import moment from "moment";
import Urls from "../../../../redux/urls";

const ServiceReportFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation('accountsReport')
    return (
        <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <ERPDateInput
                        label={t("from_date")}
                        {...getFieldProps("fromDate")}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
                    />
                    <ERPDateInput
                        label={t("to_date")}
                        {...getFieldProps("toDate")}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
                    />
                </div>
            </div>

            <div className="grid lg:grid-cols-2 md:grid-cols-1 items-center gap-4">
                <ERPDataCombobox
                    label={t("service")}
                    {...getFieldProps("serviceID")}
                    field={{
                        id: "serviceID",
                        getListUrl: Urls.data_services,
                        valueKey: "id",
                        labelKey: "name",
                    }}
                    onSelectItem={(data) => {
                        handleFieldChange("serviceID", data.value);
                    }}
                />

                <div className="flex flex-col">
                    <label className="mb-2 font-medium text-sm text-gray-700">{t("warranty_service")}</label>
                    <div className="flex items-center gap-4 p-2 border rounded-md">
                        <ERPRadio
                            id="yes"
                            name="isWarrantyService"
                            value="Yes"
                            label={t("yes")}
                            checked={formState.isWarrantyService === "Yes"}
                            onChange={(e) => handleFieldChange("isWarrantyService", e.target.value)}
                        />
                        <ERPRadio
                            id="no"
                            name="isWarrantyService"
                            value="No"
                            label={t("no")}
                            checked={formState.isWarrantyService === "No"}
                            onChange={(e) => handleFieldChange("isWarrantyService", e.target.value)}
                        />
                        <ERPRadio
                            id="both"
                            name="isWarrantyService"
                            value="Both"
                            label={t("both")}
                            checked={formState.isWarrantyService === "Both"}
                            onChange={(e) => handleFieldChange("isWarrantyService", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceReportFilter;
export const ServiceReportFilterInitialState = {
    fromDate: moment().local().toDate(),
    toDate: moment().local().toDate(),
    serviceID: 0,
    isWarrantyService: "",
};