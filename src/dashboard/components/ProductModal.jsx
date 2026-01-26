import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCurrency } from "../../context/CurrencyContext";
import { X } from "lucide-react";

const API_URL = "https://blomengdalis-tester.com/backend";

function ProductModal({ isOpen, onClose, productId, onSuccess }) {
  const { formatPrice } = useCurrency();
  const isEditMode = !!productId;
  
  const [formData, setFormData] = useState({
    name: "",
    collection: "",
    description: "",
    scent_description: "",
    original_price: "",
    price_after: "",
    discount_percent: "",
    sizes: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [currentMainImage, setCurrentMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [message, setMessage] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        fetchProduct();
      } else {
        resetForm();
      }
    }
  }, [isOpen, productId]);

  const resetForm = () => {
    setFormData({
      name: "",
      collection: "",
      description: "",
      scent_description: "",
      original_price: "",
      price_after: "",
      discount_percent: "",
      sizes: "",
    });
    setMainImage(null);
    setMainImagePreview(null);
    setCurrentMainImage(null);
    setImages([]);
    setImagesPreview([]);
    setCurrentImages([]);
    setHasDiscount(false);
    setMessage("");
  };

  const fetchProduct = async () => {
    setFetching(true);
    try {
      const response = await axios.get(`${API_URL}/get-products.php?id=${productId}`);
      const product = response.data;
      
      setFormData({
        name: product.name || "",
        collection: product.collection || "",
        description: product.description || "",
        scent_description: product.scent_description || "",
        original_price: product.original_price || "",
        price_after: product.price_after || "",
        discount_percent: product.discount_percent || "",
        sizes: product.sizes || "",
      });

      if (product.price_after && product.discount_percent) {
        setHasDiscount(true);
      }

      setCurrentMainImage(product.main_image);
      setMainImagePreview(`${API_URL}/uploads/${encodeURIComponent(product.main_image)}`);

      if (product.images) {
        const imageArray = typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : product.images;
        setCurrentImages(imageArray);
        setImagesPreview(
          imageArray.map(img => `${API_URL}/uploads/${encodeURIComponent(img)}`)
        );
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setMessage("❌ فشل في جلب بيانات المنتج");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (hasDiscount && (name === "original_price" || name === "price_after")) {
      const original = Number(updatedData.original_price);
      const after = Number(updatedData.price_after);

      if (original > 0 && after > 0 && after < original) {
        const discount = ((original - after) / original) * 100;
        updatedData.discount_percent = discount.toFixed(0);
      } else {
        updatedData.discount_percent = "";
      }
    }

    setFormData(updatedData);
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setMainImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setImagesPreview((prev) => [...prev, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!isEditMode && !mainImage) {
      setMessage("❌ يجب رفع الصورة الرئيسية");
      setLoading(false);
      return;
    }

    const originalPrice = parseFloat(formData.original_price);
    if (!originalPrice || originalPrice <= 0) {
      setMessage("❌ السعر الأصلي يجب أن يكون أكبر من صفر");
      setLoading(false);
      return;
    }

    if (hasDiscount && (!formData.price_after || !formData.discount_percent)) {
      setMessage("❌ بيانات الخصم غير صحيحة");
      setLoading(false);
      return;
    }

    const data = new FormData();
    
    if (isEditMode) {
      data.append("id", productId);
    }

    for (let key in formData) {
      if (!hasDiscount && (key === "price_after" || key === "discount_percent")) {
        data.append(key, "");
      } else if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    }

    if (mainImage) {
      data.append("main_image", mainImage);
    }

    if (images && images.length > 0) {
      images.forEach((img) => {
        if (img instanceof File) {
          data.append("images[]", img);
        }
      });
    }

    try {
      const endpoint = isEditMode ? "update-product.php" : "add-product.php";
      const url = `${API_URL}/${endpoint}`;
      
      console.log("Sending request to:", url);
      console.log("FormData keys:", Array.from(data.keys()));
      console.log("Has main image:", !!mainImage);
      console.log("Has additional images:", images.length);
      
      const res = await axios.post(url, data, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds timeout
      });

      console.log("Response status:", res.status);
      console.log("Response data:", res.data);

      if (res.data && res.data.success) {
        setMessage(`✅ ${isEditMode ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح"}`);
        setLoading(false);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
          onClose();
          resetForm();
        }, 1500);
      } else {
        const errorMsg = res.data?.message || res.data?.error || res.data || "فشل العملية";
        setMessage(`❌ ${errorMsg}`);
        setLoading(false);
      }
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
      let errorMessage = "❌ فشل الاتصال بالخادم";
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `خطأ ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        // Request was made but no response
        errorMessage = "❌ لا يوجد اتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت";
      } else if (error.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      setMessage(errorMessage);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            {isEditMode ? "تعديل المنتج" : "إضافة منتج جديد"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {fetching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a961]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Form */}
              <div className="space-y-3 sm:space-y-4">
                {message && (
                  <div
                    className={`p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm ${
                      message.includes("✅")
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                      اسم المنتج *
                    </label>
                    <input
                      name="name"
                      placeholder="اسم المنتج"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#c9a961] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                      المجموعة *
                    </label>
                    <input
                      name="collection"
                      placeholder="المجموعة"
                      value={formData.collection}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#c9a961] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                      الحجم *
                    </label>
                    <input
                      name="sizes"
                      placeholder="50ml"
                      value={formData.sizes}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#c9a961] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                      الوصف
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#c9a961] focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                      وصف الرائحة
                    </label>
                    <textarea
                      name="scent_description"
                      rows={2}
                      value={formData.scent_description}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#c9a961] focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                      السعر الأصلي *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#c9a961] focus:border-transparent"
                    />
                  </div>

                  <div className="rounded-lg border bg-gray-50 p-3">
                    <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasDiscount}
                        onChange={(e) => setHasDiscount(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">المنتج عليه خصم؟</span>
                    </label>
                  </div>

                  {hasDiscount && (
                    <div className="rounded-lg border bg-blue-50 p-3 space-y-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                          السعر بعد الخصم *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="price_after"
                          placeholder="السعر بعد الخصم"
                          value={formData.price_after}
                          onChange={handleChange}
                          required={hasDiscount}
                          className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#c9a961] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                          نسبة الخصم %
                        </label>
                        <input
                          type="number"
                          name="discount_percent"
                          value={formData.discount_percent}
                          readOnly
                          className="w-full rounded-lg bg-gray-100 border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm cursor-not-allowed"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                      الصورة الرئيسية {isEditMode ? "(اختياري)" : "*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      required={!isEditMode}
                      className="w-full text-xs sm:text-sm border border-gray-300 rounded-lg px-3 sm:px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                      صور إضافية (اختياري)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className="w-full text-xs sm:text-sm border border-gray-300 rounded-lg px-3 sm:px-4 py-2"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#c9a961] text-white py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#b8984f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading 
                      ? (isEditMode ? "جاري التحديث..." : "جاري الإضافة...") 
                      : (isEditMode ? "💾 حفظ التعديلات" : "➕ إضافة المنتج")}
                  </button>
                </form>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">معاينة المنتج</h3>
                
                <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
                  {mainImagePreview ? (
                    <img
                      src={mainImagePreview}
                      alt="معاينة"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs sm:text-sm">
                      لا توجد صورة
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500">الاسم:</span>
                    <p className="font-medium text-gray-900">{formData.name || "---"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">المجموعة:</span>
                    <p className="text-gray-900">{formData.collection || "---"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">الحجم:</span>
                    <p className="text-gray-900">{formData.sizes || "---"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">السعر:</span>
                    {hasDiscount && formData.price_after ? (
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatPrice(parseFloat(formData.price_after))}
                        </p>
                        <p className="text-xs text-gray-400 line-through">
                          {formatPrice(parseFloat(formData.original_price))}
                        </p>
                      </div>
                    ) : (
                      <p className="font-semibold text-gray-900">
                        {formData.original_price
                          ? formatPrice(parseFloat(formData.original_price))
                          : "---"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
