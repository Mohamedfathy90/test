import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

const API_URL = "https://blomengdalis-tester.com/backend";

function AddProduct() {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
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
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [message, setMessage] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("dashboard_authenticated");
    if (!isAuthenticated) {
      navigate("/F10/login");
    }
  }, [navigate]);

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
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
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
          setImagesPreview(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!mainImage) {
      setMessage("❌ يجب رفع الصورة الرئيسية");
      setLoading(false);
      return;
    }

    if (formData.original_price <= 0) {
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
    for (let key in formData) {
      if (
        !hasDiscount &&
        (key === "price_after" || key === "discount_percent")
      ) {
        data.append(key, "");
      } else {
        data.append(key, formData[key]);
      }
    }

    data.append("main_image", mainImage);
    images.forEach((img) => data.append("images[]", img));

    try {
      const res = await axios.post(`${API_URL}/add-product.php`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMessage("✅ تم إضافة المنتج بنجاح");
        setTimeout(() => {
          navigate("/F10/home");
        }, 1500);
      } else {
        setMessage("❌ فشل في إضافة المنتج");
      }
    } catch (error) {
      setMessage("❌ فشل الاتصال بالخادم");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/F10/home")}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            ← العودة للوحة التحكم
          </button>
          <h1 className="text-3xl font-bold text-gray-900">إضافة منتج جديد</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {message && (
              <div
                className={`mb-4 p-3 rounded-md text-sm ${
                  message.includes("✅")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنتج *
                </label>
                <input
                  name="name"
                  placeholder="اسم المنتج"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المجموعة *
                </label>
                <input
                  name="collection"
                  placeholder="المجموعة"
                  value={formData.collection}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف
                </label>
                <textarea
                  name="description"
                  placeholder="الوصف"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الرائحة
                </label>
                <textarea
                  name="scent_description"
                  placeholder="وصف الرائحة"
                  value={formData.scent_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحجم *
                </label>
                <input
                  name="sizes"
                  placeholder="الحجم (مثال: 50ml)"
                  value={formData.sizes}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر الأصلي *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="original_price"
                  placeholder="السعر الأصلي"
                  value={formData.original_price}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDiscount}
                    onChange={(e) => setHasDiscount(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">المنتج عليه خصم؟</span>
                </label>
              </div>

              {hasDiscount && (
                <div className="space-y-3 bg-blue-50 p-4 rounded-lg border">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نسبة الخصم %
                    </label>
                    <input
                      type="number"
                      name="discount_percent"
                      placeholder="نسبة الخصم"
                      value={formData.discount_percent}
                      readOnly
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصورة الرئيسية *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleMainImageChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صور إضافية
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "جاري الإضافة..." : "➕ إضافة المنتج"}
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              معاينة المنتج
            </h2>

            {mainImagePreview ? (
              <div className="mb-6">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={mainImagePreview}
                    alt="معاينة الصورة الرئيسية"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <p className="text-gray-400">لا توجد صورة</p>
                </div>
              </div>
            )}

            {imagesPreview.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  الصور الإضافية
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {imagesPreview.map((preview, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={preview}
                        alt={`معاينة ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  الاسم
                </h3>
                <p className="text-gray-900 font-semibold">
                  {formData.name || "---"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  المجموعة
                </h3>
                <p className="text-gray-900">{formData.collection || "---"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  الوصف
                </h3>
                <p className="text-gray-900 text-sm">
                  {formData.description || "---"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  الحجم
                </h3>
                <p className="text-gray-900">{formData.sizes || "---"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  السعر
                </h3>
                {hasDiscount && formData.price_after ? (
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(parseFloat(formData.price_after))}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(parseFloat(formData.original_price))}
                    </p>
                    {formData.discount_percent && (
                      <p className="text-sm text-red-600">
                        خصم {formData.discount_percent}%
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-lg font-bold text-gray-900">
                    {formData.original_price
                      ? formatPrice(parseFloat(formData.original_price))
                      : "---"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
