import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FooterSection from "../components/FooterSection";
import ProductButtons from "../components/ProductButtons";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { Link } from "react-router-dom";
import { getSessionId } from "../utils/SessionId"; 

const AccordionItem = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full py-2 px-0 flex items-center justify-between text-right"
      >
        <span className="header-style">{title}</span>
        <span className="text-2xl text-gray-800">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="pb-4 px-0 text-gray-700 text-sm leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [openAccordion, setOpenAccordion] = useState(null);

  const { updateCartCount } = useCart();
  const { showNotification } = useNotification();
  const size = product?.sizes || "";

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
      showNotification("تمت إضافة المنتج إلى الحقيبة", "success");
      updateCartCount();
    } catch (error) {
      showNotification("حدث خطأ أثناء الإضافة", "error");
    }
  };

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <div className="product-detail container max-w-screen-xl max-w-95 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          <div className="w-full bg-gray-50 flex justify-center items-center p-0 md:p-5 min-h-[400px] md:min-h-[600px]">
            <img
              src={`https://blomengdalis-tester.com/backend/uploads/${product.main_image}`}
              alt={product.name}
              className="w-full md:max-w-full md:max-h-full object-contain md:object-contain"
            />
          </div>

          <div className="flex flex-col gap-2 md:gap-3 w-full">
            <h4 className="text-small">{product.name}</h4>
            <h5 className="text-small">{product.collection}</h5>
            <span className="Sali inline-block">الأكثر مبيعاً</span>

            {product.discount_percent &&
            parseFloat(product.discount_percent) > 0 ? (
              <div>
                <div className="discount-label">خصومات</div>
                <div className="price-main mb-2">KWD {product.price_after}</div>
                <div className="price-old-discount">
                  <span className="line-through text-gray-500">
                    KWD {product.price_before}
                  </span>
                  <span className="text-red-700 mr-2">
                    | {product.discount_percent}% خصم
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <div className="price-main">KWD {product.original_price}</div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-1 mb-1 md:mt-2 md:mb-2">
              <span className="text-paragraph">الحجم:</span>
              {size ? (
                <button className="px-4 py-2 border border-gray-800 text-sm text-black bg-white hover:bg-gray-50 transition-colors w-full md:w-auto">
                  {size}
                </button>
              ) : (
                <span className="text-sm text-gray-400">لا يوجد حجم محدد</span>
              )}
            </div>

            <div className="flex flex-col w-full mt-1 md:mt-2">
              <ProductButtons
                selectedSize={selectedSize}
                onAddToCart={addToCart}
                productId={product.id}
              />
              <div className="mt-3 md:mt-4 flex items-center gap-2">
                <p className="text-paragraph mb-0 ">مشاركة :</p>
                <Link
                  href="#"
                  className="text-gray-500 transition-colors flex items-center"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-500 flex items-center">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-500 transition-colors flex items-center"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="mt-1 md:mt-2 border-gray-200">
              <AccordionItem
                title="الوصف"
                isOpen={openAccordion === "description"}
                onToggle={() => toggleAccordion("description")}
              >
                <div className="text-right">
                  {product.scent_description ||
                    product.description ||
                    "لا يوجد وصف متاح لهذا المنتج."}
                </div>
              </AccordionItem>

              <AccordionItem
                title="الشحن و التسليم"
                isOpen={openAccordion === "shipping"}
                onToggle={() => toggleAccordion("shipping")}
              >
                <div className="text-right space-y-4">
                  <p className="font-medium">
                    يتم شحن هذا العنصر من الكويت. حدد منطقتك أدناه للحصول على
                    مزيد من المعلومات حول أوقات التسليم
                  </p>

                  <div className="bg-black text-white py-2 px-4 text-center">
                    الكويت
                  </div>

                  <p className="text-center">
                    اعتماداً على العنصر، تتوفر أوقات التسليم التالية
                  </p>

                  <div className="space-y-3">
                    <div>
                      <p className="font-bold">4-5 أيام</p>
                      <p>توصيل مجاني للطلبات بقيمة 40.000 KWD وأكثر.</p>
                      <p>رسوم شحن 2.000 KWD للطلبات الأقل من 40.000 KWD.</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="font-bold">استلمها من المتجر</p>
                      </div>
                      <span className="text-sm text-gray-400">غير متوفر</span>
                    </div>

                    <p className="text-sm text-gray-600 leading-6">
                      استلمها في المتجر خلال ساعتين بسعر 360. Mall Store، سنتلقى
                      بريداً إلكترونياً عندما يكون جاهزاً للتحصيل.
                    </p>
                  </div>
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default ProductDetail;
