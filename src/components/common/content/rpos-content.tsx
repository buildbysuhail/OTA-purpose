import { FC, lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";

const POS = lazy(() => import("../../../pages/rpos/rpos"));
const RPosTableView = lazy(() => import("../../../pages/rpos/rpos-table-view"));
const RPosLiveView = lazy(() => import("../../../pages/rpos/live-view"));
const Operations = lazy(() => import("../../../pages/rpos/operations"));
const RPosOrders = lazy(() => import("../../../pages/rpos/orders"));
const ShortKeys = lazy(() => import("../../../pages/rpos/shortkeys"));
const Kots = lazy(() => import("../../../pages/rpos/kots"));
const Customers = lazy(() => import("../../../pages/rpos/customers"));
const CustomOrderStatus = lazy(
  () => import("../../../pages/rpos/customorderstatus")
);
const Payments = lazy(() => import("../../../pages/rpos/payments"));
const Deliveryboy = lazy(() => import("../../../pages/rpos/deliveryboy"));

interface ContentProps {}
const loading = (
  <div className="w-full h-full bg-transparent flex items-center justify-center">
    <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
  </div>
);
const RPosContent: FC<ContentProps> = () => {
  const [myClass, setMyClass] = useState("");
  return (
    <Suspense fallback={loading}>
      <Routes>
        <Route path="/" element={<POS />} />
        <Route path="/table-view" element={<RPosTableView />} />
        <Route path="/live-view" element={<RPosLiveView />} />
        <Route path="/operations" element={<Operations />} />
        <Route path="/orders" element={<RPosOrders />} />
        <Route path="/shortkeys" element={<ShortKeys />} />
        <Route path="/kots" element={<Kots />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customorder-status" element={<CustomOrderStatus />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/deliveryboy" element={<Deliveryboy />} />
      </Routes>
    </Suspense>
  );
};
export default RPosContent;
