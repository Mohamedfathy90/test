import React from "react";

const API_URL = "https://blomengdalis-tester.com/backend";

// Mapping countries to currency codes
// const COUNTRY_CURRENCY_MAP = {
//   الكويت: "KWD",
//   الإمارات: "AED",
//   السعودية: "SAR",
//   عمان: "OMR",
//   البحرين: "BHD",
//   قطر: "QAR",
// };

function OrderDetailsModal({ selectedOrder, onClose, onPrintOrder }) {
  if (!selectedOrder) return null;

  // Get currency from country
  // const getCurrencyFromCountry = (country) => {
  //   return COUNTRY_CURRENCY_MAP[country] || "KWD";
  // };

  // const orderCurrency = getCurrencyFromCountry(selectedOrder.country);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900">
            تفاصيل الطلب #{selectedOrder.id}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              معلومات الطلب
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
              <p>
                <strong>رقم الطلب:</strong> #{selectedOrder.id}
              </p>
              <p>
                <strong>رقم الفاتورة:</strong> {selectedOrder.invoice_id}
              </p>

              <p>
                <strong>الاسم:</strong>{" "}
                {selectedOrder.full_name ||
                  `${selectedOrder.first_name} ${selectedOrder.last_name}`}
              </p>

              <p>
                <strong>الهاتف:</strong> {selectedOrder.phone}
              </p>

              <p>
                <strong>الهوية:</strong> {selectedOrder.national_id || "-"}
              </p>
              <p>
                <strong>اللقب:</strong> {selectedOrder.title}
              </p>

              <p>
                <strong>الدولة:</strong>{" "}
                <span className="font-semibold text-blue-600">
                  {selectedOrder.country || "غير محدد"}
                </span>
              </p>

              {/* <p>
                <strong>العملة:</strong>{" "}
                <span className="font-semibold text-green-600">
                  {orderCurrency}
                </span>
              </p> */}

              <p>
                <strong>المدينة:</strong> {selectedOrder.city || "غير محدد"}
              </p>

              <p>
                <strong>العنوان:</strong> {selectedOrder.address || "غير محدد"}
              </p>
              <p>
                <strong>المبنى:</strong> {selectedOrder.building || "غير محدد"}
              </p>

              <p>
                <strong>التاريخ:</strong>{" "}
                {new Date(selectedOrder.created_at).toLocaleString("ar-KW")}
              </p>

              <p>
                <strong>حالة الطلب:</strong>{" "}
                <span className="font-medium text-blue-600">
                  {selectedOrder.order_status === "shipped"
                    ? "تم الشحن"
                    : "قيد الانتظار"}
                </span>
              </p>

              <p>
                <strong>حالة الدفع:</strong>{" "}
                <span
                  className={
                    selectedOrder.payment_status === "paid"
                      ? "text-green-600 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {selectedOrder.payment_status === "paid"
                    ? "مدفوع"
                    : "غير مدفوع"}
                </span>
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              المنتجات
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-2 text-right">الصورة</th>
                    <th className="px-4 py-2 text-right">المنتج</th>
                    <th className="px-4 py-2 text-right">الكمية</th>
                    <th className="px-4 py-2 text-right">السعر </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(
                    selectedOrder.items ||
                    selectedOrder.items_details ||
                    []
                  ).map((item, index) => {
                    const unitPrice = parseFloat(
                      item.price_after || item.price || item.original_price || 0
                    );
                    return (
                      <tr key={index} className="text-gray-700">
                        <td className="px-4 py-2">
                          <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                            {item.main_image ? (
                              <img
                                src={`${API_URL}/uploads/${encodeURIComponent(
                                  item.main_image
                                )}`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect fill='%23f3f4f6' width='48' height='48'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                                لا توجد صورة
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2 font-semibold">
                          {unitPrice.toFixed(2)} 
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={() => onPrintOrder(selectedOrder)}
              className="px-5 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm hover:bg-black transition"
            >
              طباعة الفاتورة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
