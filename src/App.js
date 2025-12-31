import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Favorites from "./pages/Favorites";
import AddProduct from "./pages/AddProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Header from "./components/Header";
import React, { useState } from "react";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";
import { UserProvider } from "./context/context";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  // const handleLoginSuccess = (user) => {
  //   console.log("تم تسجيل الدخول:", user);
  //   setUser(user);
  // };
  // const [user, setUser] = useState(null);

  return (
    <UserProvider>
      <CartProvider>
        <FavoritesProvider>
          <NotificationProvider>
            <Router>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/Favorites" element={<Favorites />} />
                <Route path="/AddProduct" element={<AddProduct />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-error" element={<PaymentError />} />
              </Routes>
            </Router>
          </NotificationProvider>
        </FavoritesProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
