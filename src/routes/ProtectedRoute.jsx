import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول من localStorage
  const isAuthenticated =
    localStorage.getItem("dashboard_authenticated") === "true";

  useEffect(() => {
    // لو مش مسجل دخول، نوجهه لصفحة Login
    if (!isAuthenticated) {
      navigate("/dashboard/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // لو مش مسجل دخول، نرجع Navigate component
  if (!isAuthenticated) {
    return <Navigate to="/dashboard/login" replace />;
  }

  // لو مسجل دخول، نعرض الصفحة المحمية
  return children;
}

export default ProtectedRoute;
