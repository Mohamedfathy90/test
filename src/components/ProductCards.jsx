import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFavorites } from "../context/FavoritesContext";
import axios from "axios";

const ProductCards = () => {
  const [products, setProducts] = useState([]);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "https://blomengdalis-tester.com/backend/get-products.php"
      );
      const data = await res.json();
      // console.log("Products data:", data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleFavoriteClick = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    const sessionId = getSessionId();
    const numericId = parseInt(productId);
    const isFav = favoritesIds.includes(numericId);
    const action = isFav ? "remove" : "add";

    // console.log(" Sending request:", {
    //   sessionId,
    //   productId: numericId,
    //   action,
    //   favoritesIds,
    // });

    try {
      const response = await axios.post(
        "https://blomengdalis-tester.com/backend/toggle_favorite.php",
        {
          session_id: sessionId,
          product_id: numericId,
          action,
        }
      );

      // console.log("Response:", response.data);

      await fetchFavoritesIds();
    } catch (err) {
      // console.error(" Error toggling favorite:", err);
    }
  };

  const isFavorited = (id) => {
    const numericId = parseInt(id);
    const result = favoritesIds.includes(numericId);
    // console.log("Checking favorite:", { id, numericId, favoritesIds, result });
    return result;
  };

  return (
    <div className="cards-container max-w-95">
      {products.map((product) => (
        <Link to={`/product/${product.id}`} className="card1" key={product.id}>
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

            {product.discount_percent &&
            parseFloat(product.discount_percent) > 0 ? (
              <div className="">
                <div className="discount-label">خصومات</div>
                <div className="price-main">KWD {product.price_after}</div>
                <div className="price-old-discount">
                  <span
                    style={{ textDecoration: "line-through", color: "#888" }}
                  >
                    KWD {product.price_before}
                  </span>
                  <span style={{ color: "#B12009", marginRight: "8px" }}>
                    | {product.discount_percent}% خصم
                  </span>
                </div>
              </div>
            ) : (
              <div className="">
                <div className="price-main">KWD {product.original_price}</div>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductCards;
