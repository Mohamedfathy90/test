import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import EmptyCart from "../components/EmptyCart";
import CartItem from "../components/ItemsCart";
import OrderSummary from "../components/OrderSummary";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateCartCount } = useCart();
  const navigate = useNavigate();

  // دالة لإنشاء أو جلب Session ID
  const getSessionId = () => {
    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId =
        "guest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("session_id", sessionId);
    }
    return sessionId;
  };

  const sessionId = getSessionId();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
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

  const updateQuantity = async (productId, action) => {
    try {
      await axios.post(
        "https://blomengdalis-tester.com/backend/update-cart.php",
        {
          session_id: sessionId,
          product_id: productId,
          action,
        }
      );
      fetchCart();
      updateCartCount();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.post(
        "https://blomengdalis-tester.com/backend/update-cart.php",
        {
          session_id: sessionId,
          product_id: productId,
          action: "delete",
        }
      );
      fetchCart();
      updateCartCount();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price_after * item.quantity,
    0
  );
  const taxAmount = (totalAmount * 0.05).toFixed(3);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">جاري تحميل السلة...</div>
      </div>
    );
  }

  if (cartItems.length === 0) return <EmptyCart />;

  return (
    <div dir="rtl">
      {/* Top Banner */}
      <div className="w-full bg-black text-white text-center py-2.5 text-sm mb-4">
        احصلوا على أحدث صيحات الموضة والجمال خلال ساعتين إلى باب منزلكم{" "}
        <Link
          to="/"
          className="text-white border-bottom font-medium transition"
        >
          تسوقوا الآن
        </Link>
      </div>

      <h1 className=" text-right mb-8 pb-4 border-b site-wrapper text-title-lg ">
        حقيبة التسوق
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 site-wrapper">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <CartItem
              key={`${item.product_id}-${item.size}`}
              item={item}
              removeItem={removeItem}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary totalAmount={totalAmount} taxAmount={taxAmount} />
        </div>
        {/* <Link to="/checkout">
                <button className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-900 transition-colors">
                  إكمال عملية الشراء
                </button>
              </Link> */}
      </div>``
    </div>
  );
};

export default Cart;
