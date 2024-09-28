// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";

// // import { auth } from "../../App";
// import Urls from "../../redux/actions/Urls";
// import ERPToast from "../../components/ERPComponets/ERPToast";
// import { setToken } from "../../redux/actions/CommonActons";
// import { postAction } from "../../redux/actions/AppActions";
// import { getUserComapanies } from "../../redux/actions/NetworkActions";
// import Cookies from "js-cookie";

const SocialLogins = () => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const googleProvider = new GoogleAuthProvider();
  // const facebookProvider = new FacebookAuthProvider();

  // /* ########################################################################################### */

  // const googleLogin = async () => {
  //   try {
  //     // const result = await signInWithPopup(auth, googleProvider);
  //     // result && localStorage?.setItem("profile_image", result?.user?.photoURL as any);
  //     // const response = (await dispatch(postAction(Urls.social_signup, ``, `uid=${result.user.uid}`))) as any;
  //     // const token = response?.payload?.data?.access;
  //     // if (token) {
  //     //   dispatch(setToken(token));
  //     //   Cookies.set("token", token, { expires: 30 });
  //     //   const companyResp = (await dispatch(getUserComapanies())) as any;
  //     //   companyResp?.payload?.data?.length > 0 ? navigate("/select-organization") : navigate("/create-organization");
  //     // }
  //   } catch (error) {
  //     ERPToast.showWith("Google Authentication Failed", "error");
  //     console.log(error);
  //   }
  // };

  // /* ########################################################################################### */

  // const facebookLogin = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, facebookProvider);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // /* ########################################################################################### */

  // return (
  //   <div className="flex-col items-center content-center justify-center">
  //     <div className="text-gray-300 select-none flex justify-center my-4">- Or -</div>
  //     <div className="flex justify-center">
  //       <div className="border rounded-full p-1 cursor-pointer mx-3 text-[#4285F4]" onClick={() => googleLogin()}>
  //         <img
  //           src="https://img.icons8.com/external-those-icons-flat-those-icons/96/external-Google-logos-and-brands-those-icons-flat-those-icons.png"
  //           className="w-10"
  //         />
  //       </div>
  //       <div
  //         className="border rounded-full p-1 cursor-pointer text-[#4267B2] grayscale mx-3 "
  //         // onClick={() => facebookLogin()}
  //       >
  //         <img src="/svg/facebook.svg" className="w-10" />
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default SocialLogins;
