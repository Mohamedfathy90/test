import React from "react";
import { ShoppingCart, Package, Gift } from "lucide-react";

export default function OrderSummary({ totalAmount, taxAmount }) {
  const tabbyInstallment = ((totalAmount + parseFloat(taxAmount)) / 4).toFixed(
    3
  );
  const finalTotal = (totalAmount + parseFloat(taxAmount)).toFixed(3);

  return (
    <div dir="rtl" className="">
      <div className="">
        {/* Top links */}
        <div className="pt-5 text-[13px] leading-[22px] space-y-2">
          <p className="underline cursor-pointer text-[#2b2b2b]">
            امير - اكسب واستبدل
          </p>
          <p className="underline cursor-pointer text-[#2b2b2b]">
            أضف بطاقة هدايا بلومز بيوتي
          </p>
          <p className="underline cursor-pointer text-[#2b2b2b]">
            أضف رمزًا ترويجيًا
          </p>
        </div>

        {/* Order summary */}
        <div className=" pt-6">
          <h2 className="text-[16px] font-bold mb-4">ملخص الطلب</h2>

          <div className="flex justify-between text-[13px] mb-3">
            <span className="text-[#444]">المجموع الفرعي</span>
            <span className="font-semibold">KWD {totalAmount.toFixed(3)}</span>
          </div>

          <div className="flex justify-between items-center text-[13px] mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[#444]">تقدير رسوم الشحن</span>
              <span className="underline text-[#2b6cb0] cursor-pointer">
                التوصيل للكويت
              </span>
            </div>
            <span className="text-[#444]">مجاناً</span>
          </div>

          {/* الضريبة 5% */}
          <div className="flex justify-between text-[13px] mb-4">
            <span className="text-[#444]">الضريبة (5%)</span>
            <span className="font-semibold">KWD {taxAmount}</span>
          </div>

          {/* Free shipping */}
          <div className="bg-[#DDE9DE] px-2 py-2 mb-4 text-center">
            <span className="text-[#1f7a3f] text-[13px] font-medium">
              ✓ طلبك مؤهل لـ الشحن المجاني
            </span>
          </div>

          {/* Total */}
          <div className="border-t border-[#dcdcdc] pt-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-semibold">المبلغ الإجمالي</span>
              <span className="text-[18px] font-bold">KWD {finalTotal}</span>
            </div>
            <p className="text-[11px] text-[#777] mt-1">
              يشمل جميع الضرائب و الرسوم
            </p>
          </div>

          {/* Checkout button */}
          <button className="w-full h-[46px] bg-black text-white font-semibold text-[14px] flex items-center justify-center gap-2 mb-3">
            <ShoppingCart className="w-4 h-4" />
            إكمال عملية الشراء
          </button>

          <p className="text-center text-[11px] text-[#555] mb-4">
            4 دفعات بدون فوائد بقيمة KWD {tabbyInstallment}{" "}
            <span className="font-bold">tabby</span>
          </p>
        </div>

        {/* Payment icons */}
        <div className="border-t border-[#e5e5e5] px-5 py-4 flex justify-center gap-3 flex-wrap">
          <img
            className="h-5"
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
          />
          <img
            className="h-5"
            src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
          />
          <img
            className="h-6"
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
          />
          <span className="border border-[#bbb] px-2 py-[2px] text-[11px] font-bold">
            COD
          </span>
          <span className="text-[#00b2a9] font-bold text-[11px]">tabby</span>
          <span className="text-[11px] font-bold"> Pay</span>
        </div>

        {/* Rewards */}
        <div className="border-t border-[#e5e5e5] px-5 py-4 flex gap-3">
          <Package className="w-5 h-5 text-[#555] mt-[2px]" />
          <div className="text-[13px] leading-[20px]">
            <p className="font-semibold mb-1">
              انضموا لبرنامج المكافآت بلومز بيوتي
            </p>
            <p className="text-[#666]">
              سجلوا في برنامج المكافآت بلومز بيوتي للحصول على مزايا حصرية{" "}
              <span className="underline text-[#2b6cb0] cursor-pointer">
                اضغطوا الآن
              </span>
            </p>
          </div>
        </div>

        {/* Gift */}
        <div className="border-t border-[#e5e5e5] px-5 py-4 flex items-center gap-3">
          <Gift className="w-5 h-5 text-[#555]" />
          <p className="text-[13px] font-semibold">
            تغليف الهدايا متوفر عند الشراء
          </p>
        </div>
      </div>
    </div>
  );
}
