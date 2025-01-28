import React, { useRef, useState } from "react";
import { X, ArrowLeft, Mail, Phone, Lock } from "lucide-react";
import Urls from "../../redux/urls";
import { APIClient } from "../../helpers/api-client";
import { handleResponse } from "../../utilities/HandleResponse";
import ERPToast from "../../components/ERPComponents/erp-toast";
import CircularProgressBar from "./CircularProgressBar";

// API endpoints

interface ForgotPasswordProps {
  onClose: () => void;
}
interface emailItems {
  userName:string;
  isMobile:boolean;
  credential:string
}
const api = new APIClient();
const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [emailData, setEmailData] = useState<emailItems[]>([]);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isOk, setIsOk] = useState(false);
  const [otpMethod, setOtpMethod] = useState<emailItems>();
  const [otp, setOtp] = useState("");
  const [verifyOtp,setVerifyOtp] = useState({})
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [otpTimeout, setOtpTimeout] = useState(false)
  const [resetCount, setResetCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleVerifyEmail = async () => {
    try {
      const response = await api.getAsync(`${Urls.get_login_credentials}${emailOrPhone}`);
      if (!response.isOk) {
        setError(response.message);
      }else{
        setEmailData(response.items);
        setStep(2);
        setIsOk(true);
        setError(null);
      } 
    } catch (err) {
      setError("Failed to Identify email or Phone number Please try Again");
      console.error(err);
    }
  };


  const handleSendOTP = async()=>{
    try {
      const response = await api.post(Urls.sent_token,otpMethod);
        handleResponse(response, () => {
          setVerifyOtp(response.item)
          setStep(3)
          setResetCount(prev => prev + 1);
          setOtpTimeout(true)

        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

          // Set new timeout
          timeoutRef.current = setTimeout(() => {
            setOtpTimeout(false);
          }, 1 * 60 * 1000);
        })
    } catch (error) {
      console.error("Error in setOpt:", error);
    } 
  }




  const handleVerifyOTP = async () => {
    try {
      const response = await api.post(Urls.validate_token,
        {
          ...verifyOtp,
          tokenOrOtp:otp
        });
      handleResponse(response,()=>setStep(4));
    } catch (error) {
      setError("Error in VerifyOpt Please try Again");
      console.error("Error in verifyOpt:", error);
    } 
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("password not match!!!");
      return;
    }else{
      try {
        const response = await api.post(Urls.updatePassword,{password:confirmPassword});
        handleResponse(response,()=>onClose());
      } catch (err) {
        setError("Failed to reset password. Please try again.");
        console.error(err);
      }
    }
  };



  return (
    <div className="fixed inset-0 bg-[#0005] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-[#dbeafe] rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#eff6ff] transition-colors group"
        >
          <X className="h-4 w-4 text-gray-500 group-hover:text-[#2563eb] transition-colors" />
        </button>
        {step > 1 && (
          <button
          onClick={() => setStep(step - 1)}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-[#eff6ff] transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 text-gray-500 group-hover:text-[#2563eb] transition-colors" />
          </button>
        )}
        <div className="p-8 space-y-6">
          <h2 className="text-xl font-bold text-[#1e3a8a] mb-5 text-center flex items-center justify-center gap-3 tracking-wider">
            <Lock className="w-6 h-6 text-[#2563eb]" />
            Forgot Password
          </h2>
          {error && (
            <div className="bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] px-4 py-3 rounded-lg mb-4 flex items-center gap-3 animate-pulse w-fit mx-auto">
             {error}
            <X className="w-4 h-4 text-[#ef4444]" />
             
            </div>
          )}
          {step === 1 && (
            <form onSubmit={(e)=> e.preventDefault()} className="space-y-6">
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Enter email or phone number"
                className="w-full px-4 py-3 border-2 border-[#93c5fd] rounded-xl focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none transition-all placeholder-gray-400 hover:border-[#93c5fd]"
                required
              />
              <button
                type="submit"
                onClick={handleVerifyEmail}
                className="w-full bg-[#2563eb] text-white py-3 rounded-xl hover:bg-[#1d4ed8] focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl group"
              >
                Submit
                <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  →
                </span>
              </button>
            </form>
          )}
          {step === 2 && isOk && (
            <div className="space-y-6">
            
              <div className="max-w-md mx-auto  p-6 bg-white rounded-xl shadow-md">
              <p className="text-gray-700 text-center font-medium mb-2">Select OTP method</p>
                <ul className="space-y-4">
                  {emailData.map((item, index) => (
                    <li key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <input
                    type="radio"
                    name="otpMethod"
                    value="email"
                    onChange={() => setOtpMethod(item)}
                    className="form-radio h-4 w-4 text-[#2563eb] border-2 border-[#93c5fd] focus:ring-2 focus:ring-[#3b82f6]"
                  />
                    <div className="flex-shrink-0">
                      {item.isMobile ? (
                        <Phone className="w-5 h-5 text-[#3b82f6]" />
                      ) : (
                        <Mail className="w-5 h-5 text-[#3b82f6]" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-900">{item.userName}</p>
                      <p className="text-sm text-gray-500">{item.credential}</p>
                    </div>
                  </li>
                ))}
              </ul>
          </div>
      

              <button
                onClick={handleSendOTP}
                disabled={!otpMethod}
                className="w-full bg-[#2563eb] text-white py-3 rounded-xl hover:bg-[#1d4ed8] focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed group"
              >
                Send OTP
                <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  →
                </span>
              </button>
            </div>
          )}
          {step === 3 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyOTP();
              }}
              className="space-y-6"
            >
                <div className="flex flex-col items-center mb-4">
                <CircularProgressBar key={resetCount} duration={60} size={120} strokeWidth={8} color="#3b82f6" />
                {!otpTimeout && 
               <p className="text-gray-700 mt-2">
               OTP has expired. <span onClick={handleSendOTP} className="text-sky-500 underline cursor-pointer">Reset the OTP</span>
               </p>
                }
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-4 py-3 border-2 border-[#93c5fd] rounded-xl focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none transition-all placeholder-gray-400 hover:border-[#93c5fd]"
                required
                disabled={!otpTimeout}
              />
              <button
                type="submit"
                disabled={!otpTimeout}
                className="w-full bg-[#2563eb] text-white py-3 rounded-xl hover:bg-[#1d4ed8] focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl group"
              >
                Verify OTP
                <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  →
                </span>
              </button>
            </form>
          )}
          {step === 4 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleResetPassword();
              }}
              className="space-y-6"
            >
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border-2 border-[#93c5fd] rounded-xl focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none transition-all placeholder-gray-400 hover:border-[#93c5fd]"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-3 border-2 border-[#93c5fd] rounded-xl focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none transition-all placeholder-gray-400 hover:border-[#93c5fd]"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#2563eb] text-white py-3 rounded-xl hover:bg-[#1d4ed8] focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl group"
              >
                Reset Password
                <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  →
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
