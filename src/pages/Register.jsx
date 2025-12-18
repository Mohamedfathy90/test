import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // التحقق من الاسم
    if (!name) {
      newErrors.name = "الاسم مطلوب";
    } else if (name.length < 2) {
      newErrors.name = "الاسم يجب أن يكون حرفين على الأقل";
    }

    // التحقق من البريد الإلكتروني
    if (!email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    // التحقق من كلمة المرور
    if (!password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    // التحقق من البلد
    if (!country) {
      newErrors.country = "البلد مطلوب";
    } else if (country.length < 2) {
      newErrors.country = "اسم البلد غير صحيح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    // التحقق من الحقول قبل الإرسال
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://blomengdalis-tester.com/backend/signup.php",
        {
          name,
          email,
          password,
          country,
        }
      );

      if (response.data.success) {
        setMessage("✅ تم التسجيل بنجاح. جاري التوجيه للصفحة الرئيسية...");
        setName("");
        setEmail("");
        setPassword("");
        setCountry("");
        
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            navigate("/");
          }, 500);
        }, 800);
      } else {
        setMessage("⚠️ " + response.data.message);
      }
    } catch (error) {
      setMessage("⚠️ خطأ في الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-white p-5 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ fontFamily: "'Tajawal', sans-serif" }}
    >
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-normal text-gray-800 mb-6">
          إنشاء حساب جديد
        </h2>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-normal text-gray-700 mb-2">
              الاسم الكامل
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-gray-400`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-normal text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-gray-400`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-normal text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-gray-400`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-normal text-gray-700 mb-2">
              البلد
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.country ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-gray-400`}
            />
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-black text-white rounded text-sm font-normal hover:bg-gray-900 transition-colors mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "جاري التسجيل..." : "إنشاء الحساب"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center text-sm mb-4 ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-700 mb-2">لديك حساب بالفعل؟</p>
          <p className="text-xs text-gray-600 mb-3">
            قم بتسجيل الدخول للوصول إلى حسابك
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-black border border-gray-300 rounded px-8 py-2 text-sm font-normal hover:bg-gray-50 transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
