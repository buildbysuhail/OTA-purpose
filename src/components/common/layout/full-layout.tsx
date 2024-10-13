import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  Suspense,
  useEffect,
  useState,
} from "react";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import Footer from "../footer/footer";
import Content from "../content/content";
import { Route, Routes } from "react-router-dom";
import InvoiceDesigner from "../../../pages/InvoiceDesigner/InvoiceDesigner";

interface LayoutProps {
  // setMyClass: Dispatch<SetStateAction<string>>;
}
const loading = (
  <div className="w-full h-full bg-transparent flex items-center justify-center">
    <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
  </div>
);
const FullLayout: FC<LayoutProps> = ({  }) => {
  // const Bodyclickk = () => {
  //   if (localStorage.getItem("ynexverticalstyles") == "icontext") {
  //     setMyClass("");
  //   }
  //   if (window.innerWidth > 992) {
  //     let html = document.documentElement;
  //     if (html.getAttribute("icon-overlay") === "open") {
  //       html.setAttribute("icon-overlay", "");
  //     }
  //   }
  // };
  return (
    <>
      <div className="w-full h-full absolute top-0 left-0 z-50">
      <Suspense fallback={loading}>
      <Routes>
      <Route path="/:id" element={<InvoiceDesigner />} />
      </Routes>
      </Suspense>
      </div>
    </>
  );
};
export default FullLayout;
