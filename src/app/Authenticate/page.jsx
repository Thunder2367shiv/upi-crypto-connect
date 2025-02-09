"use client";

import React from "react";
import OtpLogin from "@/components/login_signup";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black p-6">
      <div className="text-[#35b0ac] text-4xl font-bold">User Authentication Hub</div>
      {/* Increase the width of the parent container */}
      <div className="w-full max-w-6xl">
        <OtpLogin />
      </div>
    </div>
  );
};

export default Login;