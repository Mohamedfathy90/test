import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useFavorites } from "../context/FavoritesContext";

function ProductButtons({ onAddToCart, productId }) {
  // ✅ استخدم fetchFavoritesIds بدل fetchFavoritesCount
  const { favoritesIds, fetchFavoritesIds } = useFavorites();

  const getSessionId = () => {
    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId =
        "guest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("session_id", sessionId);
    }
    return sessionId;
  };

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

      const message = currentlyFavorited
        ? "تم حذف المنتج من قائمة الأمنيات"
        : "تم إضافة المنتج إلى قائمة الأمنيات";

      alert(message);

      // ✅ نحدث الـ IDs عشان الأيقونة تتغير فوراً
      await fetchFavoritesIds();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("❌ فشل في تحديث قائمة الأمنيات");
    }
  };

  return (
    <div>
      <button
        className="btn btn-dark"
        onClick={onAddToCart}
        style={{
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <FontAwesomeIcon icon={faBagShopping} />
        <span> أضف للحقيبة</span>
      </button>

      <button
        className={`btn ${isFavorited ? "btn-dark" : "btn-outline-dark"}`}
        onClick={handleToggleFavorite}
        style={{
          width: "100%",
        }}
      >
        <FontAwesomeIcon
          icon={isFavorited ? faHeartSolid : faHeart}
          // style={{
          //   color: isFavorited ? "#E11D48" : "#6B7280",
          //   marginRight: "5px",
          // }}
        />

        {isFavorited ? " موجود في المفضلة" : " أضف إلى قائمة الأمنيات"}
      </button>
    </div>
  );
}

export default ProductButtons;
