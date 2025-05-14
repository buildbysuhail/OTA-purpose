import { Fragment, useEffect, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";
import SpecialPrice from "./special-price";
import FOCScheme from "./foc-scheme";
import GiftOnBilling from "./gift-on-billing";
import QuantityLimit from "./quantity-limit";
import QuantitySlabOffer from "./qty-slab-offer";
import MultiFOCScheme from "./multi-foc-scheme";
import { RootState } from "../../../../redux/store";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";

const SchemeSettingsSpecial = () => {
  const { t } = useTranslation("inventory");
  const [activeTab, setActiveTab] = useState("specialPrice");

  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };
  const availableTabs = clientSession.isAppGlobal
    ? [
        "specialPrice",
        "focScheme",
        "multiFOCScheme",
        "giftOnBilling",
        "quantityLimit",
        "qtySlabOffer",
      ]
    : ["specialPrice", "focScheme"];

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab("specialPrice");
    }
  }, [clientSession.isAppGlobal]);
  const tabConfig = [
    { label: t("special_price"), value: "specialPrice" },
    { label: t("foc_scheme"), value: "focScheme" },
    ...(clientSession.isAppGlobal
      ? [
          { label: t("multi_foc_scheme"), value: "multiFOCScheme" },
          { label: t("gift_on_billing"), value: "giftOnBilling" },
          { label: t("quantity_limit"), value: "quantityLimit" },
          { label: t("qty_slab_offer"), value: "qtySlabOffer" },
        ]
      : []),
  ];
  const renderTabContent = () => {
    switch (activeTab) {
      case "specialPrice":
        return <SpecialPrice />;
      case "focScheme":
        return <FOCScheme />;
      case "multiFOCScheme":
        return <MultiFOCScheme />;
      case "giftOnBilling":
        return <GiftOnBilling />;
      case "quantityLimit":
        return <QuantityLimit />;
      case "qtySlabOffer":
        return <QuantitySlabOffer />;
      default:
        return null;
    }
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
                  scrollButtons="auto"
                >
                  {tabConfig.map((tab) => (
                    <Tab
                      key={tab.value}
                      className="dark:text-dark-text"
                      label={tab.label}
                      value={tab.value}
                    />
                  ))}
                </Tabs>
                <div className="pt-2">{renderTabContent()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SchemeSettingsSpecial;
