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
      <ul className={`child${level} ${MENUITEMS.active ? "double-menu-active" : ""}`} 
          style={MENUITEMS.active ? { display: "block" } : { display: "none" }}>
        {level <= 1 && (
          <li className="slide side-menu__label1" key="menu-title">
            <Link to="#">{t(MENUITEMS.title)}</Link>
          </li>
        )}
        {MENUITEMS.children
          ?.filter((x: { visible: boolean | undefined; }) => x.visible === undefined || x.visible === true)
          .map((firstlevel: any, idx: number) => (
            <li 
              key={`${firstlevel.path || firstlevel.title}-${idx}`}
              className={`relative ${firstlevel.menutitle ? 'slide__category' : ''} 
                        ${firstlevel.menutitle_lg ? 'slide__category slide__category__lg' : ''} 
                        ${firstlevel?.type === 'empty' ? 'slide' : ''} 
                        ${firstlevel?.type === 'link' ? 'slide' : ''} 
                        ${firstlevel?.type === 'sub' ? 'slide has-sub' : ''} 
                        ${firstlevel?.active ? 'open' : ''} 
                        ${firstlevel?.selected ? 'active' : ''}`}
            >
              {
                firstlevel?.disabled ? (
                  <div className={`menu-item ${firstlevel.menutitle ? 'slide__category' : ''}`}>
                    <p className="text-xs cursor side-menu__item">
                      {t(firstlevel.title)}
                    </p>
                  </div>
                ) : (
                  <Fragment>
                    {firstlevel.type === "link" && (
                      <Link to={firstlevel.path} className={`side-menu__item ${firstlevel.selected ? 'active' : ''}`}>
                        {firstlevel.icon && <firstlevel.icon className='w-[14px]' />}
                        <span className="relative flex items-center">
                          <div className="w-[148px] overflow-hidden text-ellipsis whitespace-nowrap ml-2 side-menu__label"
                            title={t(firstlevel.title).length > 20 ? t(firstlevel.title) : undefined}>
                            {t(firstlevel.title)}
                          </div>
                          {firstlevel.addPath != undefined && firstlevel.addPath != null && firstlevel.addPath != "" && (
                            <span className="absolute ms-[147px] hidden bg-black text-white group-hover:block hover:bg-[#00000047] rounded-full">
                              {/* Replace nested Link with a button or span */} 
                              <button 
                                onClick={() => window.location.href = firstlevel.addPath}
                                className={`${firstlevel.selected ? 'active' : 'active'}`}
                              >
                                <CirclePlus className="text-[#ffffffa1] hover:text-white hover:w-[26px] hover:h-[26px] side-menu__label" />
                              </button>
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
                    )}
                    {firstlevel.type === "empty" && (
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
                    )}
                    {firstlevel.type === "sub" && (
                      <Menuloop 
                        MENUITEMS={firstlevel} 
                        toggleSidemenu={toggleSidemenu} 
                        level={level + 1}
                        t={t}
                      />
                    )}
                  </Fragment>
                )
              }
            </li>
          ))}
      </ul>
    </Fragment>
  );
}

export default Menuloop;
