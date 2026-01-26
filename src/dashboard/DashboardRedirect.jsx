import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DashboardRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("dashboard_authenticated");

    if (isAuthenticated === "true") {
      navigate("/F10/home", { replace: true });
    } else {
      navigate("/F10/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>جاري التحميل...</div>
    </div>
  );
}

export default DashboardRedirect;
