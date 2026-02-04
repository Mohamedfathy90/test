import React from "react";
import { Link } from "react-router-dom";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFavorites } from "../context/FavoritesContext";
import { useNotification } from "../context/NotificationContext";
import { useCurrency } from "../context/CurrencyContext";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { getSessionId } from "../utils/SessionId";

const SearchPage = () => {
  const { searchQuery, searchResults, isSearching } = useSearch();
  const { favoritesIds, fetchFavoritesIds } = useFavorites();
  const { showNotification } = useNotification();
  const { formatPrice } = useCurrency();
  const { updateCartCount } = useCart();

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

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const sessionId = getSessionId();
    const size = product.sizes || "";

    try {
      await axios.post(
        "https://blomengdalis-tester.com/backend/add_to_cart.php",
        {
          session_id: sessionId,
          product_id: product.id,
          quantity: 1,
          size: size,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      showNotification("تمت إضافة المنتج إلى الحقيبة", "success");
      updateCartCount();
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification("حدث خطأ أثناء الإضافة", "error");
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
                  {/* <span className="aCard text-black">
                    {product.description}
                  </span> */}

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
                  {/* Determine logic for availability locally if not already done, or just use the check inline */}
                  {(product.is_available === "1" || product.is_available === 1 || product.is_available === true) && (
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      style={{
                        width: "100%",
                        backgroundColor: "rgb(0, 0, 0)",
                        border: "none",
                        borderRadius: "0px",
                        padding: "7px 20px",
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "rgb(255, 255, 255)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="bag-shopping"
                        className="svg-inline--fa fa-bag-shopping "
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        style={{
                          fontSize: "18px",
                          position: "absolute",
                          right: "20px",
                        }}
                      >
                        <path
                          fill="currentColor"
                          d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48C336 50.1 285.9 0 224 0S112 50.1 112 112l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"
                        ></path>
                      </svg>
                      <span>اضف للحقيبة</span>
                    </button>
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
