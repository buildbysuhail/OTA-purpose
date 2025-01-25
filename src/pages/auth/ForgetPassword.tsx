import React, { useState } from "react";
import { X, ArrowLeft, Mail, Phone, Lock } from "lucide-react";
import Urls from "../../redux/urls";
import { APIClient } from "../../helpers/api-client";

// API endpoints

interface ForgotPasswordProps {
  onClose: () => void;
}
const api = new APIClient();
const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [emailData, setEmailData] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isOk, setIsOk] = useState(false);
  const [otpMethod, setOtpMethod] = useState<"email" | "phone" | null>(null);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOk(true);
    setStep(2);
  };

  const handleVerifyOTP = async () => {
    try {
      

      const response = await api.getAsync(`${Urls.SendEmailToken}${emailOrPhone}`);

      if (!response.ok) {
        setError("Failed to send OTP");
      }
      setEmailData(response.items);
      setStep(2);
    } catch (err) {
      setError("Failed");
      console.error(err);
    }
  };

  const handleSendOTP = async () => {
    try {
      const response = await fetch(Urls.SendEmailToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone,
          token: otp,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid OTP");
      }

      console.log(`OTP verified: ${otp}`);
      setStep(4);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error(err);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const response = await fetch(Urls.SendEmailToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone,
          token: otp,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid OTP");
      }

      console.log(`OTP verified: ${otp}`);
      setStep(4);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error(err);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(Urls.SendEmailToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone,
          newPassword,
          token: otp,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      console.log(`Password reset successfully: ${newPassword}`);
      alert("Password reset successfully!");
      onClose();
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      console.error(err);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
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
              <X className="w-4 h-4 text-[#ef4444]" />
              {error}
            </div>
          )}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
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
              <p className="text-gray-700 text-center font-medium">
                Select OTP method:
              </p>
              <div className="flex justify-around my-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="otpMethod"
                    value="email"
                    onChange={() => setOtpMethod("email")}
                    className="form-radio h-4 w-4 text-[#2563eb] border-2 border-[#93c5fd] focus:ring-2 focus:ring-[#3b82f6]"
                  />
                  <Mail className="w-5 h-5 text-[#3b82f6]" />
                  <span className="text-gray-700 font-medium">Email</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="otpMethod"
                    value="phone"
                    onChange={() => setOtpMethod("phone")}
                    className="form-radio h-4 w-4 text-[#2563eb] border-2 border-[#93c5fd] focus:ring-2 focus:ring-[#3b82f6]"
                  />
                  <Phone className="w-5 h-5 text-[#3b82f6]" />
                  <span className="text-gray-700 font-medium">Phone</span>
                </label>
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
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-4 py-3 border-2 border-[#93c5fd] rounded-xl focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none transition-all placeholder-gray-400 hover:border-[#93c5fd]"
                required
              />
              <button
                type="submit"
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
