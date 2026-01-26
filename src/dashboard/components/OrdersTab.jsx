import React from "react";

// Mapping countries to currency codes
// const COUNTRY_CURRENCY_MAP = {
//   الكويت: "KWD",
//   الإمارات: "AED",
//   السعودية: "SAR",
//   عمان: "OMR",
//   البحرين: "BHD",
//   قطر: "QAR",
// };

function OrdersTab({
  orders,
  onViewOrder,
  onPrintOrder,
  onSaveInvoiceAsImage,
  onUpdateOrderStatus,
}) {
  // Get currency from country
  // const getCurrencyFromCountry = (country) => {
  //   return COUNTRY_CURRENCY_MAP[country] || "KWD";
  // };
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">الطلبات</h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50">
            <tr className="text-gray-600 font-semibold">
              {[
                "رقم",
                "العميل",
                // "الدولة",
                // "العملة",
                "الهاتف",
                "المبلغ",
                "الدفع",
                "الحالة",
                "الفاتورة",
                "التاريخ",
                "إجراءات",
              ].map((h) => (
                <th key={h} className="px-3 py-2 text-right whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {!orders || orders.length === 0 ? (
              <tr>
                <td
                  colSpan="12"
                  className="px-6 py-8 text-center text-gray-500"
                >
                  لا توجد طلبات
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order?.id} className="hover:bg-gray-50 transition">
                  <td className="px-3 py-2 font-semibold text-gray-900">
                    #{order.id}
                  </td>

                  <td className="px-3 py-2 min-w-[140px]">
                    <div className="font-medium truncate">
                      {order.full_name ||
                        `${order.first_name || ""} ${
                          order.last_name || ""
                        }`.trim() ||
                        order.name ||
                        "غير محدد"}
                    </div>
                    {order.national_id && (
                      <div className="text-gray-500">
                        ID: {order.national_id}
                      </div>
                    )}
                  </td>

                  {/* <td className="px-3 py-2">
                    <span className="font-semibold text-blue-600">
                      {order.country || "غير محدد"}
                    </span>
                  </td> */}

                  {/* <td className="px-3 py-2">
                    <span className="font-semibold text-green-600">
                      {order.country || "غير محدد"}
                    </span>
                  </td> */}

                  <td className="px-3 py-2 whitespace-nowrap">
                    {order.phone || "-"}
                  </td>
                  {/* 
                  <td className="px-3 py-2 min-w-[120px]">
                    {order.items_details?.slice(0, 2).map((item, i) => (
                      <div key={i} className="truncate">
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                    {order.items_details?.length > 2 && (
                      <div className="text-gray-400">
                        +{order.items_details.length - 2}
                      </div>
                    )}
                  </td> */}

                  <td className="px-3 py-2 font-semibold">
                    {parseFloat(order.total_price || 0).toFixed(2)}{" "}
                  </td>

                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : order.payment_status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.payment_status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.payment_status === "paid"
                        ? "مدفوع"
                        : order.payment_status === "processing"
                        ? "قيد المعالجة"
                        : order.payment_status === "failed"
                        ? "فشل"
                        : "غير مدفوع"}
                    </span>
                  </td>

                  <td className="px-3 py-2">
                    <select
                      value={order.order_status || "pending"}
                      onChange={(e) =>
                        onUpdateOrderStatus(order.id, e.target.value)
                      }
                      className={`text-xs rounded-md px-2 py-1  ${
                        order.order_status === "shipped"
                          ? "bg-green-100 text-green-800"
                          : order.order_status === "pending"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-900" // لأي حالة ثانية
                      }`}
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="shipped">تم الشحن</option>
                    </select>
                  </td>

                  <td className="px-3 py-2 font-mono">
                    {order.invoice_id || "-"}
                  </td>

                  <td className="px-3 py-2">
                    <div>
                      {new Date(order.created_at).toLocaleDateString("ar-KW")}
                    </div>
                    <div className="text-gray-500">
                      {new Date(order.created_at).toLocaleTimeString("ar-KW", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => onViewOrder(order.id)}
                        className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        عرض
                      </button>
                      <button
                        onClick={() => onPrintOrder(order)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        طباعة
                      </button>
                      <button
                        onClick={() => onSaveInvoiceAsImage(order)}
                        className="px-2 py-1 hover:bg-gray-100 rounded"
                      >
                        📷
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden divide-y divide-gray-100">
        {!orders || orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-xs">
            لا توجد طلبات
          </div>
        ) : (
          orders.map((order) => (
            <div key={order?.id} className="p-3 space-y-2.5">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-xs text-gray-900">
                    طلب #{order?.id}
                  </span>
                  {order?.invoice_id && (
                    <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
                      فاتورة: {order.invoice_id}
                    </div>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    order?.payment_status === "paid"
                      ? "bg-green-100 text-green-800"
                      : order?.payment_status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : order?.payment_status === "failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order?.payment_status === "paid"
                    ? "مدفوع"
                    : order?.payment_status === "processing"
                    ? "قيد المعالجة"
                    : order?.payment_status === "failed"
                    ? "فشل"
                    : "غير مدفوع"}
                </span>
              </div>

              {/* Customer Info */}
              <div className="space-y-1.5 text-[11px]">
                <div>
                  <span className="text-gray-500">العميل:</span>
                  <span className="font-medium text-gray-900 mr-1">
                    {order?.full_name ||
                      `${order?.first_name || ""} ${
                        order?.last_name || ""
                      }`.trim() ||
                      order?.name ||
                      "غير محدد"}
                  </span>
                </div>

                {order?.national_id && (
                  <div>
                    <span className="text-gray-500">الهوية:</span>
                    <span className="text-gray-900 mr-1">
                      {order.national_id}
                    </span>
                  </div>
                )}

                {/* <div>
                  <span className="text-gray-500">الدولة:</span>
                  <span className="font-semibold text-blue-600 mr-1">
                    {order?.country || "غير محدد"}
                  </span>
                </div> */}

                {/* <div>
                  <span className="text-gray-500">العملة:</span>
                  <span className="font-semibold text-green-600 mr-1">
                    {getCurrencyFromCountry(order?.country)}
                  </span>
                </div> */}

                <div>
                  <span className="text-gray-500">الهاتف:</span>
                  <span className="text-gray-900 mr-1">
                    {order?.phone || "-"}
                  </span>
                </div>
              </div>

              {/* Address */}
              {(order?.country ||
                order?.city ||
                order?.address ||
                order?.building) && (
                <div className="space-y-1 text-[11px]">
                  <div>
                    <span className="text-gray-500">العنوان:</span>
                    <span className="text-gray-900 mr-1">
                      {order?.country || ""} {order?.city && `، ${order.city}`}
                    </span>
                  </div>
                  {order?.address && (
                    <div className="text-gray-700 pr-3">{order.address}</div>
                  )}
                  {order?.building && (
                    <div className="text-gray-600 pr-3">
                      مبنى: {order.building}
                    </div>
                  )}
                </div>
              )}

              {/* Products */}
              {order?.items_details && order.items_details.length > 0 && (
                <div className="text-[11px]">
                  <span className="text-gray-500">المنتجات:</span>
                  <div className="mt-1 space-y-0.5 pr-3">
                    {order.items_details.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-gray-900">
                        {item?.name || "منتج"} × {item?.quantity || 0}
                      </div>
                    ))}
                    {order.items_details.length > 3 && (
                      <div className="text-gray-400">
                        +{order.items_details.length - 3} أكثر
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price and Status */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div>
                  <div className="text-[10px] text-gray-500">
                    المبلغ الإجمالي
                  </div>
                  <span className="font-semibold text-xs text-gray-900">
                    {parseFloat(order?.total_price || 0).toFixed(2)}{" "}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-gray-500 mb-1">
                    حالة الطلب
                  </div>
                  <select
                    value={order?.order_status || "pending"}
                    onChange={(e) =>
                      onUpdateOrderStatus(order.id, e.target.value)
                    }
                    className={`text-[10px] rounded-md px-2 py-1 border-0 font-medium ${
                      order?.order_status === "shipped"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="shipped">تم الشحن</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              {order?.created_at && (
                <div className="text-[10px] text-gray-400">
                  {new Date(order.created_at).toLocaleDateString("ar-KW")} -{" "}
                  {new Date(order.created_at).toLocaleTimeString("ar-KW", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-1.5 pt-2 border-t border-gray-100">
                <button
                  onClick={() => onViewOrder(order.id)}
                  className="flex-1 text-[10px] bg-blue-50  py-2 rounded hover:bg-blue-100 transition"
                >
                  عرض
                </button>
                <button
                  onClick={() => onPrintOrder(order)}
                  className="flex-1 text-[10px] bg-gray-100 text-gray-700 py-1.5 rounded hover:bg-gray-200 transition"
                >
                  طباعة
                </button>
                <button
                  onClick={() => onSaveInvoiceAsImage(order)}
                  className="px-2 text-[10px] bg-gray-100 hover:bg-gray-200 rounded transition"
                  title="حفظ كصورة"
                >
                  📷
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrdersTab;
