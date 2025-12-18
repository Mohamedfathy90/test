import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./context";
import axios from "axios";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const { user } = useUser();

  const fetchFavoritesCount = async () => {
    if (!user?.id) {
      setFavoritesCount(0);
      return;
    }

    try {
      const response = await axios.get(
        `https://blomengdalis-tester.com/backend/get_favorites.php?user_id=${user.id}`
      );

      console.log("Favorites response:", response.data);

      const favorites = Array.isArray(response.data) ? response.data : [];

      setFavoritesCount(favorites.length);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavoritesCount(0);
    }
  };

  useEffect(() => {
    fetchFavoritesCount();
  }, [user]);

  return (
    <FavoritesContext.Provider value={{ favoritesCount, fetchFavoritesCount }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
