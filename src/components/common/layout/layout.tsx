import { Dispatch, FC, Fragment, lazy, SetStateAction, useEffect, useState } from "react";

// Lazy load layout components
const Header = lazy(() => import("../header/header"));
const Sidebar = lazy(() => import("../sidebar/sidebar"));
// const Footer = lazy(() => import("../footer/footer"));
const Content = lazy(() => import("../content/content"));

// Non-lazy imports (utilities / ERP components)
import { ERPScrollArea } from "../../ERPComponents/erp-scrollbar";
import ERPAttachment from "../../ERPComponents/erp-attachment";
import { getStorageString } from "../../../utilities/storage-utils";

interface LayoutProps {
  setMyClass: Dispatch<SetStateAction<string>>;
}

const Layout: FC<LayoutProps> = ({ setMyClass }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);

  useEffect(() => {
    // const handleResize = () => {
    //   setIsDesktop(window.innerWidth > 992);
    // };

    // window.addEventListener("resize", handleResize);
    // return () => {
    //   window.removeEventListener("resize", handleResize);
    // };
  }, []);

  const Bodyclickk = async() => {
     let isCheck = await getStorageString("ynexverticalstyles")
        if (isCheck== "icontext") {
        setMyClass("");
       }
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute("icon-overlay") === "open") {
        html.setAttribute("icon-overlay", "");
      }
    }
  };
  return (
    // <>
    //   <Header />
    //   <Sidebar type='erp' />
    //   <div className='content main-index max-h-dvh overflow-y-auto  scrollbar scrollbar-thick scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-auto'  >
    //     <div className='main-content px-[9px]'
    //       onClick={Bodyclickk}
    //     >
    //       <Content />
    //     </div>
    //   </div>
    //   {/* <Footer /> */}
    // </>

    <>
      <Header />
      {/* {isDesktop && */}
       <Sidebar type="erp" />
       {/* } */}
      {/* <div className="w-full h-16 bg-black fixed top-0 left-0">
      {isDesktop && <ERPAttachment />}
      </div> */}
      <ERPScrollArea className="content main-index max-h-dvh overflow-y-auto">
      {/* <div className=""> */}
        <div className="main-content" onClick={Bodyclickk}>
          <Content />
        </div>
      {/* </div> */}
      </ERPScrollArea>
      {/* <Footer /> */}
    </>
  );
};
export default Layout;
