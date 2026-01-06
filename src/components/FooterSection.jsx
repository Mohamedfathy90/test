import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { FaSnapchatGhost } from "react-icons/fa";

const Footer = () => {
  const iconStyle = "text-white w-5 h-5";
  const wrapperStyle =
    "rounded-full p-2 cursor-pointer hover:bg-gray-800 transition-colors";

  return (
    <footer className="bg-white border-t pt-0 text-sm text-gray-700 rtl overflow-x-hidden">
      {/* Top Black Footer with Logo and Social Icons */}
      <div className="bg-black py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-32 h-auto">
              <img
                src="/log2.jpg"
                alt="Logo"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
              <div className={wrapperStyle}>
                <Facebook className={iconStyle} />
              </div>
              <div className={wrapperStyle}>
                <Instagram className={iconStyle} />
              </div>
              <div className={wrapperStyle}>
                <Twitter className={iconStyle} />
              </div>
              <div className={wrapperStyle}>
                <Youtube className={iconStyle} />
              </div>
              <div className={wrapperStyle}>
                <FaSnapchatGhost className={iconStyle} size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div>
            <ul className="space-y-2">
              <li className="font-bold mb-3 text-base">Trending</li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الإبداعات الإماراتية
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                العطور النسائية
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                مستلزمات النوم الإماراتية
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                المجوهرات الفاخرة
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                ملابس البحر للرجال
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <ul className="space-y-2">
              <li className="font-bold mb-3 text-base">Most Favourited</li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                العطور ديبتيك
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الجمال أوريجاني
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                المكياج إنلاستيكا
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الجمال مرسيدس
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <ul className="space-y-2">
              <li className="font-bold mb-3 text-base">Top Searches</li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الجمال شانيل
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الجمال ديور
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                العطور ديور
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                العطور شانيل
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الجمال ديبتيك
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <ul className="space-y-2">
              <li className="font-bold mb-3 text-base">خدمات العملاء</li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                تواصل معنا
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                خيارات التوصيل
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                خيارات الدفع
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                تتبع طلبك
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الإرجاع
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                فرق الدفع
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                أسئلة مكررة
              </li>
            </ul>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 border-t pt-8">
          {/* Column 1 */}
          <div>
            <ul className="space-y-2">
              <li className="font-bold mb-3 text-base">معلومات</li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                قصة بلومينجديلز
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                أقرب متجر
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                تطبيقنا
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                طرق أسهل للدفع
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                العمل
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الخصوصية
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                تعليمات الاستخدام
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                خريطة الموقع
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <ul className="space-y-2">
              <li className="font-bold mb-3 text-base">الخدمات والفعاليات</li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                تسجيل الهدايا
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الخدمات التجميلية في المتجر
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                خدمة المكالمات لوميير بوتيك
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                برنامج المكافآت أمبر
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <ul className="space-y-2">
              <li className="font-bold mb-3 text-base">موقع</li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الإمارات العربية المتحدة - إنجليزي
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الإمارات العربية المتحدة - العربية
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الكويت - إنجليزي
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                الكويت - العربية
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                السعودية - إنجليزي
              </li>
              <li className="text-sm hover:text-gray-900 cursor-pointer">
                السعودية - العربية
              </li>
            </ul>
          </div>

          {/* Column 4 - App Links */}
          <div className="space-y-4">
            <div>
              <p className="font-bold mb-3 text-base">المواقع و اللغات</p>
              <p className="text-sm font-semibold">English 🇰🇼</p>
            </div>

            <div className="flex flex-col gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="h-10 w-auto"
              />
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                className="h-10 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-gray-400">
            © الطاير بلومينجديلز جميع الحقوق محفوظة 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;