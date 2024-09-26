// import { useCallback, useState } from "react";
// import { useDispatch } from "react-redux";
// import { ResponseModelWithValidation } from "../../base/response-model";
// import { handleResponse } from "../../utilities/HandleResponse";
// import { APIClient } from "../../helpers/api-client";

// interface ERPFormManageProps {
//   popupAction: (value: boolean) => { type: string; payload: boolean };
//   url: string;
//   initialData: {data: any, validations:any };
// }
// let api = new APIClient();
// export const ERPFormManage: React.FC<ERPFormManageProps> = ({
//   popupAction,
//   url,
//   initialData
// }) => {
//   const dispatch = useDispatch();
//   const onClose = useCallback(async () => {
//     dispatch(popupAction(false));
//   }, []);
//   const [postData, setPostData] = useState<{data: any, validations:any }>(initialData);
//   const [postDataLoading, setPostDataLoading] = useState<boolean>(false);

//   const addUserType = useCallback(async () => {
//     setPostDataLoading(true);
//     const response: ResponseModelWithValidation<any, any> =
//       await api.post(url ,postData?.data);
//       setPostDataLoading(false);
//     handleResponse(response, 
//       () => {dispatch(popupAction(false));},
//       () => {setPostData((prevData: any) => ({
//                 ...prevData,
//                 validations: response.validations,
//               }));
//             });
//   }, [postData?.data]);

//   return (
//     <div className="w-full pt-4">
//       <div className="grid grid-cols-1 gap-3">
//         <ERPInput
//           id="userTypeName"
//           label="User type Name"
//           placeholder="User Type Name"
//           required={true}
//           data={postUserType?.data}
//           onChangeData={(data: any) => {
//             setPostUserType((prevData: any) => ({
//               ...prevData,
//               data: data,
//             }));
//           }}
//           value={postUserType?.data?.userTypeName}
//           validation={postUserType?.validations?.userTypeName}
//         />
//         <ERPInput
//           id="userTypeCode"
//           label="user type code"
//           placeholder="user type code"
//           required={true}
//           data={postUserType?.data}
//           onChangeData={(data: any) => {
//             setPostUserType((prevData: any) => ({
//               ...prevData,
//               data: data,
//             }));
//           }}
//           value={postUserType?.data?.userTypeCode}
//           validation={postUserType?.validations?.userTypeCode}
//         />
//         <ERPInput
//           id="remark"
//           label="Remark"
//           placeholder="remark"
//           required={true}
//           data={postUserType?.data}
//           onChangeData={(data: any) => {
//             setPostUserType((prevData: any) => ({
//               ...prevData,
//               data: data,
//             }));
//           }}
//           value={postUserType?.data?.remark}
//           validation={postUserType?.validations?.remark}
//         />
//       </div>

//       <div className="w-full p-2 flex justify-end">
//         <ERPButton
//           type="reset"
//           title="Cancel"
//           variant="secondary"
//           onClick={onClose}
//           // disabled={emailLoading}
//         ></ERPButton>
//         <ERPButton
//           type="button"
//           disabled={postUserTypeLoading}
//           variant="primary"
//           onClick={addUserType}
//           loading={postUserTypeLoading}
//           title={"Submit"}
//         ></ERPButton>
//       </div>
//     </div>
//   );
// };