"use client";

import React from 'react'
import QRPage from '@/components/GenerateQr';
const page = () => {
  return (
    <div>
      
      <QRPage Amount = {200} UpiId= {"12345"} userId = {"67f0c4a55c16abc06c15fee7"}/>
    </div>
  )
}

export default page
