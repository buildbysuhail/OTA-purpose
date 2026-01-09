import { CirclePlus } from "lucide-react";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";

function Menuloop({ MENUITEMS, toggleSidemenu, level, t }: any) {
  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);

  const handleKeyDownSub = (e: React.KeyboardEvent, parent: any) => {
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(
       document.querySelectorAll(
         ".firstlevel-link-navigate-helper, .first-menu-link-navigate-helper"
      )
    ) as HTMLElement[];

    // This focus including the puls button
    const focusablePlus = Array.from(
       document.querySelectorAll(
         ".firstlevel-link-navigate-helper, .circle-btn"
      )
    ) as HTMLElement[];

    // Index Including The plus button
    const currentIndexPlus = focusablePlus.indexOf(
      document.activeElement as HTMLElement
    );

    const currentIndex = focusable.indexOf(
      document.activeElement as HTMLElement
    );
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = currentIndexPlus + 1;
      focusablePlus[nextIndex]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
     const nextIndex = currentIndexPlus - 1;
      focusablePlus[nextIndex]?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      if(focusable[nextIndex]){
         focusable[nextIndex]?.focus();
      }
      else{
        const reportMenu = document.getElementById("report-menu-id");
        reportMenu?.focus();
      }
      
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex =
        currentIndex - 1 
        if(focusable[prevIndex]) {
      focusable[prevIndex]?.focus();
        } else{
          const elm = document.getElementById(
          `first-menu-link_${parent.title}_${parent.path}`
        );
        elm?.focus();
        }

    }
  };

  const focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const handleKeyDownMain = (e: React.KeyboardEvent, MENUITEMS: any) => {
    if (
      e.key !== "ArrowDown" &&
      e.key !== "ArrowUp" &&
      e.key !== "ArrowRight" &&
      e.key !== "ArrowLeft" &&
      e.key !== "Enter"
    )
      return;
    e.preventDefault(); // stop scrolling
    // collect only visible/enabled focusable elements
    const nodes = Array.from(
      document.querySelectorAll(focusableSelector)
    ) as HTMLElement[];
    const focusable = nodes.filter((el) => {
      // simple visibility test
      const rect = el.getBoundingClientRect();
      return !(
        el.hasAttribute("disabled") ||
        (rect.width === 0 && rect.height === 0)
      );
    });
    if (focusable.length === 0) return;
    // find the focused element or the nearest focusable ancestor
    const active = document.activeElement as HTMLElement | null;
    // helper: find index of the focusable that is the active element or an ancestor of it
    function findActiveIndex(): number {
      if (!active) return -1;
      // directly in list?
      let idx = focusable.indexOf(active);
      if (idx !== -1) return idx;
      // walk up parents until we hit document.body or find a match
      let p: HTMLElement | null = active;
      while (p && p !== document.body) {
        idx = focusable.indexOf(p);
        if (idx !== -1) return idx;
        p = p.parentElement;
      }
      return -1;
    }
    const currentIndex = findActiveIndex();

    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === "ArrowRight") {
      debugger;
      e.preventDefault();
      const next = (e.target as any).nextElementSibling;
      const isOpened = next?.classList?.contains("double-menu-active") ?? false;
      if (!isOpened) {
        (e.currentTarget as HTMLElement).click();
        setTimeout(() => {
          const firstChild = MENUITEMS.children[0];
          if (firstChild) {
            const elm = document.getElementById(
              `firstlevel_${firstChild.title}_${firstChild.path}`
            );
            elm?.focus();
          }
        }, 100);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      (e.currentTarget as HTMLElement).click();
      setTimeout(() => {
        const elm = document.getElementById(
          `first-menu-link_${MENUITEMS.title}_${MENUITEMS.path}`
        );
        elm?.focus();
      }, 100);
    } else if (e.key === "ArrowDown") {
      const nextIndex = currentIndex + 1 ;
      focusable[nextIndex].focus();
    } else if (e.key === "ArrowUp") {
      const prevIndex =
        (currentIndex - 1 + focusable.length) % focusable.length;
      focusable[prevIndex].focus();
    }
  };
  return (
    <Fragment>
      <Link
        to="#!"
        id={`first-menu-link_${MENUITEMS.title}_${MENUITEMS.path}`}
        tabIndex={0}
        type="popup"
        className={`first-menu-link-navigate-helper side-menu__item ${
          MENUITEMS?.selected ? "active" : ""
        }`}
        onClick={(event) => {
          event.preventDefault();
          toggleSidemenu(event, MENUITEMS);
        }}
        onKeyDown={(e) => {
          handleKeyDownMain(e, MENUITEMS);
        }}
      >
        {MENUITEMS.icon}
        <span
          className={`${
            level == 1 ? "side-menu__label" : ""
          } flex items-center`}
        >
          <div
            className="overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ maxWidth: "148px" }}
            title={t(MENUITEMS.title)}
          >
            {t(MENUITEMS.title)}
          </div>
          {MENUITEMS.badgetxt ? (
            <span className={MENUITEMS.class}>{MENUITEMS.badgetxt}</span>
          ) : (
            ""
          )}
        </span>
        <i className="fe fe-chevron-right side-menu__angle"></i>
      </Link>
      <ul
        className={`child${level}  ${
          MENUITEMS.active ? "double-menu-active" : ""
        }`}
        style={MENUITEMS.active ? { display: "block" } : { display: "none" }}
      >
        {level <= 1 ? (
          <li className="slide side-menu__label1">
            <Link to="#">{t(MENUITEMS.title)}</Link>
          </li>
        ) : (
          ""
        )}
        {MENUITEMS.children
          ?.filter(
            (x: any) =>
              x.visible == undefined ||
              (x.visible != undefined && x.visible == true)
          )
          .map((firstlevel: any) => (
            <>
              {firstlevel?.disabled ? (
                <li
                  className={`${
                    firstlevel.menutitle
                      ? "slide__category"
                      : firstlevel.menutitle_lg
                      ? "slide__category slide__category__lg"
                      : ""
                  } ${firstlevel?.type == "empty" ? "slide" : ""} ${
                    firstlevel?.type == "link" ? "slide" : ""
                  } ${firstlevel?.type == "sub" ? "slide has-sub" : ""} ${
                    firstlevel?.active ? "open" : ""
                  } ${firstlevel?.selected ? "active" : ""}`}
                  key={Math.random()}
                >
                  <p className="text-xs cursor  side-menu__item">
                    {t(firstlevel.title)}
                  </p>
                </li>
              ) : (
                <li
                  className={`relative ${
                    firstlevel.menutitle
                      ? "slide__category"
                      : firstlevel.menutitle_lg
                      ? "slide__category slide__category__lg"
                      : ""
                  } ${firstlevel?.type == "empty" ? "slide" : ""} ${
                    firstlevel?.type == "link" ? "slide" : ""
                  } ${firstlevel?.type == "sub" ? "slide has-sub" : ""} ${
                    firstlevel?.active ? "open" : ""
                  } ${firstlevel?.selected ? "active" : ""}`}
                  key={Math.random()}
                >
                  {firstlevel.type === "link" ? (
                    <Link
                      to={firstlevel.path}
                      id={`firstlevel_${firstlevel.title}_${firstlevel.path}`}
                      tabIndex={0}
                      className={`firstlevel-link-navigate-helper side-menu__item ${
                        firstlevel.selected ? "active" : ""
                      } group `}
                      // onKeyDown={handleKeyDownSub}
                      onKeyDown={(e) => {
                        handleKeyDownSub(e, MENUITEMS);
                      }}
                    >
                      {firstlevel.icon && (
                        <firstlevel.icon className="w-[14px]" />
                      )}
                      <span
                        className={`relative flex items-center ${
                          deviceInfo?.isMobile ? "justify-between w-full" : ""
                        }`}
                      >
                        <div
                          className="w-[148px] overflow-hidden text-ellipsis whitespace-nowrap ml-2 side-menu__label"
                          title={
                            t(firstlevel.title).length > 20
                              ? t(firstlevel.title)
                              : undefined
                          }
                        >
                          {t(firstlevel.title)}
                        </div>
                        {firstlevel.addPath && (
                          <span
                            className={`absolute 
                                  ${
                                    deviceInfo?.isMobile
                                      ? "right-0"
                                      : "left-full ml-1"
                                  } 
                                  md:ms-[147px] md:left-auto  
                                  bg-black text-white hover:bg-[#00000047] rounded-full  
                                  block md:hidden md:group-hover:block md:group-focus-within:block z-10
                                `}
                          >
                            <Link
                              to={firstlevel.addPath}
                              className="circle-btn flex items-center justify-center w-7 h-7 focus:bg-blue-950 focus:rounded-xl"
                              onClick={(e) => e.stopPropagation()}
                              tabIndex={0}
                            >
                              <CirclePlus className="flex items-center justify-center w-7 h-7 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black" />
                            </Link>
                          </span>
                        )}

                        {firstlevel.badgetxt ? (
                          <span className={firstlevel.class}>
                            {firstlevel.badgetxt}
                          </span>
                        ) : (
                          ""
                        )}
                      </span>
                    </Link>
                  ) : (
                    ""
                  )}
                  {firstlevel.type === "empty" ? (
                    <Link to="#" className="side-menu__item">
                      {firstlevel.icon}
                      <span className="">
                        {t(firstlevel.title)}
                        {firstlevel.badgetxt ? (
                          <span className={firstlevel.class}>
                            {firstlevel.badgetxt}
                          </span>
                        ) : (
                          ""
                        )}
                      </span>
                    </Link>
                  ) : (
                    ""
                  )}
                  {firstlevel.type === "sub" ? (
                    <Menuloop
                      MENUITEMS={firstlevel}
                      toggleSidemenu={toggleSidemenu}
                      level={level + 1}
                    />
                  ) : (
                    ""
                  )}
                </li>
              )}
            </>
          ))}
      </ul>
    </Fragment>
  );
}

export default Menuloop;
