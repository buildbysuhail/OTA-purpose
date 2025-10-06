
import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  Suspense,
  useEffect,
  useState,
  lazy,
} from "react";
import { getStorageString } from "../../../utilities/storage-utils";
const Header = lazy(() => import("../header/header"));
const Sidebar = lazy(() => import("../sidebar/sidebar"));
// const Footer = lazy(() => import("../footer/footer"));
const Content = lazy(() => import("../content/content"));

interface LayoutProps { 
  setMyClass: Dispatch<SetStateAction<string>>;
}

const WorkspaceSettingsLayout: FC<LayoutProps> = ({setMyClass}) => {
  const Bodyclickk = async() => {
       let isChecked = await getStorageString("ynexverticalstyles")
        if (isChecked== "icontext") {
          setMyClass("");
        }
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute('icon-overlay') === 'open') {
          html.setAttribute('icon-overlay' ,"");
      }
    }
  }
  return (
    <>
    <Header />
            <Sidebar type='workspace-settings'/>
            <div className='content main-index'>
              <div className='main-content'
                onClick={Bodyclickk}
              >
                <Content />
              </div>
            </div>
            {/* <Footer /> */}
    </>
  );
}
export default WorkspaceSettingsLayout;

