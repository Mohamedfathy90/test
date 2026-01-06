import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, Home, ShoppingCart } from "lucide-react";

const PaymentError = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order_id");

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <XCircle className="w-20 h-20 text-red-500 mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          فشلت عملية الدفع
        </h1>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold mb-2">
            لم تكتمل عملية الدفع
          </p>
          {orderId && (
            <p className="text-red-700 text-sm">
              رقم الطلب: <span className="font-bold">#{orderId}</span>
            </p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
          <p className="text-gray-800 font-semibold mb-2">أسباب محتملة:</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• رصيد غير كافٍ في البطاقة</li>
            <li>• بيانات البطاقة غير صحيحة</li>
            <li>• تم إلغاء العملية من قبلك</li>
            <li>• مشكلة تقنية مؤقتة</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/cart")}
            className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            العودة للسلة وإعادة المحاولة
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          للمساعدة، تواصل معنا على واتساب أو اتصل بنا
        </p>
      </div>
    </div>
  );
};

export default PaymentError;
