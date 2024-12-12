import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import Footer from "../footer/footer";
import Content from "../content/content";
import { ERPScrollArea } from "../../ERPComponents/erp-scrollbar";
import ERPAttachment from "../../ERPComponents/erp-attachment";

interface LayoutProps {
  setMyClass: Dispatch<SetStateAction<string>>;
}

const Layout: FC<LayoutProps> = ({ setMyClass }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const Bodyclickk = () => {
    if (localStorage.getItem("ynexverticalstyles") == "icontext") {
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
      {isDesktop && <Sidebar type="erp" />}
      {/* <div className="w-full h-16 bg-black fixed top-0 left-0">
      {isDesktop && <ERPAttachment />}
      </div> */}
      <ERPScrollArea className="content main-index max-h-dvh overflow-y-auto">
        <div className="main-content px-[9px]" onClick={Bodyclickk}>
          <Content />
        </div>
      </ERPScrollArea>
      {/* <Footer /> */}
    </>
  );
};
export default Layout;
