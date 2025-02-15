import { CirclePlus } from "lucide-react";
import { Fragment } from "react";
import { Link } from "react-router-dom";

function Menuloop({ MENUITEMS, toggleSidemenu, level, t }: any) {
  return (
    <Fragment>
      <Link to="#!" className={`side-menu__item ${MENUITEMS?.selected ? "active" : ""}`}
        onClick={(event) => {
          event.preventDefault();
          toggleSidemenu(event, MENUITEMS);
        }}
      >
        {MENUITEMS.icon}
        <span className={`${level == 1 ? "side-menu__label" : ""}`}>
          {t(MENUITEMS.title)}
          {MENUITEMS.badgetxt ? (
            <span className={MENUITEMS.class}>{MENUITEMS.badgetxt}</span>
          ) : (
            ""
          )}
        </span>
        <i className="fe fe-chevron-right side-menu__angle"></i>
      </Link>
      <ul className={`child${level}  ${MENUITEMS.active ? "double-menu-active" : ""}`} style={MENUITEMS.active ? { display: "block" } : { display: "none" }}>
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
              {
                firstlevel?.disabled ? (
                  <li className={`${firstlevel.menutitle ? 'slide__category' : firstlevel.menutitle_lg ? 'slide__category slide__category__lg' : ''} ${firstlevel?.type == 'empty' ? 'slide' : ''} ${firstlevel?.type == 'link' ? 'slide' : ''} ${firstlevel?.type == 'sub' ? 'slide has-sub' : ''} ${firstlevel?.active ? 'open' : ''} ${firstlevel?.selected ? 'active' : ''}`} key={Math.random()}>
                    <p className="text-xs cursor  side-menu__item">
                      {t(firstlevel.title)}
                    </p>
                  </li>
                ) : (
                  <li className={`${firstlevel.menutitle ? 'slide__category' : firstlevel.menutitle_lg ? 'slide__category slide__category__lg' : ''} ${firstlevel?.type == 'empty' ? 'slide' : ''} ${firstlevel?.type == 'link' ? 'slide' : ''} ${firstlevel?.type == 'sub' ? 'slide has-sub' : ''} ${firstlevel?.active ? 'open' : ''} ${firstlevel?.selected ? 'active' : ''}`} key={Math.random()}>
                    {firstlevel.type === "link" ?
                      <Link to={firstlevel.path} className={`side-menu__item ${firstlevel.selected ? 'active' : ''} group `}>
                        {firstlevel.icon}
                        <span className="relative flex items-center">
                          <div className="w-[148px] overflow-hidden text-ellipsis whitespace-nowrap"
                            title={t(firstlevel.title).length > 20 ? t(firstlevel.title) : undefined}>
                            {t(firstlevel.title)}
                          </div>
                          {firstlevel.addPath != undefined && firstlevel.addPath != null && firstlevel.addPath != "" &&
                            <span className=" fixed ms-[147px] hidden bg-black text-white  group-hover:block hover:bg-[#00000047] rounded-full">
                              <Link to={firstlevel.addPath} className={` ${firstlevel.selected ? 'active' : 'active'}`}>
                                <CirclePlus />
                                {/* <i className="side-menu__icon">
                                  <route.icon />
                                </i> */}
                              </Link>
                            </span>
                          }
                          {firstlevel.badgetxt ? (
                            <span className={firstlevel.class}>
                              {firstlevel.badgetxt}
                            </span>
                          ) : (
                            ""
                          )}
                        </span>
                      </Link>
                      : ""}
                    {firstlevel.type === "empty" ?
                      <Link to="#" className='side-menu__item'>
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
                      : ""}
                    {firstlevel.type === "sub" ?
                      <Menuloop MENUITEMS={firstlevel} toggleSidemenu={toggleSidemenu} level={level + 1} />
                      : ''}
                  </li>
                )
              }
            </>
          ))}
      </ul>
    </Fragment>
  );
}

export default Menuloop;
