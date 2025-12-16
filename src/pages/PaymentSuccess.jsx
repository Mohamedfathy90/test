// src/pages/PaymentSuccess.jsx
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  useEffect(() => {
    if (orderId) {
      axios.post(
        "https://blomengdalis-tester.com/backend/update_payment_status.php",
        {
          order_id: orderId,
          payment_status: "paid",
        }
      );
    }
  }, [orderId]);

  return (
    <div className="container">
      <h2>تم الدفع بنجاح ✅</h2>
      <p>رقم الطلب: {orderId}</p>
      <p>شكراً لطلبك، سيتم تجهيز طلبك قريباً.</p>
    </div>
  );
};

export default PaymentSuccess;
