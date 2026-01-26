import React from "react";
import { Link } from "react-router-dom";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFavorites } from "../context/FavoritesContext";
import { useNotification } from "../context/NotificationContext";
import { useCurrency } from "../context/CurrencyContext";
import { useSearch } from "../context/SearchContext";
import axios from "axios";
import { getSessionId } from "../utils/SessionId";

const SearchPage = () => {
  const { searchQuery, searchResults, isSearching } = useSearch();
  const { favoritesIds, fetchFavoritesIds } = useFavorites();
  const { showNotification } = useNotification();
  const { formatPrice } = useCurrency();

  const handleFavoriteClick = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    const sessionId = getSessionId();
    const numericId = parseInt(productId);
    const isFav = favoritesIds.includes(numericId);
    const action = isFav ? "remove" : "add";

    try {
      await axios.post(
        "https://blomengdalis-tester.com/backend/toggle_favorite.php",
        {
          session_id: sessionId,
          product_id: numericId,
          action,
        }
      );

      showNotification(
        isFav
          ? "تم حذف المنتج من قائمة الأمنيات"
          : "تم إضافة المنتج إلى قائمة الأمنيات",
        "success"
      );

      await fetchFavoritesIds();
    } catch (err) {
      console.error("Error toggling favorite:", err);
      showNotification("فشل في تحديث قائمة الأمنيات", "error");
    }
  };

  const isFavorited = (id) => {
    const numericId = parseInt(id);
    return favoritesIds.includes(numericId);
  };

  if (!searchQuery.trim()) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-muted">ابدأ البحث عن منتجاتك المفضلة</h3>
        <p className="text-muted">استخدم مربع البحث في الأعلى</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-2">
          {isSearching && searchResults.length > 0 && (
            <>نتائج البحث عن: "{searchQuery}"</>
          )}
          {isSearching && searchResults.length === 0 && (
            <>لا توجد نتائج لـ: "{searchQuery}"</>
          )}
        </h2>
        <p className="text-muted">
          {searchResults.length > 0 && (
            <>
              {searchResults.length} منتج
              {searchResults.length !== 1 && searchResults.length !== 2
                ? "ات"
                : ""}
            </>
          )}
        </p>
      </div>

      {searchResults.length === 0 && isSearching ? (
        <div className="text-center py-5">
          <p className="fs-5 text-muted">
            لا توجد منتجات تطابق بحثك "{searchQuery}"
          </p>
          <Link to="/" className="btn btn-dark mt-3">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      ) : (
        <div className="cards-container max-w-95">
          {searchResults.map((product) => {
            return (
              <Link
                to={`/product/${product.id}`}
                className="card1"
                key={product.id}
              >
                <div className="image-container image-wrapper">
                  <img
                    src={`https://blomengdalis-tester.com/backend/uploads/${encodeURIComponent(
                      product.main_image
                    )}`}
                    alt={product.name}
                  />

                  <button
                    className="favorite-btn"
                    onClick={(e) => handleFavoriteClick(e, product.id)}
                  >
                    <FontAwesomeIcon
                      className="text-black"
                      icon={isFavorited(product.id) ? faHeartSolid : faHeart}
                      style={{ fontSize: "18px" }}
                    />
                  </button>
                </div>

                <div className="linkCard">
                  <span className="aCard text-black">{product.name}</span>
                  <span className="aCard text-black">
                    {product.description}
                  </span>

                  {product.is_available === "0" ||
                  product.is_available === 0 ? (
                    <div className="price-main">انتهت الكمية</div>
                  ) : product.discount_percent &&
                    parseFloat(product.discount_percent) > 0 ? (
                    <div className="">
                      <div className="discount-label">خصومات</div>
                      <div className="price-main">
                        {formatPrice(parseFloat(product.price_after))}
                      </div>
                      <div className="price-old-discount">
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "#888",
                          }}
                        >
                          {formatPrice(parseFloat(product.original_price))}
                        </span>
                        <span style={{ color: "#B12009", marginRight: "8px" }}>
                          | {product.discount_percent}% خصم
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="">
                      <div className="price-main">
                        {formatPrice(parseFloat(product.original_price))}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
