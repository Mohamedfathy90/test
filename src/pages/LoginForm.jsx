import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/context"; 
function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        // amazonq-ignore-next-line
        "https://blomengdalis-tester.com/backend/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        login(data.user); // ✅ حفظ بيانات المستخدم في Context
        navigate("/");
      } else {
        setMessage("⚠️ " + data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ خطأ في الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white p-5"
      style={{ fontFamily: "'Tajawal', sans-serif" }}
    >
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-normal text-gray-800 mb-6">تسجيل الدخول</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-black text-white rounded mb-4 disabled:bg-gray-400"
          >
            {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-red-600">{message}</p>
        )}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-700 mb-2">ليس لديك حساب؟</p>
          <button
            onClick={() => navigate("/register")}
            className="border px-6 py-2 rounded text-sm"
          >
            أنشئ حساب
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
