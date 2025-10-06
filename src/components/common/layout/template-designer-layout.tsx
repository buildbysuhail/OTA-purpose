
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
import { Route, Routes } from "react-router-dom";
// const Header = lazy(() => import("../header/header"));
// const Sidebar = lazy(() => import("../sidebar/sidebar"));
// const Footer = lazy(() => import("../footer/footer"));
// const Content = lazy(() => import("../content/content"));
const InvoiceDesigner = lazy(
  () => import("../../../pages/InvoiceDesigner/LandingFolder/InvoiceDesignerLanding")
);
// import InvoiceDesigner from "../../../pages/InvoiceDesigner/InvoiceDesigner";

interface LayoutProps {
  // setMyClass: Dispatch<SetStateAction<string>>;
}
const loading = (
  <div className="w-full h-full bg-transparent flex items-center justify-center">
    <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
  </div>
);
const TemplateDesignerLayout: FC<LayoutProps> = ({  }) => {

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
export default TemplateDesignerLayout;
