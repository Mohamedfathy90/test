import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "https://blomengdalis-tester.com/backend/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      console.log("✅ Response from backend:", data);

      if (data.success) {
        setMessage("✅ تم تسجيل الدخول");
        onLoginSuccess && onLoginSuccess(data.user);
      } else {
        setMessage("⚠️ " + data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ خطأ في الاتصال بالخادم");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white p-5"
      style={{ fontFamily: "'Tajawal', sans-serif" }}
    >
      <div className="w-full max-w-lg">
        <h2 className=" text-xl font-normal text-gray-800 mb-6">
          تسجيل الدخول
        </h2>

        <div>
          <div className="mb-4">
            <label className="block  text-sm font-normal text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="mb-2">
            <label className="block  text-sm font-normal text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className=" mb-5">
            <a
              href="#"
              className="text-gray-700 text-sm underline hover:text-gray-900"
            >
              هل نسيت كلمة المرور؟
            </a>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-2 bg-black text-white rounded text-sm font-normal hover:bg-gray-900 transition-colors mb-4"
          >
            تسجيل الدخول
          </button>
        </div>

        {message && (
          <p
            className={`text-center text-sm mb-4 ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-6"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          تابع مع جوجل
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-700 mb-2">ليس لديك حساب؟</p>
          <p className="text-xs text-gray-600 mb-3">
            قم بإنشاء حساب بإتمام طلبك بشكل أسرع وتتبع الطلبات
          </p>
          <button
            onClick={() => console.log("Navigate to register")}
            className="bg-white text-black border border-gray-300 rounded px-8 py-2 text-sm font-normal hover:bg-gray-50 transition-colors"
          >
            أنشئ حساب
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
