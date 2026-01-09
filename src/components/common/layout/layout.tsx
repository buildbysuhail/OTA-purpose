import { Dispatch, FC, Fragment, lazy, SetStateAction, memo, useCallback, useEffect, useState } from "react";

// Lazy load layout components
const Header = lazy(() => import("../header/header"));
const Sidebar = lazy(() => import("../sidebar/sidebar"));
// const Footer = lazy(() => import("../footer/footer"));
const Content = lazy(() => import("../content/content"));

// Non-lazy imports (utilities / ERP components)
import { ERPScrollArea } from "../../ERPComponents/erp-scrollbar";
import ERPAttachment from "../../ERPComponents/erp-attachment";
import { getStorageString } from "../../../utilities/storage-utils";
import { useSidebarSwipe } from "../../../utilities/hooks/useSidebarSwipe";

interface LayoutProps {
  setMyClass: Dispatch<SetStateAction<string>>;
}

const Layout: FC<LayoutProps> = ({ setMyClass }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);

  // Enable swipe gestures for sidebar on mobile
  // Swipe from left edge (LTR) or right edge (RTL) to open sidebar
  useSidebarSwipe({
    threshold: 40,      // Min swipe distance to trigger
    edgeWidth: 50,      // Edge zone width for opening (wider for better Android detection)
    hapticFeedback: true,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBodyClick = useCallback(async () => {
    const isCheck = await getStorageString("ynexverticalstyles");
    if (isCheck === "icontext") {
      setMyClass("");
    }
    if (window.innerWidth > 992) {
      const html = document.documentElement;
      if (html.getAttribute("icon-overlay") === "open") {
        html.setAttribute("icon-overlay", "");
      }
    }
  }, [setMyClass]);

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
        <div className="main-content" onClick={handleBodyClick}>
          <Content />
        </div>
      {/* </div> */}
      </ERPScrollArea>
      {/* <Footer /> */}
    </>
  );
};

export default memo(Layout);
