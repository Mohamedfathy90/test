import React from "react";
import { Package, ShoppingCart, BarChart3, X } from "lucide-react";

function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const menuItems = [
    { id: "overview", label: "نظرة عامة", icon: BarChart3 },
    { id: "products", label: "المنتجات", icon: Package },
    { id: "orders", label: "الطلبات", icon: ShoppingCart },
    { id: "reports", label: "تقارير المبيعات", icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-[#1a1a1a] text-white
        transition-transform duration-300 flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
          <h1 className="text-sm font-semibold text-[#c9a961]">لوحة التحكم</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 hover:bg-gray-800 rounded-md transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-2 py-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-right transition
                  ${
                    isActive
                      ? "bg-[#c9a961] text-[#1a1a1a]"
                      : "text-gray-200 hover:bg-gray-800"
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">لوحة تحكم الإدارة v1.0</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
