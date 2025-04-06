"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { 
  User, Phone, Wallet, CreditCard, PlusCircle, 
  ArrowRightLeft, Lock, Loader2, Trash2, History 
} from "lucide-react";
import AddPhone from "@/components/Add_Phone_Number";
import SetMpinForm from "@/components/MpinSet";
import TransferToWallet from "@/components/TransferFund";
import AddBankAccountForm from "@/components/Add_Bank_Account";
import Delete_Bank_Account from "@/components/Delete_Bank_Account";

const ProfileSection = ({ userData, hasMPIN, setActiveModal, refreshData }) => (
  <>
    <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Personal Information
        </h2>
        <div className="mt-4 space-y-3">
          <ProfileField label="Username" value={userData.username} />
          <ProfileField label="Email" value={userData.email} />
          <PhoneField 
            phone={userData.phone} 
            onUpdate={() => setActiveModal('updatePhone')}
            onAdd={() => setActiveModal('addPhone')}
          />
        </div>
      </div>
      <WalletSection 
        balance={userData.Wallet} 
        onTransfer={() => setActiveModal('transferFunds')} 
      />
    </div>

    <MpinSection 
      hasMPIN={hasMPIN} 
      onSetMpin={() => setActiveModal(hasMPIN ? 'updateMpin' : 'setMpin')} 
    />
  </>
);

const ProfileField = ({ label, value }) => (
  <div className="flex items-center">
    <span className="text-gray-600 w-32">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

const PhoneField = ({ phone, onUpdate, onAdd }) => (
  <div className="flex items-center">
    <span className="text-gray-600 w-32">Phone:</span>
    {phone ? (
      <>
        <span className="font-medium">{phone}</span>
        <Button icon={<Phone size={16} />} onClick={onUpdate} text="Update" />
      </>
    ) : (
      <Button icon={<Phone size={16} />} onClick={onAdd} text="Add Number" />
    )}
  </div>
);

const WalletSection = ({ balance, onTransfer }) => (
  <div className="bg-blue-50 p-4 rounded-lg w-full sm:w-auto">
    <div className="flex items-center gap-2">
      <Wallet className="w-6 h-6 text-blue-600" />
      <div>
        <p className="text-sm text-gray-500">Wallet Balance</p>
        <p className="text-xl font-bold">₹{balance?.toLocaleString() || '0'}</p>
      </div>
    </div>
    <Button 
      icon={<ArrowRightLeft size={16} />} 
      onClick={onTransfer} 
      text="Transfer Funds" 
      className="mt-3 justify-center"
    />
  </div>
);

const MpinSection = ({ hasMPIN, onSetMpin }) => (
  <div className="mt-6 pt-6 border-t border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Lock className="w-5 h-5 text-blue-600" />
        <span className="font-medium">MPIN Security</span>
      </div>
      <Button 
        onClick={onSetMpin} 
        text={hasMPIN ? "Update MPIN" : "Set MPIN"} 
      />
    </div>
  </div>
);

const BankAccountsSection = ({ accounts, setActiveModal, setSelectedAccount }) => (
  <>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-blue-600" />
        My Bank Accounts
      </h2>
      <Button 
        icon={<PlusCircle size={16} />} 
        onClick={() => setActiveModal('addBankAccount')} 
        text="Add Account" 
      />
    </div>

    {accounts.length > 0 ? (
      <div className="space-y-4">
        {accounts.map(account => (
          <BankAccountCard 
            key={account._id} 
            account={account} 
            onDelete={() => {
              setSelectedAccount(account);
              setActiveModal('deleteBankAccount');
            }} 
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">No bank accounts added yet</p>
      </div>
    )}
  </>
);

const BankAccountCard = ({ account, onDelete }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition group relative">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <h3 className="font-medium">{account.bankName}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Account Number: {account.accountNumber?.replace(/.(?=.{4})/g, '•')} • {account.accountType} Account
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">Current Amount: {account.Amount} {account.Currency}</p>
          {account.UpiId && (
            <p className="text-xs text-gray-500 mt-1">UPI: {account.UpiId}</p>
          )}
        </div>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-600 transition-colors p-1"
          title="Delete account"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const TransactionHistory = ({ transactions, transactionLoading, fetchTransactions }) => (
  <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:scale-[1.005]">
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          Transaction History
        </h2>
        <Button 
          icon={transactionLoading ? <Loader2 className="animate-spin" size={16} /> : null}
          onClick={fetchTransactions} 
          text={transactionLoading ? "" : "Refresh"}
          disabled={transactionLoading}
        />
      </div>

      {transactionLoading && !transactions.length ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader>Transaction ID</TableHeader>
                <TableHeader>UPI ID</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Date</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map(transaction => (
                <TransactionRow key={transaction._id} transaction={transaction} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No transactions found</p>
        </div>
      )}
    </div>
  </div>
);

const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TransactionRow = ({ transaction }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {transaction.transactionId}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {transaction.UpiId || 'N/A'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      ₹{transaction.Amount}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <StatusBadge status={transaction.status} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(transaction.createdAt).toLocaleDateString()}
    </td>
  </tr>
);

const StatusBadge = ({ status }) => (
  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
    status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }`}>
    {status}
  </span>
);

const Button = ({ icon, text, onClick, disabled, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-1 ${className}`}
  >
    {icon}
    {text}
  </button>
);

const ModalContainer = ({ activeModal, userId, userData, selectedAccount, closeModal, refreshData }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-fit">
      {activeModal === 'addPhone' && (
        <AddPhone userId={userId} onSuccess={refreshData} />
      )}
      {activeModal === 'updatePhone' && (
        <AddPhone userId={userId} initialPhone={userData.phone} onSuccess={refreshData} />
      )}
      {activeModal === 'setMpin' && (
        <SetMpinForm userId={userId} onSuccess={closeModal} />
      )}
      {activeModal === 'updateMpin' && (
        <SetMpinForm userId={userId} isUpdate={true} onSuccess={closeModal} />
      )}
      {activeModal === 'transferFunds' && (
        <TransferToWallet userId={userId} onSuccess={refreshData} />
      )}
      {activeModal === 'addBankAccount' && (
        <AddBankAccountForm userId={userId} onSuccess={refreshData} />
      )}
      {activeModal === 'deleteBankAccount' && selectedAccount && (
        <Delete_Bank_Account 
          userId={userId} 
          accountId={selectedAccount._id}
          onSuccess={refreshData} 
        />
      )}
    </div>
  </div>
);

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
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

  const fetchData = async () => {
    try {
      if (!userId) {
        setMessage({ text: "User not authenticated", type: "error" });
        setLoading(false);
        return;
      }

      const [userRes, mpinRes, accountsRes] = await Promise.all([
        axios.post('/api/GetUserData', { userId }),
        axios.post('/api/Want_to_check_mpin', { userId }),
        axios.post('/api/FetchAllBankAccount', { userId })
      ]);

      setUserData(userRes.data.data);
      setHasMPIN(mpinRes.data.hasMPIN);
      setBankAccounts(accountsRes.data.data);
      setMessage({ text: "", type: "" });
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

  const fetchTransactions = async () => {
    try {
      setTransactionLoading(true);
      const res = await axios.post('/api/ShowHistoryTransaction', { userId });
      setTransactions(res.data.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to load transaction history",
        type: "error"
      });
    } finally {
      setTransactionLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await fetchData();
      await fetchTransactions();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
      refreshData();
    }
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
      <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${activeModal ? "blur-sm" : ""}`}>
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="mt-2 text-gray-100">Manage your account details and bank information</p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <ProfileSection 
                userData={userData} 
                hasMPIN={hasMPIN} 
                setActiveModal={setActiveModal} 
                refreshData={refreshData} 
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <BankAccountsSection 
                accounts={bankAccounts} 
                setActiveModal={setActiveModal} 
                setSelectedAccount={setSelectedAccount} 
              />
            </div>
          </div>

          <TransactionHistory 
            transactions={transactions} 
            transactionLoading={transactionLoading} 
            fetchTransactions={fetchTransactions} 
          />

          {message.text && (
            <div className={`mt-6 p-3 rounded-lg text-center ${
              message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      {activeModal && (
        <ModalContainer 
          activeModal={activeModal} 
          userId={userId} 
          userData={userData} 
          selectedAccount={selectedAccount} 
          closeModal={closeModal} 
          refreshData={refreshData} 
        />
      )}
    </>
  );
}