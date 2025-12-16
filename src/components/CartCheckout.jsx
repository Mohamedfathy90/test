import React, { useState } from 'react';
import axios from 'axios';

const CheckoutForm = ({ cartItems, totalAmount }) => {
  const [formData, setFormData] = useState({
    name: "",
  phone: "",
  address: "",
  street: " ",
  items: []
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      total: totalAmount,
      items: cartItems
    };

    try {
      const res = await axios.post(
        "https://blomengdalis-tester.com/backend/create_invoice.php",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data && res.data.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        alert('فشل في إنشاء الفاتورة.');
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      alert('حدث خطأ أثناء محاولة إتمام الدفع.');
    }
  };

  return (
    <div className="checkout-form-container">
      <h2>تأكيد الطلب</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>الاسم الكامل:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>رقم الجوال:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>المدينة / المنطقة:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />

        <label>اسم الشارع:</label>
        <input type="text" name="street" value={formData.street} onChange={handleChange} required />

        <button type="submit" className="confirm-order-btn">إتمام الدفع</button>
      </form>
    </div>
  );
};

export default CheckoutForm;
