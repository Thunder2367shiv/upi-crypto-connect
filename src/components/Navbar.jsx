"use client";
import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaBitcoin } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "./AuthProvider"; // Import AuthProvider hook
import { auth } from "../../firebase"; // Import Firebase auth
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Get the authenticated user

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="bg-gray-900 shadow-lg fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-5xl m-3 rounded-xl px-2 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <FaBitcoin className="text-3xl text-yellow-400" />
          <Link href="/" className="text-2xl font-bold text-white">
            Upi-Crypto-Connect
          </Link>
        </div>
        <div className="px-10"></div>
        {/* Desktop Menu */}
        <div className=" hidden md:flex space-x-6 items-center">
          <Link className="text-white hover:text-green-400 transition font-bold" href="/">
            Home
          </Link>
          <Link className="text-white hover:text-green-400 transition font-bold" href="/contact">
            Contact
          </Link>
          <Link className="text-white hover:text-green-400 transition font-bold" href="/buy-upi">
            Buy-Crypto
          </Link>
          <Link className="text-white hover:text-green-400 transition font-bold" href="/info">
            Explore
          </Link>

          {/* Auth Buttons */}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-bold"
                href="/pages/Authenticate"
              >
                Login / Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 absolute w-full left-0 top-full shadow-lg rounded-b-xl">
          <Link
            className="block py-3 px-6 text-white hover:text-green-400 transition"
            href="/"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            className="block py-3 px-6 text-white hover:text-green-400 transition"
            href="/contact"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            className="block py-3 px-6 text-white hover:text-green-400 transition"
            href="/buy-upi"
            onClick={() => setIsOpen(false)}
          >
            Buy UPI
          </Link>
          <Link
            className="block py-3 px-6 text-white hover:text-green-400 transition"
            href="/info"
            onClick={() => setIsOpen(false)}
          >
            Info
          </Link>

          {/* Auth Buttons in Mobile Menu */}
          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left py-3 px-6 text-white bg-red-500 hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                className="block py-3 px-6 text-white bg-green-500 hover:bg-green-600 transition"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="block py-3 px-6 text-white bg-blue-500 hover:bg-blue-600 transition"
                href="/signup"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
