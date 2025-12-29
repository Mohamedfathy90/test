import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // دالة لجلب Session ID
  const getSessionId = () => {
    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId =
        "guest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("session_id", sessionId);
    }
    return sessionId;
  };

  const fetchCartCount = async () => {
    const sessionId = getSessionId();

    try {
      const response = await axios.get(
        `https://blomengdalis-tester.com/backend/get_cart.php?session_id=${sessionId}`
      );
      const totalCount = response.data.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartCount(totalCount);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const updateCartCount = () => {
    fetchCartCount();
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
