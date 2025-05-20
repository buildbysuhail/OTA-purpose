import React, { FC, Fragment, useEffect, useMemo, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import store, { RootState } from "../../../redux/store";
import logo1 from "../../../assets/images/brand-logos/logo_dark.png";
import logo2 from "../../../assets/images/brand-logos/mini_logo.png";
import logo3 from "../../../assets/images/brand-logos/desktop-dark.png";
import logo4 from "../../../assets/images/brand-logos/toggle-dark.png";
import logo5 from "../../../assets/images/brand-logos/desktop-dark.png";
import logo6 from "../../../assets/images/brand-logos/toggle-white.png";
import SimpleBar from "simplebar-react";
import Menuloop from "../../ui/menuloop";
import { useAppState } from "../../../utilities/hooks/useAppState";
import { MENUITEMS } from "./sidemenu/sidemenu";
import { AccountSettingsMenuItems } from "./sidemenu/account-settings";
import { WorkspaceSettingsMenuItems } from "./sidemenu/workspace-settings";
import { SettingsMenuItems } from "./sidemenu/settings";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import ErpAvatar from "../../ERPComponents/erp-avatar";
import { useTranslation } from "react-i18next";
import { ReportsMenuItems } from "./sidemenu/reports-routes";
import { Countries } from "../../../redux/slices/user-session/reducer";
import ItemTableDesigner from "../../../pages/InvoiceDesigner/Designer/ItemTableDesigner";
import { UserAction, useUserRights } from "../../../helpers/user-right-helper";
import { exludedRoutes } from "../content/transaction-routes";
import profile from "../../../assets/images/faces/profile-circle.512x512.png";
import { ArrowBigLeftDash } from "lucide-react";

interface SidebarProps {
  type:
    | "erp"
    | "account-settings"
    | "workspace-settings"
    | "settings"
    | "reports";
}

const Sidebar: FC<SidebarProps> = React.memo(({ type }) => {
  let userSession = useAppSelector((state: RootState) => state.UserSession);
  let clientSession = useAppSelector((state: RootState) => state.ClientSession);
  let applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const { getAllowedFormCodes } = useUserRights();
  const [menuitems, setMenuitems] = useState<any>(() => {
    switch (type) {
      case "erp":
        return MENUITEMS;
      case "account-settings":
        return AccountSettingsMenuItems;
      case "workspace-settings":
        return WorkspaceSettingsMenuItems;
      case "settings":
        return SettingsMenuItems;
      case "reports":
        return ReportsMenuItems;
      default:
        return []; // or some default menu items
    }
  });
  useEffect(() => {
    if (type == "settings") {
      let st = menuitems;
      if (userSession.userTypeCode == "BA") {
        st = st.filter((x: any) => x.title != "branches");
      }

      if (userSession.userTypeCode == "BA") {
        st = st.filter((x: any) => x.title != "branch_info");
      }
      const sd = st.map((x: any) =>
        x.children?.map((item: any) => {
          item.visible = true;
          item.disabled = false;
          if (item.title === "refresh_all_branches") {
            if (
              userSession.userTypeCode !== "CA" &&
              applicationSettings?.miscellaneousSettings
                ?.maintainAllBranchWithCommonInventory != true
            ) {
              item.disabled = true;
            }
          }

          if (
            item.title === "company_profile_india" &&
            userSession.countryId != Countries.India
          ) {
            item.visible = false;
          }

          if (
            item.title === "hide_account_ledger" &&
            userSession.countryId == Countries.India
          ) {
            item.visible = false;
          }
          if (
            item.title === "company_profile_others" &&
            userSession.countryId == Countries.India
          ) {
            item.visible = false;
          }
          if (item.title === "upi" || item.title === "qr_pay") {
          }
          if (
            item.title === "upi" &&
            userSession.countryId != Countries.India
          ) {
            item.visible = false;
          }
          if (
            item.title === "qr_pay" &&
            userSession.countryId == Countries.India
          ) {
            item.visible = false;
          }

          if (
            exludedRoutes.find(
              (route) =>
                route.countries.find((x) => x == userSession.countryId) !=
                undefined
            )
          ) {
          }
          if (
            exludedRoutes.find(
              (route) =>
                route.title === item.title &&
                route.countries.find((x) => x == userSession.countryId) !=
                  undefined
            )
          ) {
            item.visible = false;
          }
        })
      );
      setMenuitems(st);
    } else if (type == "reports") {
      debugger;
      let st = menuitems;
      if (clientSession.isAppGlobal) {
        const excluded = [
          "purchase_tax_report_detailed",
          "purchase_tax_report_summary",
          "sales_tax_report_summary",
          "sales_tax_report_detailed",
          "purchase_tax",
          "sales_tax",
          "vat_return_form",
          "vat_return_form_arabic",
          "ksa_e_invoice_summary",
          "ksa_e_invoice_detailed",

        
        
        ];
        st = st
          .filter((parent: any) => !excluded.includes(parent.title))
          .map((parent: any) => {
            const filteredChildren = parent.children?.filter(
              (child: any) => !excluded.includes(child.title)
            );
            return {
              ...parent,
              children: filteredChildren,
            };
          })
          .filter((parent: any) => parent.children?.length > 0);
      } else {
        const excluded = ["purchase_estimate_register_report",
          "purchase_return_estimate_register_report",
          "purchase_return_estimate_summary_report",

          "purchase_gst_daily_summary_report",
           "purchase_gst_taxwise_report",
          "purchase_gst_taxwise_with_hsn_report",
          "purchase_gst_monthly_summary_report",
          "purchase_gst_detailed_report",
          "purchase_gst_register_format_report",
          "purchase_gst_advance_register_format_report",
          
          "purchase_return_gst_daily_summary_report",
          "purchase_return_gst_sales_and_return_report",
          "purchase_return_gst_taxwise_report",
          "purchase_return_gst_taxwise_with_hsn_report",
          "purchase_return_gst_monthly_summary_report",
          "purchase_return_gst_detailed_report",
          "purchase_return_gst_register_format_report",
          "purchase_return_gst_adv_register_format_report",
          "itemwise_purchase_return_estimate_summary",


          "gstr1_b2b",
          "gstr1_b2cLarge",
          "gstr1b2c_Small",
          "gstr1_cdnr",
          "gstr1_cdnur",
          "gstr1_summary_of_hsn",
          "gstr1_docs",
          "gstr3b",

          "sales_transfer_summary",
          "sales_transfer_register",
          "net_sales_transfer_report",
          "sales_transfer_partyWise_sales",
          "sales_transfer_monthWise_summary",
          "sales_transfer_partyWise_summary",
     
        ];
        st = st
          .filter((parent: any) => !excluded.includes(parent.title))
          .map((parent: any) => {
            const filteredChildren = parent.children?.filter(
              (child: any) => !excluded.includes(child.title)
            );
            return {
              ...parent,
              children: filteredChildren,
            };
          })
          .filter((parent: any) => parent.children?.length > 0);
      }

      setMenuitems(st);
    } else if (type == "erp") {
      let st: [] = [];

      st = menuitems;

      const allowedFormCodes = getAllowedFormCodes(
        menuitems.flatMap((item: any) =>
          item.children
            ? item.children
                .filter((child: any) => child.rights !== undefined)
                .map((child: any) => child.rights)
            : []
        ),
        UserAction.Show
      );

      const sd = st.map((x: any) =>
        x.children?.map((item: any) => {
          item.visible = true;
          item.disabled = false;

          if (!allowedFormCodes.find((x) => x == item.rights)) {
            item.visible = false;
          }
          if (
            exludedRoutes.find(
              (route) =>
                route.title === item.title &&
                route.countries.find((x) => x == userSession.countryId) !=
                  undefined
            )
          ) {
            item.visible = false;
          }
        })
      );
      setMenuitems(st);
    }
  }, [userSession.userTypeCode, MENUITEMS, SettingsMenuItems]);
  const { t } = useTranslation();
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const { appState, updateAppState } = useAppState();

  const local_varaiable = appState;

  function closeMenuFn() {
    const closeMenuRecursively = (items: any) => {
      items?.forEach((item: any) => {
        item.active = false;
        closeMenuRecursively(item.children);
      });
    };
    closeMenuRecursively(menuitems);
    setMenuitems((arr: any) => [...arr]);
  }

  useEffect(() => {
    window.addEventListener("resize", menuResizeFn);
    // window.addEventListener('resize', checkHoriMenu);
    const mainContent = document.querySelector(".main-content");
    if (window.innerWidth <= 992) {
      if (mainContent) {
        const theme = store.getState();
        updateAppState({ ...theme.AppState.appState, toggled: "close" });
      } else if (
        document.documentElement.getAttribute("data-nav-layout") == "horizontal"
      ) {
        // closeMenu();
      }
    }
    mainContent!.addEventListener("click", menuClose);
    return () => {
      window.removeEventListener("resize", menuResizeFn);
      // window.removeEventListener('resize', checkHoriMenu);
    };
  }, []);

  // const location = useLocation();
  const location = useLocation();
  const navigate = useNavigate();

  const avatarStyle = useMemo(() => {
    return { width: 40, height: 40 };
  }, []);

  function Onhover() {
    const theme = appState;
    if (
      (theme.toggled == "icon-overlay-close" ||
        theme.toggled == "detached-close") &&
      theme.iconOverlay != "open"
    ) {
      updateAppState({ ...theme, iconOverlay: "open" });
    }
  }

  function Outhover() {
    const theme = appState;
    if (
      (theme.toggled == "icon-overlay-close" ||
        theme.toggled == "detached-close") &&
      theme.iconOverlay == "open"
    ) {
      updateAppState({ ...theme, iconOverlay: "" });
    }
  }

  function menuClose() {
    const theme = appState;
    if (window.innerWidth <= 992) {
      updateAppState({ ...theme, toggled: "close" });
    }
    const overlayElement = document.querySelector(
      "#responsive-overlay"
    ) as HTMLElement | null;
    if (overlayElement) {
      overlayElement.classList.remove("active");
    }
    if (
      theme.dataNavLayout == "horizontal" ||
      theme.dataNavStyle == "menu-click" ||
      theme.dataNavStyle == "icon-click"
    ) {
      closeMenuFn();
    }
  }

  const WindowPreSize =
    typeof window !== "undefined" ? [window.innerWidth] : [];

  const menuResizeFn = () => {
    debugger;
    if (typeof window === "undefined") {
      // Handle the case where window is not available (server-side rendering)
      return;
    }

    WindowPreSize.push(window.innerWidth);
    if (WindowPreSize.length > 2) {
      WindowPreSize.shift();
    }

    const theme = store.getState();
    const currentWidth = WindowPreSize[WindowPreSize.length - 1];
    const prevWidth = WindowPreSize[WindowPreSize.length - 2];
    debugger;

    if (WindowPreSize.length > 1) {
      if (currentWidth < 992 && prevWidth >= 992) {
        // less than 992;
        updateAppState({ ...theme.AppState.appState, toggled: "close" });
        // ThemeChanger({ ...theme, dataToggled: "close" });
      }

      if (currentWidth >= 992 && prevWidth < 992) {
        // greater than 992
        // ThemeChanger({ ...theme, dataToggled: theme.dataVerticalStyle === "doublemenu" ? "double-menu-open" : "" });
        updateAppState({
          ...theme.AppState.appState,
          toggled:
            theme.AppState.appState.dataVerticalStyle == "doublemenu"
              ? "double-menu-open"
              : "",
        });
      }
    }
  };

  function switcherArrowFn(): void {
    // Used to remove is-expanded class and remove class on clicking arrow buttons
    function slideClick(): void {
      const slide = document.querySelectorAll<HTMLElement>(".slide");
      const slideMenu = document.querySelectorAll<HTMLElement>(".slide-menu");

      slide.forEach((element) => {
        if (element.classList.contains("is-expanded")) {
          element.classList.remove("is-expanded");
        }
      });

      slideMenu.forEach((element) => {
        if (element.classList.contains("open")) {
          element.classList.remove("open");
          element.style.display = "none";
        }
      });
    }

    slideClick();
  }

  function slideRight(): void {
    const menuNav = document.querySelector<HTMLElement>(".main-menu");
    const mainContainer1 = document.querySelector<HTMLElement>(".main-sidebar");

    if (menuNav && mainContainer1) {
      const marginLeftValue = Math.ceil(
        Number(
          window.getComputedStyle(menuNav).marginInlineStart.split("px")[0]
        )
      );
      const marginRightValue = Math.ceil(
        Number(window.getComputedStyle(menuNav).marginInlineEnd.split("px")[0])
      );
      const check = menuNav.scrollWidth - mainContainer1.offsetWidth;
      let mainContainer1Width = mainContainer1.offsetWidth;

      if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
        if (!(local_varaiable?.dir === "rtl")) {
          if (Math.abs(check) > Math.abs(marginLeftValue)) {
            menuNav.style.marginInlineEnd = "0";

            if (
              !(
                Math.abs(check) >
                Math.abs(marginLeftValue) + mainContainer1Width
              )
            ) {
              mainContainer1Width = Math.abs(check) - Math.abs(marginLeftValue);
              const slideRightButton =
                document.querySelector<HTMLElement>("#slide-right");
              if (slideRightButton) {
                slideRightButton.classList.add("hidden");
              }
            }

            menuNav.style.marginInlineStart =
              Number(menuNav.style.marginInlineStart.split("px")[0]) -
              Math.abs(mainContainer1Width) +
              "px";

            const slideRightButton =
              document.querySelector<HTMLElement>("#slide-right");
            if (slideRightButton) {
              slideRightButton.classList.remove("hidden");
            }
          }
        } else {
          if (Math.abs(check) > Math.abs(marginRightValue)) {
            menuNav.style.marginInlineEnd = "0";

            if (
              !(
                Math.abs(check) >
                Math.abs(marginRightValue) + mainContainer1Width
              )
            ) {
              mainContainer1Width =
                Math.abs(check) - Math.abs(marginRightValue);
              const slideRightButton =
                document.querySelector<HTMLElement>("#slide-right");
              if (slideRightButton) {
                slideRightButton.classList.add("hidden");
              }
            }

            menuNav.style.marginInlineStart =
              Number(menuNav.style.marginInlineStart.split("px")[0]) -
              Math.abs(mainContainer1Width) +
              "px";

            const slideLeftButton =
              document.querySelector<HTMLElement>("#slide-left");
            if (slideLeftButton) {
              slideLeftButton.classList.remove("hidden");
            }
          }
        }
      }

      const element = document.querySelector<HTMLElement>(
        ".main-menu > .slide.open"
      );
      const element1 = document.querySelector<HTMLElement>(
        ".main-menu > .slide.open > ul"
      );
      if (element) {
        element.classList.remove("active");
      }
      if (element1) {
        element1.style.display = "none";
      }
    }

    switcherArrowFn();
  }

  function slideLeft(): void {
    const menuNav = document.querySelector<HTMLElement>(".main-menu");
    const mainContainer1 = document.querySelector<HTMLElement>(".main-sidebar");

    if (menuNav && mainContainer1) {
      const marginLeftValue = Math.ceil(
        Number(
          window.getComputedStyle(menuNav).marginInlineStart.split("px")[0]
        )
      );
      const marginRightValue = Math.ceil(
        Number(window.getComputedStyle(menuNav).marginInlineEnd.split("px")[0])
      );
      const check = menuNav.scrollWidth - mainContainer1.offsetWidth;
      let mainContainer1Width = mainContainer1.offsetWidth;

      if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
        if (!(local_varaiable?.dir === "rtl")) {
          if (Math.abs(check) <= Math.abs(marginLeftValue)) {
            menuNav.style.marginInlineStart = "0px";
          }
        } else {
          if (Math.abs(check) > Math.abs(marginRightValue)) {
            menuNav.style.marginInlineStart = "0";

            if (
              !(
                Math.abs(check) >
                Math.abs(marginRightValue) + mainContainer1Width
              )
            ) {
              mainContainer1Width =
                Math.abs(check) - Math.abs(marginRightValue);
              const slideRightButton =
                document.querySelector<HTMLElement>("#slide-right");
              if (slideRightButton) {
                slideRightButton.classList.add("hidden");
              }
            }

            menuNav.style.marginInlineStart =
              Number(menuNav.style.marginInlineStart.split("px")[0]) -
              Math.abs(mainContainer1Width) +
              "px";

            const slideLeftButton =
              document.querySelector<HTMLElement>("#slide-left");
            if (slideLeftButton) {
              slideLeftButton.classList.remove("hidden");
            }
          }
        }
      }

      const element = document.querySelector<HTMLElement>(
        ".main-menu > .slide.open"
      );
      const element1 = document.querySelector<HTMLElement>(
        ".main-menu > .slide.open > ul"
      );
      if (element) {
        element.classList.remove("active");
      }
      if (element1) {
        element1.style.display = "none";
      }
    }

    switcherArrowFn();
  }

  const Topup = () => {
    if (window.scrollY > 30 && document.querySelector(".app-sidebar")) {
      const Scolls = document.querySelectorAll(".app-sidebar");
      Scolls.forEach((e) => {
        e.classList.add("sticky-pin");
      });
    } else {
      const Scolls = document.querySelectorAll(".app-sidebar");
      Scolls.forEach((e) => {
        e.classList.remove("sticky-pin");
      });
    }
  };
  window.addEventListener("scroll", Topup);

  const level = 0;
  let hasParent = false;
  let hasParentLevel = 0;

  function setSubmenu(event: any, targetObject: any, MENUITEMS = menuitems) {
    const theme = appState;
    if (
      (window.screen.availWidth <= 992 || theme.dataNavStyle != "icon-hover") &&
      (window.screen.availWidth <= 992 || theme.dataNavStyle != "menu-hover")
    ) {
      if (!event?.ctrlKey) {
        for (const item of MENUITEMS) {
          if (item === targetObject) {
            item.active = true;
            item.selected = true;
            // setMenuAncestorsActive(MENUITEMS,item);
            setMenuAncestorsActive(item);
          } else if (!item.active && !item.selected) {
            item.active = false; // Set active to false for items not matching the target
            item.selected = false; // Set active to false for items not matching the target
          } else {
            // removeActiveOtherMenus(MENUITEMS,item);
            removeActiveOtherMenus(item);
          }
          if (item.children && item.children.length > 0) {
            setSubmenu(event, targetObject, item.children);
          }
        }
      }
    }

    setMenuitems((arr: any) => [...arr]);
  }
  function getParentObject(obj: any, childObject: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (
          typeof obj[key] === "object" &&
          JSON.stringify(obj[key]) === JSON.stringify(childObject)
        ) {
          return obj; // Return the parent object
        }
        if (typeof obj[key] === "object") {
          const parentObject: any = getParentObject(obj[key], childObject);
          if (parentObject !== null) {
            return parentObject;
          }
        }
      }
    }
    return null; // Object not found
  }

  function setMenuAncestorsActive(targetObject: any) {
    const parent = getParentObject(menuitems, targetObject);
    const theme = appState;
    if (parent) {
      if (hasParentLevel > 2) {
        hasParent = true;
      }

      parent.active = true;
      parent.selected = true;
      hasParentLevel += 1;
      setMenuAncestorsActive(parent);
    } else if (!hasParent) {
      if (theme.dataVerticalStyle == "doublemenu") {
        // html.setAttribute('data-toggled', 'double-menu-close');
        updateAppState({ ...theme, toggled: "double-menu-close" });
      }
    }
  }
  function removeActiveOtherMenus(item: any) {
    if (item) {
      if (Array.isArray(item)) {
        for (const val of item) {
          val.active = false;
          val.selected = false;
        }
      }
      item.active = false;
      item.selected = false;

      if (item.children && item.children.length > 0) {
        removeActiveOtherMenus(item.children);
      }
    } else {
      return;
    }
  }
  //
  function setMenuUsingUrl(currentPath: any) {
    hasParent = false;
    hasParentLevel = 1;
    // Check current url and trigger the setSidemenu method to active the menu.
    const setSubmenuRecursively = (items: any) => {
      items?.forEach((item: any) => {
        if (item.path == "") {
        } else if (
          currentPath.includes(item.path) ||
          `${currentPath}List`.includes(item.path)
        ) {
          setSubmenu(null, item);
        }
        setSubmenuRecursively(item.children);
      });
    };
    setSubmenuRecursively(menuitems);
  }
  const [previousUrl, setPreviousUrl] = useState("/");

  useEffect(() => {
    if (
      userSession &&
      userSession?.companies &&
      Array.isArray(userSession?.companies)
    ) {
      const company = userSession?.companies.find(
        (x: any) => x.name === userSession?.currentClientName
      );
      if (company && company.logo) {
        setCompanyLogo(company.logo);
      }
    }
  }, [userSession?.companies]);
  useEffect(() => {
    // Select the target element
    const targetElement = document.documentElement;

    // Create a MutationObserver instance
    const observer = new MutationObserver(handleAttributeChange);

    // Configure the observer to watch for attribute changes
    const config = { attributes: true };

    // Start observing the target element
    observer.observe(targetElement, config);
    let currentPath = location.pathname.endsWith("/")
      ? location.pathname.slice(0, -1)
      : location.pathname;

    if (currentPath !== previousUrl) {
      setMenuUsingUrl(currentPath);
      setPreviousUrl(currentPath);
    }

    // ... the rest of your useEffect code
  }, [location]);
  function toggleSidemenu(
    event: any,
    targetObject: any,
    MENUITEMS = menuitems
  ) {
    const theme = appState;
    let element = event.target;
    if (
      (window.screen.availWidth <= 992 || theme.dataNavStyle != "icon-hover") &&
      (window.screen.availWidth <= 992 || theme.dataNavStyle != "menu-hover")
    ) {
      for (const item of MENUITEMS) {
        if (item === targetObject) {
          if (theme.dataVerticalStyle == "doublemenu" && item.active) {
            return;
          }
          item.active = !item.active;
          if (item.active) {
            closeOtherMenus(MENUITEMS, item);
          } else {
            if (theme.dataVerticalStyle == "doublemenu") {
              updateAppState({ ...theme, toggled: "double-menu-close" });
            }
          }
          setAncestorsActive(MENUITEMS, item);
        } else if (!item.active) {
          if (theme.dataVerticalStyle != "doublemenu") {
            item.active = false; // Set active to false for items not matching the target
          }
        }
        if (item.children && item.children.length > 0) {
          toggleSidemenu(event, targetObject, item.children);
        }
      }
      if (targetObject?.children && targetObject.active) {
        if (
          theme.dataVerticalStyle == "doublemenu" &&
          theme.toggled != "double-menu-open"
        ) {
          updateAppState({ ...theme, toggled: "double-menu-open" });
        }
      }
      if (
        element &&
        theme.dataNavLayout == "horizontal" &&
        (theme.dataNavStyle == "menu-click" ||
          theme.dataNavStyle == "icon-click")
      ) {
        const listItem = element.closest("li");
        if (listItem) {
          // Find the first sibling <ul> element
          const siblingUL = listItem.querySelector("ul");
          let outterUlWidth = 0;
          let listItemUL = listItem.closest("ul:not(.main-menu)");
          while (listItemUL) {
            listItemUL = listItemUL.parentElement.closest("ul:not(.main-menu)");
            if (listItemUL) {
              outterUlWidth += listItemUL.clientWidth;
            }
          }
          if (siblingUL) {
            // You've found the sibling <ul> element
            let siblingULRect = listItem.getBoundingClientRect();
            if (theme.dir == "rtl") {
              if (
                siblingULRect.left - siblingULRect.width - outterUlWidth + 150 <
                  0 &&
                outterUlWidth < window.innerWidth &&
                outterUlWidth + siblingULRect.width + siblingULRect.width <
                  window.innerWidth
              ) {
                targetObject.dirchange = true;
              } else {
                targetObject.dirchange = false;
              }
            } else {
              if (
                outterUlWidth + siblingULRect.right + siblingULRect.width + 50 >
                  window.innerWidth &&
                siblingULRect.right >= 0 &&
                outterUlWidth + siblingULRect.width + siblingULRect.width <
                  window.innerWidth
              ) {
                targetObject.dirchange = true;
              } else {
                targetObject.dirchange = false;
              }
            }
          }
          setTimeout(() => {
            let computedValue = siblingUL.getBoundingClientRect();
            if (computedValue.bottom > window.innerHeight) {
              siblingUL.style.height =
                window.innerHeight - computedValue.top - 8 + "px";
              siblingUL.style.overflow = "auto";
            }
          }, 100);
        }
      }
    }
    setMenuitems((arr: any) => [...arr]);
  }
  function setAncestorsActive(MENUITEMS: any, targetObject: any) {
    const theme = appState;
    const parent = findParent(MENUITEMS, targetObject);
    if (parent) {
      parent.active = true;
      if (parent.active) {
        updateAppState({ ...theme, toggled: "double-menu-open" });
      }
      setAncestorsActive(MENUITEMS, parent);
    } else {
      if (theme.dataVerticalStyle == "doublemenu") {
        updateAppState({ ...theme, toggled: "double-menu-close" });
      }
    }
  }
  function closeOtherMenus(MENUITEMS: any, targetObject: any) {
    for (const item of MENUITEMS) {
      if (item !== targetObject) {
        item.active = false;
        if (item.children && item.children.length > 0) {
          closeOtherMenus(item.children, targetObject);
        }
      }
    }
  }
  function findParent(MENUITEMS: any, targetObject: any) {
    for (const item of MENUITEMS) {
      if (item.children && item.children.includes(targetObject)) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const parent: any = findParent(
          (MENUITEMS = item.children),
          targetObject
        );
        if (parent) {
          return parent;
        }
      }
    }
    return null;
  }
  const Sideclick = () => {
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute("icon-overlay") != "open") {
        html.setAttribute("icon-overlay", "open");
      }
    }
  };
  function handleAttributeChange(mutationsList: any) {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        (mutation.attributeName === "data-nav-layout" ||
          mutation.attributeName === "data-vertical-style")
      ) {
        const newValue = mutation.target.getAttribute("data-nav-layout");
        if (newValue == "vertical") {
          let currentPath = location.pathname.endsWith("/")
            ? location.pathname.slice(0, -1)
            : location.pathname;
          currentPath = !currentPath ? "/dashboard/ecommerce" : currentPath;
          setMenuUsingUrl(currentPath);
        } else {
          closeMenuFn();
        }
      }
    }
  }
  const renderNavItems = useMemo(() => {
    return (
      <Fragment>
        <div
          id="responsive-overlay"
          onClick={() => {
            menuClose();
          }}
        ></div>
        <aside
          className="app-sidebar"
          id="sidebar"
          onMouseEnter={() => Onhover()}
          onMouseLeave={() => Outhover()}
        >
          <div className="main-sidebar-header">
            <Link to={import.meta.env.BASE_URL} className="header-logo">
              <img src={logo1} alt="logo" className="desktop-logo" />
              <img src={logo2} alt="logo" className="toggle-logo" />
              <img src={logo3} alt="logo" className="desktop-dark" />
              <img src={logo4} alt="logo" className="toggle-dark" />
              <img src={logo5} alt="logo" className="desktop-white" />
              <img src={logo6} alt="logo" className="toggle-white" />
            </Link>
          </div>
          <SimpleBar className="main-sidebar" id="sidebar-scroll">
            <nav className="main-menu-container nav nav-pills flex-column sub-open">
              <div
                className="slide-left"
                id="slide-left"
                onClick={() => {
                  slideLeft();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7b8191"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
                </svg>
              </div>
              {/* hasTopBorder */}
              <ul className="main-menu" onClick={() => Sideclick()}>
                {menuitems.map((levelone: any) => (
                  <Fragment key={Math.random()}>
                    <li
                      className={`${
                        levelone.menutitle
                          ? "slide__category"
                          : levelone.menutitle_lg
                          ? "slide__category slide__category__lg"
                          : ""
                      } ${
                        levelone.hasTopBorder === true
                          ? "border-t border-t-[1px] border-solid border-t-white/10 pt-2"
                          : ""
                      } ${levelone.type === "link" ? "slide" : ""}
                         ${levelone.type === "sub" ? "slide has-sub" : ""} ${
                        levelone?.active ? "open" : ""
                      } ${levelone?.selected ? "active" : ""}`}
                    >
                      {levelone.menutitle ? (
                        <span className="category-name flex">
                          {levelone.menutitle === "main" ? (
                            levelone.menutitle
                          ) : (
                            <div className="flex justify-between w-full">
                              <span className="category-name flex items-center space-x-1">
                                {levelone.menutitle}
                              </span>
                              <Link
                                to={import.meta.env.BASE_URL}
                                className="ml-auto flex items-center space-x-1"
                              >
                                <ArrowBigLeftDash
                                  size={15}
                                  className="text-[#ffffff]"
                                />
                                <span className="text-[#ffffff]">Home</span>
                              </Link>
                            </div>
                          )}
                        </span>
                      ) : (
                        ""
                      )}
                      {levelone.menutitle_lg ? (
                        <span className="category-name">
                          {t(levelone.menutitle_lg)}
                        </span>
                      ) : (
                        ""
                      )}
                      {levelone.type === "link" ? (
                        <Link
                          to={levelone.path}
                          className={`side-menu__item ${
                            levelone.selected ? "active" : ""
                          }`}
                        >
                          {levelone.icon}
                          <span className="side-menu__label">
                            {t(levelone.title)}
                            {levelone.badgetxt ? (
                              <span className={levelone.class}>
                                {levelone.badgetxt}
                              </span>
                            ) : (
                              ""
                            )}
                          </span>
                        </Link>
                      ) : (
                        ""
                      )}
                      {levelone.type === "empty" ? (
                        <Link to="#" className="side-menu__item">
                          {levelone.icon}
                          <span className="">
                            {t(levelone.title)}
                            {levelone.badgetxt ? (
                              <span className={levelone.class}>
                                {levelone.badgetxt}
                              </span>
                            ) : (
                              ""
                            )}
                          </span>
                        </Link>
                      ) : (
                        ""
                      )}
                      {levelone.type === "sub" ? (
                        <Menuloop
                          MENUITEMS={levelone}
                          level={level + 1}
                          toggleSidemenu={toggleSidemenu}
                          t={t}
                        />
                      ) : (
                        ""
                      )}
                    </li>

                    {levelone.menutitle_lg && levelone.showUserMiniCard && (
                      <li className="slide__category_Detail">
                        <div className="sm:flex items-start items-center">
                          <div>
                            <span className="avatar avatar-md avatar-rounded dark:bg-[#f2f2f28a] ">
                              <img
                                alt={userSession?.displayName || profile}
                                src={userSession?.userimage || profile}
                              />
                            </span>
                          </div>
                          <div className="flex-grow p-2">
                            <div className="flex items-center !justify-between">
                              <h6 className="mb-1  text-[.6rem]">
                                <p className="mb-1  text-[.8rem] truncate w-40">
                                  {userSession?.displayName}
                                </p>
                                <p>{userSession?.email}</p>
                              </h6>
                            </div>
                          </div>
                        </div>
                      </li>
                    )}
                    {levelone.menutitle_lg &&
                      levelone.showWorkspaceMiniCard && (
                        <li className="slide__category_Detail">
                          <div className="sm:flex items-start items-center">
                            <div>
                              <span className="avatar avatar-md avatar-badge ">
                                <ErpAvatar
                                  variant="square"
                                  alt={userSession?.currentClientName}
                                  src={companyLogo}
                                  sx={avatarStyle}
                                />
                              </span>
                            </div>
                            <div className="flex-grow p-2">
                              <div className="flex items-center !justify-between">
                                <h6 className="mb-1  text-[.6rem]">
                                  <p className="mb-1  text-[.8rem]">
                                    {userSession?.currentClientName}
                                  </p>
                                  <p>
                                    Branch: {userSession?.currentBranchName}
                                  </p>
                                </h6>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}
                  </Fragment>
                ))}
              </ul>
              <div
                className="slide-right"
                id="slide-right"
                onClick={() => {
                  slideRight();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7b8191"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
                </svg>
              </div>
            </nav>
          </SimpleBar>
        </aside>
      </Fragment>
    );
  }, [menuitems, t, appState]);
  return renderNavItems;
});

const mapStateToProps = (state: any) => ({
  local_varaiable: state,
});

export default Sidebar;
