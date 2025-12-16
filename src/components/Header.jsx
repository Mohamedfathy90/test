import React, { useState , useEffect} from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { FaUser, FaShoppingCart, FaSearch, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";


const categories = [
  { label: "تخفيضات", href: "#" },
  { label: "العطلات بوتيك", href: "https://bloomingdales.com.kw/bloomingdales-resort/" },
  { label: "حديثاً وصلنا ما", href: "https://bloomingdales.com.kw/new-in/" },
  { label: "النساء", href: "https://bloomingdales.com.kw/women/" },
  { label: "الحقائب ", href: "https://bloomingdales.com.kw/bloomingdales-new-season-women/?prefn1=categorytype&prefv1=%D8%AD%D9%82%D8%A7%D8%A6%D8%A8" },
  { label: "الجمال ", href: "https://bloomingdales.com.kw/beauty/" },
  { label: "الرجال", href: "https://bloomingdales.com.kw/men/" },
  { label: "الأطفال", href: "https://bloomingdales.com.kw/kids/" },
  { label: " مستلزمات المنزل ", href: "https://bloomingdales.com.kw/home/" },
  { label: "المجوهرات", href: "https://bloomingdales.com.kw/jewelry/" },
  { label: "الهدايا", href: "https://bloomingdales.com.kw/gifts/" },
  { label: " المصممون", href: "https://bloomingdales.com.kw/designers/" },
];


const Header = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetch("https://blomengdalis-tester.com/backend/check-session.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn && data.role === "admin") {
          setUserRole("admin");
        }
      });
  }, []);

  return (
    <>
      <header className="bg-white border-bottom container">
        {/* الجزء العلوي */}
        <Container fluid className="py-2">
          <Row className="align-items-center text-black">
          <Col xs={4} md={3} className="d-flex justify-content-end align-items-center">
              <InputGroup size="sm" className="d-none d-md-flex">
                <Form.Control placeholder="بحث..." />
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup>
              <Button
                variant="light"
                className="d-md-none ms-2"
                onClick={() => setSidebarOpen(true)}
              >
                <FaBars />
              </Button>
            </Col>
            <Col xs={4} md={6} className="text-center">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="img-fluid"
                style={{ maxHeight: "80px" }}
              />
            </Col>
            
            <Col xs={4} md={3} className="d-flex gap-3 justify-content-start">
            <Link to="/cart" style={{color:"#000"}}>
            <FaShoppingCart size={25} />
             </Link>
           <Link to="/Login" style={{color:"#000"}}>
           <FaUser size={25} style={{color:"#000"}}/>
              </Link>
            </Col>
             {/* زر الداشبورد يظهر فقط لو الأدمن مسجل دخول */}
      {user && user.is_admin === 1 && (
          <Link to="/admin-dashboard" className="admin-btn">لوحة التحكم</Link>
        )}
          
          </Row>
        </Container>

        {/* الجزء السفلي للشاشات الكبيرة */}
        <div className="bg-white text-black d-none d-md-block border-top downHeader">
          <Container fluid>
            <Row>
              <Col>
                <nav className="d-flex flex-wrap justify-content-center py-2">
                  {categories.map((cat, idx) => (
                    <a
                      key={idx}
                      href={cat.href}
                      className="mx-3 my-1 text-black text-decoration-none"
                    >
                      {cat.label}
                    </a>
                  ))}
                </nav>
              </Col>
            </Row>
          </Container>
        </div>
      </header>

      {/* القائمة الجانبية */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        <nav className="side-nav">
          {categories.map((cat, idx) => (
            <a key={idx} href={cat.href} className="side-link">
              {cat.label}
            </a>
          ))}
        </nav>
      </div>

      {/* خلفية شفافة تغلق القائمة عند الضغط */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
    </>
  );
};

export default Header;
