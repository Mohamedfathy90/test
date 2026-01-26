import React from "react";

function OverviewTab({ products, orders, weeklySales }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
      {/* Total Products */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-400 mb-2">إجمالي المنتجات</span>
          <p className="text-4xl font-semibold text-gray-900">
            {products.length}
          </p>
        </div>
      </div>

      {/* Total Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-400 mb-2">إجمالي الطلبات</span>
          <p className="text-4xl font-semibold text-gray-900">
            {orders.length}
          </p>
        </div>
      </div>

      {/* Weekly Sales */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-400 mb-2">مبيعات هذا الأسبوع</span>
          <p className="text-3xl font-semibold text-gray-900">
            {weeklySales?.totals?.paid_revenue
              ? parseFloat(weeklySales.totals.paid_revenue).toFixed(2)
              : "0.00"}
            <span className="text-base text-gray-500 mr-1">د.ك</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;
