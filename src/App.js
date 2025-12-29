import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
// import Register from './pages/Register';
import Favorites from './pages/Favorites';
import AddProduct from './pages/AddProduct';
// import LoginForm from './pages/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Header from './components/Header';
import React, { useState } from 'react';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentError from './pages/PaymentError';
import { UserProvider } from "./context/context";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";


function App() {
  const handleLoginSuccess = (user ) => {
    console.log('تم تسجيل الدخول:', user);
     setUser(user);
    // هنا ممكن تحفظ بيانات المستخدم في Context أو state
  };
   const [user, setUser] = useState(null); // تخزين بيانات المستخدم بعد تسجيل الدخول

 
  return (
    <UserProvider>
      <CartProvider>
        <FavoritesProvider>
          <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* <Route path="/Register" element={<Register />} /> */}
            <Route path="/Favorites" element={<Favorites />} />
            <Route path="/AddProduct" element={<AddProduct />} />
            {/* <Route
              path="/Login"
              element={<LoginForm onLoginSuccess={handleLoginSuccess} />}
            /> */}
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-error" element={<PaymentError />} />
          </Routes>
          </Router>
        </FavoritesProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
