import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/context";
import { useFavorites } from "../context/FavoritesContext";
import { useSearch } from "../context/SearchContext";
import { RiMenu3Line } from "react-icons/ri";
import { IoMdHeartEmpty, IoMdClose } from "react-icons/io";
import { HiOutlineSearch } from "react-icons/hi";
import CartIcon from "../components/CartIcon";
import "./Header.css"; // سننشئ ملف CSS منفصل

// const categories = [
//   { label: "تخفيضات", href: "#" },
//   {
//     label: "العطلات بوتيك",
//     href: "https://bloomingdales.com.kw/bloomingdales-resort/",
//   },
//   { label: "حديثاً وصلنا ما", href: "https://bloomingdales.com.kw/new-in/" },
//   { label: "النساء", href: "https://bloomingdales.com.kw/women/" },
//   {
//     label: "الحقائب ",
//     href: "https://bloomingdales.com.kw/bloomingdales-new-season-women/?prefn1=categorytype&prefv1=%D8%AD%D9%82%D8%A7%D8%A6%D8%A8",
//   },
//   { label: "الجمال ", href: "https://bloomingdales.com.kw/beauty/" },
//   { label: "الرجال", href: "https://bloomingdales.com.kw/men/" },
//   { label: "الأطفال", href: "https://bloomingdales.com.kw/kids/" },
//   { label: " مستلزمات المنزل ", href: "https://bloomingdales.com.kw/home/" },
//   { label: "المجوهرات", href: "https://bloomingdales.com.kw/jewelry/" },
//   { label: "الهدايا", href: "https://bloomingdales.com.kw/gifts/" },
//   { label: " المصممون", href: "https://bloomingdales.com.kw/designers/" },
// ];

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [setUserRole] = useState(null);
  const { cartCount } = useCart();
  const { user } = useUser();
  const { favoritesCount } = useFavorites();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch,
  } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://blomengdalis-tester.com/backend/check-session.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn && data.role === "admin") {
          setUserRole("admin");
        }
      });
  }, []);

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      clearSearch();
    }
  };

  const handleProductClick = (productId) => {
    setSearchOpen(false);
    clearSearch();
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <header className="bg-white">
        <Container fluid className="py-2 max-w-95">
          <Row className="align-items-center">
            {/* Desktop Search - يفتح overlay بنفس طريقة الموبايل */}
            <Col
              md={3}
              className="d-none d-md-flex justify-content-start align-items-center border-bottom"
            >
              <HiOutlineSearch size={24} className="me-2" />
              <Form className="w-100">
                <Form.Control
                  type="text"
                  placeholder="بحث..."
                  onFocus={handleSearchToggle}
                  readOnly
                  style={{
                    boxShadow: "none",
                    borderRadius: 0,
                    border: "none",
                    cursor: "pointer",
                  }}
                />
              </Form>
            </Col>

            <Col
              xs={4}
              className="d-flex d-md-none justify-content-start align-items-center"
            >
              {/* <Button
                className="d-md-none border-0 menu-btn bg-transparent text-black"
                onClick={() => setSidebarOpen(true)}
              >
                <RiMenu3Line size={25} />
              </Button> */}
              <Button
                className="border-0 search-btn bg-transparent text-black"
                onClick={handleSearchToggle}
              >
                <HiOutlineSearch size={25} />
              </Button>
            </Col>
            <Col
              xs={4}
              md={6}
              className="d-flex justify-content-center align-items-center"
            >
              <img
                src="/logo.jpg"
                alt="Logo"
                className="img-fluid"
                style={{ maxHeight: "80px" }}
              />
            </Col>

            <Col
              xs={4}
              md={3}
              className="d-flex justify-content-end align-items-center gap-2"
            >
              <Link to="/Favorites" className="position-relative text-black">
                <IoMdHeartEmpty size={25} />
                {favoritesCount > 0 && (
                  <span
                    className="position-absolute bg-black text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "18px",
                      height: "18px",
                      top: "-8px",
                      right: "-8px",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {favoritesCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="position-relative text-black"></Link>
              <CartIcon cartCount={cartCount} />
            </Col>
          </Row>
        </Container>

        {/* قائمة الفئات */}
        <div className="bg-white text-black d-none d-md-block border-bottom downHeader ">
          <Container style={{ maxWidth: "95%" }} fluid>
            <Row>
              <Col>
                {/* <nav className="d-flex flex-wrap justify-content-between py-2 header-style">
                  {categories.map((cat, idx) => (
                    <a
                      key={idx}
                      href={cat.href}
                      className="text-black text-decoration-none"
                    >
                      {cat.label}
                    </a>
                  ))}
                </nav> */}
              </Col>
            </Row>
          </Container>
        </div>
      </header>

      {/* Search Overlay - موحد للموبايل والويب */}
      <div className={`search-overlay ${searchOpen ? "open" : ""}`}>
        <div className="search-header">
          <Button
            className="border-0 bg-transparent text-black"
            onClick={handleSearchToggle}
          >
            <IoMdClose size={30} />
          </Button>
          <div className="search-input-wrapper">
            <HiOutlineSearch size={24} className="search-icon" />
            <input
              type="text"
              placeholder="ابحث في بلومينغديلز"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="search-results">
          {searchQuery && searchResults.length > 0 ? (
            searchResults.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="search-item"
              >
                <img
                  src={`https://blomengdalis-tester.com/backend/uploads/${encodeURIComponent(
                    product.main_image
                  )}`}
                  alt={product.name}
                  className="search-item-img"
                />
                <div className="search-item-info">
                  <div className="search-item-name">{product.name}</div>
                  <div className="search-item-desc">{product.description}</div>
                </div>
              </div>
            ))
          ) : searchQuery ? (
            <div className="search-empty">لا توجد نتائج</div>
          ) : null}
        </div>
      </div>

      {/* Sidebar */}
      {/* <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          ×
        </button>
        <nav className="side-nav">
          {categories.map((cat, idx) => (
            <a key={idx} href={cat.href} className="side-link">
              {cat.label}
            </a>
          ))}
        </nav>
      </div> */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </>
  );
};

export default Header;
