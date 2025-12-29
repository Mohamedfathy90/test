import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { IoHeartDislikeOutline, IoShareOutline } from "react-icons/io5";
import { useFavorites } from "../context/FavoritesContext";
import { IoTrashOutline } from "react-icons/io5";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ استخدم fetchFavoritesIds عشان نحدث الـ Context بعد الحذف
  const { fetchFavoritesIds } = useFavorites();

  const getSessionId = () => {
    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId =
        "guest_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substring(2, 9);
      localStorage.setItem("session_id", sessionId);
    }
    return sessionId;
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(
        `https://blomengdalis-tester.com/backend/get_favorites.php?session_id=${getSessionId()}`
      );
      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
    try {
      await axios.post(
        "https://blomengdalis-tester.com/backend/toggle_favorite.php",
        {
          session_id: getSessionId(),
          product_id: id,
          action: "remove",
        }
      );

      // ✅ نحدث الصفحة المحلية
      fetchFavorites();

      // ✅ نحدث الـ Context عشان باقي الصفحات تشوف التغيير
      fetchFavoritesIds();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "قائمة الأمنيات",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("تم نسخ الرابط");
    }
  };

  if (loading) return <div className="p-10 text-center">جاري التحميل...</div>;

  return (
    <div className="max-w-[95%] mx-auto">
      {/* Breadcrumb */}
      <div className="flex gap-2 text-sm text-gray-500 mt-5">
        <Link to="/" className="text-black">
          الصفحة الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-400">قائمة الأمنيات</span>
      </div>

      <h2 className="text-xl font-medium mt-3">
        قائمة الأمنيات ({favorites.length})
      </h2>

      {/* Actions */}
      {favorites.length > 0 && (
        <div className="flex justify-end gap-3 my-6">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 border px-4 py-2 text-sm hover:bg-gray-100"
          >
            <IoShareOutline size={18} />
            شارك قائمتك
          </button>
        </div>
      )}

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          {/* Icon */}
          <div className="mb-6">
            <IoHeartDislikeOutline size={70} className="text-gray-300" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-medium mb-3">هذه القائمة فارغة.</h3>

          {/* Description */}
          <p className="text-gray-500 max-w-md leading-relaxed mb-8">
            ما عليك سوى الضغط على الرمز ♡ الموجود بجانب منتجاتنا لحفظ المنتجات
            التي تحبينها لوقت لاحق.
          </p>

          {/* Button */}
          <Link
            to="/"
            className=" border border-black px-10 py-3 text-black text-bold
                 hover:bg-black hover:!text-white "
          >
            تسوق أحدث ما وصلنا
          </Link>
        </div>
      ) : (
        /* Products */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="
  pb-6
     md:pb-0
    relative
  "
            >
              {/* CARD */}
              <div className="flex gap-4 md:flex-col ">
                {/* IMAGE */}
                <Link
                  to={`/product/${product.id}`}
                  className="
                    w-[110px] h-[160px]
                    md:w-full md:h-[400px]
                    flex-shrink-0
                  "
                >
                  <img
                    src={`https://blomengdalis-tester.com/backend/uploads/${product.main_image}`}
                    alt={product.name}
                    className="w-full h-full object-cover bg-card"
                  />
                </Link>

                {/* CONTENT */}
                <div className="flex-1 md:p-4">
                  <Link
                    to={`/product/${product.id}`}
                    className="block text-black text-sm md:text-base font-medium mb-1"
                  >
                    {product.name}
                  </Link>

                  <p className="text-xs md:text-sm text-gray-500 mb-1">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold">
                      KWD {product.price_after}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      KWD {product.price_before}
                    </span>
                  </div>

                  <button className="w-full bg-black text-white py-2 text-sm">
                    اضف للحقيبة
                  </button>

                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="block mt-2"
                  >
                    {/* Mobile icon */}
                    <IoTrashOutline className="  absolute top-2 left-2 text-lg md:hidden" />

                    {/* Desktop text */}
                    <span className="hidden md:block text-xs underline">
                      حذف
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
