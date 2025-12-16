import React, { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    collection: "",
    description: "",
    scent_description: "",
    price_before: "",
    price_after: "",
    discount_percent: "",
    sizes: "", // نص، مثلاً: "50ml, 100ml"
  });

  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]); // صور إضافية
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
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
      setMessage("❌ لازم ترفع الصورة الرئيسية");
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    data.append("main_image", mainImage);
    images.forEach((img) => data.append("images[]", img));

    try {
      const res = await axios.post(
        "https://blomengdalis-tester.com/backend/add-product.php",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setMessage("✅ المنتج تم إضافته بنجاح");
        setFormData({
          name: "",
          collection: "",
          description: "",
          scent_description: "",
          price_before: "",
          price_after: "",
          discount_percent: "",
          sizes: "",
        });
        setMainImage(null);
        setImages([]);
      } else {
        setMessage("❌ فشل الإضافة: " + (res.data.error || "خطأ غير معروف"));
      }
    } catch {
      setMessage("❌ فشل الاتصال بالخادم");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>إضافة منتج جديد</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          name="name"
          placeholder="اسم المنتج"
          value={formData.name}
          onChange={handleChange}
          required
        /><br />
        <input
          name="collection"
          placeholder="المجموعة"
          value={formData.collection}
          onChange={handleChange}
          required
        /><br />
        <textarea
          name="description"
          placeholder="الوصف"
          value={formData.description}
          onChange={handleChange}
          required
        /><br />
        <textarea
          name="scent_description"
          placeholder="وصف الرائحة"
          value={formData.scent_description}
          onChange={handleChange}
          required
        /><br />
        <input
          type="number"
          name="price_before"
          placeholder="السعر قبل الخصم"
          value={formData.price_before}
          onChange={handleChange}
          required
        /><br />
        <input
          type="number"
          name="price_after"
          placeholder="السعر بعد الخصم"
          value={formData.price_after}
          onChange={handleChange}
          required
        /><br />
        <input
          type="number"
          name="discount_percent"
          placeholder="نسبة الخصم"
          value={formData.discount_percent}
          onChange={handleChange}
          required
        /><br />
        <input
          name="sizes"
          placeholder="الأحجام (مثلاً: 50ml, 100ml)"
          value={formData.sizes}
          onChange={handleChange}
          required
        /><br />
        <label>الصورة الرئيسية</label><br />
        <input type="file" name="main_image" accept="image/*" onChange={handleMainImageChange} required />
<br />
        <label>صور إضافية (اختياري)</label><br />
        <input type="file" name="images[]" accept="image/*" multiple onChange={handleImagesChange} /><br /><br />
        <button type="submit">➕ إضافة المنتج</button>
      </form>
    </div>
  );
}

export default AddProduct;
