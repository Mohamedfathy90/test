import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { getSessionId } from "../utils/SessionId";
import CheckoutHeader from "../components/CheckoutHeader";
import {ChevronDown, ChevronUp } from "lucide-react";
import applePayIcon from "../assets/checkout-applepay.svg";
import codIcon from "../assets/checkout-cod.svg";
import tabbyIcon from "../assets/checkout-tabby.svg";
import amexIcon from "../assets/checkout-american-express.svg";
import mastercardIcon from "../assets/checkout-mastercard.svg";
import visaIcon from "../assets/checkout-visa.svg";
import pciIcon from "../assets/checkout-pci.svg";
import knetIcon from "../assets/checkout-knet.svg";
import paypalIcon from "../assets/checkout-paypal.svg";
const OrderSummaryPage = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const sessionId = getSessionId();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `https://blomengdalis-tester.com/backend/get_cart.php?session_id=${sessionId}`
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce((total, item) => {
    const itemPrice =
      parseFloat(item.price_after) ||
      parseFloat(item.original_price) ||
      parseFloat(item.price_before) ||
      0;
    return total + itemPrice * item.quantity;
  }, 0);

  const taxAmount = (totalAmount * 0.05).toFixed(3);
  const finalTotal = (totalAmount + parseFloat(taxAmount)).toFixed(3);



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-3"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-white pb-20 lg:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-screen">
        {/* LEFT SIDE - CHECKOUT FORM */}
        <div className="lg:col-span-2">
          <CheckoutHeader />

          {/* CONTENT */}
          <div className="px-4 py-3">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-lg font-semibold mb-4 text-right">
                الدفع كزائر
              </h2>

              <div className="border border-gray-500  p-3 py-4">
                <div className="flex gap-3 items-start mb-4">
                  <input
                    type="radio"
                    checked={isGuest}
                    onChange={() => setIsGuest(true)}
                    className="mt-0.5 w-5 h-5 flex-shrink-0 accent-black"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1 text-right">
                      إتمام الطلب دون اشتراك
                    </p>
                    <p className="text-xs text-gray-500 text-right leading-relaxed">
                      يمكنكم إنشاء حساب بسرعة بعد الدفع
                    </p>
                  </div>
                </div>

                <div className="space-y-4 ">
                  <button
                    onClick={() =>
                      navigate("/checkout", {
                        state: {
                          cartItems,
                          totalAmount: parseFloat(finalTotal),
                        },
                      })
                    }
                    className="w-full bg-black text-white p-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    كضيف الدفع
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    للتعرف على المزيد حول{" "}
                    <Link href="#" className="underline hover:text-gray-700">
                      سياسة الخصوصية
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - SUMMARY (DESKTOP ONLY) */}
        <div className="hidden lg:flex lg:col-span-1 bg-gray-50 min-h-screen flex-col">
        
          <div className="px-5 py-6 border-b border-gray-200 sticky top-0 bg-card z-10 h-20 flex items-center">
            <h2 className="text-base xl:text-lg font-semibold">
              ملخص الطلب{" "}
              <span className="text-gray-500 font-medium">
                ({cartItems.length})
              </span>
            </h2>
          </div>

          {/* CONTENT */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* PRODUCTS */}
            <div className="px-6 xl:px-8 py-6 flex-1 overflow-y-auto">
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const price =
                    parseFloat(item.price_after) ||
                    parseFloat(item.original_price) ||
                    parseFloat(item.price_before) ||
                    0;

                  return (
                    <div
                      key={item.product_id}
                      className="pb-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-16 h-20 flex-shrink-0">
                          <img
                            src={`https://blomengdalis-tester.com/backend/uploads/${item.main_image}`}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                          <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="text-sm font-bold text-gray-900">
                              KWD {(price * item.quantity).toFixed(3)}
                            </span>
                            <span className="text-xs text-gray-400">
                              {item.quantity} × KWD {price.toFixed(3)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TOTAL */}
            <div className="px-6 xl:px-8 py-5 xl:py-6 border-t border-gray-300 bg-gray-50">
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span>KWD {totalAmount.toFixed(3)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span>مجاناً</span>
                </div>

                <div className="flex justify-between">
                  <span>الضريبة (5%)</span>
                  <span>KWD {taxAmount}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-gray-300 font-bold text-base">
                  <span>المبلغ الإجمالي</span>
                  <span>KWD {finalTotal}</span>
                </div>

                <p className="text-xs text-gray-500 pt-1">
                  يشمل جميع الضرائب والرسوم
                </p>

                {/* Payment Methods */}
                <div className="pt-4 mt-2 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-start gap-2">
                    <img
                      src={applePayIcon}
                      alt="Apple Pay"
                      className="h-6 object-contain"
                    />
                    <img
                      src={codIcon}
                      alt="COD"
                      className="h-6 object-contain"
                    />
                    <img
                      src={tabbyIcon}
                      alt="Tabby"
                      className="h-6 object-contain"
                    />
                    <img
                      src={amexIcon}
                      alt="American Express"
                      className="h-6 object-contain"
                    />
                    <img
                      src={mastercardIcon}
                      alt="Mastercard"
                      className="h-6 object-contain"
                    />
                    <img
                      src={visaIcon}
                      alt="Visa"
                      className="h-6 object-contain"
                    />
                    <img
                      src={pciIcon}
                      alt="PCI"
                      className="h-6 object-contain"
                    />
                    <img
                      src={knetIcon}
                      alt="Knet"
                      className="h-6 object-contain"
                    />
                    <img
                      src={paypalIcon}
                      alt="PayPal"
                      className="h-6 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE ORDER SUMMARY TOGGLE - BOTTOM */}
      {/* Backdrop - اللي ورا الصفحة */}
      {showOrderSummary && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setShowOrderSummary(false)}
        />
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg rounded-t-3xl transition-transform duration-300 ease-out">
        {/* ORDER SUMMARY HEADER - SHOWS WHEN EXPANDED */}
        {showOrderSummary && (
          <div className="px-4 py-3 bg-card border-b border-gray-200 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center  gap-2">
                <h3 className="text-base font-semibold">ملخص الطلب</h3>
                <span className="text-sm text-gray-500 font-medium">
                  ({cartItems.length})
                </span>
              </div>
              <button
                onClick={() => setShowOrderSummary(false)}
                className="p-1"
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* EXPANDABLE ORDER SUMMARY */}
        {showOrderSummary && (
          <div className="bg-card max-h-[60vh] overflow-y-auto">
            <div className="px-4 py-4">
              {/* PRODUCTS */}
              <div className="mb-4 space-y-3">
                {cartItems.map((item) => {
                  const price =
                    parseFloat(item.price_after) ||
                    parseFloat(item.original_price) ||
                    parseFloat(item.price_before) ||
                    0;

                  return (
                    <div
                      key={item.product_id}
                      className="flex gap-3 pb-3 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="relative w-14 h-16 sm:w-16 sm:h-20 flex-shrink-0">
                        <img
                          src={`https://blomengdalis-tester.com/backend/uploads/${item.main_image}`}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-gray-900">
                            KWD {(price * item.quantity).toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TOTALS */}
              <div className="space-y-2 text-xs sm:text-sm pt-3 border-t border-gray-300">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span>KWD {totalAmount.toFixed(3)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span>مجاناً</span>
                </div>

                <div className="flex justify-between">
                  <span>الضريبة (5%)</span>
                  <span>KWD {taxAmount}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-gray-300 font-bold text-sm sm:text-base">
                  <span>المبلغ الإجمالي</span>
                  <span>KWD {finalTotal}</span>
                </div>

                <p className="text-xs text-gray-500 pt-1">
                  يشمل جميع الضرائب والرسوم
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ORDER SUMMARY TOGGLE BUTTON - SHOWS WHEN COLLAPSED */}
        {!showOrderSummary && (
          <button
            onClick={() => setShowOrderSummary(true)}
            className="w-full px-4 py-3 sm:py-4 border-t bg-card border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              {/* Price Info */}
              <div className="flex-1 text-right">
                <div className="flex items-baseline justify-start gap-2 mb-0.5">
                  <span className="text-xs sm:text-sm text-gray-600">
                    المبلغ الإجمالي
                  </span>
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    KWD {finalTotal}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  يشمل جميع الضرائب و الرسوم
                </p>
              </div>
              {/* Arrow Icon */}
              <div className="flex-shrink-0">
                <ChevronUp className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderSummaryPage;
