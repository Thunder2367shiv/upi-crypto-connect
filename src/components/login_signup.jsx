"use client";

import React, { useEffect, useState, useTransition } from "react";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2, Phone, Lock, ShieldCheck, LogIn, User, Mail, LockIcon, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Btc } from "react-cryptocoins";

const OtpLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [registrationComplete, setregistrationComplete] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // State to toggle between Signup and Login views

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  useEffect(() => {
    if (!recaptchaVerifier && typeof window !== "undefined") {
      if (!window.recaptchaVerifierInitialized) {
        const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
        setRecaptchaVerifier(verifier);
        window.recaptchaVerifierInitialized = true;
      }
    }
  
    return () => {
      recaptchaVerifier?.clear();
      window.recaptchaVerifierInitialized = false;
    };
  }, []);
  

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp();
    }
  }, [otp]);

  const requestOtp = async (e) => {
    e.preventDefault();
    setResendCountdown(60);
    setError("");
    setSuccess("");

    if (!recaptchaVerifier) {
      setError("RecaptchaVerifier is not initialized.");
      return;
    }

    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setSuccess("OTP sent successfully.");
    } catch (error) {
      console.error(error);
      setResendCountdown(0);
      setError(error.message || "Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    startTransition(async () => {
      setError("");

      if (!confirmationResult) {
        setError("Please request OTP first.");
        return;
      }

      try {
        await confirmationResult.confirm(otp);
        router.replace("/");
      } catch (error) {
        console.error(error);
        setError("Invalid OTP. Please check and try again.");
      }
    });
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError("");
    
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Prepare user data from Google
      const userData = {
        username: user.displayName || user.email.split('@')[0],
        email: user.email,
        phone: user.phoneNumber || "", // Google might not provide phone
        // Add any other fields you need
      };
  
      // Check if user exists in your database or register them
      const response = await axios.post("/api/RegisterUser", userData);
      
      if (response.data.success || 
          (response.data.message === "User already exists")) {
            // console.log(response)
            // console.log(response.data.userId);
            sessionStorage.setItem('userId', response.data.userId);
            sessionStorage.setItem('username', response.data.username);
            sessionStorage.setItem('email', response.data.email);
            sessionStorage.setItem('phone', response.data.phone);
        router.push("/");
      } else {
        throw new Error("Failed to register user in database");
      }
    } catch (error) {
      console.error("Google sign-in error:", error.message);
      setError(error.response?.data?.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const RegisterUser = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/RegisterUser", {
        username: username.trim(),
        email: email.trim(),
        phone: phoneNumber.trim(),
      });

      if (response.data.success) {
        setregistrationComplete(true);
        setShowLogin(true); // Switch to login page after successful registration
      }
    } catch (error) {
      console.error("Error registering user:", error);

      if (error.response?.status === 400 && error.response?.data?.message === "User already exists") {
        // If user exists, redirect to login page instead of showing an error
        setShowLogin(true);
      } else {
        setError(error.response?.data?.message || "Error registering user. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Sign up on Left side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-t from-black to-cyan-900 backdrop-blur-sm shadow-2xl rounded-xl p-8 w-full md:w-1/2 transition-all duration-300 ease-in-out hover:scale-105 border border-gray-700 border-r-0"
        >
          {showLogin ? (
            <h1
              className="text-3xl font-bold text-center text-yellow-400 mb-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:text-yellow-700 transition-colors duration-300"
            >
              🔐
              <div>Upi-Crypto-Connect</div>
              <Btc size={170} color="orange" />

            </h1>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-center text-green-400 mb-6 flex items-center justify-center gap-2">
                <ShieldCheck className="w-8 h-8 text-green-400" /> Sign-up
              </h1>
              <form onSubmit={RegisterUser} className="space-y-6">
                {/* Username */}
                <div className="relative">
                  <Input
                    type="text"
                    className="w-full px-12 py-4 text-lg text-gray-100 bg-gray-800/50 border border-gray-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    required
                  />
                  <User className="absolute left-4 top-2 text-gray-200 w-6 h-6" />
                </div>
                {/* Email */}
                <div className="relative">
                  <Input
                    type="email"
                    className="w-full px-12 py-4 text-lg text-gray-100 bg-gray-800/50 border border-gray-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    required
                  />
                  <Mail className="absolute left-4 top-2 text-gray-200 w-6 h-6" />
                </div>
                {/* Phone Number Input */}
                <div className="relative">
                  <Input
                    type="tel"
                    className="w-full px-12 py-4 text-lg text-gray-100 bg-gray-800/50 border border-gray-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <Phone className="absolute left-4 top-2 text-gray-200 w-6 h-6" />
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="border-green-500 border-2 text-lg bg-green-600/50 text-white font-extrabold py-4 rounded-lg hover:bg-green-500/70 transition-all duration-300 flex items-center gap-2"
                  >
                    Submit
                  </Button>
                </div>
                <div className="mt-6 text-center">
                  {error && <p className="text-red-500">{error}</p>}
                  {success && <p className="text-green-500">{success}</p>}
                </div>
              </form>

              <h1
                className="text-1xl font-bold text-center text-white mb-6 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300"
                onClick={() => setShowLogin(true)} // Toggle back to Signup
              >
                Have an account?
                <div className="text-blue-400 hover:text-blue-700">Login</div>
              </h1>
            </>
          )}
        </motion.div>

        {/* Login on Right side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-t from-black to-cyan-900 backdrop-blur-sm shadow-2xl rounded-xl p-8 w-full md:w-1/2 transition-all duration-300 ease-in-out hover:scale-105 border border-gray-700 border-l-0"
        >
          {showLogin ? (
            <>
              <h1 className="text-3xl font-bold text-center text-green-400 mb-6 flex items-center justify-center gap-2">
                <ShieldCheck className="w-8 h-8 text-green-400" /> Login
              </h1>
              <form onSubmit={requestOtp} className="space-y-6">
                {/* Phone Number Input */}
                <div className="relative">
                  <Input
                    type="tel"
                    className="w-full px-12 py-4 text-lg text-gray-100 bg-gray-800/50 border border-gray-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <Phone className="absolute left-4 top-2 text-gray-500 w-6 h-6" />
                </div>

                {/* OTP Input (Show only when OTP is sent) */}
                {confirmationResult && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-gray-500 w-6 h-6" />
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      className="w-full pl-12"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    disabled={!phoneNumber || isPending || resendCountdown > 0}
                    className="border-green-500 border-2 text-lg bg-green-600/50 text-white font-extrabold py-4 rounded-lg hover:bg-green-500/70 transition-all duration-300 flex items-center gap-2"
                  >
                    {resendCountdown > 0 ? `Resend OTP in ${resendCountdown}s` : <><LogIn className="w-5 h-5" /> Send OTP</>}
                  </Button>

                  <Button
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 bg-white hover:bg-green-500/70 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign in with Google"}
                  </Button>
                </div>
              </form>

              {/* Error & Success Messages */}
              <div className="mt-6 text-center">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
              </div>

              <h1
                className="text-1xl font-bold text-center text-white mb-6 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300"
                onClick={() => setShowLogin(false)} // Toggle back to Signup
              >
                Don't have an account?
                <div className="text-blue-400 hover:text-blue-700">Sign up</div>
              </h1>
            </>
          ) : (
            <h1
              className="text-3xl font-bold text-center text-yellow-400 mb-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:text-yellow-700 transition-colors duration-300"
            >
              🔐
              <div>Upi-Crypto-Connect</div>
              <Btc size={170} color="orange" />
            </h1>
          )}
        </motion.div>
      </div>

      {/* Recaptcha Container */}
      <div id="recaptcha-container" />
    </div>
  );
};

export default OtpLogin;