import { Fragment, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";
import SpecialPrice from "./special-price";
import FOCScheme from "./foc-scheme";
import GiftOnBilling from "./gift-on-billing";
import QuantityLimit from "./quantity-limit";
import QuantitySlabOffer from "./qty-slab-offer";

const SchemeSettingsSpecial = () => {
  const { t } = useTranslation('inventory');
  const [activeTab, setActiveTab] = useState("specialPrice");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto">
                  <Tab
                    className="dark:text-dark-text"
                    label={t("special_price")}
                    value="specialPrice"
                  />
                  <Tab
                    className="dark:text-dark-text"
                    label={t("foc_scheme")}
                    value="focScheme"
                  />
                  <Tab
                    className="dark:text-dark-text"
                    label={t("gift_on_billing")}
                    value="giftOnBilling"
                  />
                  <Tab
                    className="dark:text-dark-text"
                    label={t("quantity_limit")}
                    value="quantityLimit"
                  />
                  <Tab
                    className="dark:text-dark-text"
                    label={t("qty_slab_offer")}
                    value="qtySlabOffer"
                  />
                </Tabs>
                <div className="pt-2">
                  {activeTab === "specialPrice" && (
                    <SpecialPrice />
                  )}

                  {activeTab === "focScheme" && (
                    <FOCScheme />
                  )}

                  {activeTab === "giftOnBilling" && (
                    <GiftOnBilling />
                  )}

                  {activeTab === "quantityLimit" && (
                    <QuantityLimit />
                  )}

                  {activeTab === "qtySlabOffer" && (
                    <QuantitySlabOffer />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SchemeSettingsSpecial;