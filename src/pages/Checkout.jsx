import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CheckoutPage = () => {
  const [paymentUrl, setPaymentUrl] = useState('');

  useEffect(() => {
  axios
    .post("https://blomengdalis-tester.com/backend/create_payment.php", {
      name: "عميل تجريبي",
      total_price: 100,
      order_id: 12345,
    })
    .then((res) => {
      console.log("Response from create_payment.php:", res.data); // ⬅️ أضف هذا
      if (res.data.success && res.data.PaymentURL) {
        setPaymentUrl(res.data.PaymentURL);
      } else {
        console.error("No PaymentURL:", res.data);
      }
    })
    .catch((err) => {
      console.error("Error fetching payment URL", err);
    });
}, []);

  return (
    <div>
      {paymentUrl ? (
        <iframe
  src={paymentUrl}
  title="MyFatoorah Payment"
  width="100%"
  height="600px"
  frameBorder="0"
  allow="payment"
/>

      ) : (
        <p>جاري تحميل بوابة الدفع...</p>
      )}
    </div>
  );
};

export default CheckoutPage;