import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import html2canvas from "html2canvas";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import OverviewTab from "./components/OverviewTab";
import ProductsTab from "./components/ProductsTab";
import OrdersTab from "./components/OrdersTab";
import ReportsTab from "./components/ReportsTab";
import OrderDetailsModal from "./components/OrderDetailsModal";

const API_URL = "https://blomengdalis-tester.com/backend";

function F10() {
  const navigate = useNavigate();
  const { formatPrice, selectedCountry, selectedCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [weeklySales, setWeeklySales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
      const isAuthenticated = localStorage.getItem("dashboard_authenticated");
      if (!isAuthenticated) {
        navigate("/F10/login");
        return;
      }
    fetchData();

    // Auto delete unpaid orders after 12 hours
    const deleteUnpaidOrders = async () => {
      try {
        await axios.post(`${API_URL}/auto-delete-unpaid-orders.php`);
      } catch (error) {
        console.error("Error deleting unpaid orders:", error);
      }
    };

    // Run on mount and then every hour
    deleteUnpaidOrders();
    const interval = setInterval(deleteUnpaidOrders, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, salesRes] = await Promise.all([
        axios.get(
          `${API_URL}/get-products.php?all=1&country=${encodeURIComponent(
            selectedCountry || ""
          )}`
        ),
        axios.get(
          `${API_URL}/get-orders.php?country=${encodeURIComponent(
            selectedCountry || ""
          )}`
        ),
        axios.get(
          `${API_URL}/get-weekly-sales.php?country=${encodeURIComponent(
            selectedCountry || ""
          )}`
        ),
      ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setWeeklySales(salesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      const response = await axios.post(`${API_URL}/delete-product.php`, {
        id: id,
        country: selectedCountry || "",
      });

      if (response.data.success) {
        alert("تم حذف المنتج بنجاح");
        fetchData();
      } else {
        alert("فشل في حذف المنتج");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("حدث خطأ أثناء حذف المنتج");
    }
  };

  const handleBulkDeleteProducts = async (ids) => {
    if (!ids || !ids.length) return;
    if (
      !window.confirm(
        `هل أنت متأكد من حذف ${ids.length} منتج/منتجات محددة؟`
      )
    )
      return;

    try {
      const responses = await Promise.all(
        ids.map((id) =>
          axios.post(`${API_URL}/delete-product.php`, {
            id,
            country: selectedCountry || "",
          })
        )
      );

      const hasError = responses.some((res) => !res.data?.success);
      if (hasError) {
        alert("تم تنفيذ بعض العمليات مع وجود أخطاء في بعضها");
      } else {
        alert("تم حذف المنتجات المحددة بنجاح");
      }
      fetchData();
    } catch (error) {
      console.error("Error bulk deleting products:", error);
      alert("حدث خطأ أثناء حذف المنتجات المحددة");
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    const isCurrentlyAvailable =
      currentStatus === "1" || currentStatus === 1 || currentStatus === true;
    const newStatus = isCurrentlyAvailable ? 0 : 1;
    try {
      const response = await axios.post(
        `${API_URL}/toggle-product-availability.php`,
        {
          id: id,
          is_available: newStatus,
          country: selectedCountry || "",
        }
      );

      if (response.data.success) {
        fetchData();
      } else {
        alert("فشل في تحديث حالة المنتج");
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
      alert("حدث خطأ أثناء تحديث حالة المنتج");
    }
  };

  const handleBulkSetAvailability = async (ids, status) => {
    if (!ids || !ids.length) return;
    const statusText = status === 1 ? "متوفرة" : "غير متوفرة";
    if (
      !window.confirm(
        `هل أنت متأكد من جعل ${ids.length} منتج/منتجات ${statusText}؟`
      )
    )
      return;

    try {
      const responses = await Promise.all(
        ids.map((id) =>
          axios.post(`${API_URL}/toggle-product-availability.php`, {
            id,
            is_available: status,
            country: selectedCountry || "",
          })
        )
      );

      const hasError = responses.some((res) => !res.data?.success);
      if (hasError) {
        alert("تم تحديث بعض المنتجات مع وجود أخطاء في بعضها");
      } else {
        alert("تم تحديث حالة المنتجات المحددة بنجاح");
      }
      fetchData();
    } catch (error) {
      console.error("Error bulk updating availability:", error);
      alert("حدث خطأ أثناء تحديث حالة توفر المنتجات المحددة");
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await axios.get(
        `${API_URL}/get-order-details.php?id=${orderId}`
      );
      setSelectedOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handlePrintOrder = (order) => {
    const printWindow = window.open("", "_blank");
    const customerName =
      order.full_name ||
      (order.title === "mr"
        ? "السيد "
        : order.title === "mrs"
        ? "السيدة "
        : order.title === "miss"
        ? "الآنسة "
        : "") +
        (order.first_name && order.last_name
          ? `${order.first_name} ${order.last_name}`
          : order.name || "غير محدد");

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>فاتورة طلب #${order.id}</title>
        <style>
          * { font-family: 'Arial', sans-serif; }
          body { padding: 20px; direction: rtl; font-size: 14px; }
          .header { text-align: center; margin-bottom: 25px; }
          .header h1 { font-size: 20px; margin-bottom: 8px; }
          .header p { font-size: 14px; color: #666; }
          .order-info { margin-bottom: 20px; line-height: 1.8; }
          .order-info p { margin: 6px 0; font-size: 13px; }
          .order-info strong { font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background-color: #f8f8f8; font-weight: 600; }
          .total { font-weight: bold; font-size: 15px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>فاتورة طلب</h1>
          <p>رقم الطلب: #${order.id}</p>
        </div>
        <div class="order-info">
          ${
            order.national_id
              ? `<p><strong>الهوية:</strong> ${order.national_id}</p>`
              : ""
          }
          <p><strong>الاسم:</strong> ${customerName}</p>
          ${order.city ? `<p><strong>المدينة:</strong> ${order.city}</p>` : ""}
          <p><strong>العنوان:</strong> ${order.address || "غير محدد"}</p>
          ${
            order.building
              ? `<p><strong>المبنى:</strong> ${order.building}</p>`
              : ""
          }
          <p><strong>الهاتف:</strong> ${order.phone || "غير محدد"}</p>
          <p><strong>تاريخ الطلب:</strong> ${new Date(
            order.created_at
          ).toLocaleDateString("ar-KW")}</p>
          <p><strong>حالة الدفع:</strong> ${
            order.payment_status === "paid"
              ? "مدفوع"
              : order.payment_status === "processing"
              ? "قيد المعالجة"
              : "غير مدفوع"
          }</p>
          ${
            order.order_status
              ? `<p><strong>حالة الطلب:</strong> ${
                  order.order_status === "pending"
                    ? "قيد الانتظار"
                    : order.order_status === "shipped"
                    ? "تم الشحن"
                    : order.order_status
                }</p>`
              : ""
          }
        </div>
     
        <div class="total">
          <p>المبلغ الإجمالي: ${parseFloat(order.total_price || 0).toFixed(
            2
          )} د.ك</p>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSaveInvoiceAsImage = async (order) => {
    const customerName =
      order.full_name ||
      (order.title === "mr"
        ? "السيد "
        : order.title === "mrs"
        ? "السيدة "
        : order.title === "miss"
        ? "الآنسة "
        : "") +
        (order.first_name && order.last_name
          ? `${order.first_name} ${order.last_name}`
          : order.name || "غير محدد");

    const invoiceDiv = document.createElement("div");
    invoiceDiv.style.position = "fixed";
    invoiceDiv.style.left = "-9999px";
    invoiceDiv.style.width = "1000px";
    invoiceDiv.style.height = "1000px";
    invoiceDiv.style.padding = "40px";
    invoiceDiv.style.direction = "rtl";
    invoiceDiv.style.backgroundColor = "white";
    invoiceDiv.style.fontFamily = "Arial, sans-serif";
    invoiceDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">فاتورة طلب</h1>
        <p style="font-size: 16px; color: #666;">رقم الطلب: #${order.id}</p>
      </div>
      <div style="margin-bottom: 20px; line-height: 1.8;">
        ${
          order.national_id
            ? `<p style="margin: 6px 0; font-size: 14px;"><strong>الهوية:</strong> ${order.national_id}</p>`
            : ""
        }
        <p style="margin: 6px 0; font-size: 14px;"><strong>الاسم:</strong> ${customerName}</p>
        ${
          order.city
            ? `<p style="margin: 6px 0; font-size: 14px;"><strong>المدينة:</strong> ${order.city}</p>`
            : ""
        }
        <p style="margin: 6px 0; font-size: 14px;"><strong>العنوان:</strong> ${
          order.address || "غير محدد"
        }</p>
        ${
          order.building
            ? `<p style="margin: 6px 0; font-size: 14px;"><strong>المبنى:</strong> ${order.building}</p>`
            : ""
        }
        <p style="margin: 6px 0; font-size: 14px;"><strong>الهاتف:</strong> ${
          order.phone || "غير محدد"
        }</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>تاريخ الطلب:</strong> ${new Date(
          order.created_at
        ).toLocaleDateString("ar-KW")}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>حالة الدفع:</strong> ${
          order.payment_status === "paid"
            ? "مدفوع"
            : order.payment_status === "processing"
            ? "قيد المعالجة"
            : "غير مدفوع"
        }</p>
        ${
          order.order_status
            ? `<p style="margin: 6px 0; font-size: 14px;"><strong>حالة الطلب:</strong> ${
                order.order_status === "pending"
                  ? "قيد الانتظار"
                  : order.order_status === "shipped"
                  ? "تم الشحن"
                  : order.order_status
              }</p>`
            : ""
        }
      </div>

      <div style="font-weight: bold; font-size: 16px; margin-top: 25px; text-align: start;">
        <p>المبلغ الإجمالي: ${parseFloat(order.total_price || 0).toFixed(
          2
        )} د.ك</p>
      </div>
    `;

    document.body.appendChild(invoiceDiv);

    try {
      const canvas = await html2canvas(invoiceDiv, {
        width: 1000,
        height: 1000,
        scale: 2,
        backgroundColor: "#ffffff",
      });

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `invoice-${order.id}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(invoiceDiv);
      }, "image/png");
    } catch (error) {
      console.error("Error generating image:", error);
      alert("حدث خطأ أثناء حفظ الصورة. يرجى المحاولة مرة أخرى.");
      document.body.removeChild(invoiceDiv);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${API_URL}/update-order-status.php`, {
        order_id: orderId,
        order_status: newStatus,
      });

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, order_status: newStatus } : order
          )
        );
      } else {
        alert(response.data.error || "فشل في تحديث حالة الطلب");
        fetchData();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "حدث خطأ أثناء تحديث حالة الطلب";
      alert(errorMessage);
      fetchData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dashboard_authenticated");
    navigate("/F10/login");
  };

  // Get page title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case "overview":
        return "نظرة عامة";
      case "products":
        return "إدارة المنتجات";
      case "orders":
        return "الطلبات";
      case "reports":
        return "تقارير المبيعات";
      default:
        return "لوحة التحكم";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a961] mx-auto"></div>
          <p className="mt-4 text-base text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100" dir="rtl">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-3 sm:px-5 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-1.5 hover:bg-gray-100 rounded-md transition"
                  aria-label="فتح القائمة"
                >
                  <Menu className="w-5 h-5 text-gray-700" />
                </button>
                <div className="flex flex-col">
                  <h1 className="text-base sm:text-lg font-semibold text-gray-900">
                    {getPageTitle()}
                  </h1>
                  {selectedCountry && (
                    <span className="text-[11px] sm:text-xs text-gray-500">
                      الدولة المختارة من الموقع: {selectedCountry}
                      {selectedCurrency
                        ? ` (${selectedCurrency})`
                        : ""}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() => navigate("/")}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-xs sm:text-sm"
                >
                  العودة للموقع
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-xs sm:text-sm"
                >
                  خروج
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5">
          {activeTab === "overview" && (
            <OverviewTab
              products={products}
              orders={orders}
              weeklySales={weeklySales}
            />
          )}

          {activeTab === "products" && (
            <ProductsTab
              products={products}
              onDeleteProduct={handleDeleteProduct}
              onToggleAvailability={handleToggleAvailability}
              onBulkDeleteProducts={handleBulkDeleteProducts}
              onBulkSetAvailability={handleBulkSetAvailability}
              onRefresh={fetchData}
            />
          )}

          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              onViewOrder={handleViewOrder}
              onPrintOrder={handlePrintOrder}
              onSaveInvoiceAsImage={handleSaveInvoiceAsImage}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === "reports" && <ReportsTab weeklySales={weeklySales} />}

          <OrderDetailsModal
            selectedOrder={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onPrintOrder={handlePrintOrder}
          />
        </main>
      </div>
    </div>
  );
}

export default F10;
