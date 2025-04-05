"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { 
  User, 
  Phone, 
  Wallet, 
  CreditCard, 
  PlusCircle, 
  ArrowRightLeft,
  Lock,
  Loader2,
  X,
  Trash2
} from "lucide-react";
import AddPhone from "@/components/Add_Phone_Number";
import SetMpinForm from "@/components/MpinSet";
import TransferToWallet from "@/components/TransferFund";
import AddBankAccountForm from "@/components/Add_Bank_Account";
import Delete_Bank_Account from "@/components/Delete_Bank_Account";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMPIN, setHasMPIN] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [userId, setUserId] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          setMessage({ text: "User not authenticated", type: "error" });
          setLoading(false);
          return;
        }

        const userRes = await axios.post('/api/GetUserData', { userId });
        setUserData(userRes.data.data);

        const mpinRes = await axios.post('/api/Want_to_check_mpin', { userId });
        setHasMPIN(mpinRes.data.hasMPIN);

        const accountsRes = await axios.post('/api/FetchAllBankAccount', { userId });
        setBankAccounts(accountsRes.data.data);

      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({ 
          text: error.response?.data?.message || "Failed to load data", 
          type: "error" 
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (activeModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeModal]);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedAccount(null);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const userRes = await axios.post('/api/GetUserData', { userId });
      setUserData(userRes.data.data);

      const accountsRes = await axios.post('/api/FetchAllBankAccount', { userId });
      setBankAccounts(accountsRes.data.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{message.text || "User data not available"}</p>
        <button 
          onClick={() => window.location.href = "/login"}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${activeModal ? "blur-sm" : ""} `}>
        <div className="max-w-4xl mx-auto mt-16">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="mt-2 text-gray-100">Manage your account details and bank information</p>
          </div>

          {/* User Information Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </h2>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-600 w-32">Username:</span>
                      <span className="font-medium">{userData.username}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-32">Email:</span>
                      <span className="font-medium">{userData.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-32">Phone:</span>
                      {userData.phone ? (
                        <>
                          <span className="font-medium">{userData.phone}</span>
                          <button 
                            onClick={() => setActiveModal('updatePhone')}
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                          >
                            <Phone className="w-4 h-4" />
                            Update
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => setActiveModal('addPhone')}
                          className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Phone className="w-4 h-4" />
                          Add Number
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Wallet Balance</p>
                      <p className="text-xl font-bold">₹{userData.Wallet?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal('transferFunds')}
                    className="mt-3 text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-1 justify-center"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    Transfer Funds
                  </button>
                </div>
              </div>

              {/* MPIN Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">MPIN Security</span>
                  </div>
                  <button
                    onClick={() => setActiveModal(hasMPIN ? 'updateMpin' : 'setMpin')}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    {hasMPIN ? "Update MPIN" : "Set MPIN"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Accounts Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  My Bank Accounts
                </h2>
                <button
                  onClick={() => setActiveModal('addBankAccount')}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Account
                </button>
              </div>

              {bankAccounts.length > 0 ? (
                <div className="space-y-4">
                  {bankAccounts.map((account) => (
                    <div key={account._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition group relative">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <h3 className="font-medium">{account.bankName}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Account Number: {account.accountNumber?.replace(/.(?=.{4})/g, '•')} • {account.accountType} Account
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-medium">Current Amount: {account.Amount} {account.Currency} </p>
                            {account.UpiId && (
                              <p className="text-xs text-gray-500 mt-1">UPI: {account.UpiId}</p>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedAccount(account);
                              setActiveModal('deleteBankAccount');
                            }}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No bank accounts added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mt-6 p-3 rounded-lg text-center ${
              message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-fit"
          >

            <div className="">
              {activeModal === 'addPhone' && (
                <AddPhone 
                  userId={userId} 
                  onSuccess={() => {
                    refreshData();
                    closeModal();
                  }} 
                />
              )}

              {activeModal === 'updatePhone' && (
                <AddPhone 
                  userId={userId} 
                  initialPhone={userData.phone}
                  onSuccess={() => {
                    refreshData();
                    closeModal();
                  }} 
                />
              )}

              {activeModal === 'setMpin' && (
                <SetMpinForm 
                  userId={userId} 
                  onSuccess={() => {
                    setHasMPIN(true);
                    closeModal();
                  }} 
                />
              )}

              {activeModal === 'updateMpin' && (
                <SetMpinForm 
                  userId={userId} 
                  isUpdate={true}
                  onSuccess={closeModal} 
                />
              )}

              {activeModal === 'transferFunds' && (
                <TransferToWallet 
                  userId={userId} 
                  onSuccess={() => {
                    refreshData();
                    closeModal();
                  }} 
                />
              )}

              {activeModal === 'addBankAccount' && (
                <AddBankAccountForm 
                  userId={userId} 
                  onSuccess={() => {
                    refreshData();
                    closeModal();
                  }} 
                />
              )}

              {activeModal === 'deleteBankAccount' && selectedAccount && (
                <Delete_Bank_Account 
                  userId={userId} 
                  accountId={selectedAccount._id}
                  onSuccess={() => {
                    refreshData();
                    closeModal();
                  }} 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}