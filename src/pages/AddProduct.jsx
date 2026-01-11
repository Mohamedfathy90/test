import React, { useState } from "react";
import axios from "axios";

function AddProduct() {
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
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);

  // handle inputs + حساب الخصم تلقائي
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

    if (formData.original_price <= 0) {
      setMessage("❌ السعر الأصلي لازم يكون أكبر من صفر");
      return;
    }

    if (hasDiscount && (!formData.price_after || !formData.discount_percent)) {
      setMessage("❌ بيانات الخصم غير صحيحة");
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
          price_after: "",
          discount_percent: "",
          sizes: "",
        });
        setMainImage(null);
        setImages([]);
        setHasDiscount(false);
      } else {
        setMessage("❌ فشل الإضافة");
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
            className="w-full border rounded-md px-4 py-2"
          />

          <input
            name="collection"
            placeholder="المجموعة"
            value={formData.collection}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2"
          />

          <textarea
            name="description"
            placeholder="الوصف"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-md px-4 py-2"
          />

          <textarea
            name="scent_description"
            placeholder="وصف الرائحة"
            value={formData.scent_description}
            onChange={handleChange}
          
            rows={3}
            className="w-full border rounded-md px-4 py-2"
          />

          <input
            name="sizes"
            placeholder="الحجم (مثال: 50ml)"
            value={formData.sizes}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2"
          />

          <input
            type="number"
            step="0.01"
            name="original_price"
            placeholder="السعر الأصلي"
            value={formData.original_price}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2"
          />

          <div className="bg-gray-50 p-3 rounded-md border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDiscount}
                onChange={(e) => setHasDiscount(e.target.checked)}
              />
              <span>🏷️ المنتج عليه خصم؟</span>
            </label>
          </div>

          {hasDiscount && (
            <div className="space-y-3 bg-blue-50 p-4 rounded-md border">
              <input
                type="number"
                step="0.01"
                name="price_after"
                placeholder="السعر بعد الخصم"
                value={formData.price_after}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-4 py-2"
              />

              <input
                type="number"
                name="discount_percent"
                placeholder="نسبة الخصم %"
                value={formData.discount_percent}
                readOnly
                className="w-full bg-gray-100 border rounded-md px-4 py-2 cursor-not-allowed"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            required
            onChange={handleMainImageChange}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
          />

          <button className="w-full bg-black text-white py-3 rounded-md">
            ➕ إضافة المنتج
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
