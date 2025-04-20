"use client";
import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaBitcoin } from "react-icons/fa";
import Link from "next/link";
import { auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setIsuser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        sessionStorage.setItem("userId", currentUser.uid);
        setIsuser(true);
      } else {
        sessionStorage.removeItem("userId");
        setIsuser(false);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsuser(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
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

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link className="text-white hover:text-green-400 transition font-bold" href="/">
            Home
          </Link>
          <Link className="text-white hover:text-green-400 transition font-bold" href="/pages/Contact">
            Contact
          </Link>
          <Link className="text-white hover:text-green-400 transition font-bold" href="/pages/Buy_Crypto">
            Buy-Crypto
          </Link>
          <Link className="text-white hover:text-green-400 transition font-bold" href="/pages/Buy_Upi">
            Transfer-Crypto
          </Link>
          <Link className="text-white hover:text-green-400 transition font-bold" href="/pages/Explore">
            Explore
          </Link>

          {user && (
            <Link className="text-white hover:text-green-400 transition font-bold" href="/pages/UserProfile">
              Profile
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
            >
              Logout
            </button>
          ) : (
            <Link
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-bold"
              href="/pages/Authenticate"
            >
              Login / Signup
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
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
            href="/pages/Contact"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            className="block py-3 px-6 text-white hover:text-green-400 transition"
            href="/pages/Buy_Crypto"
            onClick={() => setIsOpen(false)}
          >
            Buy-Crypto
          </Link>
          <Link
            className="block py-3 px-6 text-white hover:text-green-400 transition"
            href="/pages/Buy_Upi"
            onClick={() => setIsOpen(false)}
          >
            Transfer-Crypto
          </Link>
          <Link
            className="block py-3 px-6 text-white hover:text-green-400 transition"
            href="/pages/Explore"
            onClick={() => setIsOpen(false)}
          >
            Explore
          </Link>

          {user && (
            <Link
              className="block py-3 px-6 text-white hover:text-green-400 transition"
              href="/pages/UserProfile"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          )}

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block w-full text-left py-3 px-6 text-white bg-red-500 hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              className="block py-3 px-6 text-white bg-green-500 hover:bg-green-600 transition"
              href="/pages/Authenticate"
              onClick={() => setIsOpen(false)}
            >
              Login / Signup
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
