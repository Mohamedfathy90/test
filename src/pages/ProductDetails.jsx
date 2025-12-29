import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FooterSection from "../components/FooterSection";
import ProductButtons from "../components/ProductButtons";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const navigate = useNavigate();
  const { updateCartCount } = useCart();
const size = product?.sizes || "";



  // دالة لإنشاء أو جلب Session ID
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
    fetch(`https://blomengdalis-tester.com/backend/get-products.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);
  useEffect(() => {
    if (product?.sizes) {
      setSelectedSize(product.sizes);
    }
  }, [product]);


  const addToCart = async () => {
 

    const sessionId = getSessionId();

    try {
      const response = await axios.post(
        "https://blomengdalis-tester.com/backend/add_to_cart.php",
        {
          session_id: sessionId,
          product_id: product.id,
          quantity: 1,
          size: selectedSize,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert(response.data.message || "تم إضافة المنتج للسلة");
      updateCartCount();
      navigate("/cart");
    } catch (error) {
      console.error(error);
      alert("❌ فشل في إضافة المنتج إلى السلة");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <div className="product-detail container">
        <div className="imgDiteal">
          <img
            src={`https://blomengdalis-tester.com/backend/uploads/${product.main_image}`}
            alt={product.name}
            className="bg-card"
          />
        </div>
        <div className="ditals">
          <h4>{product.name}</h4>
          <h5>{product.collection}</h5>
          {/* <p>
            {product.price_after} د.أ{" "}
            <span className="Sali">بما في ذلك ضريبة القيمة المضافة</span>
          </p> */}
          <span className="Sali">الأكثر مبيعاً</span>
          {/* <div className="">
            <img
              src="https://ar.bloomingdales.ae/on/demandware.static/Sites-BloomingDales_AE-Site/-/default/dwcbe17f4a/images/tabby-logo.svg"
              alt=""
            />
            <span className="Sali"> 4 دفعات بدون فوائد بقيمة </span>
            {product.price_before} د.أ
          </div>
          <div className="">
            <img
              src="https://ar.bloomingdales.ae/on/demandware.static/Sites-BloomingDales_AE-Site/-/default/dw7931d59f/images/tamara-logo.svg"
              alt=""
            />
            <span className="Sali"> 4 دفعات بدون فوائد بقيمة </span>
            {product.price_before} د.أ
          </div>
          <div>
            <img
              src="https://ar.bloomingdales.ae/on/demandware.static/Sites-BloomingDales_AE-Site/-/default/dw75b6e9b6/images/amber/amber-card-arise.svg"
              alt=""
              style={{
                width: "40px",
              }}
            />
            <span>اربح 948 نقاط أمبر</span>
          </div> */}

          <div className="size">
            <h5>الحجم :</h5>

            {size ? (
              <p className="text-gray-700 font-medium">{size}</p>
            ) : (
              <p className="text-gray-400">لا يوجد حجم محدد لهذا المنتج</p>
            )}
          </div>

          <div
            className="buttons"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* <button
              className="ButtonDelav"
              style={{ padding: "10px 20px", marginTop: "10px" }}
            >
              <img
                src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjA4MDA1IDEyLjI3MkM4LjA4MDA1IDEzLjQ1NiA3LjEyMDA1IDE0LjQxNiA1LjkyMDA1IDE0LjQxNkM0LjczNjA1IDE0LjQxNiAzLjc3NjA1IDEzLjQ1NiAzLjc3NjA1IDEyLjI3MkMzLjc3NjA1IDExLjc3NiAzLjkzNjA1IDExLjMyOCA0LjIwODA1IDEwLjk3NkgyLjgzMjAyQzIuNTkyMDIgMTAuOTc2IDIuNDAwMDIgMTAuNzg0IDIuNDAwMDIgMTAuNTQ0VjkuNkgzLjI2NDAyVjEwLjExMkgxMC4zMlYyLjQ0Nzk4TDMuMjY0MDIgMi40Nzk5OFYzLjJIMi40MDAwMlYyLjA0Nzk4QzIuNDAwMDIgMS44MDc5OCAyLjU5MjAyIDEuNjE1OTggMi44MzIwMiAxLjYxNTk4TDEwLjc1MiAxLjU4Mzk4QzEwLjk5MiAxLjU4Mzk4IDExLjE4NCAxLjc3NTk4IDExLjE4NCAyLjAxNTk4VjQuMjU1OThIMTMuNTA0QzEzLjYxNiA0LjI1NTk4IDEzLjcyOCA0LjMwMzk4IDEzLjgwOCA0LjM4Mzk4TDE1Ljg3MiA2LjQ0Nzk4QzE1Ljk1MiA2LjUyNzk4IDE2IDYuNjM5OTggMTYgNi43NTE5OFYxMC41NDRDMTYgMTAuNzg0IDE1LjgwOCAxMC45NzYgMTUuNTY4IDEwLjk3NkgxNC4xOTJDMTQuNDY0IDExLjMyOCAxNC42MjQgMTEuNzc2IDE0LjYyNCAxMi4yNzJDMTQuNjI0IDEzLjQ1NiAxMy42NjQgMTQuNDE2IDEyLjQ4IDE0LjQxNkMxMS4yOCAxNC40MTYgMTAuMzIgMTMuNDU2IDEwLjMyIDEyLjI3MkMxMC4zMiAxMS43NzYgMTAuNDggMTEuMzI4IDEwLjc1MiAxMC45NzZINy42NDgwNUM3LjkyMDA1IDExLjMyOCA4LjA4MDA1IDExLjc3NiA4LjA4MDA1IDEyLjI3MlpNNC42NDAwNSAxMi4yNzJDNC42NDAwNSAxMi45NzYgNS4yMTYwNSAxMy41NTIgNS45MjAwNSAxMy41NTJDNi42NDAwNSAxMy41NTIgNy4yMTYwNSAxMi45NzYgNy4yMTYwNSAxMi4yNzJDNy4yMTYwNSAxMS41NTIgNi42NDAwNSAxMC45NzYgNS45MjAwNSAxMC45NzZDNS4yMTYwNSAxMC45NzYgNC42NDAwNSAxMS41NTIgNC42NDAwNSAxMi4yNzJaTTExLjE4NCAxMi4yNzJDMTEuMTg0IDEyLjk3NiAxMS43NiAxMy41NTIgMTIuNDggMTMuNTUyQzEzLjE4NCAxMy41NTIgMTMuNzYgMTIuOTc2IDEzLjc2IDEyLjI3MkMxMy43NiAxMS41NTIgMTMuMTg0IDEwLjk3NiAxMi40OCAxMC45NzZDMTEuNzYgMTAuOTc2IDExLjE4NCAxMS41NTIgMTEuMTg0IDEyLjI3MlpNMTEuMTg0IDUuMTE5OThWMTAuMTEySDE1LjEzNlY2LjkyNzk4TDEzLjMyOCA1LjExOTk4SDExLjE4NFoiIGZpbGw9IiMxMTExMTEiLz4KPHBhdGggZD0iTTMuOTY1MzEgNi44MzcyN0gwVjYuMDAwMDZIMy45NjUzMVY2LjgzNzI3WiIgZmlsbD0iIzExMTExMSIvPgo8cGF0aCBkPSJNNS41OTk5OCA0LjgwMDA2SDAuODA0MzIxVjQuMDAwMDZINS41OTk5OFY0LjgwMDA2WiIgZmlsbD0iIzExMTExMSIvPgo8cGF0aCBkPSJNNS41OTk5OCA4LjgwMDA2SDAuODA0MzIxVjguMDAwMDZINS41OTk5OFY4LjgwMDA2WiIgZmlsbD0iIzExMTExMSIvPgo8L3N2Zz4K"
                alt=""
              />{" "}
              قدموا طلبياتكم قبل منتصف الليل للتوصل غداآ
            </button> */}

            <ProductButtons
              selectedSize={selectedSize}
              onAddToCart={addToCart}
              productId={product.id}
            />
            <p>مشاركة :</p>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default ProductDetail;
