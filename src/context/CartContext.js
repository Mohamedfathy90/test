import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./context";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useUser();

  const fetchCartCount = async () => {
    if (!user?.id) {
      setCartCount(0);
      return;
    }

    try {
      const response = await axios.get(
        `https://blomengdalis-tester.com/backend/get_cart.php?user_id=${user.id}`
      );
      const totalCount = response.data.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalCount);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [user]);

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