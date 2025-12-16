import React, { useState } from 'react';
import axios from 'axios';

const ConfirmOrder = ({ cartItems, totalPrice }) => {
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [orderId, setOrderId] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      // إرسال بيانات الطلب للسيرفر
      const res = await axios.post(
        "https://blomengdalis-tester.com/backend/create_order.php",
        {
          ...form,
          total_price: totalPrice,
          items: cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
        }
      );

      const id = res.data.order_id;
      setOrderId(id);

      // إنشاء طلب الدفع
      const paymentRequest = await axios.post(
        "https://blomengdalis-tester.com/backend/create_payment.php",
        {
          name: form.name,
          total_price: totalPrice,
          order_id: id,
        },
        {
          headers: {
            Authorization: "", // غيّر الـ API Key
            "Content-Type": "application/json",
          },
        }
      );

      // التوجيه لصفحة الدفع
      window.location.href = paymentRequest.data.Data.PaymentURL;

    } catch (error) {
      console.error('خطأ في إرسال الطلب أو الدفع:', error);
      alert('حدث خطأ، حاول مرة ثانية.');
    }
  };

  return (
    <div className="container">
      <h2>معلومات التوصيل</h2>
      <input type="text" name="name" placeholder="الاسم" value={form.name} onChange={handleChange} />
      <input type="text" name="address" placeholder="العنوان" value={form.address} onChange={handleChange} />
      <input type="text" name="phone" placeholder="رقم الجوال" value={form.phone} onChange={handleChange} />
      <button onClick={handleSubmit}>تابع للدفع</button>
    </div>
  );
};

export default ConfirmOrder;
