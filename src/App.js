import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import AddProduct from './pages/AddProduct';
import LoginForm from './pages/LoginForm';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import React, { useState } from 'react';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentError from './pages/PaymentError';



function App() {
  const handleLoginSuccess = (user ) => {
    console.log('تم تسجيل الدخول:', user);
     setUser(user);
    // هنا ممكن تحفظ بيانات المستخدم في Context أو state
  };
   const [user, setUser] = useState(null); // تخزين بيانات المستخدم بعد تسجيل الدخول

 
  return (
    <Router>
      <Header user={user} /> {/* تمرير بيانات المستخدم للـ Header */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Favorites" element={<Favorites />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route
          path="/Login"
          element={<LoginForm onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-error" element={<PaymentError />} />
      </Routes>
    </Router>
  );
}

export default App;
