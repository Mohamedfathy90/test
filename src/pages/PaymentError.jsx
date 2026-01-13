import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, Home, ShoppingCart, RefreshCw } from "lucide-react";

const PaymentError = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order_id");
  const paymentId = searchParams.get("paymentId");
  const [errorDetails, setErrorDetails] = useState("");

  useEffect(() => {
    // محاولة الحصول على تفاصيل الخطأ من query parameters
    const errorMsg = searchParams.get("error");
    const message = searchParams.get("message");
    
    if (errorMsg) {
      setErrorDetails(errorMsg);
    } else if (message) {
      setErrorDetails(message);
    }
  }, [searchParams]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-white  p-8 text-center">
        <div className="mb-6">
          <XCircle className="w-20 h-20 text-red-500 mx-auto" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          فشلت عملية الدفع
        </h1>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold mb-2">
            لم تكتمل عملية الدفع
          </p>
          {orderId && (
            <p className="text-red-700 text-sm mb-1">
              رقم الطلب: <span className="font-bold">#{orderId}</span>
            </p>
          )}
          {paymentId && (
            <p className="text-red-700 text-xs">
              معرف الدفع: <span className="font-mono">{paymentId}</span>
            </p>
          )}
          {errorDetails && (
            <p className="text-red-600 text-xs mt-2 italic">
              {errorDetails}
            </p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
          <p className="text-gray-800 font-semibold mb-2">أسباب محتملة:</p>
          <ul className="text-sm text-gray-600 space-y-2 text-right">
            <li>• رصيد غير كافٍ في البطاقة</li>
            <li>• بيانات البطاقة غير صحيحة أو منتهية الصلاحية</li>
            <li>• تم إلغاء العملية من قبلك</li>
            <li>• مشكلة تقنية مؤقتة في نظام الدفع</li>
            <li>• البطاقة غير مفعلة للدفع عبر الإنترنت</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-2
             bg-black text-white font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="w-full py-2 border-1 border-gray-300 text-gray-700  font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            العودة للسلة
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full py-2 border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">
            للمساعدة والدعم الفني
          </p>
          <p className="text-xs text-gray-400">
            يرجى التواصل معنا عبر واتساب أو البريد الإلكتروني
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;
