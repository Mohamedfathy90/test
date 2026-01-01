import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getSessionId } from "../utils/SessionId"; 

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [favoritesIds, setFavoritesIds] = useState([]);
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
      const sessionId = getSessionId(); // 👈 استخدام الدالة المستوردة
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
