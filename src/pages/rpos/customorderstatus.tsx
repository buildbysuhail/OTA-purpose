// import { t } from "i18next";
// import {
//   ArrowLeft,
//   Mail,
//   Phone,
//   Plus,
// } from "lucide-react";
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   Card, 
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription ,
//   Button
// } from "@/components/ui/card";

// const CustomOrderStatus = () => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate(-1);
//   };

//   const mainStatuses = [
//     { id: 1, label: "Order Accepted", color: "bg-destructive" },
//     { id: 2, label: "Food Is Ready", color: "bg-orange-500" },
//     { id: 3, label: "Dispatched", color: "bg-blue-500" },
//     { id: 4, label: "Delivered", color: "bg-green-500" },
//   ];

//   return (
//     <div className="p-0">
//       <header className="flex justify-between items-center bg-white p-4 shadow-md border-t border-b">
//         <h2 className="text-lg font-bold">
//           {t("custom_order_status_configuration")}
//         </h2>
//         <div className="flex items-center space-x-4 absolute right-4 rtl:left-4">
//           <div className="flex items-center space-x-2">
//             <Phone className="w-4 h-4 mr-2" />
//             <span>{t("call_for_support")}</span>
//             <div>
//               <span className="font-bold">
//                 {"+91 " +
//                   "123456789"
//                     .split("")
//                     .reverse()
//                     .join("")
//                     .replace(/(\d{3})(?=\d)/, "$1 ")}
//               </span>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Mail className="w-4 h-4 mr-2" />
//             <span>{t("send_a_mail")}</span>
//             <span className="font-bold">support@polosys.com</span>
//           </div>
//           <button
//             className="flex items-center space-x-1 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
//             onClick={handleClick}
//           >
//             <ArrowLeft className="w-5 h-5 mr-1" />
//             <span className="text-black">{t("back")}</span>
//           </button>
//         </div>
//       </header>

//       <Card className="w-full max-w-3xl mx-auto mt-6">
//         <CardHeader className="space-y-2">
//           <div className="flex items-center gap-4">
//             <div className="bg-blue-50 p-4 rounded-full">
//               <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                 <Plus className="h-5 w-5 text-white" />
//               </div>
//             </div>
//             <div>
//               <CardTitle>Add customized order status</CardTitle>
//               <CardDescription className="text-base mt-2">
//                 Tired of manually tracking orders in the reports? Streamline
//                 your operations with customized order statuses! This feature
//                 lets you add custom status buttons to live view and KDS order
//                 cards to easily keep track of each order.
//               </CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="pt-6">
//           <div className="relative flex flex-col items-center">
//             <div className="absolute top-0 bottom-0 w-0.5 bg-gray-100" />

//             {mainStatuses.map((status, index) => (
//               <div
//                 key={status.id}
//                 className="relative z-10 flex flex-col items-center gap-8 mb-8 last:mb-0"
//               >
//                 <div
//                   className={`${status.color} text-white px-6 py-2.5 rounded-full font-medium shadow-sm`}
//                 >
//                   {status.label}
//                 </div>

//                 {index < mainStatuses.length - 1 && (
//                   <div className="flex items-center gap-3 bg-white">
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       className="rounded-full h-10 w-10 border-dashed"
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                     <span className="text-sm text-muted-foreground">
//                       Add up to 3 new status buttons here
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
//             <Button variant="outline">Cancel</Button>
//             <Button>Save</Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default CustomOrderStatus;