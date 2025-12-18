import CartIcon from "../components/CartIcon";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div 
      className="flex flex-col items-center justify-center text-center w-full px-4"
      style={{ 
        minHeight: "calc(100vh - 200px)",
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)"
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <CartIcon cartCount={0} size={24} clickable={false} />

        <p className="mt-2  text-base font-normal text-black" style={{ fontSize: "15px" }}>
          سلة التسوق الخاصة بك فارغة
        </p>

        <Link
          to="/"
          className="px-16 py-2 no-underline border border-gray-400 text-black hover:bg-gray-50 transition-colors inline-block"
          style={{ fontSize: "13px" }}
        >
          تسوق الوافدين الجدد
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
