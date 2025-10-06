import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
  lazy,
} from "react";
import { getStorageString } from "../../../utilities/storage-utils";
// const Header = lazy(() => import("../header/header"));
// const Sidebar = lazy(() => import("../sidebar/sidebar"));
// const Footer = lazy(() => import("../footer/footer"));
// const Content = lazy(() => import("../content/content"));
const RPosContent = lazy(() => import("../content/rpos-content"));
const RPosHeader = lazy(() => import("../header/rpos-header"));

interface RPosProps { 
  setMyClass: Dispatch<SetStateAction<string>>;
}

const RPosLayout: FC<RPosProps> = ({setMyClass}) => {
  const Bodyclickk = async() => {
        let isChecked = await getStorageString("ynexverticalstyles")
        if (isChecked == "icontext") {
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
    <RPosHeader />
            <div className='content content-rpos main-index'>
              <div className=''
                onClick={Bodyclickk}
              >
                <RPosContent />
              </div>
            </div>
            
    </>
  );
}
export default RPosLayout;

