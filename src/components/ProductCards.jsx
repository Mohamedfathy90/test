import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFavorites } from "../context/FavoritesContext";
import { useNotification } from "../context/NotificationContext";
import { useCurrency } from "../context/CurrencyContext";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { getSessionId } from "../utils/SessionId";
import Select from "../components/select";

const PRODUCTS_PER_BATCH = 20; // Number of products to load per batch

const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [sortType, setSortType] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_BATCH);

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const { favoritesIds, fetchFavoritesIds } = useFavorites();
  const { showNotification } = useNotification();
  const { formatPrice } = useCurrency();
  const { updateCartCount } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    sortProducts(sortType);
  }, [products, sortType]);

  // Update visible products when filteredProducts or displayCount changes
  useEffect(() => {
    setVisibleProducts(filteredProducts.slice(0, displayCount));
  }, [filteredProducts, displayCount]);

  // Infinite scroll: load more products when user scrolls to bottom
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && displayCount < filteredProducts.length) {
      setDisplayCount((prev) => prev + PRODUCTS_PER_BATCH);
    }
  }, [displayCount, filteredProducts.length]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "200px", // Load more when user is 200px from bottom
      threshold: 0
    };

    observerRef.current = new IntersectionObserver(handleObserver, option);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        "https://blomengdalis-tester.com/backend/get-products.php"
      );
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
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
    // Reset display count when sorting changes
    setDisplayCount(PRODUCTS_PER_BATCH);
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

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const sessionId = getSessionId();
    // Defaulting to the first size or empty if not available, since we are in card view
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
    const result = favoritesIds.includes(numericId);
    return result;
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="card1 skeleton-card">
      <div className="image-container image-wrapper skeleton-image"></div>
      <div className="linkCard">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-description"></div>
        <div className="skeleton-text skeleton-price"></div>
      </div>
    </div>
  );

  return (
    <>
      <Select onSortChange={handleSortChange} />

      <div className="cards-container max-w-95">
        {isLoading ? (
          // Show skeleton loaders while products are loading
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))
        ) : (
          <>
            {visibleProducts.map((product) => {
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
                      loading="lazy"
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
                    {/* <span className="aCard text-black">{product.description}</span>  */}

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
                    {isAvailable && (
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

            {/* Intersection observer target for infinite scroll */}
            {displayCount < filteredProducts.length && (
              <div ref={loadMoreRef} style={{ height: "20px", width: "100%" }}></div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProductCards;
