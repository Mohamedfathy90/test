import React from "react";
import { ShoppingCart, Package, Gift } from "lucide-react";

export default function OrderSummary({ totalAmount, taxAmount }) {
  const tabbyInstallment = (totalAmount / 4).toFixed(3);

  return (
    <div className="font-['Almarai']">
      <div className="max-w-md">
        {/* Header Links */}
        <div className="text-end p-5  text-sm">
          <div className="text-gray-700 underline cursor-pointer hover:text-gray-900">
            امير - اكسب واستبدل
          </div>
          <div className="text-gray-700 underline cursor-pointer hover:text-gray-900">
            أضف بطاقة هدايا باقوفنتديلز
          </div>
          <div className="text-gray-700 underline cursor-pointer hover:text-gray-900">
            أضف رمزاً ترويجياً
          </div>
        </div>

        {/* Order Summary Box */}
        <div className=" p-5 ">
          <h2 className="text-lg font-bold mb-4 text-right">ملخص الطلب</h2>

          {/* المجموع الفرعي */}
          <div className="flex justify-between items-center mb-3 text-sm">
            <div className="text-gray-700">المجموع الفرعي</div>
            <div className="font-semibold">KWD {totalAmount.toFixed(3)}</div>
          </div>

          {/* تقدير رسوم الشحن */}
          <div className="flex justify-between items-center mb-4 text-sm">
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600 w-4 h-4">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="8" cy="8" r="7" />
                  <text
                    x="8"
                    y="11"
                    textAnchor="middle"
                    fontSize="10"
                    fill="currentColor"
                    stroke="none"
                  >
                    !
                  </text>
                </svg>
              </button>
              <span className="text-gray-700">تقدير رسوم الشحن</span>
              <button className="text-blue-600 underline hover:text-blue-800">
                التوصيل للكويت
              </button>
            </div>
            <div className="text-gray-700">مجاناً</div>
          </div>

          {/* Free Shipping Banner */}
          <div className="bg-green-50 border border-green-300 rounded-md p-3 mb-4 flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-green-700 text-sm font-medium">
              طلبك مؤهل لـ الشحن المجاني
            </span>
          </div>

          {/* المبلغ الإجمالي */}
          <div className="border-t border-gray-300 pt-3 mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="text-base font-semibold">المبلغ الإجمالي</div>

              <div className="text-xl font-bold">
                KWD {totalAmount.toFixed(3)}
              </div>
            </div>
            <div className="text-left text-xs text-gray-500">
              يشمل جميع الضرائب و / أو الرسوم
            </div>
          </div>

          {/* Checkout Button */}
          <button className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mb-3">
            <ShoppingCart className="w-4 h-4" />
            إكمال عملية الشراء
          </button>

          {/* Tabby Payment */}
          <div className="text-center text-xs text-gray-600">
            <span className="font-semibold">
              4 دفعات بدون فوائد بقيمة KWD {tabbyInstallment}
            </span>
            <span className="mx-1 font-bold">tabby</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Visa_2014_logo_detail.svg"
              alt="Visa"
              className="h-5"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              className="h-5"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
              alt="Amex"
              className="h-5"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="h-6"
            />
            <div className="text-xs font-bold px-2 py-1 border border-gray-400 rounded">
              COD
            </div>
            <div className="text-xs font-bold text-teal-600 px-2">tabby</div>
            <div className="text-xs font-bold px-2">🍎 Pay</div>
          </div>
        </div>

        {/* Delivery Info Box */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
            <div className="flex-1 text-right text-sm">
              <h3 className="font-semibold mb-1">
                انضموا لبرنامج المكافآت بلومز بيوتي
              </h3>
              <p className="text-gray-600 leading-relaxed">
                سجلوا في برنامج المكافآت بلومز بيوتي حيث يمكنكم مشاركتكم من
                منتجات لجمال الحصول على هدايا حصرية!{" "}
                <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                  اضغطوا لقن
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Gift Wrapping */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div className="flex-1 text-right text-sm font-semibold">
              تغليف الهدايا متوفر عند الشراء
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
