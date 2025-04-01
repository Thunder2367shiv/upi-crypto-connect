"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useCallback, useState } from "react";

const ConnectWallet = () => {
  const { publicKey, connected, select } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = useCallback(() => {
    select("Phantom"); // Select Phantom wallet
    setVisible(true); // Open wallet modal
  }, [select, setVisible]);

  return (
    <button
  onClick={handleConnect}
  className={`px-4 py-2 rounded-lg shadow text-white transition 
    ${connected ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-600 hover:bg-red-700"}`}
>
  {connected ? "Phantom Wallet Connected" : "Connect Phantom Wallet"}
</button>

  );
};

export default ConnectWallet;
