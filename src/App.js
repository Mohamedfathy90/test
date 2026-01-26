import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Favorites from "./pages/Favorites";
import AddProduct from "./pages/AddProduct";
import SearchPage from "./pages/SearchPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Header from "./components/Header";
// import React, { useState } from "react";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";
import { UserProvider } from "./context/context";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { NotificationProvider } from "./context/NotificationContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { SearchProvider } from "./context/SearchContext";
import CurrencyPopup from "./components/CurrencyPopup";
import OrderSummaryPage from "./pages/OrderSummary";
import F10 from "./dashboard/Dashboard";
import DashboardLogin from "./dashboard/Login";
import DashboardAddProduct from "./dashboard/AddProduct";
import DashboardEditProduct from "./dashboard/EditProduct";
import DashboardRedirect from "./dashboard/DashboardRedirect";
import ProtectedRoute from "./routes/ProtectedRoute";

function AppLayout() {
  const location = useLocation();
  const hideHeaderRoutes = ["/order-summary", "/checkout"];
  const isDashboardRoute = location.pathname.startsWith("/F10");
  const shouldShowHeader =
    !hideHeaderRoutes.includes(location.pathname) && !isDashboardRoute;

  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/Favorites" element={<Favorites />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/F10" element={<DashboardRedirect />} />
        <Route path="/F10/login" element={<DashboardLogin />} />
        <Route
          path="/F10/home"
          element={
            <ProtectedRoute>
              <F10/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/F10/add-product"
          element={
            <ProtectedRoute>
              <DashboardAddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/F10/edit-product/:id"
          element={
            <ProtectedRoute>
              <DashboardEditProduct />
            </ProtectedRoute>
          }
        />
        <Route path="/order-summary" element={<OrderSummaryPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-error" element={<PaymentError />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <FavoritesProvider>
          <NotificationProvider>
            <CurrencyProvider>
              <SearchProvider>
                <Router>
                  <AppLayout />
                  <CurrencyPopup />
                </Router>
              </SearchProvider>
            </CurrencyProvider>
          </NotificationProvider>
        </FavoritesProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
