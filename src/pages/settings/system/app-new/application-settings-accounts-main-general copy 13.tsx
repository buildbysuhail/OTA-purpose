import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { useApplicationSetting } from "../../../../utilities/hooks/use-application-settings";
const {settings, handleFieldChange, filterComponent, filterText } = useApplicationSetting();
const filterableComponents = [
  {
    condition: filterComponent([t("allow_privilege_card")], filterText),
    element: (
     
    ),
  },
];