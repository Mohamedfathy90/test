import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useFavorites } from "../context/FavoritesContext";
import { useNotification } from "../context/NotificationContext";
import { getSessionId } from "../utils/SessionId";

function ProductButtons({ onAddToCart, productId }) {
  const { favoritesIds, fetchFavoritesIds } = useFavorites();
  const { showNotification } = useNotification();

  const isFavorited = favoritesIds.includes(parseInt(productId));

  const handleToggleFavorite = async () => {
    const sessionId = getSessionId(); 
    const numericId = parseInt(productId);
    const currentlyFavorited = favoritesIds.includes(numericId);
    const action = currentlyFavorited ? "remove" : "add";

    try {
      await axios.post(
        "https://blomengdalis-tester.com/backend/toggle_favorite.php",
        {
          session_id: sessionId,
          product_id: numericId,
          action: action,
        }
      );

      showNotification(
        currentlyFavorited
          ? "تم حذف المنتج من قائمة الأمنيات"
          : "تم إضافة المنتج إلى قائمة الأمنيات",
        "success"
      );

      await fetchFavoritesIds();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      showNotification("فشل في تحديث قائمة الأمنيات", "error");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <button
        onClick={onAddToCart}
        style={{
          width: "100%",
          marginBottom: "10px",
          backgroundColor: "#000",
          border: "none",
          borderRadius: "0",
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "500",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <FontAwesomeIcon
          icon={faBagShopping}
          style={{
            fontSize: "18px",
            position: "absolute",
            right: "20px",
          }}
        />
        <span>اضف للحقيبة</span>
      </button>

      <button
        onClick={handleToggleFavorite}
        style={{
          width: "100%",
          backgroundColor: "#fff",
          color: "#000",
          border: "1px solid #000",
          borderRadius: "0",
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <FontAwesomeIcon
          icon={isFavorited ? faHeartSolid : faHeart}
          style={{
            fontSize: "18px",
            position: "absolute",
            right: "20px",
            color: isFavorited ? "#000" : "#000",
          }}
        />
        <span>
          {isFavorited ? "موجود في المفضلة" : "أضف إلى قائمة الامنيات"}
        </span>
      </button>
    </div>
  );
}

export default ProductButtons;
