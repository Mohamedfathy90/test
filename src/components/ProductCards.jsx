import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFavorites } from "../context/FavoritesContext";
import { useNotification } from "../context/NotificationContext";
import { useCurrency } from "../context/CurrencyContext";
import axios from "axios";
import { getSessionId } from "../utils/SessionId";
import Select from "../components/select";

const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortType, setSortType] = useState("newest");

  const { favoritesIds, fetchFavoritesIds } = useFavorites();
  const { showNotification } = useNotification();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    sortProducts(sortType);
  }, [products, sortType]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "https://blomengdalis-tester.com/backend/get-products.php"
      );
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const sortProducts = (type) => {
    let sorted = [...products];

    switch (type) {
      case "newest":
        sorted.sort((a, b) => {
          const sizeA = parseFloat(a.size) || 0;
          const sizeB = parseFloat(b.size) || 0;
          return sizeB - sizeA;
        });
        break;

      case "best":
        sorted.sort(() => Math.random() - 0.5);
        break;

      case "lowest":
        sorted.sort((a, b) => {
          const priceA = parseFloat(a.price_after || a.original_price) || 0;
          const priceB = parseFloat(b.price_after || b.original_price) || 0;
          return priceA - priceB;
        });
        break;

      case "highest":
        // ترتيب حسب السعر - الأعلى أولاً
        sorted.sort((a, b) => {
          const priceA = parseFloat(a.price_after || a.original_price) || 0;
          const priceB = parseFloat(b.price_after || b.original_price) || 0;
          return priceB - priceA;
        });
        break;

      default:
        break;
    }

    setFilteredProducts(sorted);
  };

  const handleSortChange = (type) => {
    setSortType(type);
  };

  const handleFavoriteClick = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    const sessionId = getSessionId();
    const numericId = parseInt(productId);
    const isFav = favoritesIds.includes(numericId);
    const action = isFav ? "remove" : "add";

    try {
      const response = await axios.post(
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
    const result = favoritesIds.includes(numericId);
    return result;
  };

  return (
    <>
      <Select onSortChange={handleSortChange} />

      <div className="cards-container max-w-95">
        {filteredProducts.map((product) => {
          const isAvailable =
            product.is_available === "1" ||
            product.is_available === 1 ||
            product.is_available === true;

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
                <span className="aCard text-black">{product.description}</span>

                {product.is_available === "0" || product.is_available === 0 ? (
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
    </>
  );
};

export default ProductCards;
