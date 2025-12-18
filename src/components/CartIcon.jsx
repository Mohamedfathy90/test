import { BsFillBagFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import bagLogo from "../assets/bag-logo.svg";

const CartIcon = ({ cartCount, size = 25 }) => {
  return (
    <Link to="/cart" className="position-relative text-black">
      <BsFillBagFill size={size} color="#D2AD81" />

      {cartCount > 0 ? (
        <span
          className="position-absolute"
          style={{
            top: "70%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            color: "#000",
          }}
        >
          {cartCount}
        </span>
      ) : (
        <img
          src={bagLogo}
          alt="cart"
          className="position-absolute"
          style={{
            top: "70%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "12px",
            height: "12px",
          }}
        />
      )}
    </Link>
  );
};

export default CartIcon;
