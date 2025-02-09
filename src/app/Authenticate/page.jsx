"use client";

import React from "react";
import OtpLogin from "@/components/login_signup";

const Login = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black p-6">
      {/* Increase the width of the parent container */}
      <div className="w-full max-w-6xl">
        <OtpLogin />
      </div>
    </div>
  );
};

export default Login;