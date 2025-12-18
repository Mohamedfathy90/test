import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/context";
import { useCart } from "../context/CartContext";
import EmptyCart from "../components/EmptyCart";
import CartItem from "../components/ItemsCart";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { updateCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    if (!user?.id) return;

    try {
      const response = await axios.get(
        `https://blomengdalis-tester.com/backend/get_cart.php?user_id=${user.id}`
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, action) => {
    if (!user?.id) return;

    try {
      await axios.post(
        "https://blomengdalis-tester.com/backend/update-cart.php",
        { user_id: user.id, product_id: productId, action }
      );
      fetchCart();
      updateCartCount();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (productId) => {
    if (!user?.id) return;

    try {
      await axios.post(
        "https://blomengdalis-tester.com/backend/update-cart.php",
        { user_id: user.id, product_id: productId, action: "delete" }
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

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">جاري تحميل السلة...</div>
      </div>
    );
  }

  if (cartItems.length === 0) return <EmptyCart />;

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-normal text-right mb-8 pb-4 border-b">
        حقيبة التسوق
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products */}
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
          <div className="border-t-4 border-gray-200 sticky top-4">
            <h2 className="text-xl font-medium text-center py-4 bg-gray-50">
              ملخص الطلب
            </h2>

            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span>المجموع الفرعي</span>
                <span className="font-medium">
                  KWD {totalAmount.toFixed(3)}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>تقدير رسوم الشحن</span>
                <span>التوصيل للكويت</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>(يشمل الضرائب)</span>
                <span>KWD {taxAmount}</span>
              </div>

              <div className="pt-4 border-t-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-semibold">
                    المبلغ الإجمالي
                  </span>
                  <span className="text-lg font-bold">
                    KWD {totalAmount.toFixed(3)}
                  </span>
                </div>
              </div>

              <Link to="/checkout">
                <button className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-900 transition-colors">
                  إكمال عملية الشراء
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
