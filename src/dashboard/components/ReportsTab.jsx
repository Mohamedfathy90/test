import React from "react";

function ReportsTab({ weeklySales }) {
  if (!weeklySales) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        تقرير المبيعات الأسبوعية
      </h2>
      <div className="mb-4">
        <p className="text-xs text-gray-600">
          من {new Date(weeklySales.week_start).toLocaleDateString("ar-KW")}{" "}
          إلى {new Date(weeklySales.week_end).toLocaleDateString("ar-KW")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xs text-gray-600 mb-1">إجمالي الطلبات</h3>
          <p className="text-xl font-bold text-gray-900">
            {weeklySales.totals?.total_orders || 0}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xs text-gray-600 mb-1">إجمالي المبيعات</h3>
          <p className="text-xl font-bold text-gray-900">
            {parseFloat(weeklySales.totals?.total_revenue || 0).toFixed(2)}{" "}
            د.ك
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-xs text-gray-600 mb-1">المبيعات المدفوعة</h3>
          <p className="text-xl font-bold text-green-600">
            {parseFloat(weeklySales.totals?.paid_revenue || 0).toFixed(2)}{" "}
            د.ك
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          المبيعات اليومية
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  التاريخ
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  عدد الطلبات
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  إجمالي المبيعات
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  المدفوع
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {weeklySales.daily_sales.map((day, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                    {new Date(day.date).toLocaleDateString("ar-KW")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                    {day.orders_count}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                    {parseFloat(day.total_amount || 0).toFixed(2)} د.ك
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-green-600">
                    {parseFloat(day.paid_amount || 0).toFixed(2)} د.ك
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportsTab;
