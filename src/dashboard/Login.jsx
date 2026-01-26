import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://blomengdalis-tester.com/backend";

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/login.php`, {
        username: credentials.username,
        password: credentials.password,
      });

      if (response.data.success) {
        // حفظ حالة تسجيل الدخول في localStorage
        localStorage.setItem("dashboard_authenticated", "true");
        navigate("/F10/home");
      } else {
        setError(
          response.data.message || "اسم المستخدم أو كلمة المرور غير صحيحة"
        );
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("حدث خطأ أثناء تسجيل الدخول");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
          <p className="text-gray-600">تسجيل الدخول للوصول إلى لوحة التحكم</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المستخدم
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="أدخل اسم المستخدم"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="أدخل كلمة المرور"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
