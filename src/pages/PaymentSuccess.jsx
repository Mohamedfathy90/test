import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order_id");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          تم الدفع بنجاح! 🎉
        </h1>

        <p className="text-gray-600 mb-2">شكراً لك على طلبك</p>

        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            رقم الطلب: <span className="font-mono font-bold">#{orderId}</span>
          </p>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            سيتم إرسال رسالة تأكيد على رقم الهاتف المسجل
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          سيتم توجيهك للصفحة الرئيسية خلال {countdown} ثانية
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
