"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PayPalProvider({ children }) {
  return (
    <PayPalScriptProvider options={{ "client-id": "ASJuNEnegy6BO5KDbGuB5nZNpCJ1raVFR2QaKQwm3Ymdbgi1c4oJXpj0FrnkYl0WJa5SittgK3fX3"}}>
      {children}
    </PayPalScriptProvider>
  );
}
