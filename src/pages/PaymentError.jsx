// src/pages/PaymentError.jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentError = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  return (
    <div className="container">
      <h2>فشل الدفع ❌</h2>
      <p>رقم الطلب: {orderId}</p>
      <p>حدث خطأ أثناء عملية الدفع. الرجاء المحاولة مرة أخرى.</p>
    </div>
  );
};

export default PaymentError;
