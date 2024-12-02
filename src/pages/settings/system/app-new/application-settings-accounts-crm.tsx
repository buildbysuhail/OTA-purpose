import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { useApplicationSetting } from "../../../../utilities/hooks/use-application-settings";
const { settings, handleFieldChange, filterComponent, filterText } = useApplicationSetting();
const filterableComponents = [
  {
    condition: filterComponent([t("allow_privilege_card")], filterText),
    element: (
      <div className="flex items-center">
        <ERPCheckbox
          id="allowPrivilegeCard"
          label={t("allow_privilege_card")}
          data={settings?.mainSettings}
          checked={settings?.mainSettings?.allowPrivilegeCard}
          onChangeData={(data) =>
            handleFieldChange("mainSettings", "allowPrivilegeCard", data.allowPrivilegeCard)
          }
        />
        <ERPInput
          id="previlegeCardPerc"
          label=" "
          type="number"
          data={settings?.mainSettings}
          className="w-20 ml-6 mt-1"
          value={settings?.mainSettings?.previlegeCardPerc}
          disabled={!settings?.mainSettings?.allowPrivilegeCard}
          onChangeData={(data) =>
            handleFieldChange("mainSettings", "previlegeCardPerc", data.previlegeCardPerc)
          }
        />
        <label className="ml-2 mr-2 block form-check-label text-gray-700">%</label>
      </div>
    ),
  },
  {
    condition: filterComponent([t("redeem_points_(separated_by_comma)")], filterText),
    element: (
      <ERPInput
        id="redeeemValuesSeperatedByComma"
        value={settings?.inventorySettings?.redeeemValuesSeperatedByComma}
        data={settings?.inventorySettings}
        label={t("redeem_points_(separated_by_comma)")}
        placeholder={t("enter_redeem_points")}
        onChangeData={(data: any) =>
          handleFieldChange("inventorySettings", "redeeemValuesSeperatedByComma", data.redeeemValuesSeperatedByComma)
        }
      />
    ),
  },
  {
    condition: filterComponent([t("use_product_images")], filterText),
    element: (
      <ERPCheckbox
        id="useProductImages"
        label={t("use_product_images")}
        data={settings?.productsSettings}
        checked={settings?.productsSettings?.useProductImages}
        onChangeData={(data) =>
          handleFieldChange("productsSettings", "useProductImages", data.useProductImages)
        }
      />
    ),
  },
  {
    condition: filterComponent([t("set_gift_shared_path")], filterText),
    element: (
      <ERPInput
        id="productImagePath"
        value={settings?.productsSettings?.productImagePath}
        data={settings?.productsSettings}
        label={t("set_gift_shared_path")}
        type="text"
        placeholder={t("set_gift_shared_path")}
        onChangeData={(data) =>
          handleFieldChange("productsSettings", "productImagePath", data.productImagePath)
        }
      />
    ),
  },
];