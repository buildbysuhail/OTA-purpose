
import { Dispatch, FC, Fragment, SetStateAction, useEffect, useState, lazy } from "react";
import { getStorageString } from "../../../utilities/storage-utils";

const Header = lazy(() => import("../header/header"));
const Sidebar = lazy(() => import("../sidebar/sidebar"));
// const Footer = lazy(() => import("../footer/footer"));
const Content = lazy(() => import("../content/content"));

interface LayoutProps { 
  setMyClass?: Dispatch<SetStateAction<string>>;
}

const PosLayout: FC<LayoutProps> = ({setMyClass}) => {
  
  return (
    <>
             <Content />
            {/* <Footer /> */}
    </>
  );
}
export default PosLayout;

