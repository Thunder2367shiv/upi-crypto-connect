"use client";

import React from "react";
import OtpLogin from "@/components/login_signup";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-6">
      <div className="text-white text-4xl font-extrabold bg-black p-2 border-gray-500 border-8 rounded-3xl">User Authentication Hub</div>
      {/* Increase the width of the parent container */}
      <div className="w-full max-w-6xl">
        <OtpLogin />
      </div>
    </div>
  );
};

export default Login;