import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  

  useEffect(() => {
    fetch("https://blomengdalis-tester.com/backend/get-products.php")
      .then((res) => res.json())
      .then((data) => {
        console.log("البيانات المستلمة:", data); // أضف هذا السطر
        setProducts(data);
      })
      .catch((error) => console.error("فشل في جلب البيانات:", error));
  }, []);
  
  const handleFavoriteClick = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };
  const isFavorited = (productId) => favorites.includes(productId);

  return (
    <div className="cards-container ">
      {products.map((product) => (
        <Link to={`/product/${product.id}`} className="card1" key={product.id}>
          <div className="image-container image-wrapper">
            <img
              src={`https://blomengdalis-tester.com/backend/uploads/${encodeURIComponent(
                product.main_image
              )}`}
              alt={product.name}
              style={{
                height: "350px",
                objectFit: "cover",
                objectPosition: "center top",
              }}
            />

            <button className="favorite-btn" onClick={handleFavoriteClick}>
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <img
              src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjA4MDA1IDEyLjI3MkM4LjA4MDA1IDEzLjQ1NiA3LjEyMDA1IDE0LjQxNiA1LjkyMDA1IDE0LjQxNkM0LjczNjA1IDE0LjQxNiAzLjc3NjA1IDEzLjQ1NiAzLjc3NjA1IDEyLjI3MkMzLjc3NjA1IDExLjc3NiAzLjkzNjA1IDExLjMyOCA0LjIwODA1IDEwLjk3NkgyLjgzMjAyQzIuNTkyMDIgMTAuOTc2IDIuNDAwMDIgMTAuNzg0IDIuNDAwMDIgMTAuNTQ0VjkuNkgzLjI2NDAyVjEwLjExMkgxMC4zMlYyLjQ0Nzk4TDMuMjY0MDIgMi40Nzk5OFYzLjJIMi40MDAwMlYyLjA0Nzk4QzIuNDAwMDIgMS44MDc5OCAyLjU5MjAyIDEuNjE1OTggMi44MzIwMiAxLjYxNTk4TDEwLjc1MiAxLjU4Mzk4QzEwLjk5MiAxLjU4Mzk4IDExLjE4NCAxLjc3NTk4IDExLjE4NCAyLjAxNTk4VjQuMjU1OThIMTMuNTA0QzEzLjYxNiA0LjI1NTk4IDEzLjcyOCA0LjMwMzk4IDEzLjgwOCA0LjM4Mzk4TDE1Ljg3MiA2LjQ0Nzk4QzE1Ljk1MiA2LjUyNzk4IDE2IDYuNjM5OTggMTYgNi43NTE5OFYxMC41NDRDMTYgMTAuNzg0IDE1LjgwOCAxMC45NzYgMTUuNTY4IDEwLjk3NkgxNC4xOTJDMTQuNDY0IDExLjMyOCAxNC42MjQgMTEuNzc2IDE0LjYyNCAxMi4yNzJDMTQuNjI0IDEzLjQ1NiAxMy42NjQgMTQuNDE2IDEyLjQ4IDE0LjQxNkMxMS4yOCAxNC40MTYgMTAuMzIgMTMuNDU2IDEwLjMyIDEyLjI3MkMxMC4zMiAxMS43NzYgMTAuNDggMTEuMzI4IDEwLjc1MiAxMC45NzZINy42NDgwNUM3LjkyMDA1IDExLjMyOCA4LjA4MDA1IDExLjc3NiA4LjA4MDA1IDEyLjI3MlpNNC42NDAwNSAxMi4yNzJDNC42NDAwNSAxMi45NzYgNS4yMTYwNSAxMy41NTIgNS45MjAwNSAxMy41NTJDNi42NDAwNSAxMy41NTIgNy4yMTYwNSAxMi45NzYgNy4yMTYwNSAxMi4yNzJDNy4yMTYwNSAxMS41NTIgNi42NDAwNSAxMC45NzYgNS45MjAwNSAxMC45NzZDNS4yMTYwNSAxMC45NzYgNC42NDAwNSAxMS41NTIgNC42NDAwNSAxMi4yNzJaTTExLjE4NCAxMi4yNzJDMTEuMTg0IDEyLjk3NiAxMS43NiAxMy41NTIgMTIuNDggMTMuNTUyQzEzLjE4NCAxMy41NTIgMTMuNzYgMTIuOTc2IDEzLjc2IDEyLjI3MkMxMy43NiAxMS41NTIgMTMuMTg0IDEwLjk3NiAxMi40OCAxMC45NzZDMTEuNzYgMTAuOTc2IDExLjE4NCAxMS41NTIgMTEuMTg0IDEyLjI3MlpNMTEuMTg0IDUuMTE5OThWMTAuMTEySDE1LjEzNlY2LjkyNzk4TDEzLjMyOCA1LjExOTk4SDExLjE4NFoiIGZpbGw9IiMxMTExMTEiLz4KPHBhdGggZD0iTTMuOTY1MzEgNi44MzcyN0gwVjYuMDAwMDZIMy45NjUzMVY2LjgzNzI3WiIgZmlsbD0iIzExMTExMSIvPgo8cGF0aCBkPSJNNS41OTk5OCA0LjgwMDA2SDAuODA0MzIxVjQuMDAwMDZINS41OTk5OFY0LjgwMDA2WiIgZmlsbD0iIzExMTExMSIvPgo8cGF0aCBkPSJNNS41OTk5OCA4LjgwMDA2SDAuODA0MzIxVjguMDAwMDZINS41OTk5OFY4LjgwMDA2WiIgZmlsbD0iIzExMTExMSIvPgo8L3N2Zz4K" // اختصرته هنا
              alt="custom icon"
              className="custom-icon"
            />
          </div>
          <div className="linkCard">
            <a className="aCard" style={{ paddingTop: "30px" }}>
              {product.name}
            </a>
            <a className="aCard" style={{ paddingBottom: "30px" }}>
              {product.description}
            </a>
            <span className="khsom">خصومات</span>
            <span className="khsom">من {product.price_after} د.أ</span>
            <a className="Sali">
              <span
                style={{
                  textDecoration: "line-through",
                  color: " #888",
                  paddingLeft: "5px",
                }}
              >
                {product.price_before} د.أ
              </span>
              <span style={{ color: " #000" }}>
                {" "}
                {product.discount_percent} %خصم
              </span>
            </a>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductCards;
