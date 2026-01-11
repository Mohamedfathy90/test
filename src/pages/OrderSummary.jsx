import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { getSessionId } from "../utils/SessionId";
import CheckoutHeader from "../components/CheckoutHeader";
import CheckoutOrderSummary from "../components/CheckoutOrderSummary";

const OrderSummaryPage = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

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

        {/* ORDER SUMMARY - DESKTOP & MOBILE */}
        <CheckoutOrderSummary
          cartItems={cartItems}
          totalAmount={totalAmount}
          taxAmount={taxAmount}
          finalTotal={finalTotal}
        />
      </div>
    </div>
  );
};

export default OrderSummaryPage;
