import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [favoritesIds, setFavoritesIds] = useState([]);

  const getSessionId = () => {
    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId =
        "guest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("session_id", sessionId);
    }
    return sessionId;
  };

  // ✅ دالة لجلب العدد فقط
  const fetchFavoritesCount = async () => {
    try {
      const sessionId = getSessionId();
      const res = await axios.get(
        `https://blomengdalis-tester.com/backend/get_favorites.php?session_id=${sessionId}`
      );
      setFavoritesCount(res.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ دالة لجلب الـ IDs كاملة
  const fetchFavoritesIds = async () => {
    try {
      const sessionId = getSessionId();
      const res = await axios.get(
        `https://blomengdalis-tester.com/backend/get_favorites.php?session_id=${sessionId}`
      );
      const ids = res.data.map((item) => parseInt(item.id));
      setFavoritesIds(ids);
      setFavoritesCount(ids.length); // نحدث العدد كمان
    } catch (err) {
      console.error(err);
      setFavoritesIds([]);
      setFavoritesCount(0);
    }
  };

  useEffect(() => {
    fetchFavoritesIds(); // نجيب الـ IDs أول ما الـ Context يشتغل
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favoritesCount,
        favoritesIds,
        fetchFavoritesCount,
        fetchFavoritesIds, // ✅ مهم جداً
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
