"use client";
import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaBitcoin } from "react-icons/fa";
import Link from "next/link";
import { auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pages/Contact", label: "Contact" },
  { href: "/pages/Buy_Crypto", label: "Buy-Crypto" },
  { href: "/pages/Buy_Upi", label: "Transfer-Crypto" },
  { href: "/pages/Explore", label: "Explore" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setIsUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        sessionStorage.setItem("userId", currentUser.uid);
        setIsUser(true);
      } else {
        sessionStorage.removeItem("userId");
        setIsUser(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsUser(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderLinks = (isMobile = false) => (
    <>
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          prefetch
          className={`${
            isMobile
              ? "block py-3 px-6"
              : "font-bold"
          } text-white hover:text-green-400 transition`}
          onClick={isMobile ? () => setIsOpen(false) : undefined}
        >
          {label}
        </Link>
      ))}

      {user && (
        <Link
          href="/pages/UserProfile"
          prefetch
          className={`${
            isMobile
              ? "block py-3 px-6"
              : "font-bold"
          } text-white hover:text-green-400 transition`}
          onClick={isMobile ? () => setIsOpen(false) : undefined}
        >
          Profile
        </Link>
      )}

      {user ? (
        <button
          onClick={() => {
            handleLogout();
            if (isMobile) setIsOpen(false);
          }}
          className={`${
            isMobile
              ? "block w-full text-left py-3 px-6"
              : "px-4 py-2 rounded-lg font-medium"
          } bg-red-500 text-white hover:bg-red-600 transition`}
        >
          Logout
        </button>
      ) : (
        <Link
          href="/pages/Authenticate"
          prefetch
          className={`${
            isMobile
              ? "block py-3 px-6"
              : "px-4 py-2 rounded-lg font-bold"
          } bg-green-500 text-white hover:bg-green-600 transition`}
          onClick={isMobile ? () => setIsOpen(false) : undefined}
        >
          Login / Signup
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-gray-900 shadow-lg fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-5xl m-3 rounded-xl px-2 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <FaBitcoin className="text-3xl text-yellow-400" />
          <Link href="/" prefetch className="text-2xl font-bold text-white">
            Upi-Crypto-Connect
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {renderLinks(false)}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 absolute w-full left-0 top-full shadow-lg rounded-b-xl animate-slide-down">
          {renderLinks(true)}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
