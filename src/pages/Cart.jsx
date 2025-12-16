import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  const userId = 1; // ثابت حالياً

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `https://blomengdalis-tester.com/backend/get_cart.php?user_id=${userId}`
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, action) => {
    try {
      await axios.post(
        "https://blomengdalis-tester.com/backend/update-cart.php",
        {
          user_id: userId,
          product_id: productId,
          action: action,
        }
      );
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.post("https://blomengdalis-tester.com/backend/update-cart.php", {
        user_id: userId,
        product_id: productId,
        action: "delete"
      });
      fetchCart();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price_after * item.quantity,
    0
  );

  if (loading) return <div>جاري تحميل السلة...</div>;

  return (
    <div className="cart-container">
      <div className="div">
        <h1>حقيبة التسوق</h1>
        {cartItems.length === 0 ? (
          <p>حقيبة فارغة</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div
                key={`${item.product_id ?? "noid"}-${item.size}`}
                className="cart-item"
              >
                <img
                  src={`https://blomengdalis-tester.com/backend/uploads/${item.main_image}`}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <p>{item.name}</p>
                  <p>{item.description}</p>
                  <p>الحجم: {item.size}</p>
                  <span className="khsom">من {item.price_after} د.أ</span>
                  <a className="Sali">
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: " #888",
                        paddingLeft: "5px",
                      }}
                    >
                      {item.price_before} د.أ
                    </span>
                    <span style={{ color: " #000" }}>
                      {" "}
                      {item.discount_percent} %خصم
                    </span>
                  </a>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, "decrement")
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, "increment")
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="remove-item-btn"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="towdiv">
        <div className="cart-total">
          <p>المجموع: {totalAmount} ل.س</p>
        </div>
        {/* ✅ هنا نموذج الدفع المدمج */}
        <button>
          <Link to="/checkout" style={{}}>
            اتمام الدفع
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Cart;
