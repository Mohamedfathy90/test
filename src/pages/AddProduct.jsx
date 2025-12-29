import React, { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    collection: "",
    description: "",
    scent_description: "",
    original_price: "", // السعر الأصلي (يظهر دائماً)
    price_before: "", // السعر قبل الخصم (اختياري)
    price_after: "", // السعر بعد الخصم (اختياري)
    discount_percent: "",
    sizes: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage) {
      setMessage("❌ لازم ترفعي الصورة الرئيسية");
      return;
    }

    // التحقق من المنطق: لو في خصم، لازم يكون في price_before و price_after
    if (
      hasDiscount &&
      (!formData.price_before ||
        !formData.price_after ||
        !formData.discount_percent)
    ) {
      setMessage("❌ لو في خصم، لازم تملي كل حقول الخصم");
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      // لو مفيش خصم، بعت القيم فاضية
      if (
        !hasDiscount &&
        (key === "price_before" ||
          key === "price_after" ||
          key === "discount_percent")
      ) {
        data.append(key, "");
      } else {
        data.append(key, formData[key]);
      }
    }
    data.append("main_image", mainImage);
    images.forEach((img) => data.append("images[]", img));

    try {
      const res = await axios.post(
        "https://blomengdalis-tester.com/backend/add-product.php",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setMessage("✅ المنتج تم إضافته بنجاح");
        setFormData({
          name: "",
          collection: "",
          description: "",
          scent_description: "",
          original_price: "",
          price_before: "",
          price_after: "",
          discount_percent: "",
          sizes: "",
        });
        setMainImage(null);
        setImages([]);
        setHasDiscount(false);
      } else {
        setMessage("❌ فشل الإضافة: " + (res.data.message || ""));
      }
    } catch (error) {
      setMessage("❌ فشل الاتصال بالخادم");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          إضافة منتج جديد
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm text-red-600">{message}</p>
        )}

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <input
            name="name"
            placeholder="اسم المنتج"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />

          <input
            name="collection"
            placeholder="المجموعة"
            value={formData.collection}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />

          <textarea
            name="description"
            placeholder="الوصف"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />

          <textarea
            name="scent_description"
            placeholder="وصف الرائحة"
            value={formData.scent_description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />

          <input
            name="sizes"
            placeholder="الحجم (مثال: 50ml)"
            value={formData.sizes}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />

          {/* السعر الأصلي - مطلوب دائماً */}
          <div>
            <label className="block text-sm font-medium mb-1">
              💰 السعر الأصلي (مطلوب)
            </label>
            <input
              type="number"
              step="0.01"
              name="original_price"
              placeholder="السعر الأصلي للمنتج"
              value={formData.original_price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* اختيار لو في خصم */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
              <input
                type="checkbox"
                checked={hasDiscount}
                onChange={(e) => setHasDiscount(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">🏷️ المنتج عليه خصم؟</span>
            </label>
          </div>

          {/* حقول الخصم - تظهر بس لو في خصم */}
          {hasDiscount && (
            <div className="space-y-4 bg-blue-50 p-4 rounded-md border border-blue-200">
              <p className="text-xs text-blue-800 font-medium">
                📝 بيانات الخصم (مطلوبة)
              </p>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  step="0.01"
                  name="price_before"
                  placeholder="السعر قبل الخصم"
                  value={formData.price_before}
                  onChange={handleChange}
                  required={hasDiscount}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <input
                  type="number"
                  step="0.01"
                  name="price_after"
                  placeholder="السعر بعد الخصم"
                  value={formData.price_after}
                  onChange={handleChange}
                  required={hasDiscount}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <input
                type="number"
                name="discount_percent"
                placeholder="نسبة الخصم %"
                value={formData.discount_percent}
                onChange={handleChange}
                required={hasDiscount}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">الصورة الرئيسية</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              required
              className="w-full text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">صور إضافية (اختياري)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="w-full text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
          >
            ➕ إضافة المنتج
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;

//////////////////////////
