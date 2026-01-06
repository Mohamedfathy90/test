import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getSessionId } from "../utils/SessionId";
import CheckoutHeader from "../components/CheckoutHeader";
import CheckoutOrderSummary from "../components/CheckoutOrderSummary";


const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = getSessionId();

  const cartItems = location.state?.cartItems || [];
  const totalAmount = location.state?.totalAmount || 0;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    street: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ التحقق من وجود منتجات
    if (cartItems.length === 0) {
      setError("السلة فارغة! أضف منتجات أولاً");
      return;
    }

    // ✅ التحقق من الـ session_id
    if (!sessionId) {
      setError("خطأ في الجلسة. حاول إعادة تحميل الصفحة");
      return;
    }

    setLoading(true);
    setError("");

    // ✅ تجهيز بيانات المنتجات
    const items = cartItems.map((item) => {
      const price =
        parseFloat(item.price_after) ||
        parseFloat(item.original_price) ||
        parseFloat(item.price_before) ||
        0;

      return {
        product_id: item.product_id,
        quantity: item.quantity,
        size: item.size || "",
        price: price,
      };
    });

    // ✅ الـ Payload المطابق لقاعدة البيانات
    const payload = {
      session_id: sessionId, // ✅ مهم للـ Backend
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      street: formData.street,
      total_price: totalAmount, // ✅ تغيير من total إلى total_price
      items: items,
    };

    console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

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

      console.log("📥 Response:", res.data);

      if (res.data && res.data.payment_url) {
        window.location.href = res.data.payment_url;
      } else if (res.data.error) {
        setError(
          res.data.error + (res.data.message ? ": " + res.data.message : "")
        );
        console.error(" Backend error:", res.data);
      } else {
        setError("فشل في إنشاء الفاتورة. حاول مرة أخرى.");
      }
    } catch (err) {
      console.error("Error during checkout:", err);

      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        setError(
          err.response.data?.message ||
            "حدث خطأ في الاتصال بالخادم. حاول مرة أخرى."
        );
      } else if (err.request) {
        setError("لا يوجد استجابة من الخادم. تحقق من الاتصال بالإنترنت.");
      } else {
        setError("حدث خطأ غير متوقع: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ التحقق من وجود بيانات السلة
  if (cartItems.length === 0) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              السلة فارغة!
            </h2>
            <p className="text-gray-600 mb-6">
              لا يوجد منتجات في السلة. أضف منتجات أولاً.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              العودة للتسوق
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">إتمام الطلب</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الجوال *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="مثال: 50123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدينة / المنطقة *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="مثال: الكويت - حولي"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الشارع / المبنى *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="مثال: شارع السالمية - مبنى 15"
              />
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">عدد المنتجات:</span>
                <span className="font-semibold">{cartItems.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">المبلغ الإجمالي:</span>
                <span className="text-xl font-bold">
                  {totalAmount.toFixed(3)} KWD
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {loading ? "جاري المعالجة..." : "المتابعة للدفع"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="w-full py-3 rounded-lg font-semibold text-gray-700 border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              العودة للسلة
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
