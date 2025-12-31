import React from "react";
import axios from "axios";
import { useFavorites } from "../context/FavoritesContext";
import { useNotification } from "../context/NotificationContext";
import { IoIosInformationCircleOutline } from "react-icons/io";

const ItemCart = ({ item, removeItem, updateQuantity }) => {
  // console.log("Item data:", item);
  // الحل: استخدم price_after أو original_price
  const itemPrice =
    item.price_after || item.original_price || item.price_before || 0;
  const totalPrice = (itemPrice * item.quantity).toFixed(3);

  const { favoritesIds, fetchFavoritesIds } = useFavorites();
  const { showNotification } = useNotification();

  const getSessionId = () => {
    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId =
        "guest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("session_id", sessionId);
    }
    return sessionId;
  };

  const isFavorited = favoritesIds.includes(parseInt(item.product_id));

  const handleToggleFavorite = async () => {
    const sessionId = getSessionId();
    const numericId = parseInt(item.product_id);
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

      showNotification(
        currentlyFavorited
          ? "تم حذف المنتج من قائمة الأمنيات"
          : "تم إضافة المنتج إلى قائمة الأمنيات",
        "success"
      );

      await fetchFavoritesIds();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      showNotification("فشل في تحديث قائمة الأمنيات", "error");
    }
  };

  return (
    <div className="border-b border-gray-200 py-6" dir="rtl">
      <div className="grid grid-cols-12 gap-x-6 gap-y-4">
        {/* ================= MOBILE LAYOUT ================= */}
        <div className="col-span-12 md:hidden">
          <div className="flex items-start gap-4 ">
            {/* Image Column */}
            <div className=" w-24 h-32 flex-shrink-0 ">
              <img
                src={`https://blomengdalis-tester.com/backend/uploads/${item.main_image}`}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* All Info Column */}
            <div className="flex-1">
              {/* Title + X button */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-title flex-1">{item.name}</h3>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 5L5 15M5 5l10 10" />
                  </svg>
                </button>
              </div>

              <p className="text-paragraph mb-2">{item.description}</p>

              <div className="flex items-center gap-1 mb-2">
                <span className="text-small">معرّف المنتج:</span>
                <span className="text-small-dark">{item.product_id}</span>
              </div>

              <p className="text-medium-dark mb-3">KWD {totalPrice}</p>

              {/* Size + Quantity Controls in one row */}
              <div className="flex items-center justify-between mb-3">
                {/* Size */}
                <div className="text-small-dark underline underline-offset-2">
                  {item.sizes || "لا حجم"}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateQuantity(item.product_id, "decrement")}
                    disabled={item.quantity <= 1}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="text-almarai text-lg font-medium text-gray-900 min-w-[32px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product_id, "increment")}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Non-refundable notice */}
              <div className="color-box px-4 py-3 flex items-center justify-center gap-2 mb-3 border-box">
                <IoIosInformationCircleOutline
                  className="text-[#346596] flex-shrink-0"
                  size={20}
                />
                <span className="text-small">منتج غير قابل للاسترداد</span>
              </div>

              {/* Add to wishlist */}
              <div className="text-end">
                <button
                  onClick={handleToggleFavorite}
                  className="text-paragraph underline underline-offset-4"
                >
                  {isFavorited
                    ? "حذف من قائمة الأمنيات"
                    : "أضف إلى قائمة الأمنيات"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP LAYOUT ================= */}
        <div className="hidden md:contents">
          {/* صورة المنتج */}
          <div className="col-span-4 md:col-span-3 flex items-start justify-center sm:justify-start">
            <div className="w-40 h-40 bg-card ">
              <img
                src={`https://blomengdalis-tester.com/backend/uploads/${item.main_image}`}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* تفاصيل المنتج */}
          <div className="col-span-7 md:col-span-4 text-right flex flex-col justify-start">
            <h3 className="text-title mb-3">{item.name}</h3>
            <p className="text-paragraph mb-3">{item.description}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-small">معرّف المنتج:</span>
              <span className="text-small-dark">{item.product_id}</span>
            </div>
            <p className="text-medium-dark">KWD {totalPrice}</p>
          </div>

          {/* العمليات والأزرار */}
          <div className="col-span-12 md:col-span-5">
            {/* الصف الأول */}
            <div className="flex items-center justify-between mb-4 gap-2">
              {/* الحجم */}
              <div className="text-small-dark underline underline-offset-2 flex-shrink-0">
                {item.sizes || "لا حجم"}
              </div>

              {/* أزرار الكمية */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => updateQuantity(item.product_id, "decrement")}
                  disabled={item.quantity <= 1}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>

                <span className="text-almarai text-base font-medium text-gray-900 min-w-[24px] text-center">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.product_id, "increment")}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>

              {/* حذف المنتج */}
              <button
                onClick={() => removeItem(item.product_id)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 5L5 15M5 5l10 10" />
                </svg>
              </button>
            </div>

            {/* تنبيه عدم الإرجاع */}
            <div className="color-box px-4 py-2 flex items-center gap-2 mb-5 border-box">
              <IoIosInformationCircleOutline
                className="text-[#346596] flex-shrink-0"
                size={24}
              />
              <span className="text-small">منتج غير قابل للاسترداد</span>
            </div>

            {/* قائمة الأمنيات */}
            <div className="flex justify-end">
              <button
                onClick={handleToggleFavorite}
                className="text-paragraph underline underline-offset-4 flex items-center gap-1"
              >
                {isFavorited
                  ? "حذف من قائمة الأمنيات"
                  : "أضف إلى قائمة الأمنيات"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCart;
