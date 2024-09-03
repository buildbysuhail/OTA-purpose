// import React, { useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import { setAuthorization } from "../helpers/api_helper";
// import { useDispatch } from "react-redux";

// import { useProfile } from "../Components/Hooks/UserHooks";

// import { logoutUser } from "../slices/auth/login/thunk";

// const AuthProtected = (props : any) =>{
//   const dispatch : any = useDispatch();
//   const { userProfile, loading, token, userRoles } = useProfile();
  
//   useEffect(() => {
//     if (userProfile && !loading && token) {
//       setAuthorization();
//     } else if (!userProfile && loading && !token) {
//       dispatch(logoutUser());
//     }
//   }, [token, userProfile, loading, dispatch]);
  
//   if (userRoles === null || userRoles.length === 0) {
//     // Redirect to login if user role is not available
//     return <Navigate to={{ pathname: "/login" }} />;
//   }

//   let isAllowed = true;
//   // Check if the user's role matches the allowed roles
//   if (props.allowedRoles !== undefined && props.allowedRoles != null && props.allowedRoles !== '') {
//     const allowedRoles = props.allowedRoles.split(',');
//     isAllowed = allowedRoles.some((role: any) => userRoles.includes(role));
//   }

//   if (!isAllowed) {
//     // Redirect to unauthorized if user role is not allowed
//     return <Navigate to={{ pathname: "/login" }} />;
//   }
//   /*
//     Navigate is un-auth access protected routes via url
//     */

//   if (!userProfile && loading && !token) {
//     return (
//       <Navigate to={{ pathname: "/login"}} />
//     );
//   }

//   return <>{props.children}</>;
// };


// export default AuthProtected;